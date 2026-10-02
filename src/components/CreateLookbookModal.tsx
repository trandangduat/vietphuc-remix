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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none font-sans"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-lacquer-surface border-2 border-imperial-gold shadow-[0_24px_64px_rgba(0,0,0,0.95)] rounded-none flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-imperial-gold/30 bg-lacquer/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-none bg-imperial-gold/20 border border-imperial-gold flex items-center justify-center text-imperial-gold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-silk-ivory leading-none">
                Tạo Lookbook Mới
              </h3>
              <p className="text-[11px] text-silk-muted mt-1">
                Xuất bản trang Lookbook tạp chí thời trang cổ phong từ 1 bộ outfit của bạn
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-none bg-lacquer border border-white/20 hover:border-imperial-gold text-silk-muted hover:text-silk-ivory flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh] space-y-5">
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
              <div className="text-center py-8 px-4 border border-dashed border-lacquer-border bg-lacquer/50">
                <BookOpen className="w-10 h-10 text-silk-muted/40 mx-auto mb-2" />
                <p className="text-sm text-silk-ivory font-bold mb-1">
                  Bạn chưa có outfit nào trong tài khoản
                </p>
                <p className="text-xs text-silk-muted mb-4 max-w-xs mx-auto">
                  Hãy mở Studio để phối và lưu 1 bộ đồ trước khi tạo Lookbook nhé!
                </p>
                {onOpenStudio && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenStudio();
                    }}
                    className="px-4 py-2 bg-imperial-gold text-lacquer font-bold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Mở Studio Phối Đồ Ngay
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[180px] overflow-y-auto pr-1">
                {outfits.map((o) => {
                  const isSelected = selectedOutfitId === o.id;
                  const previewUrl = getOutfitPreviewUrl(o);

                  return (
                    <div
                      key={o.id}
                      onClick={() => handleSelectOutfit(o)}
                      className={`p-2 border transition-all cursor-pointer flex flex-col justify-between relative ${
                        isSelected
                          ? 'bg-lacquer-card border-imperial-gold shadow-[0_0_12px_rgba(216,175,101,0.35)]'
                          : 'bg-lacquer/60 border-lacquer-border/80 opacity-60 hover:opacity-100 hover:border-imperial-gold/50'
                      }`}
                    >
                      <div className="relative aspect-[3/4] w-full bg-black/40 overflow-hidden flex items-center justify-center mb-1.5">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt={o.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-silk-muted/40" />
                        )}
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-imperial-gold text-lacquer flex items-center justify-center shadow">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h5 className="text-[11px] font-bold text-silk-ivory truncate">
                          {o.name}
                        </h5>
                        <p className="text-[9px] text-silk-muted truncate">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-lacquer-border/60">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-imperial-gold mb-1.5">
                Tên Lookbook <span className="text-imperial-red">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Tết Nguyên Đán, Dạ Hội Cố Đô..."
                maxLength={45}
                className="w-full bg-lacquer border border-lacquer-border focus:border-imperial-gold px-3.5 py-2 text-sm font-serif text-silk-ivory rounded-none focus:outline-none transition-colors"
                required
              />
              <p className="text-[10px] text-silk-muted mt-1">
                Hiển thị dưới dạng thư pháp hoàng kim lớn
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-imperial-gold mb-1.5">
                Đề tài / Tiêu đề phụ
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Ví dụ: Sắc son triều Nguyễn..."
                maxLength={45}
                className="w-full bg-lacquer border border-lacquer-border focus:border-imperial-gold px-3.5 py-2 text-sm text-silk-ivory rounded-none focus:outline-none transition-colors"
              />
              <p className="text-[10px] text-silk-muted mt-1">
                Hiển thị dưới tiêu đề chính cùng họa tiết mây
              </p>
            </div>
          </div>

          {/* 3. Mô tả Lookbook (Câu chuyện của Look) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-imperial-gold">
                Câu chuyện của Look (Mô tả) <span className="text-imperial-red">*</span>
              </label>
              <span className="text-[10px] text-silk-muted">{description.length}/350</span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Lấy cảm hứng từ nét trang nghiêm, truyền thống và hơi thở hiện đại. Sắc đỏ tượng trưng cho may mắn, phú quý..."
              rows={3}
              maxLength={350}
              className="w-full bg-lacquer border border-lacquer-border focus:border-imperial-gold px-3.5 py-2 text-xs sm:text-sm text-silk-ivory leading-relaxed rounded-none focus:outline-none transition-colors resize-none font-sans"
              required
            />
          </div>

          {/* 4. Câu đối / Thơ thư pháp dọc & Dấu ấn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-lacquer-border/60">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-imperial-gold mb-1.5">
                Chữ thư pháp dọc (Góc phải)
              </label>
              <input
                type="text"
                value={verticalPoem}
                onChange={(e) => setVerticalPoem(e.target.value)}
                placeholder="Tết đến xuân về vạn sự như ý"
                maxLength={30}
                className="w-full bg-lacquer border border-lacquer-border focus:border-imperial-gold px-3.5 py-2 text-sm font-calligraphy text-silk-ivory rounded-none focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-imperial-gold mb-1.5">
                Ấn triện / Dấu ấn
              </label>
              <div className="grid grid-cols-4 gap-2">
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
                    className={`py-2 px-1 text-center border text-[11px] cursor-pointer transition-all ${
                      decorStamp === s.id
                        ? 'bg-imperial-gold/20 border-imperial-gold text-imperial-gold font-bold shadow'
                        : 'bg-lacquer border-lacquer-border text-silk-muted hover:text-silk-ivory'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-lacquer-border flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-lacquer border border-lacquer-border text-silk-muted hover:text-silk-ivory text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !selectedOutfitId || !title.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-imperial-gold to-imperial-gold-light hover:brightness-110 disabled:opacity-50 text-lacquer font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_4px_16px_rgba(216,175,101,0.35)] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-lacquer border-t-transparent rounded-full animate-spin" />
                  <span>Đang xuất bản...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>TẠO LOOKBOOK</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
