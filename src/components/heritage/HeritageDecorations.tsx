import React from 'react';

/**
 * 1. TOP-LEFT CORNER: Slender Antique Brass Filigree with Royal Vermilion Silk Tassel (Tua rua đỏ hoàng gia)
 * Proportions: Delicate 48px x 68px, hugs the 10px rounded corner, leaves ample breathing room for title.
 */
export const CornerTopLeftTassel: React.FC<{ className?: string }> = React.memo(({ className = '' }) => (
  <div className={`absolute -top-0.5 -left-0.5 pointer-events-none select-none z-20 ${className}`}>
    <svg width="48" height="68" viewBox="0 0 48 68" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldCornerTL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2BF" />
          <stop offset="40%" stopColor="#D4AF37" />
          <stop offset="75%" stopColor="#9A7332" />
          <stop offset="100%" stopColor="#4A3412" />
        </linearGradient>
        <linearGradient id="tasselRed" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C62828" />
          <stop offset="50%" stopColor="#8B1E1E" />
          <stop offset="100%" stopColor="#4A0B0B" />
        </linearGradient>
      </defs>

      {/* Slender Brass Bracket hugging the 10px rounded corner */}
      <path
        d="M2 24 V10 C2 5.58 5.58 2 10 2 H24 C20 4 17 7 15 11 C12 11 10 13 8 16 C5 18 3 21 2 24 Z"
        fill="url(#goldCornerTL)"
        stroke="#F5DA88"
        strokeWidth="0.75"
      />
      {/* Cloud filigree line */}
      <path d="M5 7 C7 4 11 4 13 6" stroke="#3A240A" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <circle cx="7" cy="6" r="1" fill="#FFF2BF" />

      {/* Red silk cord hanging down */}
      <path d="M10 10 C8 17 10 22 12 26" stroke="#8B1E1E" strokeWidth="1.6" fill="none" strokeLinecap="round" />

      {/* Auspicious Red Knot (Nút Cát Tường) */}
      <rect x="9.5" y="24" width="5" height="5" rx="0.8" transform="rotate(45 12 26.5)" fill="url(#tasselRed)" stroke="#EF9A9A" strokeWidth="0.5" />
      <circle cx="12" cy="33" r="1.6" fill="#D4AF37" stroke="#3A240A" strokeWidth="0.4" />

      {/* Slender Red Silk Tassel Skirt */}
      <path d="M11 34 L9.5 58 C12 60 13 60 14.5 58 L13 34 Z" fill="url(#tasselRed)" />
      <path d="M10.5 35 L9.5 57 M12 35 L12 59 M13.5 35 L14.5 57" stroke="#E57373" strokeWidth="0.5" opacity="0.8" />
    </svg>
  </div>
));

/**
 * 2. TOP-RIGHT CORNER: Delicate Blooming Peach Blossom Branch (Cành đào phai nở hoa)
 * Proportions: Delicate 62px x 48px, arches seamlessly over top-right rounded corner.
 */
export const CornerTopRightBlossom: React.FC<{ className?: string }> = React.memo(({ className = '' }) => (
  <div className={`absolute -top-1 -right-1 pointer-events-none select-none z-20 ${className}`}>
    <svg width="62" height="48" viewBox="0 0 62 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pinkBlossom" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFCDD2" />
          <stop offset="55%" stopColor="#E91E63" />
          <stop offset="100%" stopColor="#880E4F" />
        </radialGradient>
        <radialGradient id="peachBud" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#F8BBD0" />
          <stop offset="100%" stopColor="#C2185B" />
        </radialGradient>
      </defs>

      {/* Delicate Antique Twig hugging corner */}
      <path
        d="M60 4 C46 6 32 7 18 8 M58 6 C53 16 48 24 44 32"
        stroke="#4E342E"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Flower 1 (Corner apex) */}
      <g transform="translate(50, 10)">
        <circle cx="0" cy="-3.5" r="3" fill="url(#pinkBlossom)" />
        <circle cx="3.5" cy="-1" r="3" fill="url(#pinkBlossom)" />
        <circle cx="2.5" cy="3.5" r="3" fill="url(#pinkBlossom)" />
        <circle cx="-2.5" cy="3.5" r="3" fill="url(#pinkBlossom)" />
        <circle cx="-3.5" cy="-1" r="3" fill="url(#pinkBlossom)" />
        <circle cx="0" cy="0" r="1.6" fill="#880E4F" />
        <circle cx="0" cy="0" r="0.7" fill="#FFF59D" />
      </g>

      {/* Flower 2 (Top branch) */}
      <g transform="translate(30, 8)">
        <circle cx="0" cy="-2.5" r="2.4" fill="url(#pinkBlossom)" />
        <circle cx="2.5" cy="-0.8" r="2.4" fill="url(#pinkBlossom)" />
        <circle cx="2" cy="2.5" r="2.4" fill="url(#pinkBlossom)" />
        <circle cx="-2" cy="2.5" r="2.4" fill="url(#pinkBlossom)" />
        <circle cx="-2.5" cy="-0.8" r="2.4" fill="url(#pinkBlossom)" />
        <circle cx="0" cy="0" r="1.2" fill="#880E4F" />
        <circle cx="0" cy="0" r="0.5" fill="#FFF59D" />
      </g>

      {/* Flower 3 (Right vertical branch) */}
      <g transform="translate(46, 26)">
        <circle cx="0" cy="-2" r="2.2" fill="url(#pinkBlossom)" />
        <circle cx="2" cy="-0.6" r="2.2" fill="url(#pinkBlossom)" />
        <circle cx="1.6" cy="2" r="2.2" fill="url(#pinkBlossom)" />
        <circle cx="-1.6" cy="2" r="2.2" fill="url(#pinkBlossom)" />
        <circle cx="-2" cy="-0.6" r="2.2" fill="url(#pinkBlossom)" />
        <circle cx="0" cy="0" r="1" fill="#880E4F" />
      </g>

      {/* Spring Buds */}
      <ellipse cx="18" cy="9" rx="2" ry="1.4" transform="rotate(-15 18 9)" fill="url(#peachBud)" />
      <path d="M16 10 L14 11" stroke="#2E7D32" strokeWidth="0.8" />
    </svg>
  </div>
));

/**
 * 3. BOTTOM-RIGHT CORNER: Delicate Antique Brass Cloud Bracket (Miếng bịt đồng mây cuộn)
 * Proportions: Compact 34px x 34px.
 */
export const CornerBottomRightBrass: React.FC<{ className?: string }> = React.memo(({ className = '' }) => (
  <div className={`absolute -bottom-0.5 -right-0.5 pointer-events-none select-none z-20 ${className}`}>
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldCornerBR" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#FFF2BF" />
          <stop offset="40%" stopColor="#D4AF37" />
          <stop offset="80%" stopColor="#8C682E" />
          <stop offset="100%" stopColor="#3E2A0E" />
        </linearGradient>
      </defs>
      <path
        d="M32 10 V24 C32 28.42 28.42 32 24 32 H10 C15 30 19 26 21 21 C24 21 27 19 29 16 C31 13 32 11 32 10 Z"
        fill="url(#goldCornerBR)"
        stroke="#F5DA88"
        strokeWidth="0.75"
      />
      <path d="M28 26 C26 29 22 29 20 27 C19 25 21 23 23 23" stroke="#3A240A" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <circle cx="26" cy="27" r="1" fill="#FFF2BF" />
    </svg>
  </div>
));

/**
 * 4. BOTTOM-LEFT CORNER: Antique Brass Bracket with Soft Ink-wash Flourish (Mực loang cổ phong)
 * Proportions: Compact 48px x 34px.
 */
export const CornerBottomLeft: React.FC<{ className?: string }> = React.memo(({ className = '' }) => (
  <div className={`absolute -bottom-0.5 -left-0.5 pointer-events-none select-none z-20 ${className}`}>
    <svg width="48" height="34" viewBox="0 0 48 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldCornerBL" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFF2BF" />
          <stop offset="40%" stopColor="#D4AF37" />
          <stop offset="80%" stopColor="#8C682E" />
          <stop offset="100%" stopColor="#3E2A0E" />
        </linearGradient>
        <linearGradient id="inkFlourish" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#05070A" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#12161F" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Subtle Calligraphic Ink Wash Brush along bottom border */}
      <path d="M4 32 Q22 29 46 32 Q24 35 4 32 Z" fill="url(#inkFlourish)" />

      {/* Antique Brass Bracket */}
      <path
        d="M2 10 V24 C2 28.42 5.58 32 10 32 H24 C19 30 15 26 13 21 C10 21 7 19 5 16 C3 13 2 11 2 10 Z"
        fill="url(#goldCornerBL)"
        stroke="#F5DA88"
        strokeWidth="0.75"
      />
      <path d="M6 26 C8 29 12 29 14 27 C15 25 13 23 11 23" stroke="#3A240A" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <circle cx="8" cy="27" r="1" fill="#FFF2BF" />
    </svg>
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
