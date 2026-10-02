import React, { useState } from 'react';
import { SavedOutfit, Piece } from '../types';
import {
  X,
  BookOpen,
  Sparkles,
  Check,
  Image as ImageIcon,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { HeritageModal } from './heritage/HeritageFrame';

interface CreateLookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfits: SavedOutfit[];
  onCreateLookbook: (data: {
    title: string;
    subtitle: string;
    description: string;
    outfitId: string;
    coverImageUrl: string;
    verticalPoem: string;
    decorStamp: 'blossom' | 'cloud' | 'moon' | 'seal';
  }) => Promise<void>;
  onOpenStudio?: () => void;
}

export const CreateLookbookModal: React.FC<CreateLookbookModalProps> = ({
  isOpen,
  onClose,
  outfits,
  onCreateLookbook,
  onOpenStudio,
}) => {
  // First outfit as default selection if exists
  const initialOutfit = outfits[0];

  const getCleanTitle = (o?: SavedOutfit) => {
    if (!o) return 'Tết Nguyên Đán';
    if (o.conceptTag && !o.conceptTag.includes('👑')) return o.conceptTag;
    if (o.name.includes('•')) {
      const parts = o.name.split('•').map((s) => s.trim()).filter(Boolean);
      return parts[parts.length - 1] || parts[0];
    }
    return o.name || 'Tết Nguyên Đán';
  };

  const [selectedOutfitId, setSelectedOutfitId] = useState<string>(
    initialOutfit?.id || ''
  );
  const [title, setTitle] = useState(getCleanTitle(initialOutfit));
  const [subtitle, setSubtitle] = useState(
    initialOutfit ? `Sắc son ${initialOutfit.top.piece.culturalInfo?.period || 'triều Nguyễn'}` : 'Sắc son triều Nguyễn'
  );
  const [description, setDescription] = useState(
    initialOutfit?.aiAnalysis?.explanation ||
      'Lấy cảm hứng từ nét trang nghiêm, truyền thống và hơi thở hiện đại. Phục sức tôn vinh vẻ đẹp kín đáo, thanh khiết của dân tộc.'
  );
  const [verticalPoem, setVerticalPoem] = useState('Tết đến xuân về vạn sự như ý');
  const [decorStamp, setDecorStamp] = useState<'blossom' | 'cloud' | 'moon' | 'seal'>('seal');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Selected outfit object
  const currentOutfit = outfits.find((o) => o.id === selectedOutfitId) || initialOutfit;

  // Helper to extract image URL of an outfit
  const getOutfitPreviewUrl = (o: SavedOutfit) => {
    if (o.tryOnImage) return o.tryOnImage;
    if (o.tryOnImages && o.tryOnImages.length > 0) return o.tryOnImages[0];
    const topPiece = o.top.piece || (o.top.variant as Piece | undefined);
    return topPiece?.thumbnailUrl || topPiece?.assetUrl || '';
  };

  // When user selects a different outfit
  const handleSelectOutfit = (o: SavedOutfit) => {
    setSelectedOutfitId(o.id);
    setTitle(getCleanTitle(o));
    setSubtitle(`Sắc son ${o.top.piece.culturalInfo?.period || 'triều Nguyễn'}`);
    setDescription(
      o.aiAnalysis?.explanation ||
        o.aiAnalysis?.mascotQuote ||
        `Phục sức tôn vinh vẻ đẹp kín đáo, thanh nhã hòa quyện cùng bối cảnh ${o.event.name}.`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOutfitId) {
      setErrorMsg('Vui lòng chọn 1 outfit để tạo Lookbook!');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Vui lòng nhập tên cho Lookbook!');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Vui lòng nhập mô tả / câu chuyện cho Lookbook!');
      return;
    }

    const coverUrl = currentOutfit ? getOutfitPreviewUrl(currentOutfit) : '';

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await onCreateLookbook({
        title: title.trim(),
        subtitle: subtitle.trim() || 'Sắc son triều Nguyễn',
        description: description.trim(),
        outfitId: selectedOutfitId,
        coverImageUrl: coverUrl,
        verticalPoem: verticalPoem.trim() || 'Tết đến xuân về vạn sự như ý',
        decorStamp,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi tạo Lookbook. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <HeritageModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo Lookbook Mới"
      subtitle="Xuất bản trang Lookbook tạp chí thời trang cổ phong từ 1 bộ outfit"
      badge="Xuất bản"
      maxWidth="max-w-2xl"
    >

      {/* Error notification */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[70vh] space-y-5 pr-1">
          {/* 1. Chọn 1 outfit duy nhất */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-imperial-gold">
                1. Chọn 1 Outfit để tạo Lookbook <span className="text-imperial-red">*</span>
              </label>
              <span className="text-[11px] text-silk-muted">
                {outfits.length} outfit có sẵn
              </span>
            </div>

            {outfits.length === 0 ? (
              <div className="text-center py-6 px-4 border border-dashed border-[#C5A059]/30 bg-[#0D111A]/60 rounded-[8px]">
                <BookOpen className="w-8 h-8 text-[#C5A059]/40 mx-auto mb-2" />
                <p className="text-xs text-[#F7F4EE] font-bold mb-1">
                  Bạn chưa có outfit nào trong tài khoản
                </p>
                <p className="text-[11px] text-[#EDE5D8]/70 mb-3 max-w-xs mx-auto">
                  Hãy mở Studio để phối và lưu 1 bộ đồ trước khi tạo Lookbook nhé!
                </p>
                {onOpenStudio && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenStudio();
                    }}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#AA8232] text-[#0A0D12] font-bold text-xs uppercase tracking-wider rounded-[6px] cursor-pointer hover:brightness-110"
                  >
                    Mở Studio Phối Đồ Ngay
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[170px] overflow-y-auto pr-1">
                {outfits.map((o) => {
                  const isSelected = selectedOutfitId === o.id;
                  const previewUrl = getOutfitPreviewUrl(o);

                  return (
                    <div
                      key={o.id}
                      onClick={() => handleSelectOutfit(o)}
                      className={`p-2 border rounded-[8px] transition-all cursor-pointer flex flex-col justify-between relative ${
                        isSelected
                          ? 'bg-[#C5A059]/15 border-[#D4AF37] shadow-[0_0_12px_rgba(216,175,101,0.25)]'
                          : 'bg-[#0D111A]/80 border-[#C5A059]/25 hover:border-[#C5A059]/60'
                      }`}
                    >
                      <div className="relative aspect-[3/4] w-full bg-black/40 rounded-[4px] overflow-hidden flex items-center justify-center mb-1.5">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt={o.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-[#EDE5D8]/30" />
                        )}
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#D4AF37] text-[#0A0D12] flex items-center justify-center shadow">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h5 className="text-[11px] font-bold text-[#F7F4EE] truncate">
                          {o.name}
                        </h5>
                        <p className="text-[9px] text-[#EDE5D8]/60 truncate">
                          {o.event.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Nhập tên Lookbook & Tiêu đề phụ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#C5A059]/20">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#C5A059] mb-1.5">
                Tên Lookbook <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Tết Nguyên Đán, Dạ Hội Cố Đô..."
                maxLength={45}
                className="w-full bg-[#0D111A] border border-[#C5A059]/40 focus:border-[#D4AF37] px-3 py-2 text-xs text-[#EDE5D8] rounded-[6px] focus:outline-none transition-colors"
                required
              />
              <p className="text-[10px] text-[#EDE5D8]/60 mt-1">
                Hiển thị dưới dạng thư pháp hoàng kim lớn
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#C5A059] mb-1.5">
                Đề tài / Tiêu đề phụ
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Ví dụ: Sắc son triều Nguyễn..."
                maxLength={45}
                className="w-full bg-[#0D111A] border border-[#C5A059]/40 focus:border-[#D4AF37] px-3 py-2 text-xs text-[#EDE5D8] rounded-[6px] focus:outline-none transition-colors"
              />
              <p className="text-[10px] text-[#EDE5D8]/60 mt-1">
                Hiển thị dưới tiêu đề chính cùng họa tiết mây
              </p>
            </div>
          </div>

          {/* 3. Mô tả Lookbook (Câu chuyện của Look) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#C5A059]">
                Câu chuyện của Look (Mô tả) <span className="text-rose-400">*</span>
              </label>
              <span className="text-[10px] text-[#EDE5D8]/60">{description.length}/350</span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Lấy cảm hứng từ nét trang nghiêm, truyền thống và hơi thở hiện đại. Sắc đỏ tượng trưng cho may mắn, phú quý..."
              rows={3}
              maxLength={350}
              className="w-full bg-[#0D111A] border border-[#C5A059]/40 focus:border-[#D4AF37] px-3 py-2 text-xs text-[#EDE5D8] leading-relaxed rounded-[6px] focus:outline-none transition-colors resize-none font-sans"
              required
            />
          </div>

          {/* 4. Câu đối / Thơ thư pháp dọc & Dấu ấn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#C5A059]/20">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#C5A059] mb-1.5">
                Chữ thư pháp dọc (Góc phải)
              </label>
              <input
                type="text"
                value={verticalPoem}
                onChange={(e) => setVerticalPoem(e.target.value)}
                placeholder="Tết đến xuân về vạn sự như ý"
                maxLength={30}
                className="w-full bg-[#0D111A] border border-[#C5A059]/40 focus:border-[#D4AF37] px-3 py-2 text-xs text-[#EDE5D8] rounded-[6px] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#C5A059] mb-1.5">
                Ấn triện / Dấu ấn
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'seal', label: 'Ấn Triện' },
                  { id: 'blossom', label: 'Hoa Đào' },
                  { id: 'cloud', label: 'Mây Vàng' },
                  { id: 'moon', label: 'Vầng Trăng' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setDecorStamp(s.id as any)}
                    className={`py-1.5 px-1 text-center border rounded-[4px] text-[10px] cursor-pointer transition-all ${
                      decorStamp === s.id
                        ? 'bg-[#C5A059]/20 border-[#D4AF37] text-[#D4AF37] font-bold shadow'
                        : 'bg-[#121622] border-[#C5A059]/25 text-[#EDE5D8]/70 hover:text-[#EDE5D8]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-[#C5A059]/20 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#161B26] hover:bg-[#1E2433] border border-[#C5A059]/40 text-[#EDE5D8] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer rounded-[6px]"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !selectedOutfitId || !title.trim()}
              className="px-5 py-2 bg-gradient-to-r from-[#D4AF37] to-[#AA8232] hover:brightness-110 disabled:opacity-50 text-[#0A0D12] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_4px_16px_rgba(216,175,101,0.25)] cursor-pointer rounded-[6px]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#0A0D12] border-t-transparent rounded-full animate-spin" />
                  <span>Đang xuất bản...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>TẠO LOOKBOOK</span>
                </>
              )}
            </button>
          </div>
        </form>
    </HeritageModal>
  );
};
