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
    <div className="flex flex-col flex-1 min-h-0 bg-lacquer-card overflow-hidden">
      {/* 5 Main Tabs Flush at Header (Wireframe SCR-02) */}
      <div className="flex items-center border-b border-lacquer-border bg-lacquer-surface/80 overflow-x-auto scrollbar-none flex-shrink-0">
        <button
          onClick={() => onSelectCategory('top')}
          className={`flex-1 min-w-[75px] py-3.5 px-4 text-xs font-bold transition-all border-b-2 text-center whitespace-nowrap ${
            activeCategory === 'top'
              ? 'border-imperial-gold text-imperial-gold bg-imperial-gold/10'
              : 'border-transparent text-silk-muted hover:text-silk-ivory hover:bg-lacquer-hover'
          }`}
        >
          Áo
        </button>
        <button
          onClick={() => onSelectCategory('bottom')}
          className={`flex-1 min-w-[95px] py-3.5 px-4 text-xs font-bold transition-all border-b-2 text-center whitespace-nowrap ${
            activeCategory === 'bottom'
              ? 'border-imperial-gold text-imperial-gold bg-imperial-gold/10'
              : 'border-transparent text-silk-muted hover:text-silk-ivory hover:bg-lacquer-hover'
          }`}
        >
          Quần / Váy
        </button>
        <button
          onClick={() => onSelectCategory('footwear')}
          className={`flex-1 min-w-[85px] py-3.5 px-4 text-xs font-bold transition-all border-b-2 text-center whitespace-nowrap ${
            activeCategory === 'footwear'
              ? 'border-imperial-gold text-imperial-gold bg-imperial-gold/10'
              : 'border-transparent text-silk-muted hover:text-silk-ivory hover:bg-lacquer-hover'
          }`}
        >
          Giày / Dép
        </button>
        <button
          onClick={() => onSelectCategory('accessory')}
          className={`flex-1 min-w-[90px] py-3.5 px-4 text-xs font-bold transition-all border-b-2 text-center whitespace-nowrap ${
            activeCategory === 'accessory'
              ? 'border-imperial-gold text-imperial-gold bg-imperial-gold/10'
              : 'border-transparent text-silk-muted hover:text-silk-ivory hover:bg-lacquer-hover'
          }`}
        >
          Phụ kiện đi kèm
        </button>
        <button
          onClick={() => onSelectCategory('presets')}
          className={`flex-1 min-w-[110px] py-3.5 px-4 text-xs font-bold transition-all border-b-2 text-center whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeCategory === 'presets'
              ? 'border-imperial-gold text-imperial-gold-light bg-gradient-to-r from-imperial-red/20 to-imperial-gold/10'
              : 'border-transparent text-silk-muted hover:text-silk-ivory hover:bg-lacquer-hover'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-imperial-gold" />
          <span>Outfit gợi ý</span>
        </button>
      </div>

      {/* Secondary Controls Bar: Style Filters & Clear Accessory Button */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-lacquer/50 border-b border-lacquer-border/50 flex-wrap gap-2 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-silk-muted mr-1 font-medium">Phong cách:</span>
          {(['all', 'traditional', 'modern', 'remix'] as StyleFilter[]).map((style) => (
            <button
              key={style}
              onClick={() => onSelectStyle(style)}
              className={`px-3 py-1 rounded-full text-[11px] transition-all font-medium ${
                styleFilter === style
                  ? 'bg-imperial-gold text-lacquer font-bold shadow-sm'
                  : 'bg-lacquer-surface text-silk-muted hover:text-silk-ivory border border-lacquer-border/80'
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
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-imperial-red-bright hover:bg-imperial-red/10 border border-imperial-red/30 transition-all"
          >
            <X className="w-3 h-3" />
            <span>Bỏ phụ kiện</span>
          </button>
        )}
      </div>

      {/* Pieces & Presets Scrollable Grid Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {activeCategory === 'presets' ? (
          /* Presets List */
          <div className="grid grid-cols-1 gap-3">
            {presets.map((preset) => (
              <div
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="p-4 rounded-xl bg-lacquer-surface border border-lacquer-border hover:border-imperial-gold/50 cursor-pointer transition-all group hover:bg-lacquer-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-serif font-bold text-silk-ivory group-hover:text-imperial-gold transition-colors">
                      {preset.name}
                    </h4>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-imperial-gold/15 text-imperial-gold border border-imperial-gold/30">
                      {preset.style}
                    </span>
                  </div>
                  <p className="text-xs text-silk-muted leading-relaxed mb-3">
                    {preset.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-lacquer-border/50 text-xs text-imperial-gold font-semibold">
                  <span>Nhấn để nạp vào Studio</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Pieces Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between relative group ${
                    isPieceActive
                      ? 'bg-lacquer-surface border-imperial-gold/60 shadow-md ring-1 ring-imperial-gold/30'
                      : 'bg-lacquer-surface/60 border-lacquer-border hover:border-lacquer-border/90 hover:bg-lacquer-surface'
                  }`}
                >
                  <div>
                    {/* Top Row: Title & Info Trigger */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <h4 className="font-serif text-sm font-bold text-silk-ivory">
                          {piece.name}
                        </h4>
                        <span className="text-[10px] text-silk-muted block">
                          {piece.culturalInfo.period}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCulturalInfo({ name: piece.name, info: piece.culturalInfo });
                        }}
                        className="p-1 rounded-full text-silk-muted hover:text-imperial-gold hover:bg-lacquer-border/30 transition-all"
                        title="Xem nguồn gốc & ý nghĩa văn hóa"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Preview Thumbnail */}
                    <div className="w-full aspect-[4/3] rounded-lg bg-lacquer/80 flex items-center justify-center overflow-hidden my-2 border border-lacquer-border/40 p-2">
                      <img
                        src={piece.thumbnailUrl || piece.variants[0].assetUrl}
                        alt={piece.name}
                        className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                      />
                    </div>
                  </div>

                  {/* Swatches Selector */}
                  <div className="pt-2 border-t border-lacquer-border/40 flex items-center justify-between">
                    <span className="text-[11px] text-silk-muted">Màu sắc:</span>
                    <div className="flex items-center gap-1.5">
                      {piece.variants.map((v) => {
                        const isSelected = activeVariantId === v.variantId;
                        return (
                          <button
                            key={v.variantId}
                            onClick={() => onSelectVariant(piece, v)}
                            className={`w-6 h-6 rounded-full border-2 transition-all relative flex items-center justify-center ${
                              isSelected
                                ? 'border-imperial-gold ring-2 ring-imperial-gold/40 scale-110 shadow-sm'
                                : 'border-lacquer-border hover:scale-105'
                            }`}
                            style={{ backgroundColor: v.swatchHex }}
                            title={v.colorName}
                          >
                            {isSelected && (
                              <Check className={`w-3 h-3 ${v.swatchHex === '#F7F4EE' ? 'text-black' : 'text-white'}`} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lacquer/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-lacquer-card border border-imperial-gold/40 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedCulturalInfo(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-silk-muted hover:text-silk-ivory hover:bg-lacquer-surface transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-imperial-gold" />
              <h3 className="font-serif font-bold text-lg text-silk-ivory">
                {selectedCulturalInfo.name}
              </h3>
            </div>

            <div className="space-y-3 text-xs text-silk-muted leading-relaxed">
              <div>
                <span className="font-semibold text-silk-ivory block mb-0.5">Thời kỳ lịch sử:</span>
                <p>{selectedCulturalInfo.info.period}</p>
              </div>

              <div>
                <span className="font-semibold text-silk-ivory block mb-0.5">Ý nghĩa văn hóa:</span>
                <p>{selectedCulturalInfo.info.meaning}</p>
              </div>

              <div>
                <span className="font-semibold text-silk-ivory block mb-0.5">Hoàn cảnh sử dụng chuẩn mực:</span>
                <p>{selectedCulturalInfo.info.context}</p>
              </div>

              <div className="pt-2 border-t border-lacquer-border">
                <span className="font-semibold text-imperial-gold block mb-0.5">Nguồn tư liệu kiểm chứng:</span>
                <p className="italic text-silk-ivory">{selectedCulturalInfo.info.source}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
