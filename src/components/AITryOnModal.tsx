import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Upload,
  Download,
  CheckCircle2,
  X,
  Lock,
  AlertCircle,
  RefreshCw,
  Key,
  ExternalLink,
  Layers,
  Camera,
  Settings,
} from 'lucide-react';
import { ActiveOutfitState } from '../types';
import { HeritageModal } from './heritage/HeritageFrame';
import {
  callAITryOnService,
  renderStudioPreviewCanvas,
  getSavedPollinationsApiKey,
  savePollinationsApiKey,
} from '../services/tryOnService';

interface AITryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfit: ActiveOutfitState;
  onSaveToLookbook: (tryOnResultUrl: string) => void;
  isLoggedIn?: boolean;
  onLoginPrompt?: () => void;
}

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

  // Discreet API Key Config (hidden by default)
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyConfig, setShowKeyConfig] = useState(false);

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
      setErrorMessage('Vui lòng chọn hoặc tải lên ảnh chân dung của bạn.');
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

  const topName = outfit.topPiece?.name || outfit.topVariant?.name || 'Áo tấc truyền thống';
  const eventName = outfit.event.name || 'Không gian cổ kính';

  return (
    <HeritageModal
      isOpen={isOpen}
      onClose={onClose}
      title="Thử Trang Phục AI"
      subtitle={`Tái hiện chân dung người thật trong trang phục truyền thống • ${eventName}`}
      icon={<Sparkles className="w-5 h-5 flex-shrink-0 text-[#C5A059]" />}
      badge="THỬ ĐỒ AI"
      maxWidth="max-w-3xl sm:max-w-4xl"
    >
      <div className="space-y-5 font-sans text-xs text-[#EDE5D8]">
        {/* Error notification alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/50 text-xs text-rose-200 animate-fadeIn space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed flex-1">
                <span className="font-bold text-white">Thông báo: </span>
                {errorMessage}
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {(errorMessage.includes('API Key') ||
              errorMessage.includes('401') ||
              errorMessage.includes('403') ||
              errorMessage.includes('hạn mức')) && (
              <div className="pt-2 border-t border-rose-500/30 flex items-center justify-between">
                <span className="text-[11px] text-rose-200/80">Cần kiểm tra hoặc cập nhật API Key?</span>
                <button
                  onClick={() => setShowKeyConfig(true)}
                  className="px-2.5 py-1 rounded bg-[#E5BA70] hover:bg-[#F0D195] text-[#1A140E] font-bold text-[10px] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Key className="w-3 h-3" />
                  <span>Cài đặt Key</span>
                </button>
              </div>
            )}
          </div>
        )}

        {!generatedResult ? (
          /* Step 1: Input Setup */
          <div className="space-y-5">
            {/* 2-Column Spacious Visual Comparison Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column: Studio Outfit Reference */}
              <div className="flex flex-col rounded-2xl bg-black/40 border border-[#C5A059]/30 p-3.5 sm:p-4 shadow-inner">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#E5BA70] flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#C5A059]" />
                    <span>1. Trang phục đã chọn</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C5A059]/15 text-[#E5BA70] border border-[#C5A059]/30">
                    Bản phối Studio
                  </span>
                </div>

                <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#C5A059]/40 bg-black/60 shadow-lg flex-1">
                  {studioPreview ? (
                    <img
                      src={studioPreview}
                      alt="Bản phối Studio thực tế"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-xs text-[#EDE5D8]/50 animate-pulse gap-2">
                      <div className="w-6 h-6 border-2 border-[#C5A059]/40 border-t-[#C5A059] rounded-full animate-spin" />
                      <span>Đang tải trang phục...</span>
                    </div>
                  )}

                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-3 text-center">
                    <div className="text-xs font-bold text-[#F7F4EE] tracking-wide">{topName}</div>
                    <div className="text-[11px] text-[#E5BA70] mt-0.5">{eventName}</div>
                  </div>
                </div>
              </div>

              {/* Right Column: User Portrait Upload */}
              <div className="flex flex-col rounded-2xl bg-black/40 border border-[#C5A059]/30 p-3.5 sm:p-4 shadow-inner">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#E5BA70] flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#C5A059]" />
                    <span>2. Ảnh chân dung của bạn</span>
                  </span>
                  {selectedPhoto && (
                    <button
                      onClick={() => {
                        setSelectedPhoto(null);
                        setPhotoName('');
                      }}
                      className="text-[10px] text-rose-300 hover:text-white underline cursor-pointer"
                    >
                      Đổi ảnh
                    </button>
                  )}
                </div>

                {selectedPhoto ? (
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-[#E5BA70] bg-black/60 shadow-lg group flex-1">
                    <img
                      src={selectedPhoto}
                      alt="Ảnh chân dung đã chọn"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => {
                        setSelectedPhoto(null);
                        setPhotoName('');
                      }}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/80 hover:bg-rose-900 text-rose-300 border border-white/20 transition-all cursor-pointer shadow-md"
                      title="Chọn ảnh khác"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/80 px-2 py-1.5 text-[10px] text-[#EDE5D8] truncate text-center backdrop-blur-sm">
                      {photoName || 'Ảnh chân dung'}
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative aspect-[3/4] rounded-xl border-2 border-dashed border-[#C5A059]/40 hover:border-[#E5BA70] hover:bg-[#E5BA70]/5 bg-[#0D111A]/70 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all flex-1 group"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#E5BA70]/10 border border-[#E5BA70]/30 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-[#E5BA70]/20 transition-transform">
                      <Upload className="w-6 h-6 text-[#E5BA70]" />
                    </div>
                    <span className="text-sm font-bold text-[#F7F4EE] mb-1">
                      Tải ảnh chân dung lên
                    </span>
                    <span className="text-[11px] text-[#EDE5D8]/60 max-w-[200px] leading-relaxed">
                      Chụp rõ khuôn mặt, ánh sáng tự nhiên để đạt chất lượng tốt nhất
                    </span>
                    <span className="mt-3 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-[#E5BA70]">
                      Hỗ trợ JPG, PNG, WebP
                    </span>
                  </div>
                )}
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

            {/* Parental Consent Checkbox */}
            <div className="p-3 rounded-xl bg-black/30 border border-[#C5A059]/20">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMinorConsent}
                  onChange={(e) => setIsMinorConsent(e.target.checked)}
                  className="rounded border-[#C5A059]/50 text-[#E5BA70] focus:ring-[#E5BA70] w-4 h-4 cursor-pointer"
                />
                <span className="text-[#EDE5D8]/75 text-[11px] leading-relaxed">
                  Đối với người dưới 16 tuổi: Xác nhận đã có sự đồng ý của phụ huynh/người giám hộ.
                </span>
              </label>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleStartGeneration}
              disabled={!selectedPhoto || isGenerating || !isMinorConsent}
              className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer ${
                selectedPhoto && !isGenerating && isMinorConsent
                  ? 'bg-gradient-to-r from-[#F0D195] via-[#E5BA70] to-[#DCAB5E] text-[#1A140E] hover:brightness-110 shadow-[0_4px_24px_rgba(229,186,112,0.4)]'
                  : 'bg-[#161B26] text-[#EDE5D8]/40 border border-[#C5A059]/20 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#1A140E]/30 border-t-[#1A140E] rounded-full animate-spin" />
                  <span>{generationStep || 'AI đang dệt trang phục và tái hiện chân dung...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-[#1A140E] fill-current" />
                  <span>Thử Cổ Phục Ngay</span>
                </>
              )}
            </button>

            {/* Discreet API Key Settings Toggle in Footer */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowKeyConfig(!showKeyConfig)}
                className="text-[10px] text-[#EDE5D8]/40 hover:text-[#E5BA70] flex items-center gap-1 transition-colors cursor-pointer py-1 px-2 rounded hover:bg-white/5"
              >
                <Settings className="w-3 h-3" />
                <span>Cài đặt nâng cao</span>
              </button>
            </div>

            {/* Hidden / Discreet API Key Modal */}
            {showKeyConfig && (
              <div className="p-3.5 rounded-xl bg-[#141A26] border border-[#E5BA70]/40 space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#E5BA70] flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5" />
                    <span>Cấu hình API Key (Pollinations)</span>
                  </span>
                  <a
                    href="https://enter.pollinations.ai/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-[#E5BA70] hover:underline flex items-center gap-1"
                  >
                    <span>Nhận Key miễn phí</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    placeholder="Dán API Key (sk_...)..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/15 text-[#EDE5D8] text-xs focus:border-[#E5BA70] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSaveKey}
                    className="px-3.5 py-1.5 rounded-lg bg-[#E5BA70] text-[#1A140E] font-bold text-xs hover:bg-[#F0D195] transition-colors cursor-pointer"
                  >
                    Lưu Key
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Step 2: Generated Result View */
          <div className="space-y-6 text-center animate-fadeIn py-2">
            <div className="relative aspect-[3/4] max-w-[360px] sm:max-w-[420px] mx-auto rounded-2xl overflow-hidden border-2 border-[#E5BA70] shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(229,186,112,0.25)] bg-black/95">
              <img
                src={generatedResult}
                alt="AI Try-on result"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-black/85 backdrop-blur-md border border-[#E5BA70]/70 text-[10px] font-bold text-[#E5BA70] flex items-center gap-1.5 uppercase tracking-wider shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-[#E5BA70] fill-current" />
                <span>KẾT QUẢ THỬ CỔ PHỤC</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#EDE5D8]/80 max-w-md mx-auto leading-relaxed">
              Bức ảnh chân dung cổ phục đã hoàn tất! Bạn có thể tải ngay về máy hoặc lưu vào Bộ sưu tập Lookbook cá nhân.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1 max-w-lg mx-auto">
              <button
                onClick={() => {
                  setGeneratedResult(null);
                  setSelectedPhoto(null);
                  setPhotoName('');
                  setErrorMessage(null);
                }}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-[#EDE5D8] transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Thử ảnh khác</span>
              </button>

              <button
                onClick={handleDownload}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#E5BA70]/15 hover:bg-[#E5BA70]/25 border border-[#E5BA70]/70 text-xs font-bold text-[#E5BA70] transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Đã tải về máy!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Tải ảnh về máy</span>
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
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-[#F0D195] via-[#E5BA70] to-[#DCAB5E] text-[#1A140E] font-bold text-xs hover:brightness-110 shadow-[0_4px_16px_rgba(229,186,112,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {!isLoggedIn && <Lock className="w-4 h-4" />}
                <span>{isLoggedIn ? 'Lưu Lookbook' : 'Đăng nhập để lưu'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </HeritageModal>
  );
};
