import React, { useState } from 'react';
import { Piece, PieceCategory, PieceVariant, StyleFilter, PresetOutfit } from '../types';
import { Sparkles, X, Check, BookOpen, Layers } from 'lucide-react';

interface PieceSelectorProps {
  pieces: Piece[];
  presets: PresetOutfit[];
  activeCategory: PieceCategory | 'presets';
  onSelectCategory: (category: PieceCategory | 'presets') => void;
  styleFilter: StyleFilter;
  onSelectStyle: (style: StyleFilter) => void;
  selectedPieces: {
    top?: PieceVariant;
    bottom?: PieceVariant;
    footwear?: PieceVariant;
    accessory?: PieceVariant;
  };
  onSelectVariant: (piece: Piece, variant: PieceVariant) => void;
  onClearAccessory: () => void;
  onSelectPreset: (preset: PresetOutfit) => void;
}

export const PieceSelector: React.FC<PieceSelectorProps> = ({
  pieces,
  presets,
  activeCategory,
  onSelectCategory,
  styleFilter,
  onSelectStyle,
  selectedPieces,
  onSelectVariant,
  onClearAccessory,
  onSelectPreset,
}) => {
  const [hoveredPiece, setHoveredPiece] = useState<Piece | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Filter pieces by active category & 3 styles (Tất cả, Cổ phong, Hiện đại)
  const filteredPieces = pieces.filter((p) => {
    if (activeCategory === 'presets') return false;
    if (p.category !== activeCategory) return false;
    if (styleFilter === 'all') return true;
    return p.style === styleFilter;
  });

  // Identify currently active piece and variant for the active category
  const currentActiveVariant =
    activeCategory === 'top'
      ? selectedPieces.top
      : activeCategory === 'bottom'
      ? selectedPieces.bottom
      : activeCategory === 'footwear'
      ? selectedPieces.footwear
      : selectedPieces.accessory;

  const currentActivePiece = currentActiveVariant
    ? pieces.find((p) => p.variants.some((v) => v.variantId === currentActiveVariant.variantId))
    : null;

  // Count pieces per style in current active category
  const categoryPieces = pieces.filter((p) => p.category === activeCategory);
  const countAll = categoryPieces.length;
  const countTraditional = categoryPieces.filter((p) => p.style === 'traditional').length;
  const countModern = categoryPieces.filter((p) => p.style === 'modern').length;

  const categories: {
    id: PieceCategory | 'presets';
    label: string;
    hasSelection?: boolean;
    icon?: React.ReactNode;
  }[] = [
    { id: 'top', label: 'Áo', hasSelection: !!selectedPieces.top },
    { id: 'bottom', label: 'Quần / Váy', hasSelection: !!selectedPieces.bottom },
    { id: 'footwear', label: 'Giày / Hài', hasSelection: !!selectedPieces.footwear },
    { id: 'accessory', label: 'Phụ kiện', hasSelection: !!selectedPieces.accessory },
    {
      id: 'presets',
      label: 'Gợi ý phối',
      icon: <Sparkles className="w-3.5 h-3.5 text-imperial-gold" />,
    },
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    // Keep tooltip visible within viewport boundaries
    const offset = 18;
    const tooltipWidth = 320;
    const tooltipHeight = 220;
    let x = e.clientX + offset;
    let y = e.clientY + offset;

    if (x + tooltipWidth > window.innerWidth) {
      x = e.clientX - tooltipWidth - 10;
    }
    if (y + tooltipHeight > window.innerHeight) {
      y = e.clientY - tooltipHeight - 10;
    }

    setTooltipPos({ x, y });
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-lacquer-card overflow-hidden font-sans relative">
      {/* Tier 1: Haute Atelier Category Tabs (Zero Shift, Hairline Active Underline, Status Dot) */}
      <div className="flex items-center border-b border-lacquer-border bg-lacquer-surface/90 overflow-x-auto scrollbar-none flex-shrink-0 h-12">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative h-full flex-1 min-w-[85px] sm:min-w-[100px] px-2.5 sm:px-3 text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? 'text-imperial-gold'
                  : 'text-silk-muted hover:text-silk-ivory hover:bg-lacquer-hover/40'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>

              {/* Status Dot: Subtle indicator if category already has a chosen piece on mannequin */}
              {cat.hasSelection && (
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    isActive ? 'bg-imperial-gold ring-2 ring-imperial-gold/30' : 'bg-imperial-gold/60'
                  }`}
                  title="Đã chọn trang phục này"
                />
              )}

              {/* Active Golden Hairline Indicator */}
              {isActive && (
                <span className="absolute bottom-0 inset-x-2 h-[2px] bg-imperial-gold shadow-[0_0_8px_rgba(198,155,86,0.8)] animate-fadeIn" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tier 2: Editorial Fashion Chips (Ultra-slim, Elegant, No Chunky Boxes) */}
      {activeCategory !== 'presets' ? (
        <div className="flex items-center justify-between px-4 sm:px-5 h-9 bg-lacquer/80 border-b border-lacquer-border/60 flex-shrink-0 text-xs font-sans">
          {/* Style Chips Links with Piece Counts */}
          <div className="flex items-center gap-3">
            <span className="text-silk-muted/60 text-[11px] font-medium hidden sm:inline">Lọc theo:</span>

            {/* Chip 1: Tất cả */}
            <button
              onClick={() => onSelectStyle('all')}
              className={`transition-colors flex items-center gap-1 ${
                styleFilter === 'all'
                  ? 'text-imperial-gold font-semibold underline decoration-imperial-gold/60 underline-offset-4'
                  : 'text-silk-muted hover:text-silk-ivory font-medium'
              }`}
            >
              <span>Tất cả</span>
              <span className="text-[10px] opacity-75 font-mono">({countAll})</span>
            </button>

            <span className="text-silk-muted/30 select-none">•</span>

            {/* Chip 2: Cổ phong */}
            <button
              onClick={() => onSelectStyle('traditional')}
              className={`transition-colors flex items-center gap-1 ${
                styleFilter === 'traditional'
                  ? 'text-imperial-gold font-semibold underline decoration-imperial-gold/60 underline-offset-4'
                  : 'text-silk-muted hover:text-silk-ivory font-medium'
              }`}
            >
              <span>Cổ phong</span>
              <span className="text-[10px] opacity-75 font-mono">({countTraditional})</span>
            </button>

            <span className="text-silk-muted/30 select-none">•</span>

            {/* Chip 3: Hiện đại */}
            <button
              onClick={() => onSelectStyle('modern')}
              className={`transition-colors flex items-center gap-1 ${
                styleFilter === 'modern'
                  ? 'text-imperial-gold font-semibold underline decoration-imperial-gold/60 underline-offset-4'
                  : 'text-silk-muted hover:text-silk-ivory font-medium'
              }`}
            >
              <span>Hiện đại</span>
              <span className="text-[10px] opacity-75 font-mono">({countModern})</span>
            </button>
          </div>

          {/* Accessory Clear Action (if active) */}
          {activeCategory === 'accessory' && selectedPieces.accessory && (
            <button
              onClick={onClearAccessory}
              className="flex items-center gap-1 text-[11px] font-medium text-imperial-red-bright hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Bỏ phụ kiện</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between px-4 sm:px-5 h-9 bg-lacquer/80 border-b border-lacquer-border/60 flex-shrink-0 text-xs font-sans">
          <span className="text-silk-muted text-[11px] font-medium flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-imperial-gold" />
            <span>Bộ phối chuẩn mẫu được thiết kế sẵn ({presets.length})</span>
          </span>
        </div>
      )}

      {/* Main Piece Selection Area (Gallery Grid) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5">
        {activeCategory === 'presets' ? (
          /* Presets List */
          <div className="grid grid-cols-1 gap-3">
            {presets.map((preset) => (
              <div
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="p-4 rounded-none bg-lacquer-surface border-2 border-lacquer-border hover:border-imperial-gold cursor-pointer transition-all group hover:bg-lacquer-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-sans font-bold text-base text-silk-ivory group-hover:text-imperial-gold transition-colors">
                      {preset.name}
                    </h4>
                    <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-none bg-imperial-gold/20 text-imperial-gold border border-imperial-gold/40">
                      {preset.style}
                    </span>
                  </div>
                  <p className="text-sm text-silk-muted leading-relaxed mb-3">
                    {preset.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-lacquer-border text-xs text-imperial-gold font-bold uppercase tracking-wider">
                  <span>Nhấn để nạp vào Studio</span>
                  <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* PURE VISUAL GALLERY: Only Piece Previews, perfectly uniform tiles, zero text clutter */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredPieces.map((piece) => {
              // Check if this piece is the one currently active in this category
              const isPieceActive = piece.variants.some((v) => v.variantId === currentActiveVariant?.variantId);
              // Use current variant image if active, otherwise piece default
              const displayVariant = isPieceActive
                ? currentActiveVariant
                : piece.variants[0];

              return (
                <div
                  key={piece.id}
                  onClick={() => {
                    if (!isPieceActive) {
                      onSelectVariant(piece, piece.variants[0]);
                    }
                  }}
                  onMouseEnter={(e) => {
                    setHoveredPiece(piece);
                    handleMouseMove(e);
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setHoveredPiece(null)}
                  className={`aspect-square w-full rounded-none border-2 transition-all flex items-center justify-center p-3 relative cursor-pointer group select-none ${
                    isPieceActive
                      ? 'bg-lacquer-surface border-imperial-gold shadow-lg ring-1 ring-imperial-gold/50'
                      : 'bg-lacquer/80 border-lacquer-border hover:border-silk-muted/70 hover:bg-lacquer-surface/60'
                  }`}
                  title={piece.name}
                >
                  {/* Selection Indicator Corner Badge */}
                  {isPieceActive && (
                    <div className="absolute top-1.5 right-1.5 z-10 w-5 h-5 bg-imperial-gold text-lacquer flex items-center justify-center shadow">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  {/* Clean Visual Preview (No text inside card) */}
                  <img
                    src={displayVariant?.thumbnailUrl || piece.thumbnailUrl || displayVariant?.assetUrl}
                    alt={piece.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ACTIVE PIECE INSPECTOR BAR: Fixed at bottom of selection area (above AI Overview) */}
      {activeCategory !== 'presets' && currentActivePiece && currentActiveVariant && (
        <div className="border-t-2 border-imperial-gold/60 bg-lacquer-surface p-3 sm:p-4 flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl animate-fadeIn">
          {/* Left: Active Piece Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-none border border-imperial-gold/50 p-1 bg-lacquer flex items-center justify-center flex-shrink-0">
              <img
                src={currentActiveVariant.thumbnailUrl || currentActivePiece.thumbnailUrl || currentActiveVariant.assetUrl}
                alt={currentActivePiece.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 bg-imperial-gold/20 text-imperial-gold border border-imperial-gold/40">
                  Đang chọn
                </span>
                <h4 className="font-sans font-bold text-base text-silk-ivory">
                  {currentActivePiece.name}
                </h4>
              </div>
              <p className="text-xs text-silk-muted font-medium mt-0.5">
                {currentActivePiece.culturalInfo.period.split('(')[0]}
              </p>
            </div>
          </div>

          {/* Right: Color Swatches & Color Name */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-silk-muted uppercase tracking-wider">Màu:</span>
              <div className="flex items-center gap-1.5">
                {currentActivePiece.variants.map((v) => {
                  const isSelectedSwatch = currentActiveVariant.variantId === v.variantId;
                  return (
                    <button
                      key={v.variantId}
                      onClick={() => onSelectVariant(currentActivePiece, v)}
                      className={`w-7 h-7 rounded-none border-2 transition-all relative flex items-center justify-center ${
                        isSelectedSwatch
                          ? 'border-imperial-gold ring-2 ring-imperial-gold/60 scale-110 shadow-sm'
                          : 'border-lacquer-border hover:scale-105'
                      }`}
                      style={{ backgroundColor: v.swatchHex }}
                      title={v.colorName}
                    >
                      {isSelectedSwatch && (
                        <Check className={`w-3.5 h-3.5 stroke-[3] ${v.swatchHex === '#F7F4EE' ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <span className="text-sm font-semibold text-imperial-gold px-2.5 py-1 bg-lacquer border border-lacquer-border">
              {currentActiveVariant.colorName}
            </span>

            {activeCategory === 'accessory' && (
              <button
                onClick={onClearAccessory}
                className="text-xs text-imperial-red-bright hover:text-white hover:bg-imperial-red/20 border border-imperial-red/40 px-2 py-1 font-bold uppercase tracking-wider transition-all"
                title="Bỏ chọn phụ kiện này"
              >
                Bỏ chọn
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Hover Tooltip: Tên, Giai đoạn, Ý nghĩa văn hóa, Nguồn kiểm chứng */}
      {hoveredPiece && (
        <div
          style={{ top: tooltipPos.y, left: tooltipPos.x }}
          className="fixed z-50 pointer-events-none max-w-sm w-80 bg-lacquer-card/95 backdrop-blur-md border-2 border-imperial-gold shadow-2xl p-4 text-xs font-sans text-silk-ivory space-y-2.5 rounded-none animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-lacquer-border">
            <h5 className="font-bold text-sm text-silk-ivory flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-imperial-gold" />
              <span>{hoveredPiece.name}</span>
            </h5>
            <span className="text-xs uppercase font-bold px-2 py-0.5 bg-imperial-gold/20 text-imperial-gold border border-imperial-gold/40">
              {hoveredPiece.style === 'traditional' ? 'Cổ phong' : 'Hiện đại'}
            </span>
          </div>

          <div>
            <span className="font-bold text-silk-muted block text-xs uppercase tracking-wider">Thời kỳ lịch sử:</span>
            <p className="text-silk-ivory font-medium mt-0.5">{hoveredPiece.culturalInfo.period}</p>
          </div>

          <div>
            <span className="font-bold text-silk-muted block text-xs uppercase tracking-wider">Ý nghĩa văn hóa:</span>
            <p className="text-silk-ivory/90 leading-relaxed mt-0.5 font-normal">{hoveredPiece.culturalInfo.meaning}</p>
          </div>

          <div>
            <span className="font-bold text-silk-muted block text-xs uppercase tracking-wider">Bối cảnh chuẩn mực:</span>
            <p className="text-silk-ivory/90 leading-relaxed mt-0.5 font-normal">{hoveredPiece.culturalInfo.context}</p>
          </div>

          <div className="pt-2 border-t border-lacquer-border text-xs text-imperial-gold font-medium">
            <span>Nguồn: </span>
            <span className="italic text-silk-ivory">{hoveredPiece.culturalInfo.source}</span>
          </div>
        </div>
      )}
    </div>
  );
};
