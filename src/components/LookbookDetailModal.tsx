import React, { useRef, useState } from 'react';
import { Lookbook, SavedOutfit, Piece } from '../types';
import {
  X,
  Download,
  ExternalLink,
  Trash2,
  FileText,
  Printer,
  Sparkles,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { getPieceAlignment } from '../data/pieceAlignments';

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
  const spreadRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  // Find the single outfit for this lookbook
  const outfit =
    allOutfits.find((o) => o.id === lookbook.outfitId) ||
    allOutfits.find((o) => lookbook.outfitIds?.includes(o.id)) ||
    allOutfits[0];

  if (!outfit) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      >
        <div
          className="p-6 bg-lacquer-surface border border-imperial-gold text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-sm text-silk-ivory mb-4">
            Outfit liên kết với Lookbook này không còn tồn tại.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-imperial-gold text-lacquer font-bold text-xs"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  const topPiece = outfit.top.piece || (outfit.top.variant as Piece | undefined);
  const bottomPiece = outfit.bottom.piece || (outfit.bottom.variant as Piece | undefined);
  const footwearPiece = outfit.footwear.piece || (outfit.footwear.variant as Piece | undefined);
  const accessoryPiece = outfit.accessory?.piece || (outfit.accessory?.variant as Piece | undefined);

  // Fallback color palette
  const colors = [
    {
      hex: outfit.colorPalette?.[0] || '#7D1128',
      name: topPiece?.name.includes('đỏ') ? 'Đỏ đô' : 'Sắc chủ đạo',
      part: `(${topPiece?.name || 'áo tấc'})`,
    },
    {
      hex: outfit.colorPalette?.[2] || '#B89758',
      name: 'Vàng cổ',
      part: '(thêu)',
    },
    {
      hex: outfit.colorPalette?.[1] || '#EAE4D9',
      name: bottomPiece?.name.includes('lụa') ? 'Ngà' : 'Trầm',
      part: `(${bottomPiece?.name || 'quần lĩnh'})`,
    },
  ];

  // Alignments for 2D composite if no tryOnImage
  const bottomAlign = getPieceAlignment(bottomPiece?.id);
  const footwearAlign = getPieceAlignment(footwearPiece?.id);
  const topAlign = getPieceAlignment(topPiece?.id);
  const accessoryAlign = getPieceAlignment(accessoryPiece?.id);

  // Handle Download as High-Resolution PNG
  const handleDownloadImage = async () => {
    if (!spreadRef.current) return;
    setIsDownloading(true);
    try {
      showToast('⏳ Đang kết xuất ảnh Lookbook chất lượng cao...');
      const canvas = await html2canvas(spreadRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0A0D12',
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `lookbook-${(lookbook.title || 'outfit')
        .toLowerCase()
        .replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();

      showToast('✨ Đã tải Lookbook thành công dưới dạng ảnh chất lượng cao!');
    } catch (err: any) {
      console.error(err);
      showToast('⚠️ Lỗi khi tải ảnh: ' + (err.message || 'Thử lại'));
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle Print / Save as PDF
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 select-none font-sans"
      onClick={onClose}
    >
      {/* Outer Floating Modal Shell */}
      <div
        className="w-full max-w-7xl max-h-[96vh] flex flex-col bg-[#0A0D12] border-2 border-imperial-gold shadow-[0_24px_80px_rgba(0,0,0,0.95)] overflow-hidden relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Non-printed) */}
        <div className="px-5 py-2.5 bg-lacquer-surface border-b border-imperial-gold/30 flex items-center justify-between z-30 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-imperial-gold">
              Trang Tạp Chí Thời Trang • {lookbook.lookNumber || 'LOOK 01'}
            </span>
            <span className="text-silk-muted text-xs">|</span>
            <span className="text-silk-ivory text-xs font-serif font-bold">
              {lookbook.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Download PDF/Print */}
            <button
              onClick={handlePrintPDF}
              className="px-3 py-1.5 bg-lacquer hover:bg-lacquer-hover border border-lacquer-border hover:border-imperial-gold text-silk-ivory text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="In hoặc Lưu thành file PDF"
            >
              <Printer className="w-3.5 h-3.5 text-imperial-gold" />
              <span>In / Lưu PDF</span>
            </button>

            {/* Download Image Button */}
            <button
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="px-3.5 py-1.5 bg-gradient-to-r from-imperial-gold to-imperial-gold-light hover:brightness-110 text-lacquer text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow cursor-pointer disabled:opacity-50"
              title="Tải ảnh Lookbook độ phân giải cao"
            >
              {isDownloading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-lacquer border-t-transparent rounded-full animate-spin" />
                  <span>Đang tải...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải ảnh Lookbook</span>
                </>
              )}
            </button>

            {/* Delete Lookbook Button */}
            <button
              onClick={() => {
                if (window.confirm(`Bạn có chắc chắn muốn xóa Lookbook "${lookbook.title}" không?`)) {
                  onDeleteLookbook(lookbook.id);
                  onClose();
                }
              }}
              className="p-1.5 bg-lacquer hover:bg-rose-950/60 border border-lacquer-border hover:border-rose-500/50 text-silk-muted hover:text-rose-400 transition-all cursor-pointer"
              title="Xóa Lookbook này"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 bg-lacquer border border-white/20 hover:border-imperial-gold text-silk-muted hover:text-silk-ivory transition-all cursor-pointer"
              title="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* THE EDITORIAL LOOKBOOK SPREAD CANVAS (EXACT MATCH TO REFERENCE) */}
        {/* ============================================================== */}
        <div
          ref={spreadRef}
          id="lookbook-spread-capture"
          className="relative w-full flex-1 min-h-[580px] lg:min-h-[660px] bg-[#0A0D12] text-[#F7F4EE] flex flex-col lg:flex-row overflow-hidden border border-imperial-gold/20"
        >
          {/* ============================================================ */}
          {/* LEFT HALF (56%): CINEMATIC SCENE & MANNEQUIN STANDING          */}
          {/* ============================================================ */}
          <div className="relative w-full lg:w-[56%] min-h-[460px] lg:min-h-full flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-[#D4AF37]/30">
            {/* 1. Background Scene (Event background e.g. Phố cổ đèn lồng đêm thu) */}
            <img
              src={outfit.event?.bgUrl || '/assets/backgrounds/gallery-bg.jpg'}
              alt={outfit.event?.name}
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 contrast-105 select-none pointer-events-none"
            />

            {/* Soft Ambient Vignette for Editorial Depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/70 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* 2. Mannequin / Outfit Visual */}
            {outfit.tryOnImage ? (
              <img
                src={outfit.tryOnImage}
                alt={outfit.name}
                className="relative z-10 max-h-[92%] max-w-[85%] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] select-none pointer-events-none"
              />
            ) : (
              /* High-fidelity 2D Mannequin Composite */
              <div className="relative z-10 w-full h-full max-h-[94%] aspect-[3/4] flex items-center justify-center pointer-events-none select-none py-4">
                {/* Layer 1: Mannequin Base */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={
                      outfit.gender === 'women'
                        ? '/assets/mannequins/mannequin-nu.png'
                        : '/assets/mannequins/mannequin-nam.png'
                    }
                    alt="Ma-nơ-canh"
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_32px_rgba(0,0,0,0.85)]"
                  />
                </div>

                {/* Layer 2: Quần (Bottom) */}
                {bottomPiece && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={bottomPiece.assetUrl}
                      alt={bottomPiece.name}
                      style={{
                        transform: `translate(${bottomAlign.x}px, ${bottomAlign.y}px) scale(${bottomAlign.scale || 1}) scaleX(${bottomAlign.scaleX || 1}) scaleY(${bottomAlign.scaleY || 1}) rotate(${bottomAlign.rotate || 0}deg)`,
                      }}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}

                {/* Layer 3: Giày (Footwear) */}
                {footwearPiece && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={footwearPiece.assetUrl}
                      alt={footwearPiece.name}
                      style={{
                        transform: `translate(${footwearAlign.x}px, ${footwearAlign.y}px) scale(${footwearAlign.scale || 1}) scaleX(${footwearAlign.scaleX || 1}) scaleY(${footwearAlign.scaleY || 1}) rotate(${footwearAlign.rotate || 0}deg)`,
                      }}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}

                {/* Layer 4: Áo (Top) */}
                {topPiece && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={topPiece.assetUrl}
                      alt={topPiece.name}
                      style={{
                        transform: `translate(${topAlign.x}px, ${topAlign.y}px) scale(${topAlign.scale || 1}) scaleX(${topAlign.scaleX || 1}) scaleY(${topAlign.scaleY || 1}) rotate(${topAlign.rotate || 0}deg)`,
                      }}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)]"
                    />
                  </div>
                )}

                {/* Layer 5: Phụ kiện (Accessory) */}
                {accessoryPiece && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={accessoryPiece.assetUrl}
                      alt={accessoryPiece.name}
                      style={{
                        transform: `translate(${accessoryAlign.x}px, ${accessoryAlign.y}px) scale(${accessoryAlign.scale || 1}) scaleX(${accessoryAlign.scaleX || 1}) scaleY(${accessoryAlign.scaleY || 1}) rotate(${accessoryAlign.rotate || 0}deg)`,
                      }}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            {/* 3. Text Overlay on Left Side (MATCHING REFERENCE IMAGE) */}
            <div className="absolute top-10 sm:top-14 left-8 sm:left-12 z-20 flex flex-col items-start select-none pointer-events-none">
              {/* LOOK 01 Tag */}
              <div className="flex items-center gap-2 mb-1">
                <span className="font-serif tracking-[0.25em] text-xs sm:text-sm uppercase font-bold text-[#E5C178] drop-shadow">
                  {lookbook.lookNumber || 'LOOK 01'}
                </span>
                <span className="w-12 h-[1px] bg-[#E5C178]/60 inline-block" />
              </div>

              {/* Big Golden Brush Calligraphy Title + Red Seal Stamp */}
              <div className="flex items-center gap-3 mt-1">
                <h1 className="font-calligraphy text-4xl sm:text-5xl lg:text-6xl text-[#E5C178] font-bold drop-shadow-[0_4px_16px_rgba(229,193,120,0.45)] leading-tight -rotate-1">
                  {lookbook.title}
                </h1>

                {/* Weathered Vermilion Seal Stamp */}
                <div className="w-7 h-9 border border-[#8B1E1E]/80 rounded-none overflow-hidden shadow-lg flex-shrink-0">
                  <img
                    src="/assets/decorations/red-seal.jpg"
                    alt="Ấn triện"
                    className="w-full h-full object-cover filter contrast-125"
                  />
                </div>
              </div>

              {/* Subtitle with Golden Cloud Motif */}
              <div className="flex items-center gap-2.5 mt-2">
                <span className="w-6 h-[1px] bg-[#E5C178]/70" />
                <span className="font-serif italic text-xs sm:text-sm text-[#F7F4EE]/90 tracking-wide drop-shadow">
                  {lookbook.subtitle || 'Sắc son triều Nguyễn'}
                </span>
                <span className="w-6 h-[1px] bg-[#E5C178]/70" />
                <img
                  src="/assets/decorations/golden-cloud.png"
                  alt="Mây vàng"
                  className="w-5 h-auto object-contain opacity-75 inline-block"
                />
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT HALF (44%): EDITORIAL STORY, PALETTE & DETAILS          */}
          {/* ============================================================ */}
          <div className="relative w-full lg:w-[44%] p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-gradient-to-br from-[#10141D] via-[#0A0D12] to-[#12161F] text-[#F7F4EE] overflow-hidden select-none">
            {/* Decorative Peach Blossom Branch in Top-Right Corner */}
            <div className="absolute -top-6 -right-6 w-44 sm:w-56 h-44 sm:h-56 pointer-events-none select-none z-10 opacity-70 mix-blend-screen">
              <img
                src="/assets/decorations/peach-blossom.jpg"
                alt="Hoa đào"
                className="w-full h-full object-contain filter brightness-110"
              />
            </div>

            {/* Far Right Vertical Calligraphy Poem */}
            <div className="absolute right-4 sm:right-6 top-28 z-20 flex flex-col items-center pointer-events-none select-none hidden sm:flex">
              <span
                style={{ writingMode: 'vertical-rl' }}
                className="font-calligraphy text-base sm:text-lg text-[#E5C178]/85 tracking-[0.2em] leading-loose drop-shadow"
              >
                {lookbook.verticalPoem || 'Tết đến xuân về vạn sự như ý'}
              </span>
              <div className="w-5 h-6 mt-3 border border-[#8B1E1E]/70 overflow-hidden shadow">
                <img
                  src="/assets/decorations/red-seal.jpg"
                  alt="Ấn"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content Column (padded so it doesn't overlap vertical text) */}
            <div className="relative z-10 pr-8 sm:pr-12 space-y-6">
              {/* SECTION 1: CÂU CHUYỆN CỦA LOOK */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-black text-sm sm:text-base uppercase tracking-widest text-[#E5C178]">
                    CÂU CHUYỆN CỦA LOOK
                  </h3>
                  <img
                    src="/assets/decorations/golden-cloud.png"
                    alt="Mây vàng"
                    className="w-4 h-auto object-contain opacity-70"
                  />
                </div>
                <p className="text-xs sm:text-[13px] text-[#F7F4EE]/80 leading-relaxed font-sans text-justify">
                  {lookbook.description ||
                    'Lấy cảm hứng từ hình ảnh ngày Tết trong triều Nguyễn, look này là sự giao thoa giữa nét trang nghiêm, truyền thống và hơi thở hiện đại. Sắc đỏ của áo tấc tượng trưng cho may mắn, phú quý, kết hợp cùng họa tiết thêu vàng tinh xảo, gợi nhớ về một thời kỳ vàng son của dân tộc.'}
                </p>
              </div>

              {/* SECTION 2: BẢNG MÀU */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-black text-xs sm:text-sm uppercase tracking-widest text-[#E5C178]">
                    BẢNG MÀU
                  </h3>
                  <img
                    src="/assets/decorations/golden-cloud.png"
                    alt="Mây vàng"
                    className="w-4 h-auto object-contain opacity-70"
                  />
                </div>

                <div className="flex items-center gap-6 sm:gap-8">
                  {colors.map((c, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center">
                      <div
                        style={{ backgroundColor: c.hex }}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#D4AF37]/50 shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                      />
                      <span className="text-xs font-bold text-[#F7F4EE] mt-1.5 leading-tight">
                        {c.name}
                      </span>
                      <span className="text-[10px] text-[#F7F4EE]/60">
                        {c.part}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: CHI TIẾT TRANG PHỤC & THÀNH PHẦN OUTFIT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#D4AF37]/20">
                {/* Left: CHI TIẾT TRANG PHỤC (3 Detail Crop Cards) */}
                <div className="space-y-2">
                  <h4 className="font-serif font-black text-[11px] uppercase tracking-wider text-[#E5C178]">
                    CHI TIẾT TRANG PHỤC
                  </h4>

                  <div className="grid grid-cols-3 gap-2">
                    {/* Detail 1: Cổ áo */}
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square rounded-lg bg-black/60 border border-[#D4AF37]/40 p-1 flex items-center justify-center overflow-hidden">
                        <img
                          src={topPiece?.thumbnailUrl || topPiece?.assetUrl}
                          alt="Cổ áo"
                          className="w-full h-full object-contain hover:scale-125 transition-transform"
                        />
                      </div>
                      <span className="text-[9px] text-[#F7F4EE]/80 text-center mt-1 leading-tight line-clamp-2">
                        Cổ áo thêu hoa văn
                      </span>
                    </div>

                    {/* Detail 2: Tay áo */}
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square rounded-lg bg-black/60 border border-[#D4AF37]/40 p-1 flex items-center justify-center overflow-hidden">
                        <img
                          src={topPiece?.assetUrl || topPiece?.thumbnailUrl}
                          alt="Tay áo"
                          className="w-full h-full object-contain scale-110"
                        />
                      </div>
                      <span className="text-[9px] text-[#F7F4EE]/80 text-center mt-1 leading-tight line-clamp-2">
                        Tay áo rộng thêu viền
                      </span>
                    </div>

                    {/* Detail 3: Hài / Giày */}
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square rounded-lg bg-black/60 border border-[#D4AF37]/40 p-1 flex items-center justify-center overflow-hidden">
                        <img
                          src={footwearPiece?.thumbnailUrl || footwearPiece?.assetUrl}
                          alt="Hài thêu"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-[9px] text-[#F7F4EE]/80 text-center mt-1 leading-tight line-clamp-2">
                        {footwearPiece?.name || 'Hài thêu truyền thống'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: THÀNH PHẦN OUTFIT */}
                <div className="space-y-2 border-t sm:border-t-0 sm:border-l border-[#D4AF37]/20 sm:pl-3">
                  <h4 className="font-serif font-black text-[11px] uppercase tracking-wider text-[#E5C178]">
                    THÀNH PHẦN OUTFIT
                  </h4>

                  <ul className="space-y-1.5 text-[11px] text-[#F7F4EE]/85">
                    <li className="flex items-center gap-1.5 truncate">
                      <span className="text-xs">👘</span>
                      <span className="truncate">{topPiece?.name || 'Áo tấc đỏ đô'}</span>
                    </li>
                    <li className="flex items-center gap-1.5 truncate">
                      <span className="text-xs">👖</span>
                      <span className="truncate">{bottomPiece?.name || 'Quần lĩnh màu ngà'}</span>
                    </li>
                    <li className="flex items-center gap-1.5 truncate">
                      <span className="text-xs">🥿</span>
                      <span className="truncate">{footwearPiece?.name || 'Hài thêu truyền thống'}</span>
                    </li>
                    <li className="flex items-center gap-1.5 truncate">
                      <span className="text-xs">👒</span>
                      <span className="truncate">{accessoryPiece?.name || 'Nón lá / khăn đội đầu'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar (MATCHING REFERENCE IMAGE) */}
            <div className="relative z-10 pt-4 mt-6 border-t border-[#D4AF37]/30 flex items-center justify-end gap-3 print:hidden">
              {/* Load into Studio Button */}
              <button
                onClick={() => {
                  onLoadOutfitIntoStudio(outfit);
                  onClose();
                }}
                className="py-2.5 px-4 bg-transparent hover:bg-lacquer border border-[#D4AF37]/70 hover:border-imperial-gold text-xs font-bold uppercase tracking-wider text-[#F7F4EE] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#E5C178]" />
                <span>Mở Trong Studio</span>
              </button>

              {/* Download Button */}
              <button
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className="py-2.5 px-5 bg-gradient-to-r from-[#D4AF37] to-[#E5C178] hover:brightness-110 text-lacquer text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_4px_16px_rgba(212,175,55,0.35)] cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Tải Bộ Ảnh</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
