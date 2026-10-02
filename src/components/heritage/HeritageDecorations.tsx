import React from 'react';

/**
 * 1. TOP-LEFT CORNER: Antique Brass Filigree with Royal Vermilion Silk Tassel (Tua rua đỏ hoàng gia)
 * Performance: Memoized, zero inline software filter thrashing, GPU-accelerated.
 */
export const CornerTopLeftTassel: React.FC<{ className?: string }> = React.memo(({ className = '' }) => (
  <div className={`absolute -top-1.5 -left-1.5 pointer-events-none select-none z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] ${className}`}>
    <svg width="68" height="88" viewBox="0 0 68 88" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Antique Gold Gradient */}
        <linearGradient id="brassGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9E29D" />
          <stop offset="40%" stopColor="#C5A059" />
          <stop offset="80%" stopColor="#8C682E" />
          <stop offset="100%" stopColor="#4A3412" />
        </linearGradient>

        {/* Imperial Vermilion Red Gradient */}
        <linearGradient id="silkRedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A82020" />
          <stop offset="50%" stopColor="#7E1515" />
          <stop offset="100%" stopColor="#4A0B0B" />
        </linearGradient>

        {/* Gold Bead Gradient */}
        <radialGradient id="goldBead" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFF2BF" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#7D5716" />
        </radialGradient>
      </defs>

      {/* --- Antique Brass Corner Bracket --- */}
      <path
        d="M2 32 V8 C2 4.686 4.686 2 8 2 H32 C26 5 22 10 20 16 C16 16 12 18 10 22 C6 24 4 28 2 32 Z"
        fill="url(#brassGoldGrad)"
        stroke="#F5DA88"
        strokeWidth="0.75"
      />
      {/* Cloud scroll filigree on bracket */}
      <path
        d="M6 10 C8 6 14 6 16 9 C18 12 15 15 12 14 C10 13 8 15 10 18"
        stroke="#3A240A"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="10" cy="8" r="1.5" fill="#FFF2BF" />

      {/* --- Red Silk Cord Loop Hanging from Bracket --- */}
      <path
        d="M16 14 Q14 26 18 32 Q22 26 20 14"
        fill="none"
        stroke="#8B1E1E"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* --- Auspicious Red Chinese/Vietnamese Knot (Nút Cát Tường) --- */}
      <g>
        {/* Center Diamond Loop */}
        <rect
          x="14"
          y="28"
          width="8"
          height="8"
          rx="1"
          transform="rotate(45 18 32)"
          fill="url(#silkRedGrad)"
          stroke="#E57373"
          strokeWidth="0.8"
        />
        {/* Left ear loop */}
        <path
          d="M14 30 C9 28 8 35 13 35"
          fill="none"
          stroke="url(#silkRedGrad)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Right ear loop */}
        <path
          d="M22 30 C27 28 28 35 23 35"
          fill="none"
          stroke="url(#silkRedGrad)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* --- Gold Bead Ring --- */}
      <circle cx="18" cy="40" r="2.8" fill="url(#goldBead)" stroke="#3A2606" strokeWidth="0.5" />

      {/* --- Flowing Red Silk Tassel (Tua rua dài rủ xuống) --- */}
      <g>
        {/* Main tassel skirt */}
        <path
          d="M16 42 L13 74 Q18 78 23 74 L20 42 Z"
          fill="url(#silkRedGrad)"
        />
        {/* Detailed silk threads highlight */}
        <path d="M15 44 L14 73" stroke="#C62828" strokeWidth="0.8" opacity="0.9" />
        <path d="M17 44 L16 75" stroke="#E57373" strokeWidth="0.7" opacity="0.8" />
        <path d="M18 44 L18 76" stroke="#EF9A9A" strokeWidth="0.8" opacity="0.85" />
        <path d="M19 44 L20 75" stroke="#C62828" strokeWidth="0.7" opacity="0.9" />
        <path d="M21 44 L22 73" stroke="#7E1515" strokeWidth="0.8" opacity="0.9" />
        {/* Tassel tip fringe */}
        <path d="M13 74 L14 80 M16 75 L17 83 M18 76 L18 84 M20 75 L20 82 M22 74 L21 79" stroke="#9A1B1B" strokeWidth="1" strokeLinecap="round" />
      </g>
    </svg>
  </div>
));

/**
 * 2. TOP-RIGHT CORNER: Antique Brass Bracket with Blooming Peach Blossoms (Cành đào phai nở hoa)
 * Performance: Memoized, clean vector paths.
 */
export const CornerTopRightBlossom: React.FC<{ className?: string }> = React.memo(({ className = '' }) => (
  <div className={`absolute -top-2.5 -right-2.5 pointer-events-none select-none z-20 drop-shadow-[0_2px_5px_rgba(0,0,0,0.85)] ${className}`}>
    <svg width="86" height="74" viewBox="0 0 86 74" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Brass Gold Gradient */}
        <linearGradient id="brassCornerRight" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F9E29D" />
          <stop offset="40%" stopColor="#C5A059" />
          <stop offset="80%" stopColor="#8C682E" />
          <stop offset="100%" stopColor="#4A3412" />
        </linearGradient>

        {/* Peach Blossom Petal Radial Gradient */}
        <radialGradient id="petalPink" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFCCD5" />
          <stop offset="60%" stopColor="#F06292" />
          <stop offset="100%" stopColor="#AD1457" />
        </radialGradient>

        <radialGradient id="petalDark" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFA4B6" />
          <stop offset="70%" stopColor="#C2185B" />
          <stop offset="100%" stopColor="#880E4F" />
        </radialGradient>
      </defs>

      {/* --- Antique Brass Corner Bracket (Mirrored) --- */}
      <path
        d="M84 32 V8 C84 4.686 81.314 2 78 2 H54 C60 5 64 10 66 16 C70 16 74 18 76 22 C80 24 82 28 84 32 Z"
        fill="url(#brassCornerRight)"
        stroke="#F5DA88"
        strokeWidth="0.75"
      />
      <circle cx="76" cy="8" r="1.5" fill="#FFF2BF" />

      {/* --- Delicate Brown Blossom Twig --- */}
      <path
        d="M86 4 Q65 10 44 14 Q28 17 12 16"
        stroke="#4E342E"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Small side twigs */}
      <path d="M52 12 Q45 22 42 26" stroke="#4E342E" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M30 15 Q26 24 22 28" stroke="#4E342E" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M68 8 Q65 18 62 20" stroke="#4E342E" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* --- Flower 1: Main Large Blooming Peach Flower on Right --- */}
      <g transform="translate(68, 16)">
        {/* 5 rounded petals */}
        <circle cx="0" cy="-6" r="4.5" fill="url(#petalPink)" />
        <circle cx="6" cy="-2" r="4.5" fill="url(#petalPink)" />
        <circle cx="4" cy="5" r="4.5" fill="url(#petalPink)" />
        <circle cx="-4" cy="5" r="4.5" fill="url(#petalPink)" />
        <circle cx="-6" cy="-2" r="4.5" fill="url(#petalPink)" />
        {/* Flower Center with Gold Pistil */}
        <circle cx="0" cy="0" r="3" fill="#880E4F" />
        <circle cx="0" cy="0" r="1.5" fill="#FFF59D" />
        <circle cx="-1" cy="-1.5" r="0.6" fill="#FFD54F" />
        <circle cx="1.5" cy="-1" r="0.6" fill="#FFD54F" />
        <circle cx="1" cy="1.5" r="0.6" fill="#FFD54F" />
      </g>

      {/* --- Flower 2: Side Blossom Flower in Center --- */}
      <g transform="translate(44, 24)">
        <circle cx="0" cy="-5" r="3.8" fill="url(#petalDark)" />
        <circle cx="5" cy="-1" r="3.8" fill="url(#petalDark)" />
        <circle cx="3" cy="4" r="3.8" fill="url(#petalDark)" />
        <circle cx="-3" cy="4" r="3.8" fill="url(#petalDark)" />
        <circle cx="-5" cy="-1" r="3.8" fill="url(#petalDark)" />
        <circle cx="0" cy="0" r="2.2" fill="#4A0020" />
        <circle cx="0" cy="0" r="1.2" fill="#FFF59D" />
      </g>

      {/* --- Flower 3: Delicate Bud on Tip --- */}
      <g transform="translate(18, 20)">
        <ellipse cx="0" cy="0" rx="3.5" ry="2.5" transform="rotate(-20)" fill="url(#petalDark)" />
        <path d="M-3 2 C-2 4 1 4 2 2" stroke="#2E7D32" strokeWidth="1" fill="none" />
      </g>
      {/* Tiny red petal falling */}
      <ellipse cx="28" cy="38" rx="2" ry="1.4" transform="rotate(35)" fill="#F06292" opacity="0.8" />
    </svg>
  </div>
));

/**
 * 3. BOTTOM-RIGHT CORNER: Intricate Brass Cloud & Dragon Filigree Bracket (Miếng bịt đồng mây cuộn)
 */
export const CornerBottomRightBrass: React.FC<{ className?: string }> = React.memo(({ className = '' }) => (
  <div className={`absolute -bottom-1.5 -right-1.5 pointer-events-none select-none z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${className}`}>
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brassBR" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#F9E29D" />
          <stop offset="40%" stopColor="#C5A059" />
          <stop offset="80%" stopColor="#8C682E" />
          <stop offset="100%" stopColor="#3E2A0E" />
        </linearGradient>
      </defs>

      {/* Outer bracket contour */}
      <path
        d="M46 16 V40 C46 43.314 43.314 46 40 46 H16 C22 43 26 38 28 32 C32 32 36 30 38 26 C42 24 44 20 46 16 Z"
        fill="url(#brassBR)"
        stroke="#F5DA88"
        strokeWidth="0.75"
      />
      {/* Traditional cloud scroll carving */}
      <path
        d="M42 38 C40 42 34 42 32 39 C30 36 33 33 36 34 C38 35 40 33 38 30"
        stroke="#3A240A"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="38" cy="40" r="1.5" fill="#FFF2BF" />
    </svg>
  </div>
));

/**
 * 4. BOTTOM-LEFT CORNER: Antique Brass Bracket with Soft Ink-wash Brush Flourish (Mực tàu loang nhẹ)
 */
export const CornerBottomLeft: React.FC<{ className?: string }> = React.memo(({ className = '' }) => (
  <div className={`absolute -bottom-1.5 -left-1.5 pointer-events-none select-none z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${className}`}>
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brassBL" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F9E29D" />
          <stop offset="40%" stopColor="#C5A059" />
          <stop offset="80%" stopColor="#8C682E" />
          <stop offset="100%" stopColor="#3E2A0E" />
        </linearGradient>
      </defs>

      {/* Outer bracket contour */}
      <path
        d="M2 16 V40 C2 43.314 4.686 46 8 46 H32 C26 43 22 38 20 32 C16 32 12 30 10 26 C6 24 4 20 2 16 Z"
        fill="url(#brassBL)"
        stroke="#F5DA88"
        strokeWidth="0.75"
      />
      {/* Cloud swirl carving */}
      <path
        d="M6 38 C8 42 14 42 16 39 C18 36 15 33 12 34 C10 35 8 33 10 30"
        stroke="#3A240A"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="10" cy="40" r="1.5" fill="#FFF2BF" />
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
