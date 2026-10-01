import React, { useState } from 'react';
import { X, Sparkles, Shield, Upload, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { ActiveOutfitState } from '../types';

interface AITryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfit: ActiveOutfitState;
  onSaveToLookbook: (tryOnResultUrl: string) => void;
}

export const AITryOnModal: React.FC<AITryOnModalProps> = ({
  isOpen,
  onClose,
  outfit,
  onSaveToLookbook,
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
      // In this demo, composite result or high quality sample
      setGeneratedResult('/assets/test-composite-preview.png');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lacquer/85 backdrop-blur-md">
      <div className="max-w-xl w-full bg-lacquer-card border border-imperial-gold/40 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-silk-muted hover:text-silk-ivory hover:bg-lacquer-surface transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-imperial-red/20 text-imperial-red-bright border border-imperial-red/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-silk-ivory">
              Thử trang phục trên người thật (AI Try on)
            </h3>
            <p className="text-xs text-silk-muted">
              Kết hợp chân dung của bạn + Outfit hiện tại + Nền {outfit.event.name}
            </p>
          </div>
        </div>

        {/* Privacy Notice Banner */}
        <div className="my-4 p-3 rounded-xl bg-lacquer-surface border border-lacquer-border flex items-start gap-2.5 text-xs text-silk-muted">
          <Shield className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-silk-ivory">Cam kết bảo mật tuyệt đối: </span>
            Ảnh gốc của bạn chỉ được xử lý tạm thời để tạo kết quả và bị xóa ngay lập tức. Không sử dụng hình ảnh của bạn để huấn luyện mô hình AI.
          </div>
        </div>

        {!generatedResult ? (
          <div className="space-y-4">
            {/* Step 1: Choose / Upload Photo */}
            <div>
              <label className="block text-xs font-semibold text-silk-ivory mb-2">
                1. Chọn ảnh chân dung của bạn hoặc ảnh mẫu:
              </label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {SAMPLE_FACES.map((face) => (
                  <div
                    key={face.id}
                    onClick={() => setSelectedPhoto(face.url)}
                    className={`p-2 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      selectedPhoto === face.url
                        ? 'border-imperial-gold bg-imperial-gold/10'
                        : 'border-lacquer-border bg-lacquer-surface hover:border-lacquer-border/80'
                    }`}
                  >
                    <img
                      src={face.url}
                      alt={face.label}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <span className="text-xs text-silk-ivory font-medium">{face.label}</span>
                  </div>
                ))}
              </div>

              {/* Upload trigger simulation */}
              <div className="border border-dashed border-lacquer-border rounded-xl p-4 text-center hover:border-imperial-gold/50 cursor-pointer transition-all bg-lacquer-surface/40">
                <Upload className="w-6 h-6 text-silk-muted mx-auto mb-1.5" />
                <span className="text-xs text-silk-ivory font-medium block">Tải ảnh từ máy tính hoặc điện thoại</span>
                <span className="text-[10px] text-silk-muted">Hỗ trợ JPG, PNG (tối đa 10MB)</span>
              </div>
            </div>

            {/* Step 2: Parental Consent for Minors */}
            <div className="p-3 rounded-xl bg-lacquer-surface/80 border border-lacquer-border">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={isMinorConsent}
                  onChange={(e) => setIsMinorConsent(e.target.checked)}
                  className="mt-0.5 rounded border-lacquer-border text-imperial-gold focus:ring-imperial-gold"
                />
                <span className="text-silk-muted leading-relaxed">
                  Đối với học sinh dưới 16 tuổi: Tôi xác nhận đã có sự đồng ý của cha mẹ hoặc người giám hộ hợp pháp khi tải ảnh chân dung lên ứng dụng.
                </span>
              </label>
            </div>

            {/* Submit Action Button */}
            <button
              onClick={handleStartGeneration}
              disabled={!selectedPhoto || isGenerating}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                selectedPhoto && !isGenerating
                  ? 'bg-gradient-to-r from-imperial-red to-imperial-red-bright text-white shadow-lg hover:brightness-110'
                  : 'bg-lacquer-surface text-silk-muted border border-lacquer-border cursor-not-allowed opacity-60'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>AI đang dệt trang phục lên ảnh thật...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-imperial-gold-light" />
                  <span>Tạo ảnh AI Try on ngay</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Step 3: Generated Result View */
          <div className="space-y-4 text-center">
            <div className="relative aspect-[3/4] max-w-[320px] mx-auto rounded-xl overflow-hidden border border-imperial-gold/50 shadow-2xl">
              <img
                src={generatedResult}
                alt="AI Try-on result"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-lacquer/80 backdrop-blur-md border border-imperial-gold/40 text-[11px] font-semibold text-imperial-gold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>AI Generated Try-on</span>
              </div>
            </div>

            <p className="text-xs text-silk-muted max-w-sm mx-auto">
              Bức ảnh mô phỏng hoàn tất! Ảnh này chỉ được lưu trữ lâu dài nếu bạn chọn "Lưu vào Lookbook".
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setGeneratedResult(null)}
                className="py-2.5 px-4 rounded-xl bg-lacquer-surface border border-lacquer-border text-xs font-semibold text-silk-muted hover:text-silk-ivory"
              >
                Thử lại ảnh khác
              </button>
              <button
                onClick={() => {
                  onSaveToLookbook(generatedResult);
                  onClose();
                }}
                className="py-2.5 px-4 rounded-xl bg-imperial-gold text-lacquer font-bold text-xs hover:bg-imperial-gold-light shadow-md"
              >
                Lưu vào Lookbook
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
