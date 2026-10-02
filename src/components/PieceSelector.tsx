import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Piece, PieceCategory, StyleFilter, PresetOutfit } from '../types';
import { Sparkles, X, Check, BookOpen, Layers, Ban } from 'lucide-react';
import { HeritageCulturalCard } from './heritage/HeritageCulturalCard';

interface PieceSelectorProps {
  pieces: Piece[];
  presets: PresetOutfit[];
  activeCategory: PieceCategory | 'presets';
  onSelectCategory: (category: PieceCategory | 'presets') => void;
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
  onSelectPiece,
  onSelectVariant,
  onClearAccessory,
  onClearCategory,
  onSelectPreset,
}) => {
  const [hoveredPiece, setHoveredPiece] = useState<Piece | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnterPiece = useCallback((piece: Piece, e: React.MouseEvent<HTMLDivElement>) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    const target = e.currentTarget;
    hoverTimeoutRef.current = setTimeout(() => {
      const rect = target.getBoundingClientRect();
      const tooltipWidth = 350;
      const tooltipHeight = 360;

      let x = rect.right + 12;
      // If overflowing right side, flip to left of card
      if (x + tooltipWidth > window.innerWidth - 12) {
        x = rect.left - tooltipWidth - 12;
      }
      // If screen is narrow
      if (x < 10) {
        x = Math.max(10, (window.innerWidth - tooltipWidth) / 2);
      }

      // Vertical alignment: aligned with card, clamped within viewport
      let y = rect.top + rect.height / 2 - 80;
      if (y + tooltipHeight > window.innerHeight - 12) {
        y = window.innerHeight - tooltipHeight - 12;
      }
      if (y < 12) {
        y = 12;
      }

      setTooltipPos({ x, y });
      setHoveredPiece(piece);
    }, 35);
  }, []);

  const handleMouseLeavePiece = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredPiece(null);
  }, []);

  const handleSelect = (piece: Piece) => {
    if (onSelectPiece) {
      onSelectPiece(piece);
    } else if (onSelectVariant) {
      onSelectVariant(piece, piece);
    }
  };

  // Filter pieces by active category & 3 styles (Tất cả, Cổ phong, Hiện đại)
  const filteredPieces = pieces.filter((p) => {
    if (activeCategory === 'presets') return false;
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
          /* PURE VISUAL GALLERY: Compact uniform tiles with Option 0: Không chọn gì cả */
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
                  onMouseEnter={(e) => handleMouseEnterPiece(piece, e)}
                  onMouseLeave={handleMouseLeavePiece}
                  className={`aspect-square w-full rounded-none border-2 transition-all flex items-center justify-center p-2 relative cursor-pointer group select-none ${
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

                  {/* Clean Visual Preview (No text inside card) */}
                  <img
                    src={piece.thumbnailUrl || piece.assetUrl}
                    alt={piece.name}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Hover Tooltip: Tên, Giai đoạn, Ý nghĩa văn hóa, Nguồn kiểm chứng (Exact Match to Heritage Design) */}
      {hoveredPiece && (
        <div
          style={{
            transform: `translate3d(${tooltipPos.x}px, ${tooltipPos.y}px, 0)`,
            top: 0,
            left: 0,
            willChange: 'transform',
          }}
          className="fixed z-50 pointer-events-none max-w-sm w-[350px] animate-in fade-in duration-100"
        >
          <HeritageCulturalCard piece={hoveredPiece} />
        </div>
      )}
    </div>
  );
};
