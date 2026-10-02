import React, { useState } from 'react';
import { Lookbook, SavedOutfit, Piece } from '../types';
import {
  X,
  BookOpen,
  Sparkles,
  Download,
  ExternalLink,
  Trash2,
  Layers,
  ChevronLeft,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { getPieceAlignment, getAlignmentStyle } from '../data/pieceAlignments';

interface LookbookDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lookbook: Lookbook;
  allOutfits: SavedOutfit[];
  onLoadOutfitIntoStudio: (outfit: SavedOutfit) => void;
  onDeleteLookbook: (id: string) => void;
  showToast: (msg: string) => void;
}

export const LookbookDetailModal: React.FC<LookbookDetailModalProps> = ({
  isOpen,
  onClose,
  lookbook,
  allOutfits,
  onLoadOutfitIntoStudio,
  onDeleteLookbook,
  showToast,
}) => {
  const [activeOutfitIndex, setActiveOutfitIndex] = useState(0);
  const [isExportingPoster, setIsExportingPoster] = useState(false);

  if (!isOpen) return null;

  // Filter outfits belonging to this lookbook
  const lookbookOutfits = allOutfits.filter((o) =>
    lookbook.outfitIds.includes(o.id)
  );

  const currentOutfit: SavedOutfit | undefined = lookbookOutfits[activeOutfitIndex] || lookbookOutfits[0];

  // Helper to extract preview image
  const getOutfitPreviewUrl = (o: SavedOutfit) => {
    if (o.tryOnImage) return o.tryOnImage;
    if (o.tryOnImages && o.tryOnImages.length > 0) return o.tryOnImages[0];
    const topPiece = o.top.piece || (o.top.variant as Piece | undefined);
    return topPiece?.thumbnailUrl || topPiece?.assetUrl || '';
  };

  // Export full Lookbook as an Editorial Poster using Canvas
  const handleExportPoster = async () => {
    if (lookbookOutfits.length === 0) return;
    setIsExportingPoster(true);

    try {
      const canvas = document.createElement('canvas');
      const width = 1080;
      const cardHeight = 480;
      const headerHeight = 360;
      const footerHeight = 160;
      const height = headerHeight + lookbookOutfits.length * cardHeight + footerHeight;

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Cannot get canvas context');

      // 1. Background
      ctx.fillStyle = '#0A0D12';
      ctx.fillRect(0, 0, width, height);

      // Gold border
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 6;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      // Inner thin gold border
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(32, 32, width - 64, height - 64);

      // 2. Header
      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 24px serif';
      ctx.textAlign = 'center';
      ctx.fillText('VIỆT PHỤC REMIX • BỘ SƯU TẬP', width / 2, 100);

      ctx.fillStyle = '#F7F4EE';
      ctx.font = '900 52px serif';
      ctx.fillText(lookbook.title, width / 2, 180);

      if (lookbook.description) {
        ctx.fillStyle = 'rgba(247, 244, 238, 0.7)';
        ctx.font = 'italic 24px sans-serif';
        ctx.fillText(`"${lookbook.description}"`, width / 2, 235);
      }

      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`Tuyển tập ${lookbookOutfits.length} bộ trang phục cổ phong`, width / 2, 290);

      // Divider line
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(120, 320);
      ctx.lineTo(width - 120, 320);
      ctx.stroke();

      // 3. Render Each Outfit Card in Poster
      for (let i = 0; i < lookbookOutfits.length; i++) {
        const outfit = lookbookOutfits[i];
        const cardY = headerHeight + i * cardHeight;

        // Card container background
        ctx.fillStyle = '#12161F';
        ctx.fillRect(60, cardY, width - 120, cardHeight - 40);

        ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(60, cardY, width - 120, cardHeight - 40);

        // Card Index Tag
        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 22px serif';
        ctx.textAlign = 'left';
        ctx.fillText(`LOOK #${String(i + 1).padStart(2, '0')}`, 90, cardY + 50);

        // Outfit Name
        ctx.fillStyle = '#F7F4EE';
        ctx.font = 'bold 32px serif';
        ctx.fillText(outfit.name, 90, cardY + 100);

        // Event & Gender
        ctx.fillStyle = 'rgba(247, 244, 238, 0.65)';
        ctx.font = '20px sans-serif';
        ctx.fillText(`Bối cảnh: ${outfit.event.name}  •  Giới tính: ${outfit.gender === 'women' ? 'Nữ' : 'Nam'}`, 90, cardY + 145);

        // Pieces details
        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('CẤU THÀNH PHỤC SỨC:', 90, cardY + 210);

        ctx.fillStyle = '#F7F4EE';
        ctx.font = '20px sans-serif';
        const topPiece = outfit.top.piece || (outfit.top.variant as Piece | undefined);
        const bottomPiece = outfit.bottom.piece || (outfit.bottom.variant as Piece | undefined);
        const footwearPiece = outfit.footwear.piece || (outfit.footwear.variant as Piece | undefined);
        const accessoryPiece = outfit.accessory?.piece || (outfit.accessory?.variant as Piece | undefined);

        ctx.fillText(`• Áo: ${topPiece?.name || 'Áo cổ phục'}`, 110, cardY + 250);
        ctx.fillText(`• Quần/Váy: ${bottomPiece?.name || 'Quần lụa'}`, 110, cardY + 285);
        ctx.fillText(`• Giày: ${footwearPiece?.name || 'Hài nhung'}`, 110, cardY + 320);
        if (accessoryPiece) {
          ctx.fillText(`• Phụ kiện: ${accessoryPiece.name}`, 110, cardY + 355);
        }

        // Outfit Preview Image
        const previewUrl = getOutfitPreviewUrl(outfit);
        if (previewUrl) {
          try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            await new Promise((res, rej) => {
              img.onload = res;
              img.onerror = res; // continue on error
              img.src = previewUrl;
            });
            if (img.complete && img.naturalWidth > 0) {
              const imgW = 260;
              const imgH = 360;
              const imgX = width - 60 - imgW - 30;
              const imgY = cardY + 40;

              // Border for image
              ctx.strokeStyle = '#D4AF37';
              ctx.lineWidth = 3;
              ctx.strokeRect(imgX - 2, imgY - 2, imgW + 4, imgH + 4);
              ctx.drawImage(img, imgX, imgY, imgW, imgH);
            }
          } catch (e) {
            // Ignore single image load failure
          }
        }
      }

      // 4. Footer
      const footerY = height - 100;
      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 22px serif';
      ctx.textAlign = 'center';
      ctx.fillText('VIỆT PHỤC REMIX — ATELIER 2D FASHION LOOKBOOK', width / 2, footerY);

      ctx.fillStyle = 'rgba(247, 244, 238, 0.6)';
      ctx.font = '16px sans-serif';
      ctx.fillText('Được thiết kế và lưu trữ trên hệ thống Việt phục Remix • vietphuc-remix.web.app', width / 2, footerY + 35);

      // Download image
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `lookbook-${lookbook.title.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();

      showToast('✨ Đã xuất poster Lookbook thành công!');
    } catch (err: any) {
      console.error(err);
      showToast('⚠️ Không thể xuất poster: ' + (err.message || 'Lỗi xử lý ảnh'));
    } finally {
      setIsExportingPoster(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl max-h-[92vh] bg-lacquer-surface border-2 border-imperial-gold shadow-[0_24px_64px_rgba(0,0,0,0.95)] rounded-none flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-lacquer border-b border-imperial-gold/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-imperial-gold/20 border border-imperial-gold flex items-center justify-center text-imperial-gold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-imperial-gold/15 text-imperial-gold border border-imperial-gold/30">
                  Bộ Sưu Tập
                </span>
                <span className="text-xs text-silk-muted">
                  {lookbookOutfits.length} bộ trang phục
                </span>
              </div>
              <h2 className="font-serif font-black text-xl sm:text-2xl text-silk-ivory leading-tight mt-0.5">
                {lookbook.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Export Poster Button */}
            <button
              onClick={handleExportPoster}
              disabled={isExportingPoster || lookbookOutfits.length === 0}
              className="px-3.5 py-1.5 bg-imperial-gold hover:bg-imperial-gold-light text-lacquer text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow cursor-pointer disabled:opacity-50"
              title="Xuất poster ảnh dọc dài gồm tất cả outfit trong bộ sưu tập"
            >
              {isExportingPoster ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-lacquer border-t-transparent rounded-full animate-spin" />
                  <span>Đang xuất...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất Poster</span>
                </>
              )}
            </button>

            {/* Delete Lookbook Button */}
            <button
              onClick={() => {
                if (window.confirm(`Bạn có chắc chắn muốn xóa bộ sưu tập "${lookbook.title}" không? (Các outfit đơn lẻ vẫn được giữ lại)`)) {
                  onDeleteLookbook(lookbook.id);
                  onClose();
                }
              }}
              className="p-2 bg-lacquer hover:bg-rose-950/60 border border-lacquer-border hover:border-rose-500/50 text-silk-muted hover:text-rose-400 transition-all cursor-pointer"
              title="Xóa bộ sưu tập này"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 bg-lacquer border border-white/20 hover:border-imperial-gold text-silk-muted hover:text-silk-ivory transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lookbook Description Quote (if provided) */}
        {lookbook.description && (
          <div className="px-6 py-2.5 bg-lacquer-surface border-b border-lacquer-border/60 text-xs text-silk-muted italic flex items-center gap-2">
            <span className="text-imperial-gold font-serif text-base leading-none">“</span>
            <span>{lookbook.description}</span>
            <span className="text-imperial-gold font-serif text-base leading-none">”</span>
          </div>
        )}

        {/* Modal Main Content: Left & Right Split */}
        <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
          {lookbookOutfits.length === 0 ? (
            <div className="p-12 text-center w-full">
              <BookOpen className="w-12 h-12 text-silk-muted/40 mx-auto mb-3" />
              <p className="text-silk-ivory font-bold text-base mb-1">
                Bộ sưu tập này hiện chưa có outfit nào
              </p>
              <p className="text-xs text-silk-muted">
                Các outfit có thể đã bị xóa khỏi tài khoản của bạn.
              </p>
            </div>
          ) : (
            <>
              {/* LEFT: Outfit Showcase Stage (55%) */}
              <div className="w-full lg:w-[55%] bg-lacquer-card p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-lacquer-border relative">
                {/* Active Outfit Visual */}
                <div className="relative flex-1 min-h-[360px] flex items-center justify-center p-4 bg-gradient-to-b from-lacquer to-lacquer-surface overflow-hidden border border-lacquer-border">
                  {currentOutfit && (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={getOutfitPreviewUrl(currentOutfit)}
                        alt={currentOutfit.name}
                        className="max-h-[380px] max-w-full object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.9)]"
                      />
                    </div>
                  )}

                  {/* Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-black/70 backdrop-blur-md text-imperial-gold border border-imperial-gold/40">
                      Look #{activeOutfitIndex + 1} / {lookbookOutfits.length}
                    </span>
                    {currentOutfit?.event && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-black/70 backdrop-blur-md text-silk-ivory border border-white/20">
                        {currentOutfit.event.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Outfit Carousel Selector Bar */}
                <div className="mt-4 pt-3 border-t border-lacquer-border/80 flex items-center justify-between gap-3">
                  <button
                    onClick={() =>
                      setActiveOutfitIndex((prev) =>
                        prev > 0 ? prev - 1 : lookbookOutfits.length - 1
                      )
                    }
                    className="p-2 bg-lacquer border border-lacquer-border hover:border-imperial-gold text-silk-muted hover:text-silk-ivory transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    {lookbookOutfits.map((o, idx) => (
                      <button
                        key={o.id}
                        onClick={() => setActiveOutfitIndex(idx)}
                        className={`w-12 h-14 border transition-all cursor-pointer overflow-hidden relative flex-shrink-0 ${
                          activeOutfitIndex === idx
                            ? 'border-imperial-gold scale-105 shadow-md'
                            : 'border-lacquer-border opacity-50 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={getOutfitPreviewUrl(o)}
                          alt={o.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[9px] font-bold text-center text-silk-ivory">
                          #{idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setActiveOutfitIndex((prev) =>
                        prev < lookbookOutfits.length - 1 ? prev + 1 : 0
                      )
                    }
                    className="p-2 bg-lacquer border border-lacquer-border hover:border-imperial-gold text-silk-muted hover:text-silk-ivory transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* RIGHT: Outfit Details & Breakdown (45%) */}
              {currentOutfit && (
                <div className="w-full lg:w-[45%] p-6 flex flex-col justify-between space-y-5 bg-lacquer-surface">
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-imperial-gold tracking-widest">
                        Chi Tiết Bộ Trang Phục
                      </span>
                      <h3 className="font-serif font-extrabold text-2xl text-silk-ivory mt-0.5">
                        {currentOutfit.name}
                      </h3>
                      <p className="text-xs text-silk-muted mt-1">
                        Bối cảnh: <strong className="text-silk-ivory">{currentOutfit.event.name}</strong> • Giới tính:{' '}
                        <strong className="text-silk-ivory">{currentOutfit.gender === 'women' ? 'Nữ' : 'Nam'}</strong>
                      </p>
                    </div>

                    {/* Pieces Breakdown */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-imperial-gold flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Cấu thành xiêm y</span>
                      </h4>

                      <div className="space-y-2 text-xs">
                        {/* Áo */}
                        <div className="p-2 bg-lacquer border border-lacquer-border flex items-center gap-2.5">
                          <span className="text-[10px] font-bold text-imperial-gold uppercase w-12 flex-shrink-0">
                            Áo:
                          </span>
                          <span className="text-silk-ivory font-bold truncate">
                            {currentOutfit.top.piece.name}
                          </span>
                        </div>

                        {/* Quần */}
                        <div className="p-2 bg-lacquer border border-lacquer-border flex items-center gap-2.5">
                          <span className="text-[10px] font-bold text-imperial-gold uppercase w-12 flex-shrink-0">
                            Quần/Váy:
                          </span>
                          <span className="text-silk-ivory font-bold truncate">
                            {currentOutfit.bottom.piece.name}
                          </span>
                        </div>

                        {/* Giày */}
                        <div className="p-2 bg-lacquer border border-lacquer-border flex items-center gap-2.5">
                          <span className="text-[10px] font-bold text-imperial-gold uppercase w-12 flex-shrink-0">
                            Giày:
                          </span>
                          <span className="text-silk-ivory font-bold truncate">
                            {currentOutfit.footwear.piece.name}
                          </span>
                        </div>

                        {/* Phụ kiện */}
                        {currentOutfit.accessory && (
                          <div className="p-2 bg-lacquer border border-lacquer-border flex items-center gap-2.5">
                            <span className="text-[10px] font-bold text-imperial-gold uppercase w-12 flex-shrink-0">
                              Phụ kiện:
                            </span>
                            <span className="text-silk-ivory font-bold truncate">
                              {currentOutfit.accessory.piece.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* AI Cultural Analysis if present */}
                    {currentOutfit.aiAnalysis && (
                      <div className="p-3 bg-lacquer border border-imperial-gold/30 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-imperial-gold flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Nhận Xét Điển Lễ</span>
                          </span>
                          <span className="text-xs font-serif font-bold px-2 py-0.5 bg-imperial-gold/20 text-imperial-gold border border-imperial-gold/40">
                            ★ {currentOutfit.aiAnalysis.totalScore}/10
                          </span>
                        </div>
                        <p className="font-serif italic text-xs text-silk-ivory leading-relaxed">
                          "{currentOutfit.aiAnalysis.mascotQuote || currentOutfit.aiAnalysis.explanation}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Remix in Studio Action */}
                  <div className="pt-4 border-t border-lacquer-border">
                    <button
                      onClick={() => {
                        onLoadOutfitIntoStudio(currentOutfit);
                        onClose();
                      }}
                      className="w-full py-3 px-4 bg-gradient-to-r from-imperial-gold to-imperial-gold-light hover:brightness-105 text-lacquer font-bold text-xs uppercase tracking-wider shadow flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Mở Trong Studio (Remix)</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
