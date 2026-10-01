import React from 'react';
import { X, ExternalLink, ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lacquer/85 backdrop-blur-md">
      <div className="max-w-4xl w-full bg-lacquer-card border border-imperial-gold/40 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-silk-muted hover:text-silk-ivory hover:bg-lacquer-surface transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif font-bold text-lg text-silk-ivory mb-1">
          So sánh phương án phối đồ
        </h3>
        <p className="text-xs text-silk-muted mb-4">
          Đối chiếu trực quan {outfits.length} phương án đã chọn để tìm ra bộ trang phục ưng ý nhất
        </p>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-lacquer-border">
                <th className="py-3 px-3 text-silk-muted font-semibold w-32">Tiêu chí</th>
                {outfits.map((outfit) => (
                  <th key={outfit.id} className="py-3 px-3 font-serif font-bold text-silk-ivory min-w-[200px]">
                    {outfit.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-lacquer-border/50">
              {/* Row 1: Visual Mockup */}
              <tr>
                <td className="py-3 px-3 text-silk-muted font-medium">Hình ảnh</td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3 px-3">
                    <div className="relative aspect-[3/4] w-28 rounded-lg overflow-hidden border border-lacquer-border shadow">
                      <img
                        src={outfit.tryOnImage || outfit.top.variant.assetUrl}
                        alt={outfit.name}
                        className="w-full h-full object-cover bg-lacquer-surface"
                      />
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 2: Event */}
              <tr>
                <td className="py-3 px-3 text-silk-muted font-medium">Bối cảnh (Event)</td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3 px-3 text-silk-ivory font-medium">
                    {outfit.event.name}
                  </td>
                ))}
              </tr>

              {/* Row 3: Top */}
              <tr>
                <td className="py-3 px-3 text-silk-muted font-medium">Áo</td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3 px-3">
                    <span className="text-silk-ivory font-medium block">{outfit.top.piece.name}</span>
                    <span className="text-[11px] text-silk-muted">{outfit.top.variant.colorName}</span>
                  </td>
                ))}
              </tr>

              {/* Row 4: Bottom */}
              <tr>
                <td className="py-3 px-3 text-silk-muted font-medium">Quần / Chân váy</td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3 px-3">
                    <span className="text-silk-ivory font-medium block">{outfit.bottom.piece.name}</span>
                    <span className="text-[11px] text-silk-muted">{outfit.bottom.variant.colorName}</span>
                  </td>
                ))}
              </tr>

              {/* Row 5: Footwear */}
              <tr>
                <td className="py-3 px-3 text-silk-muted font-medium">Giày / Dép</td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3 px-3">
                    <span className="text-silk-ivory font-medium block">{outfit.footwear.piece.name}</span>
                    <span className="text-[11px] text-silk-muted">{outfit.footwear.variant.colorName}</span>
                  </td>
                ))}
              </tr>

              {/* Row 6: Accessory */}
              <tr>
                <td className="py-3 px-3 text-silk-muted font-medium">Phụ kiện</td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3 px-3 text-silk-ivory">
                    {outfit.accessory ? outfit.accessory.piece.name : <span className="text-silk-muted">Không chọn</span>}
                  </td>
                ))}
              </tr>

              {/* Row 7: AI Overview Culture */}
              <tr>
                <td className="py-3 px-3 text-silk-muted font-medium">Đánh giá AI</td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3 px-3">
                    {outfit.aiAnalysis ? (
                      <div>
                        {outfit.aiAnalysis.culturalStatus === 'suitable' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-400 mb-1">
                            <ShieldCheck className="w-3 h-3" /> Phù hợp
                          </span>
                        )}
                        {outfit.aiAnalysis.culturalStatus === 'caution' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 mb-1">
                            <AlertTriangle className="w-3 h-3" /> Cần lưu ý
                          </span>
                        )}
                        <p className="text-[11px] text-silk-muted leading-relaxed line-clamp-3">
                          {outfit.aiAnalysis.explanation}
                        </p>
                      </div>
                    ) : (
                      <span className="text-silk-muted text-[11px]">Chưa phân tích</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 8: Action */}
              <tr>
                <td className="py-3 px-3 text-silk-muted font-medium">Thao tác</td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3 px-3">
                    <button
                      onClick={() => {
                        onLoadOutfitIntoStudio(outfit);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-imperial-gold/20 text-imperial-gold hover:bg-imperial-gold hover:text-lacquer border border-imperial-gold/40 text-xs font-semibold transition-all"
                    >
                      <ExternalLink className="w-3 h-3" />
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
