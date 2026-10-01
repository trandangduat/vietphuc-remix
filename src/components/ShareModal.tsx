import React, { useState } from 'react';
import { X, Copy, Check, Link as LinkIcon, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SavedOutfit } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfits: SavedOutfit[];
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, outfits }) => {
  const [isPublic, setIsPublic] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareId, setShareId] = useState('lb_8f29d1');
  const [includeTryOnPhotos, setIncludeTryOnPhotos] = useState<Record<string, boolean>>({});
  const [showFaceWarning, setShowFaceWarning] = useState<string | null>(null);

  if (!isOpen) return null;

  const publicUrl = `https://vietphuc-remix.vn/lookbook/share/${shareId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevoke = () => {
    setIsPublic(false);
    setShareId(`lb_${Math.random().toString(36).substring(2, 8)}`);
  };

  const handleToggleFacePhoto = (outfitId: string) => {
    if (!includeTryOnPhotos[outfitId]) {
      setShowFaceWarning(outfitId);
    } else {
      setIncludeTryOnPhotos((prev) => ({ ...prev, [outfitId]: false }));
    }
  };

  const confirmIncludeFace = (outfitId: string) => {
    setIncludeTryOnPhotos((prev) => ({ ...prev, [outfitId]: true }));
    setShowFaceWarning(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lacquer/90 backdrop-blur-md font-sans">
      <div className="max-w-lg w-full bg-lacquer-card border-2 border-imperial-gold rounded-none p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-none text-silk-muted hover:text-silk-ivory hover:bg-lacquer-surface transition-all border border-lacquer-border"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-none bg-imperial-gold/20 text-imperial-gold border border-imperial-gold/40">
            <LinkIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-silk-ivory">
              Cài đặt Chia sẻ Lookbook
            </h3>
            <p className="text-xs sm:text-sm text-silk-muted mt-0.5">
              Quản lý liên kết công khai và kiểm soát nghiêm ngặt quyền riêng tư hình ảnh
            </p>
          </div>
        </div>

        {/* Public Toggle (Square vintage switch) */}
        <div className="my-5 p-4 rounded-none bg-lacquer-surface border-2 border-lacquer-border flex items-center justify-between">
          <div>
            <span className="font-bold text-sm text-silk-ivory block uppercase tracking-wider">Cho phép truy cập công khai</span>
            <span className="text-xs text-silk-muted mt-0.5 block">Bất kỳ ai có liên kết đều có thể xem Lookbook này</span>
          </div>
          <button
            onClick={() => setIsPublic(!isPublic)}
            className={`w-14 h-7 rounded-none transition-colors relative p-0.5 border ${
              isPublic ? 'bg-imperial-gold border-imperial-gold-light' : 'bg-lacquer border-lacquer-border'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-none bg-lacquer shadow transition-transform ${
                isPublic ? 'translate-x-7 bg-lacquer-surface border border-lacquer' : 'translate-x-0 bg-silk-muted'
              }`}
            />
          </button>
        </div>

        {isPublic ? (
          <div className="space-y-4">
            {/* Link Box */}
            <div className="p-3.5 rounded-none bg-lacquer border-2 border-imperial-gold/60 flex items-center gap-3">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="bg-transparent text-sm text-silk-ivory flex-1 focus:outline-none select-all font-mono"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 py-2 px-4 rounded-none bg-imperial-gold text-lacquer font-bold text-xs uppercase tracking-wider hover:bg-imperial-gold-light transition-all flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>

            {/* Privacy Granularity Checklist */}
            <div className="border-2 border-lacquer-border rounded-none p-4 bg-lacquer-surface/80">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-silk-ivory mb-3 uppercase tracking-wider">
                <ShieldCheck className="w-5 h-5 text-teal-400" />
                <span>Nội dung được phép xuất hiện trên liên kết:</span>
              </div>

              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {outfits.map((outfit) => (
                  <div key={outfit.id} className="p-3 rounded-none bg-lacquer-card border border-lacquer-border text-sm flex items-center justify-between">
                    <div>
                      <span className="font-bold text-silk-ivory block">{outfit.name}</span>
                      <span className="text-xs text-silk-muted">2D Mockup ma-nơ-canh (Được phép)</span>
                    </div>

                    {outfit.tryOnImage && (
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-silk-muted font-medium">
                          <input
                            type="checkbox"
                            checked={!!includeTryOnPhotos[outfit.id]}
                            onChange={() => handleToggleFacePhoto(outfit.id)}
                            className="rounded-none border-lacquer-border text-imperial-red focus:ring-imperial-red w-4 h-4"
                          />
                          <span className={includeTryOnPhotos[outfit.id] ? 'text-amber-400 font-bold' : 'text-silk-muted'}>
                            Chia sẻ ảnh mặt thật
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Revoke Button */}
            <div className="pt-2 flex justify-between items-center text-xs sm:text-sm">
              <span className="text-silk-muted font-medium">Muốn hủy chia sẻ?</span>
              <button
                onClick={handleRevoke}
                className="py-2 px-3.5 rounded-none bg-imperial-red/20 text-imperial-red-bright hover:bg-imperial-red/30 border border-imperial-red/40 font-bold uppercase tracking-wider transition-all"
              >
                Hủy liên kết này (Revoke)
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-none bg-lacquer-surface border-2 border-lacquer-border text-center text-sm text-silk-muted leading-relaxed">
            <p>Lookbook hiện đang ở chế độ <strong className="text-silk-ivory">Riêng tư</strong>. Bật công tắc bên trên để tạo liên kết chia sẻ với bạn bè.</p>
          </div>
        )}

        {/* Warning Modal when checking Face photo */}
        {showFaceWarning && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-lacquer/90 backdrop-blur-sm">
            <div className="max-w-sm w-full bg-lacquer-card border-2 border-amber-500 rounded-none p-6 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-none bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 border border-amber-500/40">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="font-sans font-bold text-base text-silk-ivory mb-2 uppercase tracking-wider">
                Cảnh báo quyền riêng tư hình ảnh
              </h4>
              <p className="text-xs sm:text-sm text-silk-muted leading-relaxed mb-5">
                Bức ảnh này chứa chân dung/khuôn mặt người thật. Bạn có chắc chắn muốn cho phép bất kỳ ai có liên kết đều xem được bức ảnh này trên Internet không?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowFaceWarning(null)}
                  className="py-2.5 px-4 rounded-none bg-lacquer-surface border border-lacquer-border text-xs sm:text-sm font-bold text-silk-muted hover:text-silk-ivory uppercase tracking-wider"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={() => confirmIncludeFace(showFaceWarning)}
                  className="py-2.5 px-4 rounded-none bg-amber-500 text-lacquer font-bold text-xs sm:text-sm hover:bg-amber-400 uppercase tracking-wider"
                >
                  Tôi đồng ý
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
