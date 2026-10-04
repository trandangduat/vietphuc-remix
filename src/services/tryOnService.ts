import { ActiveOutfitState, Piece } from '../types';

export interface AITryOnRequest {
  faceImage: string; // Base64 data URL or public URL of user's face
  outfit: ActiveOutfitState;
  customPrompt?: string;
  apiKey?: string;
  endpoint?: string; // Custom endpoint (e.g. Kaggle / Colab Cloudflare Tunnel)
  model?: string; // default: 'gemini-3.1-flash-lite-image' (Best P/P Nano Banana model)
  useMockFallbackOnError?: boolean;
}

export interface AITryOnResponse {
  imageUrl: string;
  promptUsed: string;
  status: 'success' | 'error';
  errorMessage?: string;
  isMockFallback?: boolean;
}

const LOCAL_STORAGE_KEY = 'vietphuc_gemini_api_key';
const LOCAL_STORAGE_ENDPOINT_KEY = 'vietphuc_tryon_endpoint';

// Best P/P model of Nano Banana family: Gemini 3.1 Flash Lite Image
export const DEFAULT_NANO_BANANA_MODEL = 'gemini-3.1-flash-lite-image';

/**
 * Retrieve the active Gemini API key from environment variables or localStorage
 */
export function getSavedGeminiApiKey(): string {
  const envKey = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim();
  if (envKey) return envKey;
  return localStorage.getItem(LOCAL_STORAGE_KEY)?.trim() || '';
}

/**
 * Retrieve custom Try-On endpoint (e.g. Kaggle / Colab URL) if configured
 */
export function getCustomTryOnEndpoint(): string {
  const envEndpoint = (import.meta.env.VITE_TRYON_API_URL as string | undefined)?.trim();
  if (envEndpoint) return envEndpoint;
  return localStorage.getItem(LOCAL_STORAGE_ENDPOINT_KEY)?.trim() || '';
}

/**
 * Resizes an image (base64 or image URL) to standard resolution (max 1024px)
 * to ensure fast multimodal upload and avoid hitting Gemini request payload limits.
 */
export async function optimizeImageForAI(
  dataUrlOrUrl: string,
  maxDim: number = 1024
): Promise<{ data: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
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

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const resDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        const [header, base64] = resDataUrl.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
        resolve({ data: base64, mimeType });
      } else {
        const parts = dataUrlOrUrl.split(',');
        const mimeType = parts[0]?.match(/:(.*?);/)?.[1] || 'image/jpeg';
        resolve({ data: parts[1] || parts[0], mimeType });
      }
    };

    img.onerror = () => {
      if (dataUrlOrUrl.startsWith('data:')) {
        const parts = dataUrlOrUrl.split(',');
        const mimeType = parts[0]?.match(/:(.*?);/)?.[1] || 'image/jpeg';
        resolve({ data: parts[1], mimeType });
      } else {
        reject(new Error('Không thể xử lý ảnh khuôn mặt'));
      }
    };

    img.src = dataUrlOrUrl;
  });
}

/**
 * Converts a relative or public URL to base64 for API multimodal transmission
 */
export async function urlToBase64(url: string): Promise<{ data: string; mimeType: string } | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const [header, base64] = result.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1] || blob.type || 'image/png';
        resolve({ data: base64, mimeType });
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.warn('Could not load piece asset for try-on payload:', url, e);
    return null;
  }
}

/**
 * Builds the comprehensive prompt for Vietnamese Traditional Virtual Try-On
 */
export function buildTryOnPrompt(outfit: ActiveOutfitState, piecesCount: number = 0): string {
  const gender = outfit.mannequinGender === 'men' ? 'nam' : 'nữ';
  const top = outfit.topPiece?.name || 'Áo tấc truyền thống';
  const topStyle = outfit.topPiece?.style || 'truyền thống';
  const topInfo = outfit.topPiece?.culturalInfo?.meaning ? ` (${outfit.topPiece.culturalInfo.meaning})` : '';

  const bottom = outfit.bottomPiece?.name || 'Quần lụa trắng truyền thống';
  const footwear = outfit.footwearPiece?.name || 'Hài nhung truyền thống';
  const accessory = outfit.accessoryPiece ? `, phụ kiện đi kèm: ${outfit.accessoryPiece.name}` : '';
  const event = outfit.event.name;
  const eventDesc = outfit.event.description || '';

  return `TASK: High-Fashion Photorealistic Virtual Try-On Portrait with Authentic Vietnamese Traditional Attire (Cổ Phục Việt Nam).

REFERENCE INPUTS PROVIDED:
1. First image: Reference face portrait of the person.
${piecesCount > 0 ? `2. Subsequent images: Visual reference garment pieces selected by the user for this outfit.` : ''}

CRITICAL GENERATION REQUIREMENTS:
1. FACIAL IDENTITY RETENTION:
   - Precisely preserve the facial likeness, facial structure, skin tone, eye shape, nose, mouth, expression, and gender (${gender}) of the individual from the reference face photo.
   - Do NOT replace or alter the face into a generic face; it must visibly and naturally be the exact same person.

2. AUTHENTIC VIETNAMESE ATTIRE:
   - DRESS the person in the exact selected Vietnamese traditional garments:
     • Áo chính (Top): "${top}" - Phong cách: ${topStyle}${topInfo}. Cổ áo đứng gài chéo hoặc cài khuy ngọc tinh xảo, tà áo buông rủ thanh thoát, chất liệu gấm hoặc tơ tằm dệt thủ công Việt Nam.
     • Quần/Váy (Bottom): "${bottom}" - Lụa mềm mại, rủ thẳng, trang nhã.
     • Hài/Giày (Footwear): "${footwear}".
     ${accessory ? `• Phụ kiện: ${accessory}.` : ''}
   ${piecesCount > 0 ? '- Faithfully reproduce the textures, fabric drape, color palette, embroidery patterns, and seams shown in the attached reference garment images.' : ''}

3. EVENT ENVIRONMENT & LIGHTING:
   - Atmospheric backdrop: "${event}" (${eventDesc}).
   - Full natural daylight or warm ambient festival lighting fitting the Vietnamese cultural setting.
   - Elegant, dignified posture matching Vietnamese traditional etiquette.

4. PHOTOGRAPHIC QUALITY:
   - 8k resolution, cinematic commercial fashion photoshoot, shallow depth of field, sharp garment textile details (silk sheen, brocade weaves, gold thread embroidery).
   - High fidelity, natural skin texture, perfectly realistic hands and proportions.`;
}

/**
 * Dispatches request either to:
 * 1. Self-hosted Kaggle / Colab GPU Server (if VITE_TRYON_API_URL or endpoint is set)
 * 2. Or Google AI Studio Gemini API (Nano Banana: gemini-3.1-flash-lite-image)
 */
export async function callAITryOnService(
  request: AITryOnRequest,
  onProgress?: (message: string) => void
): Promise<AITryOnResponse> {
  // Check if a self-hosted Kaggle/Colab or custom server is configured
  const customEndpoint = request.endpoint || getCustomTryOnEndpoint();

  if (customEndpoint) {
    try {
      onProgress?.('Đang chuẩn bị ảnh chân dung...');
      const faceImg = await optimizeImageForAI(request.faceImage, 1024);
      const prompt = request.customPrompt || buildTryOnPrompt(request.outfit);

      onProgress?.('Đang kết nối tới máy chủ Kaggle GPU...');
      const response = await fetch(customEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          face_image: `data:${faceImg.mimeType};base64,${faceImg.data}`,
          prompt,
          outfit: {
            top: request.outfit.topPiece?.name,
            bottom: request.outfit.bottomPiece?.name,
            footwear: request.outfit.footwearPiece?.name,
            accessory: request.outfit.accessoryPiece?.name,
            event: request.outfit.event.name,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Máy chủ Kaggle phản hồi lỗi (${response.status}): ${response.statusText}`);
      }

      onProgress?.('Đang hoàn thiện ảnh chân dung cổ phục...');
      const data = await response.json();
      const imageUrl = data.image_url || data.output?.[0] || data.result;

      if (!imageUrl) {
        throw new Error('Máy chủ không trả về ảnh kết quả.');
      }

      return {
        imageUrl,
        promptUsed: prompt,
        status: 'success',
      };
    } catch (err: any) {
      console.error('Kaggle Server Try-On Error:', err);
      return {
        imageUrl: '',
        promptUsed: '',
        status: 'error',
        errorMessage: err.message || 'Không thể kết nối máy chủ Kaggle GPU.',
      };
    }
  }

  // Fallback to Google AI Studio Gemini API
  const apiKey = request.apiKey || getSavedGeminiApiKey();

  if (!apiKey) {
    return {
      imageUrl: '',
      promptUsed: '',
      status: 'error',
      errorMessage:
        'Chưa cấu hình API Key (VITE_GEMINI_API_KEY) hoặc Máy chủ Kaggle (VITE_TRYON_API_URL) trong file .env.',
    };
  }

  const model = request.model || DEFAULT_NANO_BANANA_MODEL;

  try {
    onProgress?.('Đang chuẩn bị ảnh chân dung...');
    const faceImg = await optimizeImageForAI(request.faceImage, 1024);

    onProgress?.('Đang nạp chi tiết các mảnh cổ phục đã chọn...');
    const piecesToLoad: Piece[] = [];
    if (request.outfit.topPiece) piecesToLoad.push(request.outfit.topPiece);
    if (request.outfit.bottomPiece) piecesToLoad.push(request.outfit.bottomPiece);
    if (request.outfit.footwearPiece) piecesToLoad.push(request.outfit.footwearPiece);
    if (request.outfit.accessoryPiece) piecesToLoad.push(request.outfit.accessoryPiece);

    const pieceImageParts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

    for (const piece of piecesToLoad) {
      const assetUrl = piece.assetUrl || piece.thumbnailUrl;
      if (assetUrl) {
        const pieceData = await urlToBase64(assetUrl);
        if (pieceData) {
          pieceImageParts.push({
            text: `[Visual Reference Piece: ${piece.name} - ${piece.category}]`,
          });
          pieceImageParts.push({
            inlineData: {
              mimeType: pieceData.mimeType,
              data: pieceData.data,
            },
          });
        }
      }
    }

    const prompt = request.customPrompt || buildTryOnPrompt(request.outfit, pieceImageParts.length / 2);

    const parts: any[] = [
      { text: prompt },
      { text: '[Reference User Face Portrait Photo]:' },
      {
        inlineData: {
          mimeType: faceImg.mimeType,
          data: faceImg.data,
        },
      },
      ...pieceImageParts,
    ];

    onProgress?.('Đang kết nối AI sinh ảnh cổ phục (Nano Banana)...');

    const endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
      apiKey
    )}`;

    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts,
          },
        ],
      }),
    });

    if (!response.ok) {
      let errDetails = '';
      let isFreeTierZeroQuota = false;

      try {
        const errJson = await response.json();
        errDetails = errJson.error?.message || response.statusText;
        if (errDetails.includes('limit: 0') || errDetails.includes('free_tier_requests')) {
          isFreeTierZeroQuota = true;
        }
      } catch {
        errDetails = response.statusText;
      }

      if (response.status === 429) {
        if (isFreeTierZeroQuota) {
          throw new Error(
            'Tài khoản Google AI Studio hiện tại chưa kích hoạt Billing (Google đặt hạn mức sinh ảnh ở gói miễn phí là 0). Vui lòng liên kết thẻ thanh toán (Pay-as-you-go) tại Google AI Studio, hoặc chuyển sang dùng máy chủ Kaggle GPU miễn phí.'
          );
        }
        throw new Error(
          'Đã vượt quá hạn mức gọi (Quota limit) của Google AI Studio. Vui lòng thử lại sau ít phút.'
        );
      } else if (response.status === 400) {
        throw new Error(`Yêu cầu không hợp lệ (400): ${errDetails}`);
      } else if (response.status === 403 || response.status === 401) {
        throw new Error(
          `API Key không hợp lệ hoặc chưa được cấp quyền (HTTP ${response.status}). Vui lòng kiểm tra lại key trong .env.`
        );
      } else {
        throw new Error(`Lỗi từ Google AI (${response.status}): ${errDetails}`);
      }
    }

    onProgress?.('Đang hoàn thiện ảnh chân dung cổ phục...');
    const data = await response.json();

    const candidates = data?.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error(data?.error?.message || 'Không nhận được kết quả hình ảnh từ AI.');
    }

    const firstCandidate = candidates[0];

    if (firstCandidate.finishReason && firstCandidate.finishReason !== 'STOP') {
      if (firstCandidate.finishReason === 'SAFETY') {
        throw new Error('Ảnh bị từ chối bởi bộ lọc an toàn của Google Gemini. Vui lòng thử lại với một ảnh khuôn mặt khác.');
      }
    }

    let imageBase64: string | undefined;
    let mimeType = 'image/png';

    if (firstCandidate.content?.parts) {
      for (const part of firstCandidate.content.parts) {
        if (part.inlineData?.data) {
          imageBase64 = part.inlineData.data;
          mimeType = part.inlineData.mimeType || 'image/png';
          break;
        }
        if (part.inline_data?.data) {
          imageBase64 = part.inline_data.data;
          mimeType = part.inline_data.mime_type || 'image/png';
          break;
        }
      }
    }

    if (!imageBase64) {
      const textPart = firstCandidate.content?.parts?.find((p: any) => p.text)?.text;
      if (textPart) {
        throw new Error(`Mô hình phản hồi: ${textPart}`);
      }
      throw new Error('Mô hình không trả về dữ liệu hình ảnh. Vui lòng thử lại.');
    }

    const finalImageUrl = `data:${mimeType};base64,${imageBase64}`;

    return {
      imageUrl: finalImageUrl,
      promptUsed: prompt,
      status: 'success',
    };
  } catch (err: any) {
    console.error('Try-On Error:', err);
    return {
      imageUrl: '',
      promptUsed: '',
      status: 'error',
      errorMessage: err.message || 'Đã xảy ra lỗi khi kết nối với AI sinh ảnh.',
    };
  }
}
