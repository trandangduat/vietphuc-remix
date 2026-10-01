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
      {/* 5 Main Tabs Flush at Header */}
      <div className="flex items-center border-b-2 border-lacquer-border bg-lacquer-surface overflow-x-auto scrollbar-none flex-shrink-0">
        <button
          onClick={() => onSelectCategory('top')}
          className={`flex-1 min-w-[80px] py-3.5 px-3 text-sm font-semibold transition-all border-b-2 text-center whitespace-nowrap uppercase tracking-wider ${
            activeCategory === 'top'
              ? 'border-imperial-gold text-imperial-gold bg-imperial-gold/15 font-bold'
              : 'border-transparent text-silk-muted hover:text-silk-ivory hover:bg-lacquer-hover'
          }`}
        >
          Áo
        </button>
        <button
          onClick={() => onSelectCategory('bottom')}
          className={`flex-1 min-w-[95px] py-3.5 px-3 text-sm font-semibold transition-all border-b-2 text-center whitespace-nowrap uppercase tracking-wider ${
            activeCategory === 'bottom'
              ? 'border-imperial-gold text-imperial-gold bg-imperial-gold/15 font-bold'
              : 'border-transparent text-silk-muted hover:text-silk-ivory hover:bg-lacquer-hover'
          }`}
        >
          Quần / Váy
        </button>
        <button
          onClick={() => onSelectCategory('footwear')}
          className={`flex-1 min-w-[85px] py-3.5 px-3 text-sm font-semibold transition-all border-b-2 text-center whitespace-nowrap uppercase tracking-wider ${
            activeCategory === 'footwear'
              ? 'border-imperial-gold text-imperial-gold bg-imperial-gold/15 font-bold'
              : 'border-transparent text-silk-muted hover:text-silk-ivory hover:bg-lacquer-hover'
          }`}
        >
          Giày / Dép
        </button>
        <button
          onClick={() => onSelectCategory('accessory')}
          className={`flex-1 min-w-[90px] py-3.5 px-3 text-sm font-semibold transition-all border-b-2 text-center whitespace-nowrap uppercase tracking-wider ${
            activeCategory === 'accessory'
              ? 'border-imperial-gold text-imperial-gold bg-imperial-gold/15 font-bold'
              : 'border-transparent text-silk-muted hover:text-silk-ivory hover:bg-lacquer-hover'
          }`}
        >
          Phụ kiện
        </button>
        <button
          onClick={() => onSelectCategory('presets')}
          className={`flex-1 min-w-[110px] py-3.5 px-3 text-sm font-semibold transition-all border-b-2 text-center whitespace-nowrap flex items-center justify-center gap-1.5 uppercase tracking-wider ${
            activeCategory === 'presets'
              ? 'border-imperial-gold text-imperial-gold-light bg-gradient-to-r from-imperial-red/25 to-imperial-gold/15 font-bold'
              : 'border-transparent text-silk-muted hover:text-silk-ivory hover:bg-lacquer-hover'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-imperial-gold" />
          <span>Gợi ý phối</span>
        </button>
      </div>

      {/* Secondary Controls Bar: ONLY 3 Style Filters (Tất cả, Cổ phong, Hiện đại) */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 bg-lacquer/70 border-b border-lacquer-border flex-wrap gap-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-silk-muted mr-1 font-bold uppercase tracking-wider">Phong cách:</span>
          {(['all', 'traditional', 'modern'] as StyleFilter[]).map((style) => (
            <button
              key={style}
              onClick={() => onSelectStyle(style)}
              className={`px-3 py-1 rounded-none text-xs transition-all font-bold border uppercase tracking-wider ${
                styleFilter === style
                  ? 'bg-imperial-gold text-lacquer border-imperial-gold shadow-sm'
                  : 'bg-lacquer-surface text-silk-muted hover:text-silk-ivory border-lacquer-border'
              }`}
            >
              {style === 'all'
                ? 'Tất cả'
                : style === 'traditional'
                ? 'Cổ phong'
                : 'Hiện đại'}
            </button>
          ))}
        </div>

        {activeCategory === 'accessory' && selectedPieces.accessory && (
          <button
            onClick={onClearAccessory}
            className="flex items-center gap-1.5 px-3 py-1 rounded-none text-xs font-bold text-imperial-red-bright hover:bg-imperial-red/15 border border-imperial-red/40 transition-all uppercase"
          >
            <X className="w-3.5 h-3.5" />
            <span>Bỏ phụ kiện</span>
          </button>
        )}
      </div>

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
