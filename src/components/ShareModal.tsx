import React, { useState } from 'react';
import { X, Copy, Check, ShieldAlert, Link as LinkIcon, AlertTriangle, ShieldCheck } from 'lucide-react';
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
  const [selectedOutfitIds, setSelectedOutfitIds] = useState<string[]>(outfits.map((o) => o.id));
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
      // Trying to enable: show privacy alert first
      setShowFaceWarning(outfitId);
    } else {
      // Disable directly
      setIncludeTryOnPhotos((prev) => ({ ...prev, [outfitId]: false }));
    }
  };

  const confirmIncludeFace = (outfitId: string) => {
    setIncludeTryOnPhotos((prev) => ({ ...prev, [outfitId]: true }));
    setShowFaceWarning(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lacquer/85 backdrop-blur-md">
      <div className="max-w-lg w-full bg-lacquer-card border border-imperial-gold/40 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-silk-muted hover:text-silk-ivory hover:bg-lacquer-surface transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-imperial-gold/15 text-imperial-gold border border-imperial-gold/30">
            <LinkIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-silk-ivory">
              Cài đặt Chia sẻ Lookbook
            </h3>
            <p className="text-xs text-silk-muted">
              Quản lý liên kết công khai và kiểm soát nghiêm ngặt quyền riêng tư hình ảnh
            </p>
          </div>
        </div>

        {/* Public Toggle */}
        <div className="my-4 p-4 rounded-xl bg-lacquer-surface border border-lacquer-border flex items-center justify-between">
          <div>
            <span className="font-semibold text-xs text-silk-ivory block">Cho phép truy cập công khai</span>
            <span className="text-[11px] text-silk-muted">Bất kỳ ai có liên kết đều có thể xem Lookbook này</span>
          </div>
          <button
            onClick={() => setIsPublic(!isPublic)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              isPublic ? 'bg-imperial-gold' : 'bg-lacquer-border'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-lacquer shadow-md transition-transform ${
                isPublic ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {isPublic ? (
          <div className="space-y-4">
            {/* Link Box */}
            <div className="p-3 rounded-xl bg-lacquer/90 border border-imperial-gold/30 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="bg-transparent text-xs text-silk-ivory flex-1 focus:outline-none select-all"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-imperial-gold text-lacquer font-bold text-xs hover:bg-imperial-gold-light transition-all flex-shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>

            {/* Privacy Granularity Checklist */}
            <div className="border border-lacquer-border rounded-xl p-4 bg-lacquer-surface/60">
              <div className="flex items-center gap-2 text-xs font-semibold text-silk-ivory mb-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Chọn nội dung được phép xuất hiện trên liên kết:</span>
              </div>

              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {outfits.map((outfit) => (
                  <div key={outfit.id} className="p-2.5 rounded-lg bg-lacquer-card border border-lacquer-border text-xs flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-silk-ivory block">{outfit.name}</span>
                      <span className="text-[10px] text-silk-muted">2D Mockup ma-nơ-canh (Được phép)</span>
                    </div>

                    {outfit.tryOnImage && (
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-silk-muted">
                          <input
                            type="checkbox"
                            checked={!!includeTryOnPhotos[outfit.id]}
                            onChange={() => handleToggleFacePhoto(outfit.id)}
                            className="rounded border-lacquer-border text-imperial-red focus:ring-imperial-red"
                          />
                          <span className={includeTryOnPhotos[outfit.id] ? 'text-amber-400 font-medium' : 'text-silk-muted'}>
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
            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-silk-muted">Muốn hủy chia sẻ?</span>
              <button
                onClick={handleRevoke}
                className="py-1.5 px-3 rounded-lg bg-imperial-red/15 text-imperial-red-bright hover:bg-imperial-red/25 border border-imperial-red/30 font-semibold transition-all"
              >
                Hủy liên kết này (Revoke)
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-lacquer-surface text-center text-xs text-silk-muted">
            <p>Lookbook hiện đang ở chế độ <strong>Riêng tư</strong>. Bật công tắc bên trên để tạo liên kết chia sẻ với bạn bè.</p>
          </div>
        )}

        {/* Warning Modal when checking Face photo */}
        {showFaceWarning && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-lacquer/90 backdrop-blur-sm">
            <div className="max-w-sm w-full bg-lacquer-card border border-amber-500/50 rounded-2xl p-5 shadow-2xl text-center">
              <div className="w-10 h-10 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-sm text-silk-ivory mb-2">
                Cảnh báo quyền riêng tư hình ảnh
              </h4>
              <p className="text-xs text-silk-muted leading-relaxed mb-4">
                Bức ảnh này chứa chân dung/khuôn mặt người thật. Bạn có chắc chắn muốn cho phép bất kỳ ai có liên kết đều xem được bức ảnh này trên Internet không?
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowFaceWarning(null)}
                  className="py-2 px-3 rounded-xl bg-lacquer-surface border border-lacquer-border text-xs font-semibold text-silk-muted hover:text-silk-ivory"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={() => confirmIncludeFace(showFaceWarning)}
                  className="py-2 px-3 rounded-xl bg-amber-500 text-lacquer font-bold text-xs hover:bg-amber-400"
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
