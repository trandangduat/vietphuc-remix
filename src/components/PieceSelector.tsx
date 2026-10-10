import React, { useState } from 'react';
import { Piece, PieceCategory, StyleFilter } from '../types';
import { Info, X, Check, BookOpen, Layers, Ban, Shirt, Columns2, Footprints, Crown, LayoutGrid, Gem } from 'lucide-react';
import { PieceInfoModal } from './PieceInfoModal';

// Oriental Needle Diamond Separator between Category Tabs
const TabSeparator: React.FC = () => (
  <div className="flex items-center justify-center px-0.5 sm:px-1 flex-shrink-0 pointer-events-none select-none" aria-hidden="true">
    <svg className="w-2.5 h-6 text-[#C5A059]/40" viewBox="0 0 10 24" fill="none" stroke="currentColor">
      <line x1="5" y1="2" x2="5" y2="7" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M5 8L8.5 12L5 16L1.5 12Z" strokeWidth="1.2" fill="currentColor" fillOpacity="0.25" />
      <circle cx="5" cy="12" r="1" fill="currentColor" />
      <line x1="5" y1="17" x2="5" y2="22" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  </div>
);

// Traditional Folding Fan Icon for Cổ phong filter pill
const FoldingFanIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.5 15C4.5 9 8 5 12 5C16 5 19.5 9 20.5 15L13.5 19.5C12.5 20.2 11.5 20.2 10.5 19.5L3.5 15Z" />
    <path d="M9 16.5C10 15.8 11 15.5 12 15.5C13 15.5 14 15.8 15 16.5" />
    <line x1="12" y1="15.5" x2="12" y2="5" />
    <line x1="10.5" y1="16" x2="7.5" y2="6.5" />
    <line x1="13.5" y1="16" x2="16.5" y2="6.5" />
    <line x1="9.5" y1="16.5" x2="5" y2="10" />
    <line x1="14.5" y1="16.5" x2="19" y2="10" />
    <circle cx="12" cy="20.5" r="1" fill="currentColor" />
  </svg>
);

interface PieceSelectorProps {
  pieces: Piece[];
  activeCategory: PieceCategory;
  onSelectCategory: (category: PieceCategory) => void;
  styleFilter: StyleFilter;
  onSelectStyle: (style: StyleFilter) => void;
  selectedPieces: {
    top?: Piece;
    bottom?: Piece;
    footwear?: Piece;
    accessory?: Piece;
  };
  onSelectPiece: (piece: Piece) => void;
  onSelectVariant?: (piece: Piece, variant: any) => void;
  onClearAccessory: () => void;
  onClearCategory: (category: PieceCategory) => void;
}

export const PieceSelector: React.FC<PieceSelectorProps> = ({
  pieces,
  activeCategory,
  onSelectCategory,
  styleFilter,
  onSelectStyle,
  selectedPieces,
  onSelectPiece,
  onSelectVariant,
  onClearAccessory,
  onClearCategory,
}) => {
  const [inspectedPiece, setInspectedPiece] = useState<Piece | null>(null);

  const handleSelect = (piece: Piece) => {
    if (onSelectPiece) {
      onSelectPiece(piece);
    } else if (onSelectVariant) {
      onSelectVariant(piece, piece);
    }
  };

  // Filter pieces by active category & 3 styles (Tất cả, Cổ phong, Hiện đại)
  const filteredPieces = pieces.filter((p) => {
    if (p.category !== activeCategory) return false;
    if (styleFilter === 'all') return true;
    return p.style === styleFilter;
  });

  // Identify currently active piece for the active category
  const currentActivePiece =
    activeCategory === 'top'
      ? selectedPieces.top
      : activeCategory === 'bottom'
      ? selectedPieces.bottom
      : activeCategory === 'footwear'
      ? selectedPieces.footwear
      : selectedPieces.accessory;

  // Count pieces per style in current active category
  const categoryPieces = pieces.filter((p) => p.category === activeCategory);
  const countAll = categoryPieces.length;
  const countTraditional = categoryPieces.filter((p) => p.style === 'traditional').length;
  const countModern = categoryPieces.filter((p) => p.style === 'modern').length;

  const categories = [
    {
      id: 'top' as const,
      label: 'Áo',
      hasSelection: !!selectedPieces.top,
      Icon: Shirt,
    },
    {
      id: 'bottom' as const,
      label: 'Quần / Váy',
      hasSelection: !!selectedPieces.bottom,
      Icon: Columns2,
    },
    {
      id: 'footwear' as const,
      label: 'Giày / Hài',
      hasSelection: !!selectedPieces.footwear,
      Icon: Footprints,
    },
    {
      id: 'accessory' as const,
      label: 'Phụ kiện',
      hasSelection: !!selectedPieces.accessory,
      Icon: Crown,
    },
  ];



  return (
    <div className="flex flex-col flex-1 min-h-0 bg-lacquer-card overflow-hidden font-sans relative">
      {/* Editorial Ambient Background Texture & Glows (Exact Match to Gallery / Lookbook Screen) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src="/assets/backgrounds/gallery-bg.jpg"
          alt="Trưng bày"
          className="w-full h-full object-cover opacity-20 filter grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-lacquer/85 via-lacquer/60 to-lacquer/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#0A0D12_90%)]" />
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-12 right-1/4 w-80 h-80 rounded-full bg-imperial-gold/10 filter blur-[90px]" />
        <div className="absolute bottom-16 left-1/4 w-80 h-80 rounded-full bg-imperial-red/10 filter blur-[90px]" />
        {/* Subtle royal Chim Lạc watermark */}
        <img
          src="/assets/decorations/chim-lac.png"
          alt=""
          className="absolute -bottom-10 -right-10 w-72 h-72 object-contain opacity-5 pointer-events-none select-none filter invert"
        />
      </div>

      {/* Decorative Top Accent Line with Diamond */}
      <div className="relative z-10 w-full flex items-center justify-center pt-2 px-3 flex-shrink-0">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent relative flex items-center justify-center">
          <div className="w-1.5 h-1.5 rotate-45 border border-[#C5A059]/60 bg-lacquer-card" />
        </div>
      </div>

      {/* Tier 1: Category Tabs with Clean Rectangle Active Highlight */}
      <div className="relative z-10 px-2 sm:px-3 pt-1.5 pb-2 flex-shrink-0 border-b border-[#C5A059]/15">
        <div className="flex items-center w-full overflow-x-auto no-scrollbar scrollbar-none gap-0.5 sm:gap-1 py-1 px-0.5">
          {categories.map((cat, index) => {
            const isActive = activeCategory === cat.id;
            const IconComponent = cat.Icon;

            return (
              <React.Fragment key={cat.id}>
                {index > 0 && <TabSeparator />}
                <button
                  onClick={() => onSelectCategory(cat.id)}
                  className={`relative flex-1 min-w-[76px] sm:min-w-[92px] h-10 sm:h-11 px-2 sm:px-3 rounded-md font-sans uppercase tracking-wider text-xs sm:text-[13px] transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap select-none cursor-pointer border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#F0D195] via-[#E5BA70] to-[#DCAB5E] text-[#1A140E] font-bold shadow-[0_2px_10px_rgba(229,186,112,0.3)] border-[#E5BA70]'
                      : 'bg-transparent text-[#EDE5D8]/75 hover:text-white hover:bg-white/[0.04] border-transparent font-medium'
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                    {/* Category icon with solid fill/stroke weight when active */}
                    <IconComponent
                      className={`w-4 h-4 sm:w-4.5 sm:h-4.5 flex-shrink-0 transition-all ${
                        isActive
                          ? 'text-[#1A140E] fill-current stroke-[2.2]'
                          : 'text-[#C5A059] fill-none stroke-[1.75]'
                      }`}
                    />

                    <span>{cat.label}</span>

                    {/* Status Dot: subtle indicator if category already has a chosen piece on mannequin */}
                    {cat.hasSelection && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          isActive
                            ? 'bg-[#1A140E] ring-2 ring-[#1A140E]/20'
                            : 'bg-[#D4AF37] ring-1 ring-[#D4AF37]/40'
                        }`}
                        title="Đã chọn trang phục này"
                      />
                    )}
                  </span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Tier 2: Refined Fashion Filter Pills */}
      <div className="relative z-10 flex items-center justify-between px-3 sm:px-4 py-2.5 flex-shrink-0 text-xs font-sans bg-lacquer-surface/40 backdrop-blur-sm border-b border-[#C5A059]/10">
          {/* Style Chips Links with Piece Counts & Dedicated Reference Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Pill 1: Tất cả */}
            <button
              onClick={() => onSelectStyle('all')}
              className={`px-3.5 sm:px-4 py-1.5 text-xs font-sans rounded-full border transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                styleFilter === 'all'
                  ? 'bg-gradient-to-r from-[#F0D195] via-[#E5BA70] to-[#DCAB5E] text-[#1A140E] font-bold shadow-[0_2px_10px_rgba(212,175,55,0.35)] border-[#E5BA70]'
                  : 'bg-lacquer-card/80 text-[#EDE5D8]/90 hover:text-white border-white/20 hover:border-[#E5BA70]/50 hover:bg-white/[0.06]'
              }`}
            >
              <LayoutGrid className={`w-3.5 h-3.5 flex-shrink-0 ${styleFilter === 'all' ? 'text-[#1A140E] fill-current' : 'text-[#C5A059]'}`} />
              <span>Tất cả</span>
              <span className={`text-[11px] font-mono ${styleFilter === 'all' ? 'text-[#1A140E]/80 font-bold' : 'text-[#EDE5D8]/60'}`}>
                ({countAll})
              </span>
            </button>

            {/* Pill 2: Cổ phong */}
            <button
              onClick={() => onSelectStyle('traditional')}
              className={`px-3.5 sm:px-4 py-1.5 text-xs font-sans rounded-full border transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                styleFilter === 'traditional'
                  ? 'bg-gradient-to-r from-[#F0D195] via-[#E5BA70] to-[#DCAB5E] text-[#1A140E] font-bold shadow-[0_2px_10px_rgba(212,175,55,0.35)] border-[#E5BA70]'
                  : 'bg-lacquer-card/80 text-[#EDE5D8]/90 hover:text-white border-white/20 hover:border-[#E5BA70]/50 hover:bg-white/[0.06]'
              }`}
            >
              <FoldingFanIcon className={`w-3.5 h-3.5 flex-shrink-0 ${styleFilter === 'traditional' ? 'text-[#1A140E]' : 'text-[#C5A059]'}`} />
              <span>Cổ phong</span>
              <span className={`text-[11px] font-mono ${styleFilter === 'traditional' ? 'text-[#1A140E]/80 font-bold' : 'text-[#EDE5D8]/60'}`}>
                ({countTraditional})
              </span>
            </button>

            {/* Pill 3: Hiện đại */}
            <button
              onClick={() => onSelectStyle('modern')}
              className={`px-3.5 sm:px-4 py-1.5 text-xs font-sans rounded-full border transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                styleFilter === 'modern'
                  ? 'bg-gradient-to-r from-[#F0D195] via-[#E5BA70] to-[#DCAB5E] text-[#1A140E] font-bold shadow-[0_2px_10px_rgba(212,175,55,0.35)] border-[#E5BA70]'
                  : 'bg-lacquer-card/80 text-[#EDE5D8]/90 hover:text-white border-white/20 hover:border-[#E5BA70]/50 hover:bg-white/[0.06]'
              }`}
            >
              <Gem className={`w-3.5 h-3.5 flex-shrink-0 ${styleFilter === 'modern' ? 'text-[#1A140E] fill-current' : 'text-[#C5A059]'}`} />
              <span>Hiện đại</span>
              <span className={`text-[11px] font-mono ${styleFilter === 'modern' ? 'text-[#1A140E]/80 font-bold' : 'text-[#EDE5D8]/60'}`}>
                ({countModern})
              </span>
            </button>
          </div>

          {/* Right side: Accessory Clear Action (if active) */}
          {activeCategory === 'accessory' && selectedPieces.accessory && (
            <button
              onClick={onClearAccessory}
              className="flex items-center gap-1 rounded-full px-2.5 py-0.5 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-500/40 text-rose-300 text-[11px] font-medium transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Bỏ phụ kiện</span>
            </button>
          )}
        </div>

      {/* Main Piece Selection Area (Gallery Grid) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {/* PURE VISUAL GALLERY: Compact uniform tiles with Option 0: Không chọn gì cả */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 xl:grid-cols-5 gap-2.5">
            {/* OPTION 0: Không chọn gì cả (Default selection) */}
            <div
              onClick={() => onClearCategory(activeCategory)}
              className={`aspect-square w-full rounded-none border-2 transition-all flex flex-col items-center justify-center p-2 relative cursor-pointer group select-none ${
                !currentActivePiece
                  ? 'bg-lacquer-surface border-imperial-gold shadow-lg ring-1 ring-imperial-gold/50'
                  : 'bg-lacquer/80 border-lacquer-border hover:border-silk-muted/70 hover:bg-lacquer-surface/60'
              }`}
              title={`Không mặc ${
                activeCategory === 'top'
                  ? 'áo'
                  : activeCategory === 'bottom'
                  ? 'quần'
                  : activeCategory === 'footwear'
                  ? 'giày'
                  : 'phụ kiện'
              }`}
            >
              {/* Selection Indicator Corner Badge */}
              {!currentActivePiece && (
                <div className="absolute top-1.5 right-1.5 z-10 w-4 h-4 bg-imperial-gold text-lacquer flex items-center justify-center shadow">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <div className="flex flex-col items-center justify-center gap-1.5">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-dashed flex items-center justify-center transition-colors ${
                    !currentActivePiece
                      ? 'border-imperial-gold text-imperial-gold bg-imperial-gold/10'
                      : 'border-silk-muted/40 text-silk-muted group-hover:text-silk-ivory group-hover:border-silk-muted'
                  }`}
                >
                  <Ban className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span
                  className={`text-[10px] sm:text-[11px] font-medium transition-colors text-center ${
                    !currentActivePiece
                      ? 'text-imperial-gold font-semibold'
                      : 'text-silk-muted group-hover:text-silk-ivory'
                  }`}
                >
                  Không chọn
                </span>
              </div>
            </div>

            {filteredPieces.map((piece) => {
              // Check if this piece is the one currently active in this category
              const isPieceActive = currentActivePiece?.id === piece.id;

              return (
                <div
                  key={piece.id}
                  onClick={() => {
                    if (!isPieceActive) {
                      handleSelect(piece);
                    }
                  }}
                  className={`aspect-square w-full rounded-none border-2 transition-colors duration-100 flex items-center justify-center p-2 relative cursor-pointer group select-none ${
                    isPieceActive
                      ? 'bg-lacquer-surface border-imperial-gold shadow-lg ring-1 ring-imperial-gold/50'
                      : 'bg-lacquer/80 border-lacquer-border hover:border-silk-muted/70 hover:bg-lacquer-surface/60'
                  }`}
                  title={piece.name}
                >
                  {/* Selection Indicator Corner Badge */}
                  {isPieceActive && (
                    <div className="absolute top-1.5 right-1.5 z-10 w-4 h-4 bg-imperial-gold text-lacquer flex items-center justify-center shadow">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  {/* Nút Thông tin (Hiện khi di chuột vào piece) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInspectedPiece(piece);
                    }}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-150 absolute top-1.5 left-1.5 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/90 hover:bg-[#C5A059] text-[#EDE5D8] hover:text-[#0A0D12] border border-[#C5A059]/70 hover:border-[#F0D195] shadow-[0_2px_8px_rgba(0,0,0,0.85)] text-[10px] sm:text-[11px] font-sans font-semibold tracking-wide backdrop-blur-md cursor-pointer active:scale-95"
                    title={`Xem thông tin nguồn gốc & ý nghĩa của ${piece.name}`}
                  >
                    <Info className="w-3 h-3 flex-shrink-0" />
                    <span>Thông tin</span>
                  </button>

                  {/* Clean Visual Preview (No text inside card) */}
                  <img
                    src={piece.thumbnailUrl || piece.assetUrl}
                    alt={piece.name}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-100"
                  />
                </div>
              );
            })}
          </div>
      </div>



      {/* Popup Modal chi tiết thông tin piece, nguồn gốc, ý nghĩa & nguồn tham khảo */}
      <PieceInfoModal
        piece={inspectedPiece}
        isOpen={Boolean(inspectedPiece)}
        onClose={() => setInspectedPiece(null)}
        onSelectPiece={handleSelect}
        isEquipped={Boolean(
          inspectedPiece &&
            (currentActivePiece?.id === inspectedPiece.id ||
              selectedPieces.top?.id === inspectedPiece.id ||
              selectedPieces.bottom?.id === inspectedPiece.id ||
              selectedPieces.footwear?.id === inspectedPiece.id ||
              selectedPieces.accessory?.id === inspectedPiece.id)
        )}
      />
    </div>
  );
};
