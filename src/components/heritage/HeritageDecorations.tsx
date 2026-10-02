import React from 'react';

/**
 * 1. TOP-LEFT CORNER: Real Antique Brass Filigree with Royal Red Silk Tassel (Image Asset)
 */
export const CornerTopLeftTassel: React.FC<{ className?: string }> = React.memo(({ className = '' }) => (
  <div className={`absolute -top-1 -left-1 pointer-events-none select-none z-20 ${className}`}>
    <img
      src="/assets/decorations/heritage-corners/corner-top-left.png"
      alt=""
      className="w-[64px] h-[84px] object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]"
    />
  </div>
));

/**
 * 2. TOP-RIGHT CORNER: Real Blooming Peach Blossom Branch (Image Asset)
 */
export const CornerTopRightBlossom: React.FC<{ className?: string }> = React.memo(({ className = '' }) => (
  <div className={`absolute -top-3.5 -right-3.5 pointer-events-none select-none z-20 ${className}`}>
    <img
      src="/assets/decorations/heritage-corners/corner-top-right.png"
      alt=""
      className="w-[84px] h-[70px] object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]"
    />
  </div>
));

/**
 * 3. BOTTOM-RIGHT CORNER: Real Antique Vietnamese Brass Dragon & Lotus Filigree Bracket (Image Asset)
 */
export const CornerBottomRightBrass: React.FC<{ className?: string }> = React.memo(({ className = '' }) => (
  <div className={`absolute -bottom-1 -right-1 pointer-events-none select-none z-20 ${className}`}>
    <img
      src="/assets/decorations/heritage-corners/corner-bottom-right.png"
      alt=""
      className="w-[50px] h-[46px] object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]"
    />
  </div>
));

/**
 * 4. BOTTOM-LEFT CORNER: Real Antique Vietnamese Brass Filigree Bracket (Image Asset)
 */
export const CornerBottomLeft: React.FC<{ className?: string }> = React.memo(({ className = '' }) => (
  <div className={`absolute -bottom-1 -left-1 pointer-events-none select-none z-20 ${className}`}>
    <img
      src="/assets/decorations/heritage-corners/corner-bottom-left.png"
      alt=""
      className="w-[50px] h-[46px] object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]"
    />
  </div>
));

/**
 * 5. ANCIENT CALLIGRAPHIC DIVIDER: Tapered gold line with central cloud scroll motif
 */
export const AncientCloudDivider: React.FC<{ className?: string }> = React.memo(({ className = '' }) => (
  <div className={`relative w-full flex items-center justify-center my-3 pointer-events-none select-none ${className}`}>
    {/* Left tapered line */}
    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/60 to-[#F9E29D]" />

    {/* Center golden cloud scroll knot */}
    <div className="px-2.5 flex items-center gap-1.5 opacity-90">
      <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1 6 C4 2 8 2 10 5 C11 2 15 2 17 5 C19 3 22 4 23 6 C22 9 18 10 15 8 C14 10 10 10 8 7 C6 10 2 9 1 6 Z"
          fill="none"
          stroke="#C5A059"
          strokeWidth="1"
        />
        <circle cx="12" cy="6" r="1.5" fill="#F9E29D" />
      </svg>
    </div>

    {/* Right tapered line */}
    <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#C5A059]/60 to-[#F9E29D]" />
  </div>
));

/**
 * 6. HERITAGE GOLD CREST ICONS: Exact Match to Reference Image
 */

// Crown / Dynasty Emblem for "THỜI KỲ LỊCH SỬ"
export const HeritageDynastyIcon: React.FC<{ className?: string }> = React.memo(({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 28 28" fill="none" className={`text-[#D4AF37] flex-shrink-0 ${className}`}>
    <defs>
      <linearGradient id="goldIconGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF2BF" />
        <stop offset="60%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#8C682E" />
      </linearGradient>
    </defs>
    {/* Royal Crown / Mũ Bình Thiên Headpiece */}
    <path
      d="M4 10 L14 5 L24 10 L22 20 C22 22 18 24 14 24 C10 24 6 22 6 20 Z"
      stroke="url(#goldIconGrad1)"
      strokeWidth="1.6"
      strokeLinejoin="round"
      fill="rgba(212, 175, 55, 0.08)"
    />
    <path d="M4 10 L14 16 L24 10" stroke="url(#goldIconGrad1)" strokeWidth="1.4" />
    <path d="M14 5 V16" stroke="url(#goldIconGrad1)" strokeWidth="1.4" />
    <circle cx="14" cy="5" r="1.6" fill="#FFF2BF" />
    <circle cx="4" cy="10" r="1.2" fill="#FFF2BF" />
    <circle cx="24" cy="10" r="1.2" fill="#FFF2BF" />
    {/* Traditional cloud curve below */}
    <path d="M9 20 C11 22 17 22 19 20" stroke="url(#goldIconGrad1)" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
));

// Incense Burner / Sacred Lotus Crest for "Ý NGHĨA VĂN HÓA"
export const HeritageCulturalIcon: React.FC<{ className?: string }> = React.memo(({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 28 28" fill="none" className={`text-[#D4AF37] flex-shrink-0 ${className}`}>
    <defs>
      <linearGradient id="goldIconGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF2BF" />
        <stop offset="60%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#8C682E" />
      </linearGradient>
    </defs>
    {/* Sacred Lotus / Antique Urn Motif */}
    <path
      d="M14 4 C14 4 11 8 11 11 C11 13 12.5 14.5 14 14.5 C15.5 14.5 17 13 17 11 C17 8 14 4 14 4 Z"
      fill="rgba(212, 175, 55, 0.2)"
      stroke="url(#goldIconGrad2)"
      strokeWidth="1.4"
    />
    {/* Left Petal */}
    <path
      d="M11 10 C8 8 6 12 7 15 C8.5 17 12 17 12 17"
      stroke="url(#goldIconGrad2)"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    {/* Right Petal */}
    <path
      d="M17 10 C20 8 22 12 21 15 C19.5 17 16 17 16 17"
      stroke="url(#goldIconGrad2)"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    {/* Base Pedestal */}
    <path d="M7 19 H21 L19 23 H9 Z" stroke="url(#goldIconGrad2)" strokeWidth="1.4" strokeLinejoin="round" />
    <line x1="14" y1="17" x2="14" y2="19" stroke="url(#goldIconGrad2)" strokeWidth="1.4" />
  </svg>
));

// Temple Pavilion / Festival Gate for "BỐI CẢNH CHUẨN MỰC"
export const HeritageContextIcon: React.FC<{ className?: string }> = React.memo(({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 28 28" fill="none" className={`text-[#D4AF37] flex-shrink-0 ${className}`}>
    <defs>
      <linearGradient id="goldIconGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF2BF" />
        <stop offset="60%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#8C682E" />
      </linearGradient>
    </defs>
    {/* Curved Ancient Curved Palace Roof */}
    <path
      d="M3 11 C7 10 11 8 14 5 C17 8 21 10 25 11 C23 13 20 13 14 13 C8 13 5 13 3 11 Z"
      stroke="url(#goldIconGrad3)"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="rgba(212, 175, 55, 0.12)"
    />
    {/* Roof Pinnacle */}
    <circle cx="14" cy="5" r="1.4" fill="#FFF2BF" />
    {/* Pillars */}
    <line x1="8" y1="13" x2="8" y2="23" stroke="url(#goldIconGrad3)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="20" y1="13" x2="20" y2="23" stroke="url(#goldIconGrad3)" strokeWidth="1.5" strokeLinecap="round" />
    {/* Internal archway */}
    <path d="M11 23 V17 C11 15 17 15 17 17 V23" stroke="url(#goldIconGrad3)" strokeWidth="1.3" />
    {/* Base steps */}
    <line x1="5" y1="23" x2="23" y2="23" stroke="url(#goldIconGrad3)" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
));

// Open Ancient Manuscript / Book Icon for "Nguồn"
export const HeritageBookIcon: React.FC<{ className?: string }> = React.memo(({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={`text-[#D4AF37] flex-shrink-0 ${className}`}>
    <defs>
      <linearGradient id="goldIconGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF2BF" />
        <stop offset="60%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#8C682E" />
      </linearGradient>
    </defs>
    <path
      d="M3 6 C6 4 10 5 12 7 C14 5 18 4 21 6 V19 C18 17 14 18 12 20 C10 18 6 17 3 19 Z"
      stroke="url(#goldIconGrad4)"
      strokeWidth="1.6"
      strokeLinejoin="round"
      fill="rgba(212, 175, 55, 0.08)"
    />
    <line x1="12" y1="7" x2="12" y2="20" stroke="url(#goldIconGrad4)" strokeWidth="1.6" />
  </svg>
));
