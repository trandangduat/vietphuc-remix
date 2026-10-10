import { evaluateCulturalOutfit } from '../data/culturalEvaluator';
import { renderAppraisalPreview } from './tryOnService';
import { ActiveOutfitState, AIOverviewResult, Piece } from '../types';

const DEFAULT_MODEL = 'qwen/qwen3.8-27b';
const cache = new Map<string, AIOverviewResult>();
let warnedMissingKey = false;

function clip(text: string | undefined, max: number): string {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}

function clampScore(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.round(Math.min(10, Math.max(0, parsed)) * 10) / 10;
}

function isAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

export function outfitAppraisalSignature(outfit: ActiveOutfitState): string {
  return [
    outfit.mannequinGender,
    outfit.topPiece?.id || '',
    outfit.bottomPiece?.id || '',
    outfit.footwearPiece?.id || '',
    outfit.accessoryPiece?.id || '',
    outfit.event.id,
    outfit.event.name,
    outfit.event.description,
  ].join('|');
}

function chosenPiece(primary?: Piece, variant?: Piece): Piece | undefined {
  return primary || variant;
}

function pieceLabel(piece?: Piece): string {
  return piece?.name || 'chưa chọn';
}

function buildPrompt(outfit: ActiveOutfitState): string {
  const top = chosenPiece(outfit.topPiece, outfit.topVariant);
  const bottom = chosenPiece(outfit.bottomPiece, outfit.bottomVariant);
  const footwear = chosenPiece(outfit.footwearPiece, outfit.footwearVariant);
  const accessory = chosenPiece(outfit.accessoryPiece, outfit.accessoryVariant);
  const missing = [
    !top ? 'áo' : '',
    !bottom ? 'quần hoặc váy' : '',
    !footwear ? 'giày hoặc hài' : '',
  ].filter(Boolean);

  return [
    'Ảnh đính kèm là preview bên trái Studio: ma-nơ-canh đang mặc bộ đang phối, nền là bối cảnh sự kiện.',
    'Hãy nhìn ảnh để chấm màu sắc, độ hoàn chỉnh và mức hợp với sự kiện. Tên món chỉ lấy từ danh sách bên dưới.',
    `Sự kiện: ${outfit.event.name}.`,
    `Mô tả sự kiện: ${clip(outfit.event.description, 280) || 'Không có mô tả thêm.'}`,
    `Áo: ${pieceLabel(top)}.`,
    `Quần/Váy: ${pieceLabel(bottom)}.`,
    `Giày/Hài: ${pieceLabel(footwear)}.`,
    `Phụ kiện: ${pieceLabel(accessory)}.`,
    missing.length
      ? `Các mục ghi "chưa chọn" là đang thiếu: ${missing.join(', ')}. Ảnh sẽ lộ phần thân chưa có trang phục.`
      : 'Đã chọn đủ áo, quần hoặc váy, và giày hoặc hài.',
  ].join('\n');
}

function previewDataUrl(dataUrl: string): string {
  if (!/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(dataUrl)) {
    throw new Error('Ảnh preview không hợp lệ');
  }
  return dataUrl;
}

const SCORING_RULES = [
  'Bạn là Bé Cáo, linh vật thẩm định Việt phục của ứng dụng Việt phục Remix.',
  'Ảnh là preview người dùng đang thấy. Chấm đúng bộ đồ và sự kiện được nêu.',
  'Viết toàn bộ bằng tiếng Việt, giọng trang nhã.',
  'Trả về một JSON object, không markdown, với đúng các khóa:',
  'totalScore, colorHarmonyScore, colorHarmonySummary, colorHarmonyComment, eventFitScore, eventFitSummary, eventFitComment, culturalNormScore, culturalNormComment, culturalStatus, explanation, suggestion, source, mascotQuote, mascotMood.',
  'Ba tiêu chí, mỗi tiêu chí từ 0 đến 10, một chữ số thập phân:',
  '1. Hài hòa màu sắc: nhìn màu trên ảnh, giữa áo, quần, giày, phụ kiện và nền sự kiện.',
  '2. Phù hợp sự kiện: bộ đồ có đúng không khí sự kiện được nêu hay không.',
  '3. Chuẩn mực lễ nghi: mức độ đúng điển chế cổ phục. Remix hợp sự kiện trẻ vẫn có thể điểm khá, nhưng giảm điểm khi mặc sai lễ.',
  'totalScore là trung bình có trọng số: sự kiện 40%, lễ nghi 35%, màu sắc 25%, làm tròn một chữ số.',
  'Thang điểm: 9.0–10 là chỉnh và đúng tinh thần sự kiện; 7.5–8.9 là đẹp nhưng còn điểm trừ nhỏ; dưới 6 là lệch sự kiện hoặc trái lễ.',
  'culturalStatus chỉ được là suitable, caution hoặc not-recommended. suitable khi totalScore từ 8 trở lên và không trái lễ; caution khi remix hoặc lệch nhẹ; not-recommended khi trái lễ nghiêm trọng hoặc rất không hợp sự kiện.',
  'Áo, quần hoặc váy, và giày hoặc hài là ba món bắt buộc. Thiếu món nào thì outfit chưa hoàn chỉnh, không được khen là đạt.',
  'Khi thiếu món bắt buộc: totalScore chỉ từ 2.0 đến 4.5, mỗi tiêu chí không quá 5.0, culturalStatus là caution. explanation và comment phải nêu đúng tên món còn thiếu.',
  'explanation là một câu, tối đa 180 ký tự. Mỗi comment một đến hai câu, tối đa 220 ký tự.',
  'colorHarmonySummary và eventFitSummary tối đa 90 ký tự. suggestion để chuỗi rỗng nếu không cần đổi món.',
  'source là "Nhận xét từ ảnh preview". mascotQuote tối đa 110 ký tự.',
  'mascotMood chỉ được là reverent, happy, curious hoặc thinking.',
  'Không bịa món không có trong danh sách và không thấy trên ảnh.',
].join(' ');

async function buildRequestBody(outfit: ActiveOutfitState): Promise<string> {
  const preview = previewDataUrl(await renderAppraisalPreview(outfit));
  return JSON.stringify({
    model: DEFAULT_MODEL,
    temperature: 0.5,
    max_completion_tokens: 900,
    reasoning_effort: 'none',
    reasoning_format: 'hidden',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SCORING_RULES },
      {
        role: 'user',
        content: [
          { type: 'text', text: buildPrompt(outfit) },
          { type: 'image_url', image_url: { url: preview } },
        ],
      },
    ],
  });
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null;
}

function readText(value: unknown, max: number, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const clean = value.replace(/\s+/g, ' ').trim();
  return clean ? clip(clean, max) : fallback;
}

function normalizeAppraisal(raw: unknown, outfit: ActiveOutfitState): AIOverviewResult {
  const data = asRecord(raw);
  if (!data) throw new Error('Groq không trả về JSON hợp lệ');

  const missingPiece = !chosenPiece(outfit.topPiece, outfit.topVariant)
    || !chosenPiece(outfit.bottomPiece, outfit.bottomVariant)
    || !chosenPiece(outfit.footwearPiece, outfit.footwearVariant);
  let colorScore = clampScore(data.colorHarmonyScore);
  let eventScore = clampScore(data.eventFitScore);
  let normScore = clampScore(data.culturalNormScore);
  if (missingPiece) {
    colorScore = Math.min(colorScore, 5);
    eventScore = Math.min(eventScore, 5);
    normScore = Math.min(normScore, 5);
  }
  const weighted = Math.round((colorScore * 0.25 + eventScore * 0.4 + normScore * 0.35) * 10) / 10;
  let totalScore = clampScore(data.totalScore);
  if (Math.abs(totalScore - weighted) > 1.2) totalScore = weighted;
  if (missingPiece) totalScore = Math.min(totalScore, 4.5);

  const rawStatus = data.culturalStatus;
  let culturalStatus: AIOverviewResult['culturalStatus'] =
    rawStatus === 'suitable' || rawStatus === 'caution' || rawStatus === 'not-recommended'
      ? rawStatus
      : totalScore >= 8
        ? 'suitable'
        : totalScore >= 6
          ? 'caution'
          : 'not-recommended';
  if (missingPiece && culturalStatus === 'suitable') culturalStatus = 'caution';

  const rawMood = data.mascotMood;
  const mascotMood: NonNullable<AIOverviewResult['mascotMood']> =
    rawMood === 'happy' || rawMood === 'thinking' || rawMood === 'curious' || rawMood === 'reverent'
      ? rawMood
      : missingPiece
        ? 'thinking'
        : 'happy';

  const suggestion = readText(data.suggestion, 180, '');

  return {
    totalScore,
    criteria: {
      colorHarmony: {
        name: 'Hài hòa màu sắc',
        score: colorScore,
        maxScore: 10,
        comment: readText(data.colorHarmonyComment, 240, 'Màu sắc cần được nhìn lại cùng toàn bộ xiêm y.'),
      },
      eventFit: {
        name: 'Phù hợp sự kiện',
        score: eventScore,
        maxScore: 10,
        comment: readText(data.eventFitComment, 240, `Cần đối chiếu lại với không khí ${outfit.event.name}.`),
      },
      culturalNorm: {
        name: 'Chuẩn mực lễ nghi',
        score: normScore,
        maxScore: 10,
        comment: readText(data.culturalNormComment, 240, 'Cần đối chiếu thêm với quy thức cổ phục.'),
      },
    },
    colorHarmony: readText(data.colorHarmonySummary, 100, 'Màu sắc của bộ trang phục.'),
    eventFit: readText(data.eventFitSummary, 100, `Bối cảnh ${outfit.event.name}.`),
    culturalStatus,
    explanation: readText(data.explanation, 200, 'Bé Cáo đã xem qua bộ trang phục này.'),
    suggestion: suggestion || undefined,
    source: readText(data.source, 90, 'Tri thức Việt phục'),
    mascotQuote: readText(data.mascotQuote, 120, 'Bộ đồ này có câu chuyện riêng đấy!'),
    mascotMood,
  };
}

function extractModelJson(payload: unknown): unknown {
  const data = asRecord(payload);
  const choices = data?.choices;
  const first = Array.isArray(choices) ? asRecord(choices[0]) : null;
  const message = asRecord(first?.message);
  const text = typeof message?.content === 'string' ? message.content : '';
  if (!text.trim()) throw new Error('Groq không trả lời');
  const fenced = text.trim().match(/```(?:json)?\s*([\s\S]*?)```/);
  return JSON.parse(fenced ? fenced[1] : text);
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    const record = asRecord(data);
    const error = record?.error;
    if (typeof error === 'string') return error;
    const nested = asRecord(error);
    if (typeof nested?.message === 'string') return nested.message;
  } catch {
    return '';
  }
  return '';
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true }
    );
  });
}

async function requestAppraisal(outfit: ActiveOutfitState, signal?: AbortSignal): Promise<unknown> {
  const body = await buildRequestBody(outfit);
  let lastError = 'Groq không chấm được';

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const proxy = await fetch('/api/appraise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal,
    });

    if (proxy.ok) return proxy.json();

    const proxyMessage = await readErrorMessage(proxy);
    if (proxyMessage === 'missing_key') {
      if (!warnedMissingKey) {
        warnedMissingKey = true;
        console.warn('Chưa có GROQ_API_KEY. Bé Cáo không chấm được.');
      }
      throw new Error('Chưa có Groq API key');
    }

    lastError = proxyMessage || `Groq trả về ${proxy.status}`;
    const retryable = proxy.status === 429 || proxy.status === 503;
    if (!retryable || attempt === 2) throw new Error(lastError);
    await wait(900 * (attempt + 1), signal);
  }

  throw new Error(lastError);
}

export async function appraiseOutfit(
  outfit: ActiveOutfitState,
  signal?: AbortSignal
): Promise<AIOverviewResult> {
  const hasAnyPiece = Boolean(
    chosenPiece(outfit.topPiece, outfit.topVariant) ||
      chosenPiece(outfit.bottomPiece, outfit.bottomVariant) ||
      chosenPiece(outfit.footwearPiece, outfit.footwearVariant) ||
      chosenPiece(outfit.accessoryPiece, outfit.accessoryVariant)
  );
  if (!hasAnyPiece) return evaluateCulturalOutfit(outfit);

  const signature = outfitAppraisalSignature(outfit);
  const cached = cache.get(signature);
  if (cached) return cached;

  try {
    const payload = await requestAppraisal(outfit, signal);
    const result = normalizeAppraisal(extractModelJson(payload), outfit);
    cache.set(signature, result);
    return result;
  } catch (error) {
    if (isAbort(error)) throw error;
    const message = error instanceof Error ? error.message : 'Groq không chấm được';
    throw new Error(message);
  }
}
