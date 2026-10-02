import React, { useState } from 'react';
import { SavedOutfit, Piece } from '../types';
import {
  X,
  BookOpen,
  Sparkles,
  Check,
  Image as ImageIcon,
  CheckSquare,
  Square,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
} from 'lucide-react';

interface CreateLookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfits: SavedOutfit[];
  onCreateLookbook: (data: {
    title: string;
    description: string;
    coverImageUrl: string;
    coverOutfitId: string;
    outfitIds: string[];
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
  const [step, setStep] = useState<1 | 2>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [decorStamp, setDecorStamp] = useState<'blossom' | 'cloud' | 'moon' | 'seal'>('blossom');
  const [selectedOutfitIds, setSelectedOutfitIds] = useState<string[]>(() =>
    outfits.slice(0, 3).map((o) => o.id)
  );
  const [coverOutfitId, setCoverOutfitId] = useState<string>(() =>
    outfits[0]?.id || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Toggle selection of outfit
  const handleToggleSelectOutfit = (id: string) => {
    setSelectedOutfitIds((prev) => {
      const exists = prev.includes(id);
      let updated: string[];
      if (exists) {
        updated = prev.filter((item) => item !== id);
        // If unselected the cover outfit, pick another
        if (coverOutfitId === id && updated.length > 0) {
          setCoverOutfitId(updated[0]);
        }
      } else {
        updated = [...prev, id];
        // If no cover outfit yet, pick this one
        if (!coverOutfitId) {
          setCoverOutfitId(id);
        }
      }
      return updated;
    });
  };

  // Select all or deselect all
  const handleSelectAll = () => {
    if (selectedOutfitIds.length === outfits.length) {
      setSelectedOutfitIds([]);
      setCoverOutfitId('');
    } else {
      setSelectedOutfitIds(outfits.map((o) => o.id));
      if (!coverOutfitId && outfits.length > 0) {
        setCoverOutfitId(outfits[0].id);
      }
    }
  };

  // Helper to extract image URL of an outfit
  const getOutfitPreviewUrl = (o: SavedOutfit) => {
    if (o.tryOnImage) return o.tryOnImage;
    if (o.tryOnImages && o.tryOnImages.length > 0) return o.tryOnImages[0];
    const topPiece = o.top.piece || (o.top.variant as Piece | undefined);
    return topPiece?.thumbnailUrl || topPiece?.assetUrl || '';
  };

  const handleProceedToStep2 = () => {
    if (!title.trim()) {
      setErrorMsg('Vui lòng nhập tên cho bộ sưu tập!');
      return;
    }
    setErrorMsg(null);
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setErrorMsg('Vui lòng nhập tên cho bộ sưu tập!');
      setStep(1);
      return;
    }
    if (selectedOutfitIds.length === 0) {
      setErrorMsg('Vui lòng chọn ít nhất 1 outfit cho bộ sưu tập!');
      return;
    }

    const coverOutfit = outfits.find((o) => o.id === coverOutfitId) || outfits.find((o) => o.id === selectedOutfitIds[0]);
    const coverUrl = coverOutfit ? getOutfitPreviewUrl(coverOutfit) : '';

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await onCreateLookbook({
        title: title.trim(),
        description: description.trim(),
        coverImageUrl: coverUrl,
        coverOutfitId: coverOutfit?.id || selectedOutfitIds[0],
        outfitIds: selectedOutfitIds,
        decorStamp,
      });
      // Reset & close
      setTitle('');
      setDescription('');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi tạo bộ sưu tập. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
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
                Tạo Bộ Sưu Tập Mới
              </h3>
              <p className="text-[11px] text-silk-muted mt-1">
                Gom các bộ outfit theo chủ đề hoặc phong cách riêng của bạn
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

        {/* Stepper Indicator */}
        <div className="px-6 py-2.5 bg-lacquer border-b border-lacquer-border/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 flex items-center justify-center font-bold text-[10px] rounded-none ${
                step === 1
                  ? 'bg-imperial-gold text-lacquer'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
              }`}
            >
              1
            </span>
            <span className={step === 1 ? 'font-bold text-imperial-gold' : 'text-silk-muted'}>
              Thông tin chủ đề
            </span>
          </div>

          <div className="w-8 h-[1px] bg-lacquer-border" />

          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 flex items-center justify-center font-bold text-[10px] rounded-none ${
                step === 2
                  ? 'bg-imperial-gold text-lacquer'
                  : 'bg-lacquer-surface text-silk-muted border border-lacquer-border'
              }`}
            >
              2
            </span>
            <span className={step === 2 ? 'font-bold text-imperial-gold' : 'text-silk-muted'}>
              Chọn outfit ({selectedOutfitIds.length})
            </span>
          </div>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-5">
          {step === 1 ? (
            /* STEP 1: Basic Information */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-imperial-gold mb-1.5">
                  Tên bộ sưu tập <span className="text-imperial-red">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Du Xuân Giáp Thìn, Cổ Phục Công Sở, Dạ Yến Hoàng Cung..."
                  maxLength={60}
                  className="w-full bg-lacquer border border-lacquer-border focus:border-imperial-gold px-3.5 py-2.5 text-sm text-silk-ivory rounded-none focus:outline-none transition-colors"
                  autoFocus
                />
                <p className="text-[10px] text-silk-muted mt-1 text-right">
                  {title.length}/60 ký tự
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-imperial-gold mb-1.5">
                  Lời tựa / Ý niệm (Tùy chọn)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Một đoạn mô tả ngắn hoặc ý thơ gửi gắm vào bộ sưu tập này..."
                  rows={3}
                  maxLength={250}
                  className="w-full bg-lacquer border border-lacquer-border focus:border-imperial-gold px-3.5 py-2 text-sm text-silk-ivory rounded-none focus:outline-none transition-colors resize-none"
                />
                <p className="text-[10px] text-silk-muted mt-1 text-right">
                  {description.length}/250 ký tự
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-imperial-gold mb-2">
                  Dấu ấn trang trí bìa
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    { id: 'blossom', label: 'Hoa Đào' },
                    { id: 'cloud', label: 'Mây Vàng' },
                    { id: 'moon', label: 'Vầng Trăng' },
                    { id: 'seal', label: 'Ấn Triện' },
                  ].map((stamp) => (
                    <button
                      key={stamp.id}
                      type="button"
                      onClick={() => setDecorStamp(stamp.id as any)}
                      className={`p-2.5 border text-center transition-all cursor-pointer ${
                        decorStamp === stamp.id
                          ? 'bg-imperial-gold/20 border-imperial-gold text-imperial-gold font-bold shadow'
                          : 'bg-lacquer border-lacquer-border text-silk-muted hover:text-silk-ivory hover:border-lacquer-border/80'
                      }`}
                    >
                      <span className="text-xs block">{stamp.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* STEP 2: Select Outfits from user's saved list */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-imperial-gold">
                    Chọn các outfit đưa vào bộ sưu tập
                  </h4>
                  <p className="text-[11px] text-silk-muted mt-0.5">
                    Nhấp vào ô chọn để thêm/bớt. Nhấp biểu tượng ảnh để đặt làm ảnh bìa.
                  </p>
                </div>

                {outfits.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs font-medium text-imperial-gold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {selectedOutfitIds.length === outfits.length ? (
                      <>
                        <Square className="w-3.5 h-3.5" />
                        <span>Bỏ chọn tất cả</span>
                      </>
                    ) : (
                      <>
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>Chọn tất cả ({outfits.length})</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {outfits.length === 0 ? (
                <div className="text-center py-10 px-4 border border-dashed border-lacquer-border bg-lacquer/50">
                  <BookOpen className="w-10 h-10 text-silk-muted/40 mx-auto mb-2" />
                  <p className="text-sm text-silk-ivory font-bold mb-1">
                    Bạn chưa lưu outfit nào trong tài khoản
                  </p>
                  <p className="text-xs text-silk-muted mb-4 max-w-xs mx-auto">
                    Hãy quay lại Studio để phối đồ và lưu ít nhất 1 outfit trước khi tạo bộ sưu tập nhé!
                  </p>
                  {onOpenStudio && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenStudio();
                      }}
                      className="px-4 py-2 bg-imperial-gold text-lacquer font-bold text-xs uppercase tracking-wider"
                    >
                      Mở Studio Phối Đồ
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                  {outfits.map((o) => {
                    const isSelected = selectedOutfitIds.includes(o.id);
                    const isCover = coverOutfitId === o.id;
                    const previewUrl = getOutfitPreviewUrl(o);

                    return (
                      <div
                        key={o.id}
                        onClick={() => handleToggleSelectOutfit(o.id)}
                        className={`p-2.5 border transition-all cursor-pointer flex items-center gap-3 relative ${
                          isSelected
                            ? 'bg-lacquer-card border-imperial-gold/80 shadow-md'
                            : 'bg-lacquer/60 border-lacquer-border/80 opacity-60 hover:opacity-90'
                        }`}
                      >
                        {/* Checkbox */}
                        <div
                          className={`w-5 h-5 flex-shrink-0 flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-imperial-gold border-imperial-gold text-lacquer'
                              : 'border-white/30 bg-lacquer'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        {/* Outfit Thumbnail */}
                        <div className="w-12 h-16 rounded-none bg-black/40 border border-lacquer-border flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                          {previewUrl ? (
                            <img
                              src={previewUrl}
                              alt={o.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-silk-muted/40" />
                          )}
                          {isCover && (
                            <div className="absolute inset-x-0 bottom-0 bg-imperial-gold text-lacquer text-[8px] font-extrabold text-center uppercase tracking-tight py-0.5">
                              Ảnh bìa
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs font-bold text-silk-ivory truncate">
                            {o.name}
                          </h5>
                          <p className="text-[10px] text-silk-muted truncate mt-0.5">
                            {o.event.name} • {o.gender === 'women' ? 'Nữ' : 'Nam'}
                          </p>

                          {/* Set as Cover button if selected */}
                          {isSelected && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCoverOutfitId(o.id);
                              }}
                              className={`mt-1.5 text-[10px] font-bold px-2 py-0.5 border cursor-pointer transition-all ${
                                isCover
                                  ? 'bg-imperial-gold/20 text-imperial-gold border-imperial-gold'
                                  : 'bg-lacquer text-silk-muted border-lacquer-border hover:text-silk-ivory hover:border-imperial-gold'
                              }`}
                            >
                              {isCover ? '★ Đang là ảnh bìa' : 'Đặt làm ảnh bìa'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-lacquer-border bg-lacquer/90 flex items-center justify-between">
          {step === 1 ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-lacquer border border-lacquer-border text-silk-muted hover:text-silk-ivory text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleProceedToStep2}
                className="px-5 py-2 bg-imperial-gold hover:bg-imperial-gold-light text-lacquer font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow cursor-pointer"
              >
                <span>Tiếp tục: Chọn Outfit</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-lacquer border border-lacquer-border text-silk-muted hover:text-silk-ivory text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting || selectedOutfitIds.length === 0}
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-gradient-to-r from-imperial-gold to-imperial-gold-light hover:brightness-110 disabled:opacity-50 text-lacquer font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_4px_16px_rgba(216,175,101,0.35)] cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-lacquer border-t-transparent rounded-full animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Tạo Bộ Sưu Tập</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
