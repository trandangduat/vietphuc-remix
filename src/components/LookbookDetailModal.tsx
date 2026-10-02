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

  // Dynamic color palette adapting to outfit pieces
  const isBlueTop = topPiece?.id?.includes('xanh') || topPiece?.name?.toLowerCase().includes('xanh');
  const isRedTop = topPiece?.id?.includes('do') || topPiece?.name?.toLowerCase().includes('đỏ');

  const colors = [
    {
      hex: outfit.colorPalette?.[0] || (isBlueTop ? '#1A4B54' : '#7D1128'),
      name: isBlueTop ? 'Xanh cổ vịt' : isRedTop ? 'Đỏ đô' : 'Sắc chủ đạo',
      part: `(${topPiece?.name || 'áo tấc'})`,
    },
    {
      hex: outfit.colorPalette?.[2] || '#B89758',
      name: 'Vàng cổ',
      part: '(thêu)',
    },
    {
      hex: outfit.colorPalette?.[1] || (bottomPiece?.name?.includes('tây') ? '#374151' : '#EAE4D9'),
      name: bottomPiece?.name?.includes('tây') ? 'Xám trầm' : 'Ngà',
      part: `(${bottomPiece?.name || 'quần lĩnh'})`,
    },
  ];

  // Alignments for 2D composite
  const bottomAlign = getPieceAlignment(bottomPiece?.id);
  const footwearAlign = getPieceAlignment(footwearPiece?.id);
  const topAlign = getPieceAlignment(topPiece?.id);
  const accessoryAlign = getPieceAlignment(accessoryPiece?.id || 'piece-non-la');

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
      {/* Outer Floating Modal Shell */}
      <div
        className="w-full max-w-7xl max-h-[96vh] flex flex-col bg-[#0A0D12] border-2 border-imperial-gold/80 shadow-[0_24px_80px_rgba(0,0,0,0.98)] overflow-hidden relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Top-Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-40 w-8 h-8 rounded-full bg-black/70 hover:bg-black/95 border border-white/20 hover:border-imperial-gold text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg print:hidden"
          title="Đóng (ESC)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Delete Lookbook discreet button */}
        <button
          onClick={() => {
            if (window.confirm(`Bạn có chắc chắn muốn xóa Lookbook "${lookbook.title}" không?`)) {
              onDeleteLookbook(lookbook.id);
              onClose();
            }
          }}
          className="absolute top-3.5 right-13 z-40 w-8 h-8 rounded-full bg-black/70 hover:bg-rose-950/80 border border-white/20 hover:border-rose-500/60 text-white/60 hover:text-rose-400 flex items-center justify-center transition-all cursor-pointer shadow-lg print:hidden"
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
          {/* LEFT HALF (56%): CINEMATIC SCENE & MANNEQUIN STANDING          */}
          {/* ============================================================ */}
          <div className="relative w-full lg:w-[56%] min-h-[500px] lg:min-h-full flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-[#D4AF37]/20">
            {/* 1. Atmospheric Background (Serene Ancient Town with Glowing Lanterns & River) */}
            <img
              src="/assets/lookbook/editorial-bg.jpg"
              alt="Phố cổ Hội An hoàng hôn"
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-95 contrast-105 select-none pointer-events-none"
            />

            {/* Subtle Gradient Overlays for Fashion Editorial Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />
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
                {/* Soft Ground Shadow underneath mannequin on cobblestones */}
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

                {/* Layer 5: Phụ kiện (Z=50) - Nón lá truyền thống đội trên đầu mannequin */}
                <div
                  className="absolute inset-0 z-50 pointer-events-none"
                  style={
                    accessoryPiece?.assetUrl
                      ? getAlignmentStyle(accessoryAlign)
                      : getAlignmentStyle(getPieceAlignment('piece-non-la'))
                  }
                >
                  <img
                    src={accessoryPiece?.assetUrl || '/assets/pieces/accessories/acc-non-la-traditional.png'}
                    alt={accessoryPiece?.name || 'Nón lá truyền thống'}
                    className="w-full h-full object-contain filter drop-shadow-[0_8px_18px_rgba(0,0,0,0.7)]"
                  />
                </div>
              </div>
            )}

            {/* 3. Text Overlay on Left Side (MATCHING USER REFERENCE DESIGN) */}
            <div className="absolute top-10 sm:top-14 left-7 sm:left-11 z-20 flex flex-col items-start select-none pointer-events-none max-w-[55%]">
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

              {/* SECTION 2: BẢNG MÀU */}
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
                {/* Left: CHI TIẾT TRANG PHỤC (3 Macro Photography Close-up Cards) */}
                <div className="space-y-2">
                  <h4 className="font-serif font-black text-[11px] uppercase tracking-wider text-[#E8C87B]">
                    CHI TIẾT TRANG PHỤC
                  </h4>

                  <div className="grid grid-cols-3 gap-2">
                    {/* Detail 1: Cổ áo thêu hoa văn */}
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square rounded-xl bg-black/60 border border-[#D4AF37]/50 p-0.5 overflow-hidden shadow-md group">
                        <img
                          src="/assets/lookbook/detail-collar.jpg"
                          alt="Cổ áo thêu hoa văn"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-lg"
                        />
                      </div>
                      <span className="text-[9px] font-serif text-[#F7F4EE]/90 text-center mt-1 leading-tight line-clamp-2">
                        Cổ áo thêu hoa văn
                      </span>
                    </div>

                    {/* Detail 2: Tay áo rộng, thêu viền */}
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square rounded-xl bg-black/60 border border-[#D4AF37]/50 p-0.5 overflow-hidden shadow-md group">
                        <img
                          src="/assets/lookbook/detail-sleeve.jpg"
                          alt="Tay áo rộng thêu viền"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-lg"
                        />
                      </div>
                      <span className="text-[9px] font-serif text-[#F7F4EE]/90 text-center mt-1 leading-tight line-clamp-2">
                        Tay áo rộng, thêu viền
                      </span>
                    </div>

                    {/* Detail 3: Hài thêu truyền thống */}
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square rounded-xl bg-black/60 border border-[#D4AF37]/50 p-0.5 overflow-hidden shadow-md group">
                        <img
                          src="/assets/lookbook/detail-shoes.jpg"
                          alt="Hài thêu truyền thống"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-lg"
                        />
                      </div>
                      <span className="text-[9px] font-serif text-[#F7F4EE]/90 text-center mt-1 leading-tight line-clamp-2">
                        Hài thêu truyền thống
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: THÀNH PHẦN OUTFIT */}
                <div className="space-y-2 border-t sm:border-t-0 sm:border-l border-[#D4AF37]/20 sm:pl-3">
                  <h4 className="font-serif font-black text-[11px] uppercase tracking-wider text-[#E8C87B]">
                    THÀNH PHẦN OUTFIT
                  </h4>

                  <ul className="space-y-1.5 text-xs text-[#F7F4EE]/90 font-serif">
                    <li className="flex items-center gap-2 truncate">
                      <span className="w-4 text-center text-[#D4AF37]">👘</span>
                      <span className="truncate">{topPiece?.name || 'Áo tấc đỏ đô'}</span>
                    </li>
                    <li className="flex items-center gap-2 truncate">
                      <span className="w-4 text-center text-[#D4AF37]">👖</span>
                      <span className="truncate">{bottomPiece?.name || 'Quần lĩnh màu ngà'}</span>
                    </li>
                    <li className="flex items-center gap-2 truncate">
                      <span className="w-4 text-center text-[#D4AF37]">🥿</span>
                      <span className="truncate">{footwearPiece?.name || 'Hài thêu truyền thống'}</span>
                    </li>
                    <li className="flex items-center gap-2 truncate">
                      <span className="w-4 text-center text-[#D4AF37]">👒</span>
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
                className="py-2.5 px-3.5 bg-black/60 hover:bg-black/90 border border-[#D4AF37]/60 hover:border-[#D4AF37] text-xs font-serif font-bold text-[#E8C87B] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="In hoặc Lưu PDF"
              >
                <Printer className="w-3.5 h-3.5 text-[#E8C87B]" />
                <span className="hidden sm:inline">In / PDF</span>
              </button>

              {/* Load into Studio Button */}
              <button
                onClick={() => {
                  onLoadOutfitIntoStudio(outfit);
                  onClose();
                }}
                className="py-2.5 px-4 bg-transparent hover:bg-[#D4AF37]/10 border border-[#D4AF37]/80 hover:border-[#D4AF37] text-xs font-serif font-bold uppercase tracking-wider text-[#F7F4EE] flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#E8C87B]" />
                <span>Mở Trong Studio</span>
              </button>

              {/* Download PNG Button */}
              <button
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className="py-2.5 px-5 bg-gradient-to-r from-[#D4AF37] via-[#F2DCA5] to-[#D4AF37] hover:brightness-110 text-[#1B1408] text-xs font-serif font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_4px_18px_rgba(212,175,55,0.45)] cursor-pointer disabled:opacity-50"
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
