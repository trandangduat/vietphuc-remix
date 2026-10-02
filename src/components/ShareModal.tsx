import React, { useState } from 'react';
import { Copy, Check, Link as LinkIcon, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SavedOutfit } from '../types';
import { HeritageModal, HeritageFrame } from './heritage/HeritageFrame';

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
    <>
      <HeritageModal
        isOpen={isOpen}
        onClose={onClose}
        title="Cài Đặt Chia Sẻ Lookbook"
        subtitle="Quản lý liên kết công khai và quyền riêng tư hình ảnh"
        icon={<LinkIcon className="w-4 h-4 flex-shrink-0 text-[#C5A059]" />}
        badge="CHIA SẺ"
        maxWidth="max-w-lg"
      >
        <div className="space-y-4 font-sans text-xs">
          {/* Public Toggle (Rounded modern vintage switch) */}
          <div className="p-3.5 rounded-[8px] bg-[#0D111A] border border-[#C5A059]/30 flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-[#F7F4EE] block uppercase tracking-wider">
                Cho phép truy cập công khai
              </span>
              <span className="text-[11px] text-[#EDE5D8]/70 mt-0.5 block">
                Bất kỳ ai có liên kết đều có thể xem Lookbook này
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border cursor-pointer ${
                isPublic ? 'bg-[#C5A059] border-[#D4AF37]' : 'bg-[#161B26] border-[#C5A059]/40'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#0A0D12] shadow-md transition-transform ${
                  isPublic ? 'translate-x-6 bg-[#07090D]' : 'translate-x-0 bg-[#EDE5D8]/60'
                }`}
              />
            </button>
          </div>

          {isPublic ? (
            <div className="space-y-3.5">
              {/* Link Box */}
              <div className="p-2.5 rounded-[6px] bg-[#0D1017] border border-[#C5A059]/50 flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={publicUrl}
                  className="bg-transparent text-xs text-[#EDE5D8] flex-1 focus:outline-none select-all font-mono"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-[4px] bg-gradient-to-r from-[#D4AF37] to-[#AA8232] text-[#0A0D12] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex-shrink-0 cursor-pointer shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>

              {/* Privacy Granularity Checklist */}
              <div className="border border-[#C5A059]/30 rounded-[8px] p-3.5 bg-[#0D111A]">
                <div className="flex items-center gap-2 text-[11px] font-bold text-[#C5A059] mb-2.5 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Nội dung được phép xuất hiện trên liên kết:</span>
                </div>

                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {outfits.map((outfit) => (
                    <div
                      key={outfit.id}
                      className="p-2.5 rounded-[6px] bg-[#121622] border border-[#C5A059]/25 text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-medium text-[#F7F4EE] block">{outfit.name}</span>
                        <span className="text-[11px] text-[#EDE5D8]/60">2D Mockup ma-nơ-canh (Được phép)</span>
                      </div>

                      {outfit.tryOnImage && (
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-[#EDE5D8]/80 font-normal">
                            <input
                              type="checkbox"
                              checked={!!includeTryOnPhotos[outfit.id]}
                              onChange={() => handleToggleFacePhoto(outfit.id)}
                              className="rounded-[3px] border-[#C5A059]/40 text-[#C5A059] focus:ring-[#C5A059] w-3.5 h-3.5 cursor-pointer"
                            />
                            <span className={includeTryOnPhotos[outfit.id] ? 'text-amber-400 font-medium' : 'text-[#EDE5D8]/70'}>
                              Ảnh mặt thật
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Revoke Button */}
              <div className="pt-1 flex justify-between items-center text-xs">
                <span className="text-[#EDE5D8]/60">Muốn hủy chia sẻ?</span>
                <button
                  type="button"
                  onClick={handleRevoke}
                  className="py-1.5 px-3 rounded-[6px] bg-rose-950/60 hover:bg-rose-900/70 text-rose-300 border border-rose-500/40 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Hủy liên kết này (Revoke)
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-[8px] bg-[#0D111A] border border-[#C5A059]/30 text-center text-xs text-[#EDE5D8]/70 leading-relaxed">
              <p>
                Lookbook hiện đang ở chế độ <strong className="text-[#F7F4EE]">Riêng tư</strong>. Bật công tắc bên trên để tạo liên kết chia sẻ với bạn bè.
              </p>
            </div>
          )}
        </div>
      </HeritageModal>

      {/* Warning Modal when checking Face photo */}
      {showFaceWarning && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <HeritageFrame
            title="Cảnh Báo Quyền Riêng Tư"
            icon={<AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />}
            onClose={() => setShowFaceWarning(null)}
            showCloseButton={true}
            className="w-full max-w-sm"
          >
            <div className="space-y-3 font-sans text-xs text-center py-1">
              <p className="text-[#EDE5D8]/85 leading-relaxed">
                Bức ảnh này chứa chân dung/khuôn mặt người thật. Bạn có chắc chắn muốn cho phép bất kỳ ai có liên kết đều xem được bức ảnh này trên Internet không?
              </p>
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFaceWarning(null)}
                  className="py-2 px-3 rounded-[6px] bg-[#161B26] hover:bg-[#1E2433] border border-[#C5A059]/40 text-xs font-bold text-[#EDE5D8] uppercase tracking-wider cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={() => confirmIncludeFace(showFaceWarning)}
                  className="py-2 px-3 rounded-[6px] bg-gradient-to-r from-[#D4AF37] to-[#AA8232] text-[#0A0D12] font-bold text-xs hover:brightness-110 uppercase tracking-wider cursor-pointer shadow-sm"
                >
                  Tôi đồng ý
                </button>
              </div>
            </div>
          </HeritageFrame>
        </div>
      )}
    </>
  );
};
