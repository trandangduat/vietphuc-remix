import React, { useState } from 'react';
import { Sparkles, Shield, Upload } from 'lucide-react';
import { ActiveOutfitState } from '../types';
import { HeritageModal } from './heritage/HeritageFrame';

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
  const [isMinorConsent, setIsMinorConsent] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);

  // Sample portrait faces
  const SAMPLE_FACES = [
    { id: 'face1', label: 'Chân dung mẫu 1 (Nữ)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
    { id: 'face2', label: 'Chân dung mẫu 2 (Nam)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  ];

  const handleStartGeneration = () => {
    if (!selectedPhoto) return;
    setIsGenerating(true);

    // Simulate AI Image-to-Image / Inpainting generation
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedResult('/assets/test-composite-preview.png');
    }, 2000);
  };

  return (
    <HeritageModal
      isOpen={isOpen}
      onClose={onClose}
      title="Thử Trang Phục AI (AI Try On)"
      subtitle={`Kết hợp chân dung + Outfit hiện tại • Nền: ${outfit.event.name}`}
      icon={<Sparkles className="w-4 h-4 flex-shrink-0 text-[#C5A059]" />}
      badge="AI STUDIO"
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 font-sans text-xs">
        {/* Privacy Notice Banner */}
        <div className="p-3 rounded-[6px] bg-[#0D111A] border-l-4 border-l-teal-500 border border-[#C5A059]/30 flex items-start gap-2.5 text-xs text-[#EDE5D8]/80">
          <Shield className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-[#F7F4EE]">Cam kết bảo mật: </span>
            Ảnh gốc chỉ được xử lý tạm thời để tạo kết quả và xóa ngay lập tức. Không dùng ảnh của bạn để huấn luyện mô hình AI.
          </div>
        </div>

        {!generatedResult ? (
          <div className="space-y-4">
            {/* Step 1: Choose / Upload Photo */}
            <div>
              <label className="block text-[11px] font-bold text-[#C5A059] mb-2 uppercase tracking-wider">
                1. Chọn ảnh chân dung hoặc ảnh mẫu:
              </label>
              <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                {SAMPLE_FACES.map((face) => (
                  <div
                    key={face.id}
                    onClick={() => setSelectedPhoto(face.url)}
                    className={`p-2.5 rounded-[8px] border cursor-pointer transition-all flex items-center gap-2.5 ${
                      selectedPhoto === face.url
                        ? 'border-[#D4AF37] bg-[#C5A059]/15 shadow-sm'
                        : 'border-[#C5A059]/30 bg-[#0D111A]/80 hover:border-[#C5A059]/60'
                    }`}
                  >
                    <img
                      src={face.url}
                      alt={face.label}
                      className="w-10 h-10 rounded-[6px] object-cover border border-[#C5A059]/40 flex-shrink-0"
                    />
                    <span className="text-xs text-[#EDE5D8] font-medium">{face.label}</span>
                  </div>
                ))}
              </div>

              {/* Upload trigger simulation */}
              <div className="border border-dashed border-[#C5A059]/45 hover:border-[#D4AF37] rounded-[8px] p-4 text-center cursor-pointer transition-all bg-[#0D111A]/60">
                <Upload className="w-6 h-6 text-[#C5A059] mx-auto mb-1.5 opacity-90" />
                <span className="text-xs text-[#EDE5D8] font-bold block">Tải ảnh từ máy tính hoặc điện thoại</span>
                <span className="text-[11px] text-[#EDE5D8]/60 mt-0.5 block">Hỗ trợ định dạng JPG, PNG (tối đa 10MB)</span>
              </div>
            </div>

            {/* Step 2: Parental Consent for Minors */}
            <div className="p-3 rounded-[6px] bg-[#0D111A] border border-[#C5A059]/30">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={isMinorConsent}
                  onChange={(e) => setIsMinorConsent(e.target.checked)}
                  className="mt-0.5 rounded-[3px] border-[#C5A059]/50 text-[#C5A059] focus:ring-[#C5A059] w-4 h-4 cursor-pointer"
                />
                <span className="text-[#EDE5D8]/80 leading-relaxed font-normal">
                  Đối với học sinh dưới 16 tuổi: Tôi xác nhận đã có sự đồng ý của cha mẹ hoặc người giám hộ hợp pháp khi tải ảnh chân dung lên ứng dụng.
                </span>
              </label>
            </div>

            {/* Submit Action Button */}
            <button
              onClick={handleStartGeneration}
              disabled={!selectedPhoto || isGenerating}
              className={`w-full py-3 rounded-[6px] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                selectedPhoto && !isGenerating
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8232] text-[#0A0D12] hover:brightness-110 shadow-[0_4px_16px_rgba(212,175,55,0.25)]'
                  : 'bg-[#161B26] text-[#EDE5D8]/40 border border-[#C5A059]/25 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0A0D12]/30 border-t-[#0A0D12] rounded-full animate-spin" />
                  <span>AI đang xử lý ghép trang phục...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#0A0D12]" />
                  <span>Tạo ảnh AI Try On ngay</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Step 3: Generated Result View */
          <div className="space-y-4 text-center">
            <div className="relative aspect-[3/4] max-w-[280px] mx-auto rounded-[8px] overflow-hidden border border-[#C5A059]/70 shadow-[0_16px_40px_rgba(0,0,0,0.9)]">
              <img
                src={generatedResult}
                alt="AI Try-on result"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-[4px] bg-[#12161F]/90 backdrop-blur-md border border-[#C5A059]/60 text-[10px] font-bold text-[#D4AF37] flex items-center gap-1.5 uppercase tracking-wider shadow">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>AI Generated</span>
              </div>
            </div>

            <p className="text-xs text-[#EDE5D8]/80 max-w-sm mx-auto leading-relaxed">
              Bức ảnh mô phỏng hoàn tất! Ảnh này chỉ được lưu trữ lâu dài nếu bạn chọn "Lưu vào Lookbook".
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => setGeneratedResult(null)}
                className="py-2.5 px-3 rounded-[6px] bg-[#161B26] hover:bg-[#1E2433] border border-[#C5A059]/40 text-xs font-bold text-[#EDE5D8] uppercase tracking-wider transition-colors cursor-pointer"
              >
                Thử lại ảnh khác
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
                className="py-2.5 px-3 rounded-[6px] bg-gradient-to-r from-[#D4AF37] to-[#AA8232] text-[#0A0D12] font-bold text-xs hover:brightness-110 shadow-[0_4px_16px_rgba(212,175,55,0.25)] uppercase tracking-wider cursor-pointer"
              >
                {isLoggedIn ? 'Lưu vào Lookbook' : 'Đăng nhập để lưu'}
              </button>
            </div>
          </div>
        )}
      </div>
    </HeritageModal>
  );
};
