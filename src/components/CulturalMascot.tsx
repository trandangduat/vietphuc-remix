import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ActiveOutfitState, AIOverviewResult } from '../types';
import { evaluateCulturalOutfit } from '../data/culturalEvaluator';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  BookCheck,
  X,
  Lock,
  ChevronRight,
  RotateCw,
} from 'lucide-react';
import { HeritageModal } from './heritage/HeritageFrame';

interface CulturalMascotProps {
  outfit: ActiveOutfitState;
  isLoggedIn: boolean;
  onLoginPrompt: () => void;
}

export const CulturalMascot: React.FC<CulturalMascotProps> = ({
  outfit,
  isLoggedIn,
  onLoginPrompt,
}) => {
  // Modal open state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Thinking state & speech bubble
  const [isThinking, setIsThinking] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Current analysis result
  const analysis = useMemo<AIOverviewResult>(() => evaluateCulturalOutfit(outfit), [
    outfit.topPiece?.id,
    outfit.bottomPiece?.id,
    outfit.footwearPiece?.id,
    outfit.accessoryPiece?.id,
    outfit.event.id,
  ]);

  // Track previous outfit signature to trigger "Thinking" state
  const prevSignatureRef = useRef<string>('');
  const isInitialMount = useRef(true);

  useEffect(() => {
    const currentSignature = `${outfit.topPiece?.id || 'none'}-${outfit.bottomPiece?.id || 'none'}-${outfit.footwearPiece?.id || 'none'}-${outfit.accessoryPiece?.id || 'none'}-${outfit.event.id}`;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevSignatureRef.current = currentSignature;
      return;
    }

    if (prevSignatureRef.current !== currentSignature) {
      prevSignatureRef.current = currentSignature;

      // Trigger Thinking state
      setIsThinking(true);
      setShowBubble(false);

      if (bubbleTimerRef.current) {
        clearTimeout(bubbleTimerRef.current);
      }

      // After 800ms of "pondering court customs", show speech bubble
      const thinkTimer = setTimeout(() => {
        setIsThinking(false);
        setShowBubble(true);

        // Auto-dismiss bubble after 5.5s
        bubbleTimerRef.current = setTimeout(() => {
          setShowBubble(false);
        }, 5500);
      }, 800);

      return () => {
        clearTimeout(thinkTimer);
      };
    }
  }, [
    outfit.topPiece?.id,
    outfit.bottomPiece?.id,
    outfit.footwearPiece?.id,
    outfit.accessoryPiece?.id,
    outfit.event.id,
  ]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    };
  }, []);

  // Free Dragging Position State (No snap to edge)
  const MASCOT_SIZE = 64;
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vietphuc_mascot_pos');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (
            typeof parsed.x === 'number' &&
            typeof parsed.y === 'number' &&
            parsed.x >= 0 &&
            parsed.x <= window.innerWidth - MASCOT_SIZE &&
            parsed.y >= 70 &&
            parsed.y <= window.innerHeight - MASCOT_SIZE
          ) {
            return parsed;
          }
        }
      } catch (e) {
        // fallback
      }
      return {
        x: Math.max(16, window.innerWidth - 88),
        y: Math.max(80, window.innerHeight - 100),
      };
    }
    return { x: 500, y: 500 };
  });

  // Drag handling refs
  const isDraggingRef = useRef(false);
  const startPosRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });
  const hasMovedRef = useRef(false);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only primary click
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startPosRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: position.x,
      startY: position.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvent.clientX - startPosRef.current.mouseX;
      const dy = moveEvent.clientY - startPosRef.current.mouseY;

      if (Math.hypot(dx, dy) > 5) {
        hasMovedRef.current = true;
      }

      const newX = Math.min(
        Math.max(10, startPosRef.current.startX + dx),
        window.innerWidth - MASCOT_SIZE - 10
      );
      const newY = Math.min(
        Math.max(72, startPosRef.current.startY + dy),
        window.innerHeight - MASCOT_SIZE - 10
      );

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // Save position to localStorage
      setPosition((current) => {
        try {
          localStorage.setItem('vietphuc_mascot_pos', JSON.stringify(current));
        } catch (e) {
          // ignore
        }
        return current;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startPosRef.current = {
      mouseX: touch.clientX,
      mouseY: touch.clientY,
      startX: position.x,
      startY: position.y,
    };

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (!isDraggingRef.current || moveEvent.touches.length !== 1) return;
      const moveTouch = moveEvent.touches[0];
      const dx = moveTouch.clientX - startPosRef.current.mouseX;
      const dy = moveTouch.clientY - startPosRef.current.mouseY;

      if (Math.hypot(dx, dy) > 5) {
        hasMovedRef.current = true;
      }

      const newX = Math.min(
        Math.max(10, startPosRef.current.startX + dx),
        window.innerWidth - MASCOT_SIZE - 10
      );
      const newY = Math.min(
        Math.max(72, startPosRef.current.startY + dy),
        window.innerHeight - MASCOT_SIZE - 10
      );

      setPosition({ x: newX, y: newY });
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);

      setPosition((current) => {
        try {
          localStorage.setItem('vietphuc_mascot_pos', JSON.stringify(current));
        } catch (e) {
          // ignore
        }
        return current;
      });
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  // Click mascot action
  const handleClickMascot = () => {
    if (hasMovedRef.current) return; // Prevent click if user dragged
    setIsModalOpen(true);
    setShowBubble(false);
  };

  // Determine speech bubble direction based on current screen position
  const isRightHalf = position.x > (typeof window !== 'undefined' ? window.innerWidth / 2 : 500);
  const isBottomHalf = position.y > (typeof window !== 'undefined' ? window.innerHeight - 200 : 500);

  // Forbid displaying mascot assistant if user is not logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      {/* FLOATING DRAGGABLE MASCOT CONTAINER */}
      <div
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 60,
          touchAction: 'none',
        }}
        className="select-none font-sans"
      >
        {/* SPEECH BUBBLE (Heritage Mini-Popup Style) */}
        {showBubble && !isThinking && (
          <div
            style={{
              position: 'absolute',
              borderRadius: '8px',
              ...(isRightHalf ? { right: '100%', marginRight: '14px' } : { left: '100%', marginLeft: '14px' }),
              ...(isBottomHalf ? { bottom: '-6px' } : { top: '-6px' }),
            }}
            className="w-72 sm:w-80 bg-gradient-to-b from-[#11141C] via-[#0C0E14] to-[#07090D] border border-[#C5A059]/65 p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.95)] animate-in fade-in zoom-in-95 duration-200 text-[#EDE5D8]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bubble Tail arrow pointing to mascot */}
            <div
              style={{
                position: 'absolute',
                ...(isRightHalf
                  ? { right: '-8px', borderLeft: '8px solid #C5A059' }
                  : { left: '-8px', borderRight: '8px solid #C5A059' }),
                ...(isBottomHalf ? { bottom: '24px' } : { top: '24px' }),
                width: 0,
                height: 0,
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
              }}
            />

            {/* Bubble Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#C5A059]/30">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[#C5A059] font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Bé Nghê Phán:</span>
                </span>
                {analysis.totalScore > 0 && (
                  <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-[4px] bg-[#12161F] text-[#D4AF37] border border-[#C5A059]/50">
                    {analysis.totalScore}/10
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {analysis.culturalStatus === 'suitable' ? (
                  <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase rounded-[3px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                    Phù hợp
                  </span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase rounded-[3px] bg-amber-950/80 text-amber-300 border border-amber-500/40">
                    Lưu ý
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowBubble(false)}
                  className="text-[#EDE5D8]/70 hover:text-white p-0.5 transition-colors cursor-pointer"
                  title="Đóng nhận xét"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bubble Body: Mascot Quote (Sans-serif) */}
            <p className="font-sans text-xs text-[#EDE5D8]/95 leading-relaxed my-2.5">
              "{analysis.mascotQuote || analysis.criteria.colorHarmony.comment}"
            </p>

            {/* Bubble Footer Action */}
            <button
              type="button"
              onClick={() => {
                setShowBubble(false);
                setIsModalOpen(true);
              }}
              className="w-full py-1.5 px-2.5 rounded-[6px] bg-[#161B26] hover:bg-[#1E2433] border border-[#C5A059]/40 hover:border-[#D4AF37] text-[11px] font-sans font-bold text-[#D4AF37] flex items-center justify-center gap-1 transition-all uppercase tracking-wider cursor-pointer"
            >
              <span>Xem luận giải chi tiết</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* MASCOT AVATAR BUTTON (DRAGGABLE & CLICKABLE) */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={handleClickMascot}
          className="relative w-16 h-16 cursor-grab active:cursor-grabbing transition-transform active:scale-95 group"
          title="Bé Nghê Cung Đình - Nhấp để xem Đánh giá Văn hóa"
        >
          {/* Outer glowing aura ring */}
          <div
            className={`absolute -inset-1 rounded-full opacity-70 blur-sm transition-all duration-300 ${
              isThinking
                ? 'bg-gradient-to-r from-imperial-gold via-amber-400 to-imperial-red-bright animate-spin'
                : 'bg-imperial-gold/30 group-hover:opacity-100 group-hover:bg-imperial-gold/50'
            }`}
          />

          {/* Mascot Circle Surface */}
          <div
            className={`relative w-full h-full rounded-full border-2 p-1.5 flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.85)] transition-all ${
              isThinking
                ? 'border-imperial-gold bg-lacquer-card ring-2 ring-imperial-gold/70 animate-pulse'
                : 'border-imperial-gold/80 bg-gradient-to-b from-lacquer-surface to-lacquer group-hover:border-imperial-gold group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]'
            }`}
          >
            {/* SVG MASCOT: BÉ NGHÊ CUNG ĐÌNH CHIBI */}
            <svg
              viewBox="0 0 100 100"
              className={`w-full h-full drop-shadow filter transition-transform ${
                isThinking ? 'scale-105' : 'group-hover:scale-105'
              }`}
            >
              {/* Halos & Traditional Clouds (Vân mây) */}
              <circle cx="50" cy="50" r="46" fill="#181512" stroke="#D4AF37" strokeWidth="2" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="42" fill="#241B12" />

              {/* Royal Horns / Flame Mane (Sừng Nghê uốn lượn phong cách triều Nguyễn) */}
              <path
                d="M32 26 C26 12, 14 18, 22 28 C26 33, 31 34, 34 32 Z"
                fill="#D4AF37"
                stroke="#8A1C14"
                strokeWidth="1.5"
              />
              <path
                d="M68 26 C74 12, 86 18, 78 28 C74 33, 69 34, 66 32 Z"
                fill="#D4AF37"
                stroke="#8A1C14"
                strokeWidth="1.5"
              />

              {/* Royal Cap / Headdress gem (Ngọc bội đỉnh đầu) */}
              <ellipse cx="50" cy="22" rx="7" ry="9" fill="#8A1C14" stroke="#D4AF37" strokeWidth="2" />
              <circle cx="50" cy="22" r="3" fill="#D4AF37" />

              {/* Lion Face Base (Mặt Nghê thuần Việt) */}
              <ellipse cx="50" cy="52" rx="30" ry="26" fill="#D4AF37" stroke="#684A12" strokeWidth="2" />

              {/* Mane Curls (Bờm xoắn ốc cung đình) */}
              <circle cx="24" cy="46" r="6" fill="#B38F2B" stroke="#684A12" strokeWidth="1" />
              <circle cx="22" cy="58" r="6" fill="#B38F2B" stroke="#684A12" strokeWidth="1" />
              <circle cx="76" cy="46" r="6" fill="#B38F2B" stroke="#684A12" strokeWidth="1" />
              <circle cx="78" cy="58" r="6" fill="#B38F2B" stroke="#684A12" strokeWidth="1" />

              {/* Snout & Cheeks */}
              <ellipse cx="50" cy="58" rx="16" ry="12" fill="#FAF8F5" stroke="#684A12" strokeWidth="1.5" />
              <ellipse cx="50" cy="51" rx="5" ry="3.5" fill="#8A1C14" />

              {/* Eyes with Thinking vs Normal Mode */}
              {isThinking ? (
                <>
                  {/* Thinking Eyes (Looking up thoughtfully) */}
                  <ellipse cx="38" cy="43" rx="5" ry="6" fill="#181512" />
                  <circle cx="39" cy="40" r="2.2" fill="#FFFFFF" />
                  <ellipse cx="62" cy="43" rx="5" ry="6" fill="#181512" />
                  <circle cx="63" cy="40" r="2.2" fill="#FFFFFF" />
                  {/* Pondering eyebrows */}
                  <path d="M33 34 Q39 30 43 35" stroke="#684A12" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M67 34 Q61 30 57 35" stroke="#684A12" strokeWidth="2" fill="none" strokeLinecap="round" />
                </>
              ) : (
                <>
                  {/* Happy / Expressive Eyes */}
                  <ellipse cx="38" cy="45" rx="5" ry="5.5" fill="#181512" />
                  <circle cx="37" cy="43" r="2.2" fill="#FFFFFF" />
                  <ellipse cx="62" cy="45" rx="5" ry="5.5" fill="#181512" />
                  <circle cx="61" cy="43" r="2.2" fill="#FFFFFF" />
                  {/* Gentle curved brows */}
                  <path d="M33 36 Q38 32 43 36" stroke="#684A12" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M67 36 Q62 32 57 36" stroke="#684A12" strokeWidth="2" fill="none" strokeLinecap="round" />
                </>
              )}

              {/* Whiskers / Mouth smile */}
              <path d="M44 60 Q50 64 56 60" stroke="#8A1C14" strokeWidth="2" fill="none" strokeLinecap="round" />
              <circle cx="34" cy="56" r="1" fill="#684A12" />
              <circle cx="36" cy="58" r="1" fill="#684A12" />
              <circle cx="66" cy="56" r="1" fill="#684A12" />
              <circle cx="64" cy="58" r="1" fill="#684A12" />

              {/* Royal Gold Bell / Khánh Vàng Cung Đình */}
              <path d="M42 74 L58 74 L54 82 L46 82 Z" fill="#D4AF37" stroke="#8A1C14" strokeWidth="1" />
              <circle cx="50" cy="80" r="2" fill="#8A1C14" />
            </svg>

            {/* THINKING ORBS INDICATOR OVERLAY */}
            {isThinking && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute -top-1 right-0 flex items-center gap-1 bg-black/90 border border-imperial-gold px-1.5 py-0.5 rounded-full shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-imperial-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-imperial-red-bright animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* PERMANENT MINI SCORE BADGE PINNED TO BOTTOM-RIGHT CORNER */}
          {analysis.totalScore > 0 && !isThinking && (
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-lacquer-card border border-imperial-gold text-[10px] font-serif font-bold text-imperial-gold shadow-md flex items-center gap-0.5">
              <span>★</span>
              <span>{analysis.totalScore}</span>
            </div>
          )}
        </div>
      </div>

      {/* DETAILED CULTURAL APPRAISAL MODAL POPUP */}
      <HeritageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thẩm Định Văn Hóa Cung Đình"
        subtitle={`Cố vấn Phục sức & Lễ nghi • Bối cảnh: ${outfit.event.name}`}
        icon={<Sparkles className="w-4 h-4 flex-shrink-0 text-[#C5A059]" />}
        badge={`${analysis.totalScore}/10 ĐIỂM`}
        source={analysis.source}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4 font-sans text-xs">
          {/* Score & Verdict Banner */}
          <div className="p-3.5 rounded-[8px] bg-[#0D111A] border border-[#C5A059]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="text-center p-2 rounded-[6px] bg-[#C5A059]/15 border border-[#C5A059]/40 flex-shrink-0 min-w-[70px]">
                <span className="block text-2xl font-bold text-[#D4AF37]">
                  {analysis.totalScore}
                </span>
                <span className="text-[9px] uppercase font-bold text-[#EDE5D8]/60 tracking-wider">
                  Thang 10
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  {analysis.culturalStatus === 'suitable' ? (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Chuẩn mực điển lễ</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-500/40">
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      <span>Cần cân nhắc</span>
                    </span>
                  )}
                </div>
                <p className="font-sans text-xs text-[#EDE5D8] leading-relaxed">
                  "{analysis.mascotQuote || analysis.criteria.colorHarmony.comment}"
                </p>
              </div>
            </div>

            {!isLoggedIn && (
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  onLoginPrompt();
                }}
                className="py-1.5 px-3 rounded-[6px] bg-gradient-to-r from-[#D4AF37] to-[#AA8232] text-[#0A0D12] font-bold text-[11px] uppercase tracking-wider shadow transition-all whitespace-nowrap flex items-center justify-center gap-1.5 hover:brightness-110 cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Lưu vào Lookbook</span>
              </button>
            )}
          </div>

          {/* 3 Core Pillars of Cultural Criteria */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5">
              <BookCheck className="w-3.5 h-3.5" />
              <span>3 Tiêu Chí Thẩm Định Cổ Phong</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* 1. Hài hòa màu sắc */}
              <div className="p-3 rounded-[8px] bg-[#0D111A] border border-[#C5A059]/25 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#C5A059] uppercase tracking-wider text-[10px]">
                      Hài hòa màu sắc
                    </span>
                    <span className="font-bold text-[#D4AF37] text-xs">
                      {analysis.criteria.colorHarmony.score}/10
                    </span>
                  </div>
                  <p className="text-[11px] text-[#EDE5D8]/85 leading-relaxed font-sans">
                    {analysis.criteria.colorHarmony.comment}
                  </p>
                </div>
              </div>

              {/* 2. Phù hợp sự kiện */}
              <div className="p-3 rounded-[8px] bg-[#0D111A] border border-[#C5A059]/25 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#C5A059] uppercase tracking-wider text-[10px]">
                      Phù hợp bối cảnh
                    </span>
                    <span className="font-bold text-[#D4AF37] text-xs">
                      {analysis.criteria.eventFit.score}/10
                    </span>
                  </div>
                  <p className="text-[11px] text-[#EDE5D8]/85 leading-relaxed font-sans">
                    {analysis.criteria.eventFit.comment}
                  </p>
                </div>
              </div>

              {/* 3. Chuẩn mực lễ nghi */}
              <div className="p-3 rounded-[8px] bg-[#0D111A] border border-[#C5A059]/25 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#C5A059] uppercase tracking-wider text-[10px]">
                      Chuẩn mực lễ nghi
                    </span>
                    <span className="font-bold text-[#D4AF37] text-xs">
                      {analysis.criteria.culturalNorm.score}/10
                    </span>
                  </div>
                  <p className="text-[11px] text-[#EDE5D8]/85 leading-relaxed font-sans">
                    {analysis.criteria.culturalNorm.comment}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Curator Editorial Synthesis Block */}
          <div className="p-3.5 rounded-[8px] bg-[#0D111A] border-l-4 border-l-[#C5A059] border border-[#C5A059]/30 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] text-[#C5A059] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Luận Giải Của Giám Tuyển Văn Hóa</span>
            </div>
            <p className="font-sans text-xs text-[#EDE5D8]/95 leading-relaxed">
              "{analysis.explanation}"
            </p>
            {analysis.suggestion && (
              <p className="text-[11px] text-amber-300 font-sans pt-1.5 border-t border-[#C5A059]/20">
                💡 <strong>Gợi ý phục sức:</strong> {analysis.suggestion}
              </p>
            )}
          </div>

          {/* Modal Footer button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="py-2 px-5 rounded-[6px] bg-gradient-to-r from-[#D4AF37] to-[#AA8232] hover:brightness-110 text-[#0A0D12] font-bold text-xs uppercase tracking-wider transition-all shadow cursor-pointer"
            >
              Đã Hiểu • Tiếp Tục Phối Đồ
            </button>
          </div>
        </div>
      </HeritageModal>
    </>
  );
};
