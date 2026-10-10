import React from 'react';
import { PresetOutfit, EventBackground } from '../types';
import { ParallaxScatteredHero } from '../components/landing/ParallaxScatteredHero';
import { MarqueeTicker } from '../components/landing/MarqueeTicker';
import { TaglineScrollReveal } from '../components/landing/TaglineScrollReveal';
import { AtelierPortalFooter } from '../components/landing/AtelierPortalFooter';
import { AmbientSoundController } from '../components/landing/AmbientSoundController';

interface LandingScreenProps {
  onOpenStudio: (preset?: PresetOutfit, event?: EventBackground) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onOpenStudio }) => {
  return (
    <div id="main-content" className="flex flex-col min-h-screen font-sans bg-[#0A0D12] text-silk-ivory">
      {/* 0. AMBIENT AUDIO PILL (Web Audio API pentatonic chimes, muted by default) */}
      <AmbientSoundController />

      {/* 1. SCATTERED PARALLAX HERO: Y phục bay lượn tự do với tương tác chuột mượt mà */}
      <ParallaxScatteredHero onOpenStudio={onOpenStudio} />

      {/* 2. KINETIC FASHION TICKER: Dải ruy-băng typography thời trang di sản */}
      <MarqueeTicker />

      {/* 3. TAGLINE SCROLL REVEAL: Kích hoạt tuyên ngôn theo nhịp thở cuộn trang */}
      <TaglineScrollReveal />

      {/* 4. FINALE: CÁNH CỬA ATELIER & HAUTE FOOTER (Grand CTA + Privacy + Newsletter) */}
      <AtelierPortalFooter onOpenStudio={() => onOpenStudio()} />
    </div>
  );
};
