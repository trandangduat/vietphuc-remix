import { ActiveOutfitState } from '../types';
import { getPieceAlignment, PieceAlignment } from '../data/pieceAlignments';

export interface AITryOnRequest {
  faceImage: string; // Base64 data URL or URL of the user's uploaded person/face image
  studioPreviewImage?: string; // Optional pre-rendered studio preview; will be auto-generated if omitted
  outfit: ActiveOutfitState;
  customPrompt?: string;
  apiKey?: string;
  model?: 'openai/gpt-image-2' | 'openai/gpt-image-1-mini' | 'google/gemini-nano-banana-2.1' | string;
}

export interface AITryOnResponse {
  imageUrl: string;
  promptUsed: string;
  status: 'success' | 'error';
  errorMessage?: string;
}

const LOCAL_STORAGE_KEY = 'vietphuc_pollinations_api_key';

/**
 * Default AI Model for Multimodal Virtual Try-On
 */
export const DEFAULT_AI_MODEL = 'openai/gpt-image-2';

/**
 * Retrieve saved Pollinations API key
 */
export function getSavedPollinationsApiKey(): string {
  const envKey = (import.meta.env.VITE_POLLINATIONS_API_KEY as string | undefined)?.trim();
  if (envKey) return envKey;
  return localStorage.getItem(LOCAL_STORAGE_KEY)?.trim() || '';
}

/**
 * Save Pollinations API key to localStorage
 */
export function savePollinationsApiKey(key: string): void {
  if (key && key.trim()) {
    localStorage.setItem(LOCAL_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}

/**
 * Helper to load an HTML image asynchronously
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Không thể nạp tài nguyên: ${url}`));
    img.src = url;
  });
}

/** Match Studio DOM: image letterboxed inside a box (object-contain). */
export function drawImageContained(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  boxX: number,
  boxY: number,
  boxW: number,
  boxH: number
) {
  const imageAspect = img.naturalWidth / img.naturalHeight;
  const boxAspect = boxW / boxH;
  let drawW: number;
  let drawH: number;
  let drawX: number;
  let drawY: number;

  if (imageAspect > boxAspect) {
    drawW = boxW;
    drawH = boxW / imageAspect;
    drawX = boxX;
    drawY = boxY + (boxH - drawH) / 2;
  } else {
    drawH = boxH;
    drawW = boxH * imageAspect;
    drawX = boxX + (boxW - drawW) / 2;
    drawY = boxY;
  }

  ctx.drawImage(img, drawX, drawY, drawW, drawH);
}

/** Match Studio DOM: transformed layer with object-contain piece art. */
export function drawAlignedLayer(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  alignment: PieceAlignment,
  canvasW: number,
  canvasH: number
) {
  ctx.save();
  const cx = canvasW / 2 + (alignment.x / 100) * canvasW;
  const cy = canvasH / 2 + (alignment.y / 100) * canvasH;
  ctx.translate(cx, cy);
  if (alignment.rotate) {
    ctx.rotate((alignment.rotate * Math.PI) / 180);
  }
  const sx = alignment.scale * (alignment.scaleX ?? 1);
  const sy = alignment.scale * (alignment.scaleY ?? 1);
  ctx.scale(sx, sy);
  drawImageContained(ctx, img, -canvasW / 2, -canvasH / 2, canvasW, canvasH);
  ctx.restore();
}

function mannequinAssetFor(outfit: ActiveOutfitState): string {
  return outfit.mannequinGender === 'men'
    ? '/assets/mannequins/mannequin-men.png'
    : '/assets/mannequins/mannequin-base.png';
}

/**
 * Resizes an image (base64 or URL) to a maximum dimension to ensure fast network upload
 */
export async function optimizeImageForAI(
  dataUrlOrUrl: string,
  maxDim: number = 1024
): Promise<string> {
  try {
    const img = await loadImage(dataUrlOrUrl);
    let { width, height } = img;
    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return dataUrlOrUrl;

    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', 0.88);
  } catch (err) {
    console.warn('Could not optimize image, using original:', err);
    return dataUrlOrUrl;
  }
}

/**
 * Renders the full 2D Studio mockup (Background + Mannequin + Calibrated Garment Layers)
 * into a single high-resolution image to serve as the exact visual reference for AI.
 */
export async function renderStudioPreviewCanvas(
  outfit: ActiveOutfitState,
  width: number = 900,
  height: number = 1200
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Không thể khởi tạo Canvas 2D');

  const bottomPiece = outfit.bottomPiece || outfit.bottomVariant;
  const footwearPiece = outfit.footwearPiece || outfit.footwearVariant;
  const topPiece = outfit.topPiece || outfit.topVariant;
  const accessoryPiece = outfit.accessoryPiece || outfit.accessoryVariant;

  interface LayerItem {
    url: string;
    alignment?: PieceAlignment;
    isCover?: boolean;
  }

  // Dark studio sweep: lifted behind the figure, lacquer at the edges.
  const cx = canvas.width / 2;
  const cy = canvas.height * 0.46;
  const backdrop = ctx.createRadialGradient(cx, cy, canvas.width * 0.06, cx, cy, canvas.width * 0.78);
  backdrop.addColorStop(0, '#2C3340');
  backdrop.addColorStop(0.55, '#171C26');
  backdrop.addColorStop(1, '#0A0D12');
  ctx.fillStyle = backdrop;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const layers: LayerItem[] = [];

  layers.push({ url: mannequinAssetFor(outfit) });

  // 3. Bottoms
  if (bottomPiece?.assetUrl) {
    layers.push({ url: bottomPiece.assetUrl, alignment: getPieceAlignment(bottomPiece.id) });
  }

  // 4. Footwear
  if (footwearPiece?.assetUrl) {
    layers.push({ url: footwearPiece.assetUrl, alignment: getPieceAlignment(footwearPiece.id) });
  }

  // 5. Tops
  if (topPiece?.assetUrl) {
    layers.push({ url: topPiece.assetUrl, alignment: getPieceAlignment(topPiece.id) });
  }

  // 6. Accessories
  if (accessoryPiece?.assetUrl) {
    layers.push({ url: accessoryPiece.assetUrl, alignment: getPieceAlignment(accessoryPiece.id) });
  }

  for (const item of layers) {
    try {
      const img = await loadImage(item.url);
      if (item.isCover) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else if (item.alignment) {
        drawAlignedLayer(ctx, img, item.alignment, canvas.width, canvas.height);
      } else {
        drawImageContained(ctx, img, 0, 0, canvas.width, canvas.height);
      }
    } catch (err) {
      console.warn(`Layer render skipped: ${item.url}`, err);
    }
  }

  return canvas.toDataURL('image/jpeg', 0.9);
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  boxW: number,
  boxH: number
) {
  const scale = Math.max(boxW / img.naturalWidth, boxH / img.naturalHeight);
  const drawW = img.naturalWidth * scale;
  const drawH = img.naturalHeight * scale;
  ctx.drawImage(img, (boxW - drawW) / 2, (boxH - drawH) / 2, drawW, drawH);
}

/**
 * The left Studio preview: event background, mannequin, and the selected pieces.
 * Smaller JPEG for the scoring request.
 */
export async function renderAppraisalPreview(outfit: ActiveOutfitState): Promise<string> {
  const width = 480;
  const height = 640;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Không thể khởi tạo ảnh preview');

  ctx.fillStyle = '#141820';
  ctx.fillRect(0, 0, width, height);

  if (outfit.event.bgUrl) {
    try {
      const background = await loadImage(outfit.event.bgUrl);
      drawImageCover(ctx, background, width, height);
    } catch (err) {
      console.warn('Appraisal background skipped', err);
    }
  }

  const layers: { url: string; alignment?: PieceAlignment }[] = [
    { url: mannequinAssetFor(outfit) },
  ];
  const bottomPiece = outfit.bottomPiece || outfit.bottomVariant;
  const footwearPiece = outfit.footwearPiece || outfit.footwearVariant;
  const topPiece = outfit.topPiece || outfit.topVariant;
  const accessoryPiece = outfit.accessoryPiece || outfit.accessoryVariant;
  if (bottomPiece?.assetUrl) layers.push({ url: bottomPiece.assetUrl, alignment: getPieceAlignment(bottomPiece.id) });
  if (footwearPiece?.assetUrl) layers.push({ url: footwearPiece.assetUrl, alignment: getPieceAlignment(footwearPiece.id) });
  if (topPiece?.assetUrl) layers.push({ url: topPiece.assetUrl, alignment: getPieceAlignment(topPiece.id) });
  if (accessoryPiece?.assetUrl) layers.push({ url: accessoryPiece.assetUrl, alignment: getPieceAlignment(accessoryPiece.id) });

  for (const layer of layers) {
    try {
      const img = await loadImage(layer.url);
      if (layer.alignment) drawAlignedLayer(ctx, img, layer.alignment, width, height);
      else drawImageContained(ctx, img, 0, 0, width, height);
    } catch (err) {
      console.warn(`Appraisal layer skipped: ${layer.url}`, err);
    }
  }

  return canvas.toDataURL('image/jpeg', 0.72);
}

/**
 * Builds the simplified Virtual Try-On prompt:
 * Image 1 = Mannequin wearing the outfit (no background)
 * Image 2 = Person's portrait photo
 * The event setting is described via text.
 */
export function buildMultimodalTryOnPrompt(outfit: ActiveOutfitState): string {
  const top = outfit.topPiece?.name || outfit.topVariant?.name || 'Áo tấc truyền thống';
  const bottom = outfit.bottomPiece?.name || outfit.bottomVariant?.name || 'Quần lụa truyền thống';
  const footwear = outfit.footwearPiece?.name || outfit.footwearVariant?.name || 'Hài nhung';
  const accessory = outfit.accessoryPiece ? `, phụ kiện: ${outfit.accessoryPiece.name}` : '';
  const eventName = outfit.event.name || 'Không gian cổ kính';
  const eventDesc = outfit.event.description ? ` - ${outfit.event.description}` : '';

  return (
    `Image 1 is a mannequin wearing a traditional Vietnamese outfit: ${top}, ${bottom}, ${footwear}${accessory}.\n` +
    `Image 2 is the reference photo of the person (face portrait or full-body).\n\n` +
    `Task: Generate a realistic full-body standing photograph of this person wearing the complete outfit from Image 1.\n` +
    `Authentic Likeness & Build: Faithfully preserve the person's face, facial structure, and their natural, authentic body shape and build.\n` +
    `Proportion Balance: Maintain a natural, anatomically correct head-to-body proportion where the head size is naturally balanced with the neck, shoulders, and torso (avoid disproportionate head enlargement or bobblehead distortion).\n` +
    `Framing: Straight eye-level shot showing the complete standing person from head to toe. The full outfit is completely visible: flowing robe (${top}), trousers (${bottom}), and shoes (${footwear}).\n` +
    `Setting/Background: ${eventName}${eventDesc}.`
  );
}

/**
 * Converts image URL or Blob to Base64 Data URL (with proxy fallback)
 */
async function fetchImageAsDataUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn('Direct fetch failed, falling back to proxy / raw url:', err);
    try {
      const proxyUrl = `/api/pollinations-proxy?url=${encodeURIComponent(url)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error(`Proxy HTTP ${res.status}`);
      const blob = await res.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      return url;
    }
  }
}

const MISSING_API_KEY_MESSAGE =
  'Chưa có API Key. Vui lòng bấm nút "API Key" ở trên để nhập key miễn phí từ enter.pollinations.ai/keys.';

/**
 * Shared Pollinations image call used by try-on and custom scene backgrounds.
 * Optional imageUrls are sent in order after the text prompt.
 */
async function requestPollinationsImage(options: {
  prompt: string;
  imageUrls?: string[];
  apiKey?: string;
  model?: string;
}): Promise<string> {
  const apiKey = options.apiKey || getSavedPollinationsApiKey();
  if (!apiKey) {
    throw new Error(MISSING_API_KEY_MESSAGE);
  }

  const model = options.model || DEFAULT_AI_MODEL;
  const content: Array<Record<string, unknown>> = [{ type: 'text', text: options.prompt }];
  for (const url of options.imageUrls ?? []) {
    content.push({ type: 'image_url', image_url: { url } });
  }

  const response = await fetch('https://gen.pollinations.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content }],
    }),
  });

  if (!response.ok) {
    let errText = '';
    try {
      const errJson = await response.json();
      errText = errJson.error?.message || response.statusText;
    } catch {
      errText = await response.text();
    }

    if (response.status === 402 || errText.includes('INSUFFICIENT_BALANCE')) {
      throw new Error(
        `Mô hình "${model}" yêu cầu số dư Paid Pollen. Bạn có thể đổi sang mô hình "GPT Image 2" hoặc "GPT Image Mini" để tiếp tục.`
      );
    }

    if (response.status === 401 || response.status === 403) {
      throw new Error('API Key không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại key.');
    }

    throw new Error(`AI phản hồi lỗi (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const assistantContent = data.choices?.[0]?.message?.content;
  if (!assistantContent) {
    throw new Error('Mô hình không trả về nội dung hình ảnh.');
  }

  const urlMatch =
    assistantContent.match(/https:\/\/media\.pollinations\.ai\/[a-zA-Z0-9_\-]+/i) ||
    assistantContent.match(/https?:\/\/[^\s\)\"\'\<\>]+/i);

  if (!urlMatch || !urlMatch[0]) {
    throw new Error(`AI phản hồi dạng văn bản thay vì ảnh: ${assistantContent}`);
  }

  return fetchImageAsDataUrl(urlMatch[0]);
}

function toImageError(err: unknown, fallback: string): AITryOnResponse {
  const message = err instanceof Error ? err.message : fallback;
  return {
    imageUrl: '',
    promptUsed: '',
    status: 'error',
    errorMessage: message || fallback,
  };
}

/**
 * Text-to-image scene for the Studio backdrop, using the same model and key as try-on.
 */
export async function generateSceneBackground(description: string): Promise<AITryOnResponse> {
  const prompt =
    `Photorealistic empty environment photograph for a fashion studio backdrop.\n` +
    `Scene: ${description.trim()}\n` +
    `Composition: leave the vertical center open for a standing person. ` +
    `A clear, flat walkway or courtyard floor runs through the middle of the frame, from the foreground to the distance, with nothing on it. ` +
    `Tables, chairs, stalls, plants, lanterns, and other objects stay on the left and right sides only. ` +
    `The lower center, where feet would rest, is empty ground, not furniture.\n` +
    `No people, no mannequins, no clothing, no text, no logos, no watermark. Natural light, sharp detail, vertical composition.`;

  try {
    const imageUrl = await requestPollinationsImage({ prompt });
    return { imageUrl, promptUsed: prompt, status: 'success' };
  } catch (err) {
    console.error('Scene background error:', err);
    return { ...toImageError(err, 'Đã xảy ra lỗi khi tạo bối cảnh.'), promptUsed: prompt };
  }
}

/**
 * Dispatches multimodal Virtual Try-On request to Pollinations OpenAI-compatible API
 * using: [Target Face Image] + [Studio Outfit Reference Image] + [Custom Try-On Prompt]
 */
export async function callAITryOnService(
  request: AITryOnRequest,
  onProgress?: (message: string) => void
): Promise<AITryOnResponse> {
  if (!getSavedPollinationsApiKey() && !request.apiKey?.trim()) {
    return {
      imageUrl: '',
      promptUsed: '',
      status: 'error',
      errorMessage: MISSING_API_KEY_MESSAGE,
    };
  }

  const model = request.model || DEFAULT_AI_MODEL;
  let prompt = '';

  try {
    onProgress?.('Đang chuẩn bị ảnh chân dung của bạn...');
    const optimizedFace = await optimizeImageForAI(request.faceImage, 1024);

    onProgress?.('Đang kết xuất bản phối trang phục từ Studio...');
    const studioPreview =
      request.studioPreviewImage || (await renderStudioPreviewCanvas(request.outfit));
    const optimizedStudio = await optimizeImageForAI(studioPreview, 1024);

    prompt = request.customPrompt || buildMultimodalTryOnPrompt(request.outfit);

    onProgress?.(`Đang gửi dữ liệu tới AI đa phương thức (${model})...`);
    const imageUrl = await requestPollinationsImage({
      prompt,
      imageUrls: [optimizedStudio, optimizedFace],
      apiKey: request.apiKey,
      model,
    });

    return {
      imageUrl,
      promptUsed: prompt,
      status: 'success',
    };
  } catch (err) {
    console.error('Try-On Error:', err);
    return { ...toImageError(err, 'Đã xảy ra lỗi khi tạo ảnh thử đồ.'), promptUsed: prompt };
  }
}
