import React, { useState } from 'react';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { PIECES, EVENTS, PRESET_OUTFITS } from '../../data/catalog';
import { getPieceAlignment, getAlignmentStyle } from '../../data/pieceAlignments';
import { CornerTopLeftTassel, CornerBottomRightBrass } from '../heritage/HeritageDecorations';
import { PresetOutfit, EventBackground } from '../../types';

interface HeroLiveAtelierProps {
  onOpenStudio: (preset?: PresetOutfit, event?: EventBackground) => void;
}

export const HeroLiveAtelier: React.FC<HeroLiveAtelierProps> = ({ onOpenStudio }) => {
  // Two curated interactive outfits for instant switching
  // Mode 0: Royal Traditional (Áo tấc đỏ + Quần lụa + Hài nhung + Nón lá)
  // Mode 1: Contemporary Remix (Áo tấc xanh + Quần âu + Loafer)
  const [styleMode, setStyleMode] = useState<0 | 1>(0);
  const [activeEventIndex, setActiveEventIndex] = useState(0); // 0: Tết, 1: Dạ hội Prom

  const currentEvent = EVENTS[activeEventIndex];

  // Pieces
  const aoTacDo = PIECES.find((p) => p.id === 'piece-ao-tac-do') || PIECES[0];
  const aoTacXanh = PIECES.find((p) => p.id === 'piece-ao-tac-xanh') || PIECES[1];
  const quanLua = PIECES.find((p) => p.id === 'piece-quan-lua');
  const quanTay = PIECES.find((p) => p.id === 'piece-quan-tay');
  const haiNhung = PIECES.find((p) => p.id === 'piece-hai-nhung');
  const loafer = PIECES.find((p) => p.id === 'piece-loafer');
  const nonLa = PIECES.find((p) => p.id === 'piece-non-la');

  const topPiece = styleMode === 0 ? aoTacDo : aoTacXanh;
  const bottomPiece = styleMode === 0 ? quanLua : quanTay;
  const footwearPiece = styleMode === 0 ? haiNhung : loafer;
  const accessoryPiece = styleMode === 0 ? nonLa : undefined;

  // Alignments
  const topAlign = getPieceAlignment(topPiece?.id);
  const bottomAlign = getPieceAlignment(bottomPiece?.id);
  const footwearAlign = getPieceAlignment(footwearPiece?.id);
  const accessoryAlign = getPieceAlignment(accessoryPiece?.id);

  const matchedPreset = styleMode === 0 ? PRESET_OUTFITS[0] : PRESET_OUTFITS[1];

  return (
    <div className="relative w-full max-w-[420px] mx-auto lg:max-w-none flex flex-col items-center">
      {/* Decorative Aura */}
      <div className="absolute -inset-4 bg-imperial-gold/5 blur-2xl pointer-events-none" />

      {/* Main Atelier Card */}
      <div className="relative w-full bg-[#12161F] border-2 border-imperial-gold/50 shadow-2xl p-3 sm:p-4 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
        {/* Heritage Filigree Corners */}
        <CornerTopLeftTassel className="scale-90" />
        <CornerBottomRightBrass className="scale-90" />

        {/* Live Canvas Viewport (Fixed 3:4 Aspect Ratio) */}
        <div className="relative w-full aspect-[3/4] bg-[#0A0D12] overflow-hidden border border-imperial-gold/30">
          {/* Layer 0: Event Background */}
          <img
            src={currentEvent.bgUrl}
            alt={currentEvent.name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          />

          {/* Soft vignette overlay */}
          <div className="absolute inset-0 bg-black/25 pointer-events-none" />

          {/* Layer 1: Mannequin Base */}
          <img
            src="/assets/mannequins/mannequin-base.png"
            alt="Ma-nơ-canh trình bày"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-10"
          />

          {/* Layer 2: Bottom Piece */}
          {bottomPiece && (
            <img
              key={`bottom-${bottomPiece.id}`}
              src={bottomPiece.assetUrl}
              alt={bottomPiece.name}
              style={getAlignmentStyle(bottomAlign)}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-20 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            />
          )}

          {/* Layer 3: Footwear Piece */}
          {footwearPiece && (
            <img
              key={`footwear-${footwearPiece.id}`}
              src={footwearPiece.assetUrl}
              alt={footwearPiece.name}
              style={getAlignmentStyle(footwearAlign)}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-30 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            />
          )}

          {/* Layer 4: Top Piece */}
          {topPiece && (
            <img
              key={`top-${topPiece.id}`}
              src={topPiece.assetUrl}
              alt={topPiece.name}
              style={getAlignmentStyle(topAlign)}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            />
          )}

          {/* Layer 5: Accessory Piece */}
          {accessoryPiece && (
            <img
              key={`acc-${accessoryPiece.id}`}
              src={accessoryPiece.assetUrl}
              alt={accessoryPiece.name}
              style={getAlignmentStyle(accessoryAlign)}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            />
          )}

          {/* Cultural Score Seal Stamp (Top Right) */}
          <div className="absolute top-3 right-3 z-50 pointer-events-none">
            <div
              className="relative w-14 h-14 bg-[#7C1C16] border border-[#F0D7A2]/80 flex flex-col items-center justify-center text-[#F6E7C1] shadow-lg"
              style={{ transform: 'rotate(-5deg)' }}
            >
              <div className="absolute inset-[2px] border border-[#F0D7A2]/30" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#F0D7A2]/80 leading-none">
                ĐIỂM
              </span>
              <span className="font-serif font-bold text-lg leading-tight">
                {styleMode === 0 ? '9.8' : '9.4'}
              </span>
            </div>
          </div>

          {/* Floating Outfit Mode Badge (Top Left) */}
          <div className="absolute top-3 left-3 z-50 bg-[#0A0D12]/90 backdrop-blur-md border border-imperial-gold/40 px-2.5 py-1 text-[11px] font-bold text-imperial-gold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-imperial-gold animate-pulse" />
            <span>{styleMode === 0 ? 'Hoàng gia cổ điển' : 'Đương đại Remix'}</span>
          </div>

          {/* Bottom Overlay: Curated Description */}
          <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-[#0A0D12] via-[#0A0D12]/90 to-transparent z-50">
            <div className="flex items-center justify-between text-xs text-silk-muted mb-1">
              <span className="font-semibold text-silk-ivory">
                {styleMode === 0 ? 'Áo tấc đỏ gấm triều Nguyễn' : 'Áo tấc chàm kết hợp quần âu'}
              </span>
              <span className="text-imperial-gold font-bold">
                {currentEvent.name}
              </span>
            </div>
            <p className="text-[11px] text-silk-muted line-clamp-1 leading-relaxed">
              {styleMode === 0
                ? 'Lễ phục đại triều trang trọng, sắc đỏ hòa quyện cùng lụa trắng tơ tằm.'
                : 'Phá cách trẻ trung, phom dáng cổ điển kết hợp quần âu và giày loafer hiện đại.'}
            </p>
          </div>
        </div>

        {/* Interactive Controls & Swatches Strip */}
        <div className="mt-3.5 space-y-3">
          {/* 1. Style Switcher Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setStyleMode(0)}
              className={`py-2 px-3 text-xs font-bold uppercase tracking-wider transition-all border flex items-center justify-center gap-2 ${
                styleMode === 0
                  ? 'bg-imperial-gold text-lacquer border-imperial-gold shadow-gold-glow'
                  : 'bg-[#181E29] text-silk-muted border-lacquer-border hover:border-imperial-gold/50'
              }`}
            >
              <span className="w-2.5 h-2.5 bg-[#7A1C1C] border border-white/40" />
              <span>Cổ phục thuần chất</span>
            </button>

            <button
              onClick={() => setStyleMode(1)}
              className={`py-2 px-3 text-xs font-bold uppercase tracking-wider transition-all border flex items-center justify-center gap-2 ${
                styleMode === 1
                  ? 'bg-imperial-gold text-lacquer border-imperial-gold shadow-gold-glow'
                  : 'bg-[#181E29] text-silk-muted border-lacquer-border hover:border-imperial-gold/50'
              }`}
            >
              <span className="w-2.5 h-2.5 bg-[#1A4B54] border border-white/40" />
              <span>Gen Z Remix</span>
            </button>
          </div>

          {/* 2. Event Toggle & Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveEventIndex((prev) => (prev === 0 ? 1 : 0))}
              title="Đổi bối cảnh phông nền"
              className="py-2.5 px-3 bg-[#181E29] border border-lacquer-border hover:border-imperial-gold text-silk-ivory text-xs font-medium flex items-center gap-1.5 transition-colors flex-shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-imperial-gold" />
              <span className="hidden sm:inline">Bối cảnh:</span>
              <span className="text-imperial-gold font-bold">{currentEvent.name.split(' ')[0]}</span>
            </button>

            <button
              onClick={() => onOpenStudio(matchedPreset, currentEvent)}
              className="flex-1 py-2.5 px-4 bg-[#7A1C1C] hover:bg-[#8B1E1E] border border-imperial-gold/60 text-silk-ivory font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 group shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-imperial-gold group-hover:rotate-12 transition-transform" />
              <span>Mở bộ này trong Studio</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
