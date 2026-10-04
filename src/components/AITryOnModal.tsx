import React, { useState, useRef } from 'react';
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
  Image as ImageIcon,
} from 'lucide-react';
import { ActiveOutfitState } from '../types';
import { HeritageModal } from './heritage/HeritageFrame';
import { callAITryOnService } from '../services/tryOnService';

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
  const [isMinorConsent, setIsMinorConsent] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Trigger AI generation with Nano Banana
  const handleStartGeneration = async () => {
    if (!selectedPhoto) {
      setErrorMessage('Vui lòng tải lên hoặc chọn một ảnh khuôn mặt chân dung.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await callAITryOnService(
        {
          faceImage: selectedPhoto,
          outfit,
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
      badge="NANO BANANA AI"
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 font-sans text-xs">
        {/* Privacy Notice Banner */}
        <div className="p-3 rounded-lg bg-[#0D111A] border-l-4 border-l-emerald-500 border border-[#C5A059]/25 flex items-start gap-2.5 text-xs text-[#EDE5D8]/80">
          <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-[#F7F4EE]">Bảo mật hình ảnh: </span>
            Ảnh khuôn mặt của bạn chỉ được sử dụng trong phiên làm việc để tạo ảnh phục trang truyền thống và không được lưu trữ cho mục đích khác.
          </div>
        </div>

        {/* Outfit summary chip */}
        <div className="p-3 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#EDE5D8]/90 truncate">
            <Shirt className="w-4 h-4 text-[#E5BA70] flex-shrink-0" />
            <span className="truncate">
              <strong>Phục trang:</strong> {outfit.topPiece?.name || 'Áo tấc'} + {outfit.bottomPiece?.name || 'Quần'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[#E5BA70] flex-shrink-0 text-[11px] font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>{outfit.event.name}</span>
          </div>
        </div>

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

            {/* Quick Demo Preview fallback if quota limit or billing is hit */}
            {(errorMessage.includes('Billing') || errorMessage.includes('Quota')) && (
              <div className="pt-2 border-t border-rose-500/30 flex items-center justify-between">
                <span className="text-[11px] text-rose-200/80">
                  Bạn có muốn xem ảnh mô phỏng kết quả mẫu để kiểm tra giao diện?
                </span>
                <button
                  onClick={() => {
                    setGeneratedResult('/assets/test-composite-preview.png');
                    setErrorMessage(null);
                  }}
                  className="px-2.5 py-1 rounded bg-[#E5BA70] hover:bg-[#F0D195] text-[#1A140E] font-bold text-[10px] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Xem ảnh mẫu</span>
                </button>
              </div>
            )}
          </div>
        )}

        {!generatedResult ? (
          <div className="space-y-4">
            {/* Step 1: Upload Face Photo */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold text-[#E5BA70] uppercase tracking-wider block">
                  Tải lên ảnh khuôn mặt của bạn:
                </label>
                {selectedPhoto && (
                  <button
                    onClick={() => {
                      setSelectedPhoto(null);
                      setPhotoName('');
                    }}
                    className="text-[11px] text-rose-300 hover:text-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    <span>Chọn ảnh khác</span>
                  </button>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Drag/Click upload box or Photo preview */}
              {selectedPhoto ? (
                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#0D111A] border border-[#E5BA70]/60 shadow-[0_0_15px_rgba(229,186,112,0.15)]">
                  <img
                    src={selectedPhoto}
                    alt="Khuôn mặt đã chọn"
                    className="w-16 h-16 rounded-lg object-cover border border-[#E5BA70]/40 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5BA70] block">
                      Ảnh khuôn mặt sẵn sàng
                    </span>
                    <p className="text-xs text-silk-ivory font-medium truncate mt-0.5">
                      {photoName || 'Chân dung người dùng'}
                    </p>
                    <span className="text-[11px] text-[#EDE5D8]/50 block mt-0.5">
                      AI sẽ giữ trọn diện mạo khuôn mặt này và mặc bộ cổ phục lên người bạn.
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#C5A059]/35 hover:border-[#E5BA70] bg-[#0D111A]/60 hover:bg-[#0D111A]/80 rounded-xl p-5 text-center cursor-pointer transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-[#E5BA70]/15 border border-[#E5BA70]/30 flex items-center justify-center mb-2 mx-auto text-[#E5BA70]">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-[#EDE5D8] font-bold block mb-0.5">
                    Bấm để tải ảnh khuôn mặt từ thiết bị
                  </span>
                  <span className="text-[11px] text-[#EDE5D8]/50 block">
                    Khuyến nghị: Ảnh chụp chính diện, rõ nét (JPG, PNG tối đa 15MB)
                  </span>
                </div>
              )}

              {/* Sample Faces Shortcuts */}
              {!selectedPhoto && (
                <div className="mt-3">
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
                        className="p-2 rounded-lg border border-white/10 bg-[#0D111A]/70 hover:border-[#E5BA70]/50 cursor-pointer transition-all flex items-center gap-2 select-none"
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
            </div>

            {/* Parental Consent Checkbox */}
            <div className="p-3 rounded-lg bg-[#0D111A] border border-[#C5A059]/25">
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
                  <span>{generationStep || 'AI đang sinh ảnh...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#1A140E] fill-current" />
                  <span>Tạo ảnh AI Try On ngay</span>
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
                <span>AI Generated</span>
              </div>
            </div>

            <p className="text-xs text-[#EDE5D8]/80 max-w-sm mx-auto leading-relaxed">
              Bức ảnh mô phỏng hoàn tất! Bạn có thể tải ngay file ảnh chất lượng cao về máy hoặc lưu vào Bộ sưu tập Lookbook cá nhân.
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
