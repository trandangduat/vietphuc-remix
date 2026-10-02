import React from 'react';
import { ExternalLink, ShieldCheck, AlertTriangle, Layers } from 'lucide-react';
import { SavedOutfit } from '../types';
import { HeritageModal } from './heritage/HeritageFrame';

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
  return (
    <HeritageModal
      isOpen={isOpen}
      onClose={onClose}
      title="So Sánh Phương Án Phối Đồ"
      subtitle={`Đối chiếu trực quan ${outfits.length} phương án đã chọn`}
      icon={<Layers className="w-4 h-4 flex-shrink-0 text-[#C5A059]" />}
      badge={`${outfits.length} OUTFIT`}
      maxWidth="max-w-5xl"
    >
      <div className="space-y-4 font-sans text-xs">
        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-[8px] border border-[#C5A059]/40 bg-[#0D111A]/90 shadow-inner">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#C5A059]/30 bg-[#121622]">
                <th className="py-3 px-3.5 text-[#C5A059] font-bold uppercase tracking-wider text-[11px] w-32">
                  Tiêu chí
                </th>
                {outfits.map((outfit) => (
                  <th
                    key={outfit.id}
                    className="py-3 px-3.5 font-bold text-[#F7F4EE] min-w-[200px] text-xs border-l border-[#C5A059]/25"
                  >
                    {outfit.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C5A059]/20 text-[#EDE5D8]">
              {/* Row 1: Visual Mockup */}
              <tr>
                <td className="py-3.5 px-3.5 text-[#C5A059] font-bold text-[11px] uppercase tracking-wider">
                  Hình ảnh
                </td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3.5 px-3.5 border-l border-[#C5A059]/20">
                    <div className="relative aspect-[3/4] w-28 rounded-[6px] overflow-hidden border border-[#C5A059]/40 shadow bg-[#080A0F]">
                      <img
                        src={outfit.tryOnImage || outfit.top.piece.assetUrl || outfit.top.variant?.assetUrl}
                        alt={outfit.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 2: Event */}
              <tr>
                <td className="py-3 px-3.5 text-[#C5A059] font-bold text-[11px] uppercase tracking-wider">
                  Bối cảnh
                </td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3 px-3.5 text-[#EDE5D8] font-medium border-l border-[#C5A059]/20">
                    {outfit.event.name}
                  </td>
                ))}
              </tr>

              {/* Row 3: Top */}
              <tr>
                <td className="py-3 px-3.5 text-[#C5A059] font-bold text-[11px] uppercase tracking-wider">
                  Áo
                </td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3 px-3.5 border-l border-[#C5A059]/20">
                    <span className="text-[#F7F4EE] font-medium block">{outfit.top.piece.name}</span>
                    <span className="text-[11px] text-[#EDE5D8]/60">
                      {outfit.top.piece.colorName || outfit.top.variant?.colorName}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 4: Bottom */}
              <tr>
                <td className="py-3 px-3.5 text-[#C5A059] font-bold text-[11px] uppercase tracking-wider">
                  Quần / Váy
                </td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3 px-3.5 border-l border-[#C5A059]/20">
                    <span className="text-[#F7F4EE] font-medium block">{outfit.bottom.piece.name}</span>
                    <span className="text-[11px] text-[#EDE5D8]/60">
                      {outfit.bottom.piece.colorName || outfit.bottom.variant?.colorName}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 5: Footwear */}
              <tr>
                <td className="py-3 px-3.5 text-[#C5A059] font-bold text-[11px] uppercase tracking-wider">
                  Giày / Dép
                </td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3 px-3.5 border-l border-[#C5A059]/20">
                    <span className="text-[#F7F4EE] font-medium block">{outfit.footwear.piece.name}</span>
                    <span className="text-[11px] text-[#EDE5D8]/60">
                      {outfit.footwear.piece.colorName || outfit.footwear.variant?.colorName}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 6: Accessory */}
              <tr>
                <td className="py-3 px-3.5 text-[#C5A059] font-bold text-[11px] uppercase tracking-wider">
                  Phụ kiện
                </td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3 px-3.5 text-[#EDE5D8] font-medium border-l border-[#C5A059]/20">
                    {outfit.accessory ? outfit.accessory.piece.name : <span className="text-[#EDE5D8]/50">Không chọn</span>}
                  </td>
                ))}
              </tr>

              {/* Row 7: AI Overview Culture */}
              <tr>
                <td className="py-3 px-3.5 text-[#C5A059] font-bold text-[11px] uppercase tracking-wider">
                  Đánh giá AI
                </td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3 px-3.5 border-l border-[#C5A059]/20">
                    {outfit.aiAnalysis ? (
                      <div className="space-y-1">
                        {outfit.aiAnalysis.culturalStatus === 'suitable' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                            <ShieldCheck className="w-3.5 h-3.5" /> Phù hợp
                          </span>
                        )}
                        {outfit.aiAnalysis.culturalStatus === 'caution' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                            <AlertTriangle className="w-3.5 h-3.5" /> Cần lưu ý
                          </span>
                        )}
                        <p className="text-[11px] text-[#EDE5D8]/80 leading-relaxed line-clamp-3">
                          {outfit.aiAnalysis.explanation}
                        </p>
                      </div>
                    ) : (
                      <span className="text-[#EDE5D8]/50 text-[11px]">Chưa phân tích</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 8: Action */}
              <tr>
                <td className="py-3 px-3.5 text-[#C5A059] font-bold text-[11px] uppercase tracking-wider">
                  Thao tác
                </td>
                {outfits.map((outfit) => (
                  <td key={outfit.id} className="py-3 px-3.5 border-l border-[#C5A059]/20">
                    <button
                      onClick={() => {
                        onLoadOutfitIntoStudio(outfit);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-[6px] bg-gradient-to-r from-[#D4AF37] to-[#AA8232] text-[#0A0D12] hover:brightness-110 text-xs font-bold transition-all uppercase tracking-wider shadow-sm cursor-pointer"
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
    </HeritageModal>
  );
};
