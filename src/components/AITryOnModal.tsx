import React, { useState } from 'react';
import { X, Sparkles, Shield, Upload } from 'lucide-react';
import { ActiveOutfitState } from '../types';

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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lacquer/90 backdrop-blur-md font-sans">
      <div className="max-w-xl w-full bg-lacquer-card border-2 border-imperial-gold rounded-none p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-none text-silk-muted hover:text-silk-ivory hover:bg-lacquer-surface transition-all border border-lacquer-border"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-none bg-imperial-red/20 text-imperial-red-bright border border-imperial-red/40">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-2xl text-silk-ivory">
              Thử trang phục trên người thật (AI Try on)
            </h3>
            <p className="text-sm text-silk-muted mt-0.5">
              Kết hợp chân dung của bạn + Outfit hiện tại + Nền {outfit.event.name}
            </p>
          </div>
        </div>

        {/* Privacy Notice Banner */}
        <div className="my-4 p-3.5 rounded-none bg-lacquer-surface border-l-4 border-l-teal-400 border border-lacquer-border flex items-start gap-3 text-sm text-silk-muted">
          <Shield className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-silk-ivory">Cam kết bảo mật tuyệt đối: </span>
            Ảnh gốc của bạn chỉ được xử lý tạm thời để tạo kết quả và bị xóa ngay lập tức. Không sử dụng hình ảnh của bạn để huấn luyện mô hình AI.
          </div>
        </div>

        {!generatedResult ? (
          <div className="space-y-4">
            {/* Step 1: Choose / Upload Photo */}
            <div>
              <label className="block text-xs font-bold text-silk-ivory mb-2 uppercase tracking-wider">
                1. Chọn ảnh chân dung của bạn hoặc ảnh mẫu:
              </label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {SAMPLE_FACES.map((face) => (
                  <div
                    key={face.id}
                    onClick={() => setSelectedPhoto(face.url)}
                    className={`p-3 rounded-none border-2 cursor-pointer transition-all flex items-center gap-3 ${
                      selectedPhoto === face.url
                        ? 'border-imperial-gold bg-imperial-gold/15'
                        : 'border-lacquer-border bg-lacquer-surface hover:border-silk-muted/60'
                    }`}
                  >
                    <img
                      src={face.url}
                      alt={face.label}
                      className="w-12 h-12 rounded-none object-cover border border-lacquer-border"
                    />
                    <span className="text-sm text-silk-ivory font-semibold">{face.label}</span>
                  </div>
                ))}
              </div>

              {/* Upload trigger simulation */}
              <div className="border-2 border-dashed border-lacquer-border rounded-none p-5 text-center hover:border-imperial-gold/60 cursor-pointer transition-all bg-lacquer-surface/40">
                <Upload className="w-7 h-7 text-imperial-gold mx-auto mb-2" />
                <span className="text-sm text-silk-ivory font-bold block">Tải ảnh từ máy tính hoặc điện thoại</span>
                <span className="text-xs text-silk-muted mt-1 block">Hỗ trợ định dạng JPG, PNG (tối đa 10MB)</span>
              </div>
            </div>

            {/* Step 2: Parental Consent for Minors */}
            <div className="p-3.5 rounded-none bg-lacquer-surface border border-lacquer-border">
              <label className="flex items-start gap-3 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={isMinorConsent}
                  onChange={(e) => setIsMinorConsent(e.target.checked)}
                  className="mt-1 rounded-none border-lacquer-border text-imperial-gold focus:ring-imperial-gold w-4 h-4"
                />
                <span className="text-silk-muted leading-relaxed font-medium">
                  Đối với học sinh dưới 16 tuổi: Tôi xác nhận đã có sự đồng ý của cha mẹ hoặc người giám hộ hợp pháp khi tải ảnh chân dung lên ứng dụng.
                </span>
              </label>
            </div>

            {/* Submit Action Button */}
            <button
              onClick={handleStartGeneration}
              disabled={!selectedPhoto || isGenerating}
              className={`w-full py-3.5 rounded-none font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                selectedPhoto && !isGenerating
                  ? 'bg-gradient-to-r from-imperial-red to-imperial-red-bright text-silk-ivory border border-imperial-red-bright hover:brightness-110'
                  : 'bg-lacquer-surface text-silk-muted border border-lacquer-border cursor-not-allowed opacity-60'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-none animate-spin" />
                  <span>AI đang xử lý ghép trang phục lên ảnh thật...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-imperial-gold-light" />
                  <span>Tạo ảnh AI Try on ngay</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Step 3: Generated Result View */
          <div className="space-y-4 text-center">
            <div className="relative aspect-[3/4] max-w-[320px] mx-auto rounded-none overflow-hidden border-2 border-imperial-gold shadow-2xl">
              <img
                src={generatedResult}
                alt="AI Try-on result"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-none bg-lacquer/90 backdrop-blur-md border border-imperial-gold text-xs font-bold text-imperial-gold flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Generated Try-on</span>
              </div>
            </div>

            <p className="text-sm text-silk-muted max-w-sm mx-auto leading-relaxed">
              Bức ảnh mô phỏng hoàn tất! Ảnh này chỉ được lưu trữ lâu dài nếu bạn chọn "Lưu vào Lookbook".
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setGeneratedResult(null)}
                className="py-3 px-4 rounded-none bg-lacquer-surface border border-lacquer-border text-sm font-bold text-silk-muted hover:text-silk-ivory uppercase tracking-wider"
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
                className="py-3 px-4 rounded-none bg-imperial-gold text-lacquer font-bold text-sm hover:bg-imperial-gold-light shadow-md uppercase tracking-wider cursor-pointer"
              >
                {isLoggedIn ? 'Lưu vào Lookbook' : 'Đăng nhập để lưu ảnh'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
