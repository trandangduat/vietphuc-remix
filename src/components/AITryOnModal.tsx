import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Shield,
  Upload,
  Download,
  CheckCircle2,
  X,
  Lock,
  Shirt,
  Calendar,
  AlertCircle,
  RefreshCw,
  Key,
  ExternalLink,
  Layers,
  User,
} from 'lucide-react';
import { ActiveOutfitState } from '../types';
import { HeritageModal } from './heritage/HeritageFrame';
import {
  callAITryOnService,
  renderStudioPreviewCanvas,
  getSavedPollinationsApiKey,
  savePollinationsApiKey,
  DEFAULT_AI_MODEL,
} from '../services/tryOnService';

interface AITryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfit: ActiveOutfitState;
  onSaveToLookbook: (tryOnResultUrl: string) => void;
  isLoggedIn?: boolean;
  onLoginPrompt?: () => void;
}

// Sample faces for quick demo
const SAMPLE_FACES = [
  {
    id: 'face-nu-1',
    label: 'Chân dung Nữ 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'face-nam-1',
    label: 'Chân dung Nam 1',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'face-nu-2',
    label: 'Chân dung Nữ 2',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  },
];

export const AITryOnModal: React.FC<AITryOnModalProps> = ({
  isOpen,
  onClose,
  outfit,
  onSaveToLookbook,
  isLoggedIn = false,
  onLoginPrompt,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string>('');
  const [studioPreview, setStudioPreview] = useState<string | null>(null);
  const [isMinorConsent, setIsMinorConsent] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pollinations API Key & Multimodal Model Selection
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_AI_MODEL);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved API key on mount
  useEffect(() => {
    setApiKey(getSavedPollinationsApiKey());
  }, []);

  // Pre-render the exact Studio canvas preview whenever modal opens or outfit changes
  useEffect(() => {
    if (isOpen) {
      renderStudioPreviewCanvas(outfit)
        .then((dataUrl) => setStudioPreview(dataUrl))
        .catch((err) => console.warn('Could not pre-render studio preview:', err));
    }
  }, [isOpen, outfit]);

  const handleSaveKey = () => {
    savePollinationsApiKey(apiKey);
    setShowKeyConfig(false);
  };

  // Handle file upload from device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WebP).');
        return;
      }
      setErrorMessage(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedPhoto(event.target?.result as string);
        setPhotoName(file.name);
        setGeneratedResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger Multimodal AI Virtual Try-On
  const handleStartGeneration = async () => {
    if (!selectedPhoto) {
      setErrorMessage('Vui lòng tải lên hoặc chọn một ảnh khuôn mặt/người mẫu.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await callAITryOnService(
        {
          faceImage: selectedPhoto,
          studioPreviewImage: studioPreview || undefined,
          outfit,
          apiKey: apiKey.trim() || undefined,
          model: selectedModel,
        },
        (progress) => setGenerationStep(progress)
      );

      if (response.status === 'success' && response.imageUrl) {
        setGeneratedResult(response.imageUrl);
      } else {
        setErrorMessage(response.errorMessage || 'Lỗi khi tạo ảnh. Vui lòng thử lại.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Không thể kết nối dịch vụ AI. Vui lòng thử lại sau.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Download high-resolution PNG
  const handleDownload = () => {
    if (!generatedResult) return;
    const link = document.createElement('a');
    link.download = `vietphuc-tryon-${Date.now()}.png`;
    link.href = generatedResult;
    link.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <HeritageModal
      isOpen={isOpen}
      onClose={onClose}
      title="Thử Trang Phục AI (AI Try On)"
      subtitle={`Tạo ảnh người thật mặc cổ phục qua AI • Bối cảnh: ${outfit.event.name}`}
      icon={<Sparkles className="w-4 h-4 flex-shrink-0 text-[#C5A059]" />}
      badge="MULTIMODAL AI TRY-ON"
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 font-sans text-xs">
        {/* Top Controls: Model Switcher & API Key */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-[#0D111A] border border-[#C5A059]/25 text-xs">
          <div className="flex items-center gap-2 text-[#EDE5D8]/90">
            <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-[11px] leading-tight font-medium">
              Mô hình: <strong className="text-[#F7F4EE]">{selectedModel.split('/').pop()?.toUpperCase()}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Model switcher */}
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-black/60 border border-white/15 text-[#EDE5D8] text-[11px] rounded px-2 py-1 focus:border-[#E5BA70] focus:outline-none cursor-pointer"
            >
              <option value="openai/gpt-image-2">GPT Image 2 (Khuyên dùng)</option>
              <option value="openai/gpt-image-1-mini">GPT Image Mini (Nhanh)</option>
              <option value="google/gemini-nano-banana-2.1">Nano Banana 2.1 (Google)</option>
            </select>

            {/* API Key settings button */}
            <button
              type="button"
              onClick={() => setShowKeyConfig(!showKeyConfig)}
              className={`px-2 py-1 rounded text-[11px] font-medium border flex items-center gap-1 transition-colors cursor-pointer ${
                apiKey
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-[#EDE5D8]/70 hover:text-white'
              }`}
              title="Cấu hình API Key"
            >
              <Key className="w-3 h-3" />
              <span>{apiKey ? 'Key OK' : 'API Key'}</span>
            </button>
          </div>
        </div>

        {/* API Key Configuration Dropdown */}
        {showKeyConfig && (
          <div className="p-3 rounded-lg bg-[#141A26] border border-[#E5BA70]/40 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#E5BA70] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                <span>Cấu hình API Key (Pollinations)</span>
              </span>
              <a
                href="https://enter.pollinations.ai/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-[#E5BA70] hover:underline flex items-center gap-1"
              >
                <span>Lấy Key miễn phí</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <p className="text-[11px] text-[#EDE5D8]/70 leading-relaxed">
              Dán API Key (bắt đầu bằng <code>sk_...</code> hoặc <code>pk_...</code>) để kích hoạt mô hình đa phương thức:
            </p>

            <div className="flex items-center gap-2">
              <input
                type="password"
                placeholder="Dán API Key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 px-2.5 py-1.5 rounded bg-black/60 border border-white/15 text-[#EDE5D8] text-xs focus:border-[#E5BA70] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveKey}
                className="px-3 py-1.5 rounded bg-[#E5BA70] text-[#1A140E] font-bold text-xs hover:bg-[#F0D195] transition-colors cursor-pointer"
              >
                Lưu
              </button>
            </div>
          </div>
        )}

        {/* Error notification alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 animate-fadeIn space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed flex-1">
                <span className="font-bold text-white">Thông báo từ AI: </span>
                {errorMessage}
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Prompt to add API Key if 401, 402, 403, or quota is returned */}
            {(errorMessage.includes('402') ||
              errorMessage.includes('403') ||
              errorMessage.includes('401') ||
              errorMessage.includes('API Key') ||
              errorMessage.includes('Paid Pollen')) && (
              <div className="pt-2 border-t border-rose-500/30 flex items-center justify-between">
                <span className="text-[11px] text-rose-200/90">
                  Cần kiểm tra API Key hoặc đổi mô hình khác:
                </span>
                <button
                  onClick={() => setShowKeyConfig(true)}
                  className="px-2.5 py-1 rounded bg-[#E5BA70] hover:bg-[#F0D195] text-[#1A140E] font-bold text-[10px] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Key className="w-3 h-3" />
                  <span>Cấu hình Key</span>
                </button>
              </div>
            )}
          </div>
        )}

        {!generatedResult ? (
          <div className="space-y-4">
            {/* Visual Input Overview: 2 Reference Images Fed to AI */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-black/40 border border-white/10">
              {/* Input 1: User Person / Face Image */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5BA70] flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>1. Ảnh khuôn mặt / Người mẫu</span>
                </span>
                {selectedPhoto ? (
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-[#E5BA70]/50 bg-black/60 group">
                    <img
                      src={selectedPhoto}
                      alt="Ảnh người mẫu"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => {
                        setSelectedPhoto(null);
                        setPhotoName('');
                      }}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/75 hover:bg-rose-900 text-rose-300 transition-colors"
                      title="Đổi ảnh khác"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/75 px-1.5 py-0.5 text-[9px] text-[#EDE5D8] truncate text-center">
                      {photoName || 'Đã chọn'}
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-[3/4] rounded-lg border-2 border-dashed border-[#C5A059]/35 hover:border-[#E5BA70] bg-[#0D111A]/60 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-all"
                  >
                    <Upload className="w-5 h-5 text-[#E5BA70] mb-1" />
                    <span className="text-[10px] font-bold text-[#EDE5D8]">Bấm tải ảnh lên</span>
                    <span className="text-[9px] text-[#EDE5D8]/50">Khuôn mặt rõ nét</span>
                  </div>
                )}
              </div>

              {/* Input 2: Studio Preview Reference (Outfit + Background) */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5BA70] flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  <span>2. Bản phối Studio thực tế</span>
                </span>
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-[#C5A059]/40 bg-black/60">
                  {studioPreview ? (
                    <img
                      src={studioPreview}
                      alt="Bản phối Studio thực tế"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-[#EDE5D8]/50 animate-pulse">
                      Đang kết xuất bản phối...
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-black/80 px-1.5 py-0.5 text-[9px] text-[#E5BA70] truncate text-center">
                    {outfit.topPiece?.name || 'Áo tấc'} • {outfit.event.name}
                  </div>
                </div>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Sample Faces Shortcuts */}
            {!selectedPhoto && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#EDE5D8]/50 block mb-1.5">
                  Hoặc thử nhanh với ảnh chân dung mẫu:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {SAMPLE_FACES.map((face) => (
                    <div
                      key={face.id}
                      onClick={() => {
                        setSelectedPhoto(face.url);
                        setPhotoName(face.label);
                        setErrorMessage(null);
                      }}
                      className="p-1.5 rounded-lg border border-white/10 bg-[#0D111A]/70 hover:border-[#E5BA70]/50 cursor-pointer transition-all flex items-center gap-2 select-none"
                    >
                      <img
                        src={face.url}
                        alt={face.label}
                        className="w-7 h-7 rounded-full object-cover border border-[#E5BA70]/40 flex-shrink-0"
                      />
                      <span className="text-[11px] text-[#EDE5D8] font-medium truncate">
                        {face.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Parental Consent Checkbox */}
            <div className="p-2.5 rounded-lg bg-[#0D111A] border border-[#C5A059]/25">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={isMinorConsent}
                  onChange={(e) => setIsMinorConsent(e.target.checked)}
                  className="mt-0.5 rounded border-[#C5A059]/50 text-[#E5BA70] focus:ring-[#E5BA70] w-4 h-4 cursor-pointer"
                />
                <span className="text-[#EDE5D8]/80 leading-relaxed font-normal text-[11px]">
                  Đối với người dưới 16 tuổi: Tôi xác nhận đã có sự đồng ý của phụ huynh/người giám hộ khi tải ảnh khuôn mặt lên hệ thống.
                </span>
              </label>
            </div>

            {/* Submit Action Button */}
            <button
              onClick={handleStartGeneration}
              disabled={!selectedPhoto || isGenerating || !isMinorConsent}
              className={`w-full py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                selectedPhoto && !isGenerating && isMinorConsent
                  ? 'bg-gradient-to-r from-[#F0D195] via-[#E5BA70] to-[#DCAB5E] text-[#1A140E] hover:brightness-110 shadow-[0_4px_16px_rgba(229,186,112,0.35)]'
                  : 'bg-[#161B26] text-[#EDE5D8]/40 border border-[#C5A059]/20 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#1A140E]/30 border-t-[#1A140E] rounded-full animate-spin" />
                  <span>{generationStep || 'AI đang xử lý ghép ảnh đa phương thức...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#1A140E] fill-current" />
                  <span>Tạo ảnh AI Try On (Khuôn mặt + Bộ đồ Studio)</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Step 2: Generated Result View */
          <div className="space-y-4 text-center animate-fadeIn">
            <div className="relative aspect-[3/4] max-w-[320px] mx-auto rounded-xl overflow-hidden border-2 border-[#E5BA70] shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(229,186,112,0.2)] bg-black/90">
              <img
                src={generatedResult}
                alt="AI Try-on result"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-md border border-[#E5BA70]/60 text-[10px] font-bold text-[#E5BA70] flex items-center gap-1.5 uppercase tracking-wider shadow">
                <Sparkles className="w-3 h-3 text-[#E5BA70] fill-current" />
                <span>AI TRY-ON RESULT</span>
              </div>
            </div>

            <p className="text-xs text-[#EDE5D8]/80 max-w-sm mx-auto leading-relaxed">
              Bức ảnh thử trang phục hoàn tất! Bạn có thể tải ngay file ảnh về máy hoặc lưu vào Bộ sưu tập Lookbook cá nhân.
            </p>

            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <button
                onClick={() => {
                  setGeneratedResult(null);
                  setSelectedPhoto(null);
                  setPhotoName('');
                  setErrorMessage(null);
                }}
                className="py-2.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-[#EDE5D8] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Thử ảnh khác</span>
              </button>

              <button
                onClick={handleDownload}
                className="py-2.5 px-3 rounded-lg bg-[#E5BA70]/15 hover:bg-[#E5BA70]/25 border border-[#E5BA70]/60 text-xs font-bold text-[#E5BA70] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Đã tải!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải ảnh</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    onLoginPrompt?.();
                    return;
                  }
                  onSaveToLookbook(generatedResult);
                  onClose();
                }}
                className="py-2.5 px-3 rounded-lg bg-gradient-to-r from-[#F0D195] via-[#E5BA70] to-[#DCAB5E] text-[#1A140E] font-bold text-xs hover:brightness-110 shadow-[0_4px_16px_rgba(229,186,112,0.3)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {!isLoggedIn && <Lock className="w-3.5 h-3.5" />}
                <span>{isLoggedIn ? 'Lưu Lookbook' : 'Đăng nhập lưu'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </HeritageModal>
  );
};
