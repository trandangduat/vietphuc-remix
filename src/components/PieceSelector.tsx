import React, { useState } from 'react';
import { Piece, PieceCategory, PieceVariant, StyleFilter, PresetOutfit, CulturalInfo } from '../types';
import { Sparkles, Info, X, Check, BookOpen } from 'lucide-react';

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
  const [selectedCulturalInfo, setSelectedCulturalInfo] = useState<{ name: string; info: CulturalInfo } | null>(null);

  // Filter pieces by active category & style
  const filteredPieces = pieces.filter((p) => {
    if (activeCategory === 'presets') return false;
    if (p.category !== activeCategory) return false;
    if (styleFilter === 'all') return true;
    return p.style === styleFilter;
  });

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-lacquer-card overflow-hidden font-sans">
      {/* 5 Main Tabs Flush at Header (Wireframe SCR-02) */}
      <div className="flex items-center border-b-2 border-lacquer-border bg-lacquer-surface overflow-x-auto scrollbar-none flex-shrink-0">
        <button
          onClick={() => onSelectCategory('top')}
          className={`flex-1 min-w-[85px] py-4 px-4 text-xs sm:text-sm font-bold transition-all border-b-2 text-center whitespace-nowrap uppercase tracking-wider ${
            activeCategory === 'top'
              ? 'border-imperial-gold text-imperial-gold bg-imperial-gold/15'
              : 'border-transparent text-silk-muted hover:text-silk-ivory hover:bg-lacquer-hover'
          }`}
        >
          Áo
        </button>
        <button
          onClick={() => onSelectCategory('bottom')}
          className={`flex-1 min-w-[105px] py-4 px-4 text-xs sm:text-sm font-bold transition-all border-b-2 text-center whitespace-nowrap uppercase tracking-wider ${
            activeCategory === 'bottom'
              ? 'border-imperial-gold text-imperial-gold bg-imperial-gold/15'
              : 'border-transparent text-silk-muted hover:text-silk-ivory hover:bg-lacquer-hover'
          }`}
        >
          Quần / Váy
        </button>
        <button
          onClick={() => onSelectCategory('footwear')}
          className={`flex-1 min-w-[95px] py-4 px-4 text-xs sm:text-sm font-bold transition-all border-b-2 text-center whitespace-nowrap uppercase tracking-wider ${
            activeCategory === 'footwear'
              ? 'border-imperial-gold text-imperial-gold bg-imperial-gold/15'
              : 'border-transparent text-silk-muted hover:text-silk-ivory hover:bg-lacquer-hover'
          }`}
        >
          Giày / Dép
        </button>
        <button
          onClick={() => onSelectCategory('accessory')}
          className={`flex-1 min-w-[100px] py-4 px-4 text-xs sm:text-sm font-bold transition-all border-b-2 text-center whitespace-nowrap uppercase tracking-wider ${
            activeCategory === 'accessory'
              ? 'border-imperial-gold text-imperial-gold bg-imperial-gold/15'
              : 'border-transparent text-silk-muted hover:text-silk-ivory hover:bg-lacquer-hover'
          }`}
        >
          Phụ kiện
        </button>
        <button
          onClick={() => onSelectCategory('presets')}
          className={`flex-1 min-w-[120px] py-4 px-4 text-xs sm:text-sm font-bold transition-all border-b-2 text-center whitespace-nowrap flex items-center justify-center gap-2 uppercase tracking-wider ${
            activeCategory === 'presets'
              ? 'border-imperial-gold text-imperial-gold-light bg-gradient-to-r from-imperial-red/25 to-imperial-gold/15'
              : 'border-transparent text-silk-muted hover:text-silk-ivory hover:bg-lacquer-hover'
          }`}
        >
          <Sparkles className="w-4 h-4 text-imperial-gold" />
          <span>Gợi ý phối</span>
        </button>
      </div>

      {/* Secondary Controls Bar: Style Filters & Clear Accessory Button */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-lacquer/60 border-b border-lacquer-border flex-wrap gap-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-silk-muted mr-1 font-semibold uppercase tracking-wider">Phong cách:</span>
          {(['all', 'traditional', 'modern', 'remix'] as StyleFilter[]).map((style) => (
            <button
              key={style}
              onClick={() => onSelectStyle(style)}
              className={`px-3.5 py-1.5 rounded-none text-xs sm:text-sm transition-all font-bold border ${
                styleFilter === style
                  ? 'bg-imperial-gold text-lacquer border-imperial-gold shadow-sm'
                  : 'bg-lacquer-surface text-silk-muted hover:text-silk-ivory border-lacquer-border'
              }`}
            >
              {style === 'all'
                ? 'Tất cả'
                : style === 'traditional'
                ? 'Cổ phong'
                : style === 'modern'
                ? 'Hiện đại'
                : 'Remix'}
            </button>
          ))}
        </div>

        {activeCategory === 'accessory' && selectedPieces.accessory && (
          <button
            onClick={onClearAccessory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs sm:text-sm font-bold text-imperial-red-bright hover:bg-imperial-red/15 border border-imperial-red/40 transition-all uppercase"
          >
            <X className="w-3.5 h-3.5" />
            <span>Bỏ phụ kiện</span>
          </button>
        )}
      </div>

      {/* Pieces & Presets Scrollable Grid Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {activeCategory === 'presets' ? (
          /* Presets List */
          <div className="grid grid-cols-1 gap-3.5">
            {presets.map((preset) => (
              <div
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="p-5 rounded-none bg-lacquer-surface border-2 border-lacquer-border hover:border-imperial-gold cursor-pointer transition-all group hover:bg-lacquer-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-sans font-bold text-base sm:text-lg text-silk-ivory group-hover:text-imperial-gold transition-colors">
                      {preset.name}
                    </h4>
                    <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-none bg-imperial-gold/20 text-imperial-gold border border-imperial-gold/40">
                      {preset.style}
                    </span>
                  </div>
                  <p className="text-sm text-silk-muted leading-relaxed mb-4">
                    {preset.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-lacquer-border text-sm text-imperial-gold font-bold uppercase tracking-wider">
                  <span>Nhấn để nạp vào Studio</span>
                  <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Pieces Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredPieces.map((piece) => {
              // Check if any variant of this piece is currently active
              const activeVariantId =
                activeCategory === 'top'
                  ? selectedPieces.top?.variantId
                  : activeCategory === 'bottom'
                  ? selectedPieces.bottom?.variantId
                  : activeCategory === 'footwear'
                  ? selectedPieces.footwear?.variantId
                  : selectedPieces.accessory?.variantId;

              const isPieceActive = piece.variants.some((v) => v.variantId === activeVariantId);

              return (
                <div
                  key={piece.id}
                  className={`p-4 rounded-none border-2 transition-all flex flex-col justify-between relative group ${
                    isPieceActive
                      ? 'bg-lacquer-surface border-imperial-gold shadow-md ring-1 ring-imperial-gold/40'
                      : 'bg-lacquer-surface/70 border-lacquer-border hover:border-silk-muted/60 hover:bg-lacquer-surface'
                  }`}
                >
                  <div>
                    {/* Top Row: Title & Info Trigger */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-sans text-base font-bold text-silk-ivory">
                          {piece.name}
                        </h4>
                        <span className="text-xs text-silk-muted block font-medium mt-0.5">
                          {piece.culturalInfo.period}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCulturalInfo({ name: piece.name, info: piece.culturalInfo });
                        }}
                        className="p-1.5 rounded-none text-silk-muted hover:text-imperial-gold hover:bg-lacquer-border/40 transition-all border border-transparent hover:border-lacquer-border"
                        title="Xem nguồn gốc & ý nghĩa văn hóa"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Preview Thumbnail */}
                    <div className="w-full aspect-[4/3] rounded-none bg-lacquer flex items-center justify-center overflow-hidden my-2 border border-lacquer-border p-3">
                      <img
                        src={piece.thumbnailUrl || piece.variants[0].assetUrl}
                        alt={piece.name}
                        className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                      />
                    </div>
                  </div>

                  {/* Swatches Selector (Vintage square textile chips) */}
                  <div className="pt-3 border-t border-lacquer-border flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-silk-muted font-bold">Màu sắc:</span>
                    <div className="flex items-center gap-2">
                      {piece.variants.map((v) => {
                        const isSelected = activeVariantId === v.variantId;
                        return (
                          <button
                            key={v.variantId}
                            onClick={() => onSelectVariant(piece, v)}
                            className={`w-7 h-7 rounded-none border-2 transition-all relative flex items-center justify-center ${
                              isSelected
                                ? 'border-imperial-gold ring-2 ring-imperial-gold/50 scale-110 shadow-sm'
                                : 'border-lacquer-border hover:scale-105'
                            }`}
                            style={{ backgroundColor: v.swatchHex }}
                            title={v.colorName}
                          >
                            {isSelected && (
                              <Check className={`w-3.5 h-3.5 ${v.swatchHex === '#F7F4EE' ? 'text-black' : 'text-white'}`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cultural Info Popup Modal */}
      {selectedCulturalInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lacquer/85 backdrop-blur-sm">
          <div className="max-w-lg w-full bg-lacquer-card border-2 border-imperial-gold rounded-none p-6 sm:p-7 shadow-2xl relative font-sans">
            <button
              onClick={() => setSelectedCulturalInfo(null)}
              className="absolute top-4 right-4 p-2 rounded-none text-silk-muted hover:text-silk-ivory hover:bg-lacquer-surface transition-all border border-lacquer-border"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-imperial-gold flex-shrink-0" />
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-silk-ivory">
                {selectedCulturalInfo.name}
              </h3>
            </div>

            <div className="space-y-4 text-sm text-silk-muted leading-relaxed">
              <div>
                <span className="font-bold text-silk-ivory block mb-1 uppercase tracking-wider text-xs">Thời kỳ lịch sử:</span>
                <p className="text-silk-ivory">{selectedCulturalInfo.info.period}</p>
              </div>

              <div>
                <span className="font-bold text-silk-ivory block mb-1 uppercase tracking-wider text-xs">Ý nghĩa văn hóa:</span>
                <p className="text-silk-ivory">{selectedCulturalInfo.info.meaning}</p>
              </div>

              <div>
                <span className="font-bold text-silk-ivory block mb-1 uppercase tracking-wider text-xs">Hoàn cảnh sử dụng chuẩn mực:</span>
                <p className="text-silk-ivory">{selectedCulturalInfo.info.context}</p>
              </div>

              <div className="pt-3 border-t border-lacquer-border">
                <span className="font-bold text-imperial-gold block mb-1 uppercase tracking-wider text-xs">Nguồn tư liệu kiểm chứng:</span>
                <p className="italic text-silk-ivory font-medium">{selectedCulturalInfo.info.source}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
