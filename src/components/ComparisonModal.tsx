import React from 'react';
import { X, ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';
import { SavedOutfit } from '../types';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfits: SavedOutfit[];
  onLoadOutfitIntoStudio: (outfit: SavedOutfit) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  outfits,
  onLoadOutfitIntoStudio,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lacquer/90 backdrop-blur-md font-sans">
      <div className="max-w-5xl w-full bg-lacquer-card border-2 border-imperial-gold rounded-none p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-none text-silk-muted hover:text-silk-ivory hover:bg-lacquer-surface transition-all border border-lacquer-border"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif font-bold text-2xl text-silk-ivory mb-1">
          So sánh phương án phối đồ
        </h3>
        <p className="text-sm text-silk-muted mb-5">
          Đối chiếu trực quan {outfits.length} phương án đã chọn để tìm ra bộ trang phục ưng ý nhất
        </p>

        {/* Comparison Table */}
        <div className="overflow-x-auto border-2 border-lacquer-border">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-lacquer-border bg-lacquer-surface">
                <th className="py-3.5 px-4 text-silk-muted font-bold uppercase tracking-wider text-xs w-36">Tiêu chí</th>
                {outfits.map((outfit) => (
                  <th key={outfit.id} className="py-3.5 px-4 font-sans font-bold text-silk-ivory min-w-[220px] text-base border-l border-lacquer-border">
                    {outfit.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-lacquer-border">
              {/* Row 1: Visual Mockup */}
              <tr>
                <td className="py-4 px-4 text-silk-muted font-bold text-xs uppercase tracking-wider">Hình ảnh</td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-4 px-4 border-l border-lacquer-border">
                    <div className="relative aspect-[3/4] w-32 rounded-none overflow-hidden border-2 border-lacquer-border shadow">
                      <img
                        src={outfit.tryOnImage || outfit.top.piece.assetUrl || outfit.top.variant?.assetUrl}
                        alt={outfit.name}
                        className="w-full h-full object-cover bg-lacquer-surface"
                      />
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 2: Event */}
              <tr>
                <td className="py-3.5 px-4 text-silk-muted font-bold text-xs uppercase tracking-wider">Bối cảnh</td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3.5 px-4 text-silk-ivory font-semibold border-l border-lacquer-border">
                    {outfit.event.name}
                  </td>
                ))}
              </tr>

              {/* Row 3: Top */}
              <tr>
                <td className="py-3.5 px-4 text-silk-muted font-bold text-xs uppercase tracking-wider">Áo</td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3.5 px-4 border-l border-lacquer-border">
                    <span className="text-silk-ivory font-bold block">{outfit.top.piece.name}</span>
                    <span className="text-xs text-silk-muted font-medium">{outfit.top.piece.colorName || outfit.top.variant?.colorName}</span>
                  </td>
                ))}
              </tr>

              {/* Row 4: Bottom */}
              <tr>
                <td className="py-3.5 px-4 text-silk-muted font-bold text-xs uppercase tracking-wider">Quần / Váy</td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3.5 px-4 border-l border-lacquer-border">
                    <span className="text-silk-ivory font-bold block">{outfit.bottom.piece.name}</span>
                    <span className="text-xs text-silk-muted font-medium">{outfit.bottom.piece.colorName || outfit.bottom.variant?.colorName}</span>
                  </td>
                ))}
              </tr>

              {/* Row 5: Footwear */}
              <tr>
                <td className="py-3.5 px-4 text-silk-muted font-bold text-xs uppercase tracking-wider">Giày / Dép</td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3.5 px-4 border-l border-lacquer-border">
                    <span className="text-silk-ivory font-bold block">{outfit.footwear.piece.name}</span>
                    <span className="text-xs text-silk-muted font-medium">{outfit.footwear.piece.colorName || outfit.footwear.variant?.colorName}</span>
                  </td>
                ))}
              </tr>

              {/* Row 6: Accessory */}
              <tr>
                <td className="py-3.5 px-4 text-silk-muted font-bold text-xs uppercase tracking-wider">Phụ kiện</td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3.5 px-4 text-silk-ivory font-semibold border-l border-lacquer-border">
                    {outfit.accessory ? outfit.accessory.piece.name : <span className="text-silk-muted">Không chọn</span>}
                  </td>
                ))}
              </tr>

              {/* Row 7: AI Overview Culture */}
              <tr>
                <td className="py-3.5 px-4 text-silk-muted font-bold text-xs uppercase tracking-wider">Đánh giá AI</td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3.5 px-4 border-l border-lacquer-border">
                    {outfit.aiAnalysis ? (
                      <div>
                        {outfit.aiAnalysis.culturalStatus === 'suitable' && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-400 mb-1.5 uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4" /> Phù hợp
                          </span>
                        )}
                        {outfit.aiAnalysis.culturalStatus === 'caution' && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-1.5 uppercase tracking-wider">
                            <AlertTriangle className="w-4 h-4" /> Cần lưu ý
                          </span>
                        )}
                        <p className="text-xs text-silk-muted leading-relaxed line-clamp-3">
                          {outfit.aiAnalysis.explanation}
                        </p>
                      </div>
                    ) : (
                      <span className="text-silk-muted text-xs">Chưa phân tích</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 8: Action */}
              <tr>
                <td className="py-3.5 px-4 text-silk-muted font-bold text-xs uppercase tracking-wider">Thao tác</td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3.5 px-4 border-l border-lacquer-border">
                    <button
                      onClick={() => {
                        onLoadOutfitIntoStudio(outfit);
                        onClose();
                      }}
                      className="flex items-center gap-2 py-2 px-4 rounded-none bg-imperial-gold text-lacquer hover:bg-imperial-gold-light text-xs font-bold transition-all uppercase tracking-wider"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Mở trong Studio</span>
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
