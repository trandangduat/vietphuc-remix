import React, { useRef, useState } from 'react';
import { Lookbook, SavedOutfit, Piece } from '../types';
import {
  X,
  Download,
  ExternalLink,
  Trash2,
  Printer,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { getPieceAlignment, getAlignmentStyle } from '../data/pieceAlignments';
import {
  CornerTopLeftTassel,
  CornerBottomRightBrass,
  CornerBottomLeft,
} from './heritage/HeritageDecorations';

// Bespoke traditional gold line-art icons for outfit composition
const TraditionalRobeIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4 text-[#D4AF37] flex-shrink-0">
    <path d="M4 4 L10 6 L12 11 L14 6 L20 4 L22 8 L18 10 L18 20 L6 20 L6 10 L2 8 Z" strokeLinejoin="round" />
    <path d="M10 6 L14 14" strokeLinecap="round" />
    <path d="M14 6 L10 14" strokeLinecap="round" />
  </svg>
);

const TraditionalPantsIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4 text-[#D4AF37] flex-shrink-0">
    <path d="M6 3 L18 3 L19 21 L13 21 L12 11 L11 21 L5 21 Z" strokeLinejoin="round" />
    <line x1="6" y1="6" x2="18" y2="6" strokeLinecap="round" />
  </svg>
);

const TraditionalShoesIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4 text-[#D4AF37] flex-shrink-0">
    <path d="M3 14 C3 10 7 10 11 11 C15 12 19 11 21 14 C21 17 18 18 13 18 C7 18 3 17 3 14 Z" strokeLinejoin="round" />
    <path d="M5 14 C8 11 12 12 14 14" strokeLinecap="round" />
  </svg>
);

const TraditionalHatIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4 text-[#D4AF37] flex-shrink-0">
    <path d="M12 4 L2 18 C7 19 17 19 22 18 Z" strokeLinejoin="round" />
    <circle cx="12" cy="4" r="1" fill="currentColor" />
  </svg>
);

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
          style={{ borderRadius: '10px' }}
          className="p-6 bg-gradient-to-b from-[#11141C] via-[#0C0E14] to-[#07090D] border border-[#C5A059]/65 text-center max-w-sm w-full font-sans shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <CornerTopLeftTassel />
          <CornerBottomRightBrass />
          <CornerBottomLeft />
          <p className="text-xs text-[#EDE5D8] mb-4 mt-2">
            Outfit liên kết với Lookbook này không còn tồn tại.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-[6px] bg-gradient-to-r from-[#D4AF37] to-[#AA8232] text-[#0A0D12] font-bold text-xs cursor-pointer hover:brightness-110"
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

  // Dynamic color palette adapting to user's actual outfit pieces
  const getDynamicSwatches = (o: SavedOutfit) => {
    const top = o.top.piece || (o.top.variant as Piece | undefined);
    const bottom = o.bottom.piece || (o.bottom.variant as Piece | undefined);

    let swatch1Hex = o.colorPalette?.[0] || '#7D1128';
    let swatch1Name = 'Đỏ đô';
    if (top?.id?.includes('xanh') || top?.name?.toLowerCase().includes('xanh')) {
      swatch1Hex = '#1A4B54';
      swatch1Name = 'Xanh cổ vịt';
    } else if (top?.id?.includes('do') || top?.name?.toLowerCase().includes('đỏ')) {
      swatch1Hex = '#7D1128';
      swatch1Name = 'Đỏ đô';
    } else if (top?.swatchHex) {
      swatch1Hex = top.swatchHex;
      swatch1Name = top.colorName || 'Sắc áo';
    }

    const swatch2Hex = o.colorPalette?.[2] || '#B89758';
    const swatch2Name = 'Vàng cổ';

    let swatch3Hex = o.colorPalette?.[1] || '#EAE4D9';
    let swatch3Name = 'Ngà';
    if (bottom?.id?.includes('tay') || bottom?.name?.toLowerCase().includes('tây') || bottom?.name?.toLowerCase().includes('xám')) {
      swatch3Hex = '#374151';
      swatch3Name = 'Xám than';
    } else if (bottom?.name?.toLowerCase().includes('lụa') || bottom?.name?.toLowerCase().includes('trắng')) {
      swatch3Hex = '#EAE4D9';
      swatch3Name = 'Ngà';
    } else if (bottom?.swatchHex) {
      swatch3Hex = bottom.swatchHex;
      swatch3Name = bottom.colorName || 'Sắc quần';
    }

    return [
      { hex: swatch1Hex, name: swatch1Name, part: `(${top?.name || 'áo tấc'})` },
      { hex: swatch2Hex, name: swatch2Name, part: '(thêu)' },
      { hex: swatch3Hex, name: swatch3Name, part: `(${bottom?.name || 'quần lĩnh'})` },
    ];
  };

  const colors = getDynamicSwatches(outfit);

  // Alignments for 2D composite
  const bottomAlign = getPieceAlignment(bottomPiece?.id);
  const footwearAlign = getPieceAlignment(footwearPiece?.id);
  const topAlign = getPieceAlignment(topPiece?.id);
  const accessoryAlign = getPieceAlignment(accessoryPiece?.id);

  // Format title into 2 poetic calligraphic lines
  const formatLookTitle = (raw: string): string[] => {
    let clean = (raw || 'Tết Nguyên Đán').trim();
    if (clean.includes('•')) {
      const parts = clean.split('•').map((s) => s.trim()).filter(Boolean);
      clean = parts[parts.length - 1] || parts[0];
    }
    const words = clean.split(' ').filter(Boolean);
    if (words.length <= 1) return [clean];
    if (words.length === 2) return [words[0], words[1]];
    if (words.length === 3) return [words[0], `${words[1]} ${words[2]}`];
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  };

  const titleLines = formatLookTitle(lookbook.title);

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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-black/92 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 select-none font-sans"
      onClick={onClose}
    >
      {/* Outer Floating Modal Shell (Clean, sleek, border gold with soft glow) */}
      <div
        style={{ borderRadius: '10px' }}
        className="w-full max-w-7xl max-h-[96vh] flex flex-col bg-gradient-to-b from-[#11141C] via-[#0C0E14] to-[#07090D] border border-[#C5A059]/65 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_24px_rgba(197,160,89,0.12),inset_0_0_0_1px_rgba(197,160,89,0.2)] overflow-hidden relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Heritage Signature Corners */}
        <CornerTopLeftTassel />
        <CornerBottomRightBrass />
        <CornerBottomLeft />

        {/* Floating Top-Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 z-40 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 border border-[#C5A059]/50 hover:border-[#D4AF37] text-[#EDE5D8]/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-md print:hidden"
          title="Đóng (ESC)"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Delete Lookbook discreet button */}
        <button
          onClick={() => {
            if (window.confirm(`Bạn có chắc chắn muốn xóa Lookbook "${lookbook.title}" không?`)) {
              onDeleteLookbook(lookbook.id);
              onClose();
            }
          }}
          className="absolute top-2.5 right-11 z-40 w-7 h-7 rounded-full bg-black/60 hover:bg-rose-950/80 border border-[#C5A059]/40 hover:border-rose-500/60 text-[#EDE5D8]/60 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer shadow-md print:hidden"
          title="Xóa Lookbook này"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* ============================================================== */}
        {/* THE EDITORIAL LOOKBOOK SPREAD CANVAS (FAITHFUL TO USER MOCKUP)  */}
        {/* ============================================================== */}
        <div
          ref={spreadRef}
          id="lookbook-spread-capture"
          className="relative w-full flex-1 min-h-[580px] lg:min-h-[660px] bg-[#0A0D12] text-[#F7F4EE] flex flex-col lg:flex-row overflow-hidden"
        >
          {/* ============================================================ */}
          {/* LEFT HALF (56%): CINEMATIC OUTFIT STAGE & CALLIGRAPHY          */}
          {/* ============================================================ */}
          <div className="relative w-full lg:w-[56%] min-h-[500px] lg:min-h-full flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-[#D4AF37]/20">
            {/* 1. Atmospheric Event Scene Background (User outfit's event or fallback) */}
            <img
              src={outfit.event?.bgUrl || '/assets/backgrounds/gallery-bg.jpg'}
              alt={outfit.event?.name}
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-95 contrast-105 select-none pointer-events-none"
            />

            {/* Depth vignette overlays for editorial mood */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-[#0A0D12] pointer-events-none" />

            {/* Seamless transition on the right edge blending into lacquer panel */}
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-[#0A0D12] pointer-events-none z-10" />

            {/* 2. Mannequin / Outfit Visual */}
            {outfit.tryOnImage ? (
              <img
                src={outfit.tryOnImage}
                alt={outfit.name}
                className="relative z-10 max-h-[92%] max-w-[85%] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] select-none pointer-events-none"
              />
            ) : (
              /* High-fidelity Grounded 2D Mannequin Composite */
              <div className="relative z-10 w-full h-full max-h-[95%] aspect-[3/4] flex items-center justify-center pointer-events-none select-none py-2">
                {/* Soft Ground Shadow underneath mannequin on floor */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-6 bg-black/75 rounded-full blur-md" />

                {/* Layer 1: Mannequin Base (Head, Neck, Torso, Legs, Stand) */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <img
                    src="/assets/mannequins/mannequin-base.png"
                    alt="Ma-nơ-canh"
                    className="w-full h-full object-contain filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.85)]"
                  />
                </div>

                {/* Layer 2: Quần / Chân váy (Z=20) */}
                {bottomPiece?.assetUrl && (
                  <div
                    className="absolute inset-0 z-20 pointer-events-none"
                    style={getAlignmentStyle(bottomAlign)}
                  >
                    <img
                      src={bottomPiece.assetUrl}
                      alt={bottomPiece.name}
                      className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                    />
                  </div>
                )}

                {/* Layer 3: Giày / Hài (Z=30) */}
                {footwearPiece?.assetUrl && (
                  <div
                    className="absolute inset-0 z-30 pointer-events-none"
                    style={getAlignmentStyle(footwearAlign)}
                  >
                    <img
                      src={footwearPiece.assetUrl}
                      alt={footwearPiece.name}
                      className="w-full h-full object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]"
                    />
                  </div>
                )}

                {/* Layer 4: Áo tấc (Z=40) */}
                {topPiece?.assetUrl && (
                  <div
                    className="absolute inset-0 z-40 pointer-events-none"
                    style={getAlignmentStyle(topAlign)}
                  >
                    <img
                      src={topPiece.assetUrl}
                      alt={topPiece.name}
                      className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
                    />
                  </div>
                )}

                {/* Layer 5: Phụ kiện (Z=50) - Nón lá / Khăn */}
                {accessoryPiece?.assetUrl && (
                  <div
                    className="absolute inset-0 z-50 pointer-events-none"
                    style={getAlignmentStyle(accessoryAlign)}
                  >
                    <img
                      src={accessoryPiece.assetUrl}
                      alt={accessoryPiece.name}
                      className="w-full h-full object-contain filter drop-shadow-[0_8px_18px_rgba(0,0,0,0.7)]"
                    />
                  </div>
                )}
              </div>
            )}

            {/* 3. Text Overlay on Left Side (MATCHING USER REFERENCE DESIGN) */}
            <div className="absolute top-10 sm:top-14 left-7 sm:left-11 z-20 flex flex-col items-start select-none pointer-events-none max-w-[50%]">
              {/* LOOK 01 Tag */}
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="font-serif tracking-[0.28em] text-xs uppercase font-black text-[#E8C87B] drop-shadow-md">
                  {lookbook.lookNumber || 'LOOK 01'}
                </span>
                <span className="w-14 h-[1px] bg-gradient-to-r from-[#E8C87B] to-transparent inline-block" />
              </div>

              {/* Big Golden Brush Calligraphy Title + Vermilion Seal Stamp */}
              <div className="flex items-start gap-3 my-1">
                <div className="flex flex-col">
                  {titleLines.map((line, idx) => (
                    <span
                      key={idx}
                      className="font-calligraphy text-4xl sm:text-5xl lg:text-6xl text-[#E8C87B] font-bold drop-shadow-[0_4px_16px_rgba(232,200,123,0.55)] leading-[1.05] select-none -rotate-1"
                    >
                      {line}
                    </span>
                  ))}
                </div>

                {/* Weathered Vermilion Seal Stamp right beside title */}
                <div className="mt-2 px-1 py-1.5 bg-[#8B1E1E] border border-[#D4AF37]/90 shadow-[0_4px_12px_rgba(0,0,0,0.7)] flex flex-col items-center justify-center flex-shrink-0 select-none">
                  <span className="text-[9px] font-serif font-black text-[#D4AF37] leading-tight [writing-mode:vertical-rl] tracking-widest">
                    ẤN KÝ
                  </span>
                </div>
              </div>

              {/* Subtitle with Golden Cloud Motif */}
              <div className="flex items-center gap-2.5 mt-2">
                <span className="w-6 h-[1px] bg-[#E8C87B]/60" />
                <span className="font-serif italic text-xs sm:text-sm text-[#F7F4EE]/90 tracking-wide drop-shadow">
                  {lookbook.subtitle || 'Sắc son triều Nguyễn'}
                </span>
                <span className="w-6 h-[1px] bg-[#E8C87B]/60" />
                <img
                  src="/assets/decorations/golden-cloud.png"
                  alt="Mây vàng"
                  className="w-5 h-auto object-contain opacity-80 inline-block drop-shadow"
                />
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT HALF (44%): EDITORIAL STORY, PALETTE & DETAILS          */}
          {/* ============================================================ */}
          <div className="relative w-full lg:w-[44%] p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-gradient-to-br from-[#10141D] via-[#0A0D12] to-[#12161F] text-[#F7F4EE] overflow-hidden select-none">
            {/* Decorative Peach Blossom Branch in Top-Right Corner with Soft Radial Mask */}
            <div
              className="absolute -top-4 -right-4 w-52 sm:w-64 h-52 sm:h-64 pointer-events-none select-none z-10 opacity-85"
              style={{
                maskImage: 'radial-gradient(ellipse at 85% 15%, black 45%, transparent 78%)',
                WebkitMaskImage: 'radial-gradient(ellipse at 85% 15%, black 45%, transparent 78%)',
              }}
            >
              <img
                src="/assets/decorations/peach-blossom.jpg"
                alt="Hoa đào"
                className="w-full h-full object-cover mix-blend-screen filter brightness-110"
              />
            </div>

            {/* Far Right Vertical Calligraphy Poem */}
            <div className="absolute right-4 sm:right-6 top-24 bottom-24 z-20 flex flex-col items-center justify-between pointer-events-none select-none hidden md:flex">
              <div className="flex flex-col items-center">
                <span
                  style={{ writingMode: 'vertical-rl' }}
                  className="font-calligraphy text-base sm:text-lg text-[#E8C87B]/90 tracking-[0.24em] leading-loose drop-shadow-[0_2px_8px_rgba(232,200,123,0.3)]"
                >
                  {lookbook.verticalPoem || 'Tết đến xuân về vạn sự như ý'}
                </span>
                {/* Small square red seal stamp */}
                <div className="w-5 h-5 mt-3 bg-[#8B1E1E] border border-[#D4AF37]/80 shadow flex items-center justify-center">
                  <span className="text-[7.5px] font-serif font-black text-[#D4AF37]">ẤN</span>
                </div>
              </div>
            </div>

            {/* Content Column (padded so it doesn't collide with vertical poem) */}
            <div className="relative z-10 pr-6 sm:pr-12 space-y-6">
              {/* SECTION 1: CÂU CHUYỆN CỦA LOOK */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-black text-xs sm:text-sm uppercase tracking-[0.2em] text-[#E8C87B]">
                    CÂU CHUYỆN CỦA LOOK
                  </h3>
                  <img
                    src="/assets/decorations/golden-cloud.png"
                    alt="Mây vàng"
                    className="w-4 h-auto object-contain opacity-75"
                  />
                </div>
                <p className="text-xs sm:text-[13px] text-[#F7F4EE]/85 leading-relaxed font-sans text-justify">
                  {lookbook.description ||
                    'Lấy cảm hứng từ hình ảnh ngày Tết trong triều Nguyễn, look này là sự giao thoa giữa nét trang nghiêm, truyền thống và hơi thở hiện đại. Sắc đỏ của áo tấc tượng trưng cho may mắn, phú quý, kết hợp cùng họa tiết thêu vàng tinh xảo, gợi nhớ về một thời kỳ vàng son của dân tộc.'}
                </p>
              </div>

              {/* SECTION 2: BẢNG MÀU (Dynamic to user's outfit pieces) */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-black text-xs sm:text-sm uppercase tracking-[0.2em] text-[#E8C87B]">
                    BẢNG MÀU
                  </h3>
                  <img
                    src="/assets/decorations/golden-cloud.png"
                    alt="Mây vàng"
                    className="w-4 h-auto object-contain opacity-75"
                  />
                </div>

                <div className="flex items-center gap-6 sm:gap-8">
                  {colors.map((c, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center">
                      <div
                        style={{ backgroundColor: c.hex }}
                        className="w-10 h-10 rounded-full border-2 border-[#D4AF37]/70 shadow-[0_4px_14px_rgba(0,0,0,0.8)]"
                      />
                      <span className="text-xs font-serif font-bold text-[#F7F4EE] mt-1.5 leading-tight">
                        {c.name}
                      </span>
                      <span className="text-[10px] text-[#D4AF37]/80 font-serif italic">
                        {c.part}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: CHI TIẾT TRANG PHỤC & THÀNH PHẦN OUTFIT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#D4AF37]/20">
                {/* Left: CHI TIẾT TRANG PHỤC (User's actual outfit piece detail cards) */}
                <div className="space-y-2">
                  <h4 className="font-serif font-black text-[11px] uppercase tracking-wider text-[#E8C87B]">
                    CHI TIẾT TRANG PHỤC
                  </h4>

                  <div className="grid grid-cols-3 gap-2">
                    {/* Detail 1: Cổ áo & Hoa văn (User's top piece) */}
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square rounded-xl bg-gradient-to-b from-[#1c212c] to-[#0d1017] border border-[#D4AF37]/50 p-1.5 overflow-hidden shadow-md group flex items-center justify-center">
                        <img
                          src={topPiece?.thumbnailUrl || topPiece?.assetUrl}
                          alt="Cổ áo thêu hoa văn"
                          className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] group-hover:scale-115 transition-transform duration-500 rounded-lg"
                        />
                      </div>
                      <span className="text-[9px] font-serif text-[#F7F4EE]/90 text-center mt-1 leading-tight line-clamp-2">
                        Cổ áo & Hoa văn
                      </span>
                    </div>

                    {/* Detail 2: Vạt áo & Tay áo (User's top piece) */}
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square rounded-xl bg-gradient-to-b from-[#1c212c] to-[#0d1017] border border-[#D4AF37]/50 p-1.5 overflow-hidden shadow-md group flex items-center justify-center">
                        <img
                          src={topPiece?.assetUrl || topPiece?.thumbnailUrl}
                          alt="Vạt áo & Thân áo"
                          className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] scale-110 group-hover:scale-120 transition-transform duration-500 rounded-lg"
                        />
                      </div>
                      <span className="text-[9px] font-serif text-[#F7F4EE]/90 text-center mt-1 leading-tight line-clamp-2">
                        Vạt áo & Thân áo
                      </span>
                    </div>

                    {/* Detail 3: Hài / Giày (User's footwear piece) */}
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square rounded-xl bg-gradient-to-b from-[#1c212c] to-[#0d1017] border border-[#D4AF37]/50 p-1.5 overflow-hidden shadow-md group flex items-center justify-center">
                        <img
                          src={footwearPiece?.thumbnailUrl || footwearPiece?.assetUrl}
                          alt={footwearPiece?.name || 'Giày / Hài'}
                          className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] group-hover:scale-115 transition-transform duration-500 rounded-lg"
                        />
                      </div>
                      <span className="text-[9px] font-serif text-[#F7F4EE]/90 text-center mt-1 leading-tight line-clamp-2">
                        {footwearPiece?.name || 'Hài thêu'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: THÀNH PHẦN OUTFIT (Bespoke gold SVG line icons) */}
                <div className="space-y-2 border-t sm:border-t-0 sm:border-l border-[#D4AF37]/20 sm:pl-3">
                  <h4 className="font-serif font-black text-[11px] uppercase tracking-wider text-[#E8C87B]">
                    THÀNH PHẦN OUTFIT
                  </h4>

                  <ul className="space-y-2 text-xs text-[#F7F4EE]/90 font-sans">
                    <li className="flex items-center gap-2.5 truncate">
                      <TraditionalRobeIcon />
                      <span className="truncate">{topPiece?.name || 'Áo tấc'}</span>
                    </li>
                    <li className="flex items-center gap-2.5 truncate">
                      <TraditionalPantsIcon />
                      <span className="truncate">{bottomPiece?.name || 'Quần truyền thống'}</span>
                    </li>
                    <li className="flex items-center gap-2.5 truncate">
                      <TraditionalShoesIcon />
                      <span className="truncate">{footwearPiece?.name || 'Hài / Giày'}</span>
                    </li>
                    <li className="flex items-center gap-2.5 truncate">
                      <TraditionalHatIcon />
                      <span className="truncate">{accessoryPiece?.name || 'Nón lá truyền thống'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar (MATCHING USER REFERENCE DESIGN) */}
            <div className="relative z-10 pt-4 mt-6 border-t border-[#D4AF37]/25 flex items-center justify-end gap-3 print:hidden">
              {/* Print / Save PDF Button */}
              <button
                onClick={handlePrintPDF}
                className="py-2 px-3 bg-[#161B26] hover:bg-[#1E2433] border border-[#C5A059]/40 hover:border-[#D4AF37] text-xs font-sans font-bold text-[#D4AF37] rounded-[6px] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="In hoặc Lưu PDF"
              >
                <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">In / PDF</span>
              </button>

              {/* Load into Studio Button */}
              <button
                onClick={() => {
                  onLoadOutfitIntoStudio(outfit);
                  onClose();
                }}
                className="py-2 px-3.5 bg-transparent hover:bg-[#C5A059]/15 border border-[#C5A059]/70 hover:border-[#D4AF37] text-xs font-sans font-bold uppercase tracking-wider text-[#EDE5D8] rounded-[6px] flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Mở Trong Studio</span>
              </button>

              {/* Download PNG Button */}
              <button
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className="py-2 px-4 rounded-[6px] bg-gradient-to-r from-[#D4AF37] to-[#AA8232] hover:brightness-110 text-[#0A0D12] text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_4px_16px_rgba(212,175,55,0.25)] cursor-pointer disabled:opacity-50"
              >
                {isDownloading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#1B1408] border-t-transparent rounded-full animate-spin" />
                    <span>Đang kết xuất...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>Tải Bộ Ảnh</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
