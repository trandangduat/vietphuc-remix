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
  width: number = 768,
  height: number = 1024
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

  // 0. Neutral clean studio backdrop (no event background)
  ctx.fillStyle = '#E8EAED';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const layers: LayerItem[] = [];

  // 1. Mannequin Base
  layers.push({ url: '/assets/mannequins/mannequin-base.png' });

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
        const align = item.alignment;
        ctx.save();
        const cx = canvas.width / 2 + (align.x / 100) * canvas.width;
        const cy = canvas.height / 2 + (align.y / 100) * canvas.height;
        ctx.translate(cx, cy);
        if (align.rotate) {
          ctx.rotate((align.rotate * Math.PI) / 180);
        }
        const sx = align.scale * (align.scaleX ?? 1);
        const sy = align.scale * (align.scaleY ?? 1);
        ctx.scale(sx, sy);
        ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        ctx.restore();
      } else {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    } catch (err) {
      console.warn(`Layer render skipped: ${item.url}`, err);
    }
  }

  return canvas.toDataURL('image/jpeg', 0.9);
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
    `Image 2 is the reference photo of the person for virtual try-on.\n\n` +
    `Task: Generate a realistic portrait of the person from Image 2 wearing the exact outfit from Image 1.\n` +
    `Preserve the person's face, facial structure, and likeness.\n` +
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

/**
 * Dispatches multimodal Virtual Try-On request to Pollinations OpenAI-compatible API
 * using: [Target Face Image] + [Studio Outfit Reference Image] + [Custom Try-On Prompt]
 */
export async function callAITryOnService(
  request: AITryOnRequest,
  onProgress?: (message: string) => void
): Promise<AITryOnResponse> {
  const apiKey = request.apiKey || getSavedPollinationsApiKey();

  if (!apiKey) {
    return {
      imageUrl: '',
      promptUsed: '',
      status: 'error',
      errorMessage:
        'Chưa có API Key. Vui lòng bấm nút "API Key" ở trên để nhập key miễn phí từ enter.pollinations.ai/keys.',
    };
  }

  const model = request.model || DEFAULT_AI_MODEL;

  try {
    onProgress?.('Đang chuẩn bị ảnh chân dung của bạn...');
    const optimizedFace = await optimizeImageForAI(request.faceImage, 1024);

    onProgress?.('Đang kết xuất bản phối trang phục từ Studio...');
    const studioPreview =
      request.studioPreviewImage || (await renderStudioPreviewCanvas(request.outfit));
    const optimizedStudio = await optimizeImageForAI(studioPreview, 1024);

    const prompt = request.customPrompt || buildMultimodalTryOnPrompt(request.outfit);

    onProgress?.(`Đang gửi dữ liệu tới AI đa phương thức (${model})...`);

    const response = await fetch('https://gen.pollinations.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: optimizedStudio } }, // Image 1: Mannequin wearing the outfit
              { type: 'image_url', image_url: { url: optimizedFace } },   // Image 2: Person for try-on
            ],
          },
        ],
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

    onProgress?.('AI đang hoàn thiện và render ảnh thử đồ...');
    const data = await response.json();

    const assistantContent = data.choices?.[0]?.message?.content;
    if (!assistantContent) {
      throw new Error('Mô hình không trả về nội dung hình ảnh.');
    }

    // Extract image URL from response (Markdown ![Image](url) or raw URL)
    const urlMatch =
      assistantContent.match(/https:\/\/media\.pollinations\.ai\/[a-zA-Z0-9_\-]+/i) ||
      assistantContent.match(/https?:\/\/[^\s\)\"\'\<\>]+/i);

    if (!urlMatch || !urlMatch[0]) {
      throw new Error(`AI phản hồi dạng văn bản thay vì ảnh: ${assistantContent}`);
    }

    const generatedImageUrl = urlMatch[0];

    onProgress?.('Đang tải ảnh chất lượng cao về máy...');
    const base64DataUrl = await fetchImageAsDataUrl(generatedImageUrl);

    return {
      imageUrl: base64DataUrl,
      promptUsed: prompt,
      status: 'success',
    };
  } catch (err: any) {
    console.error('Try-On Error:', err);
    return {
      imageUrl: '',
      promptUsed: '',
      status: 'error',
      errorMessage: err.message || 'Đã xảy ra lỗi khi tạo ảnh thử đồ.',
    };
  }
}
