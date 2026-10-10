import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PIECES } from '../data/catalog';
import {
  PieceAlignment,
  AlignmentMap,
  DEFAULT_PIECE_ALIGNMENTS,
  DEFAULT_PIECE_ALIGNMENT,
  getStoredPieceAlignments,
  savePieceAlignments,
  resetPieceAlignments,
  exportAlignmentsAsCode,
  getAlignmentStyle,
} from '../data/pieceAlignments';
import { Piece, PieceCategory, GenderSelection } from '../types';
import {
  RotateCw,
  Save,
  Copy,
  RotateCcw,
  Check,
  ChevronLeft,
  Grid,
  Layers,
  Search,
  X,
  Crosshair,
  ZoomIn,
  ZoomOut,
  Maximize,
  Moon,
  Sun,
  Eye,
  SlidersHorizontal,
  Info,
  Sparkles,
  Command,
  ArrowUpDown,
  ArrowLeftRight,
} from 'lucide-react';

interface DevCalibratorScreenProps {
  onExit?: () => void;
}

export const DevCalibratorScreen: React.FC<DevCalibratorScreenProps> = ({ onExit }) => {
  // Load stored alignments or defaults
  const [alignments, setAlignments] = useState<AlignmentMap>(() => getStoredPieceAlignments());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: 'idle' | 'success_file' | 'success_local' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  // Mannequin Gender Selection: 'men' (Male ♂) | 'women' (Female ♀)
  const [mannequinGender, setMannequinGender] = useState<GenderSelection>('men');

  // Search & Filters for Pieces Library
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<PieceCategory | 'all'>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'men' | 'women' | 'unisex'>('all');

  // Currently active piece being calibrated (1-on-1 with mannequin)
  const [selectedPiece, setSelectedPiece] = useState<Piece>(() => {
    // Default to piece-ao-ngu-than-nam or first available piece
    const defaultPiece =
      PIECES.find((p) => p.id === 'piece-ao-ngu-than-nam') ||
      PIECES.find((p) => p.id === 'piece-quan-lua') ||
      PIECES[0];
    return defaultPiece;
  });

  // When selected piece changes, optionally recommend matching mannequin gender
  const handleSelectPiece = (piece: Piece) => {
    setSelectedPiece(piece);
    if (piece.gender === 'men' && mannequinGender !== 'men') {
      setMannequinGender('men');
    } else if (piece.gender === 'women' && mannequinGender !== 'women') {
      setMannequinGender('women');
    }
  };

  // Preview options
  const [bgMode, setBgMode] = useState<'checker' | 'dark' | 'light'>('checker');
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [pieceOpacity, setPieceOpacity] = useState(1);
  const [showFullOutfit, setShowFullOutfit] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState(1);

  // Current alignment for selected piece
  const pieceKey = selectedPiece.id;
  const currentAlignment: PieceAlignment =
    alignments[pieceKey] || DEFAULT_PIECE_ALIGNMENTS[pieceKey] || { ...DEFAULT_PIECE_ALIGNMENT };

  // Update alignment helper
  const updateCurrentAlignment = (patch: Partial<PieceAlignment>) => {
    if (!pieceKey) return;
    setAlignments((prev) => {
      const existing = prev[pieceKey] || DEFAULT_PIECE_ALIGNMENTS[pieceKey] || { ...DEFAULT_PIECE_ALIGNMENT };
      return {
        ...prev,
        [pieceKey]: {
          ...existing,
          ...patch,
        },
      };
    });
    setHasUnsavedChanges(true);
  };

  // Dragging support on canvas stage
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!stageRef.current) return;
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: currentAlignment.x,
      startY: currentAlignment.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStartRef.current || !stageRef.current) return;
    const stageRect = stageRef.current.getBoundingClientRect();
    const dxPx = e.clientX - dragStartRef.current.mouseX;
    const dyPx = e.clientY - dragStartRef.current.mouseY;

    // Normalize with canvas zoom
    const dxPercent = (dxPx / (stageRect.width * canvasZoom)) * 100;
    const dyPercent = (dyPx / (stageRect.height * canvasZoom)) * 100;

    const newX = Number((dragStartRef.current.startX + dxPercent).toFixed(2));
    const newY = Number((dragStartRef.current.startY + dyPercent).toFixed(2));

    updateCurrentAlignment({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.02 : -0.02;
    const newScale = Math.max(0.3, Math.min(2.5, Number((currentAlignment.scale + delta).toFixed(3))));
    updateCurrentAlignment({ scale: newScale });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const step = e.shiftKey ? 1.0 : 0.2;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        updateCurrentAlignment({ x: Number((currentAlignment.x - step).toFixed(2)) });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        updateCurrentAlignment({ x: Number((currentAlignment.x + step).toFixed(2)) });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        updateCurrentAlignment({ y: Number((currentAlignment.y - step).toFixed(2)) });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        updateCurrentAlignment({ y: Number((currentAlignment.y + step).toFixed(2)) });
      } else if (e.key === '[') {
        e.preventDefault();
        updateCurrentAlignment({ scale: Math.max(0.3, Number((currentAlignment.scale - 0.05).toFixed(3))) });
      } else if (e.key === ']') {
        e.preventDefault();
        updateCurrentAlignment({ scale: Math.min(2.5, Number((currentAlignment.scale + 0.05).toFixed(3))) });
      } else if (e.key.toLowerCase() === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentAlignment, pieceKey]);

  // Save handler - writes directly to file src/data/pieceAlignments.ts and updates localStorage
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await savePieceAlignments(alignments);
      setHasUnsavedChanges(false);
      setSaveStatus({
        type: res.savedToFile ? 'success_file' : 'success_local',
        message: res.message,
      });
      setTimeout(() => {
        setSaveStatus({ type: 'idle', message: '' });
      }, 4000);
    } catch (err: any) {
      setSaveStatus({
        type: 'error',
        message: err?.message || 'Có lỗi xảy ra khi lưu cấu hình!',
      });
      setTimeout(() => {
        setSaveStatus({ type: 'idle', message: '' });
      }, 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Copy code handler
  const handleCopyCode = async () => {
    const code = exportAlignmentsAsCode(alignments);
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      console.log('Exported code:\n', code);
    }
  };

  // Reset selected piece
  const handleResetCurrentPiece = () => {
    const def = DEFAULT_PIECE_ALIGNMENTS[pieceKey] || { ...DEFAULT_PIECE_ALIGNMENT };
    updateCurrentAlignment(def);
  };

  // Reset all pieces
  const handleResetAll = () => {
    if (window.confirm('Khôi phục toàn bộ cấu hình tất cả trang phục về mặc định ban đầu?')) {
      resetPieceAlignments();
      setAlignments({ ...DEFAULT_PIECE_ALIGNMENTS });
      setHasUnsavedChanges(false);
      setSaveStatus({
        type: 'success_local',
        message: 'Đã đặt lại toàn bộ tọa độ về mặc định!',
      });
      setTimeout(() => setSaveStatus({ type: 'idle', message: '' }), 3000);
    }
  };

  // Filtered pieces
  const displayedPieces = useMemo(() => {
    return PIECES.filter((p) => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (genderFilter !== 'all') {
        if (genderFilter === 'unisex' && p.gender !== 'unisex') return false;
        if (genderFilter === 'men' && p.gender !== 'men') return false;
        if (genderFilter === 'women' && p.gender !== 'women') return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(query);
        const matchColor = p.colorName?.toLowerCase().includes(query);
        const matchPeriod = p.culturalInfo?.period?.toLowerCase().includes(query);
        if (!matchName && !matchColor && !matchPeriod) return false;
      }
      return true;
    });
  }, [categoryFilter, genderFilter, searchQuery]);

  // Outfit references for selected gender
  const refTop = useMemo(() => {
    if (mannequinGender === 'men') {
      return (
        PIECES.find((p) => p.id === 'piece-ao-ngu-than-nam') ||
        PIECES.find((p) => p.category === 'top' && (p.gender === 'men' || p.gender === 'unisex'))
      );
    }
    return (
      PIECES.find((p) => p.id === 'piece-ao-tac-do') ||
      PIECES.find((p) => p.category === 'top' && (p.gender === 'women' || p.gender === 'unisex'))
    );
  }, [mannequinGender]);

  const refBottom = useMemo(() => {
    if (mannequinGender === 'men') {
      return (
        PIECES.find((p) => p.id === 'piece-quan-lua-den') ||
        PIECES.find((p) => p.id === 'piece-quan-tay') ||
        PIECES.find((p) => p.category === 'bottom')
      );
    }
    return PIECES.find((p) => p.id === 'piece-quan-lua') || PIECES.find((p) => p.category === 'bottom');
  }, [mannequinGender]);

  const refFootwear = useMemo(() => {
    if (mannequinGender === 'men') {
      return (
        PIECES.find((p) => p.id === 'piece-hai-nhung-den') ||
        PIECES.find((p) => p.id === 'piece-loafer') ||
        PIECES.find((p) => p.category === 'footwear')
      );
    }
    return PIECES.find((p) => p.id === 'piece-hai-nhung') || PIECES.find((p) => p.category === 'footwear');
  }, [mannequinGender]);

  const refAccessory = useMemo(() => {
    if (mannequinGender === 'men') {
      return PIECES.find((p) => p.id === 'piece-khan-dong-hoang-gia') || PIECES.find((p) => p.category === 'accessory');
    }
    return PIECES.find((p) => p.id === 'piece-non-la') || PIECES.find((p) => p.category === 'accessory');
  }, [mannequinGender]);

  // Compute piece transform style
  const activePieceStyle = {
    ...getAlignmentStyle(currentAlignment),
    opacity: pieceOpacity,
  };

  // Mannequin image source
  const mannequinSrc =
    mannequinGender === 'men' ? '/assets/mannequins/mannequin-men.png' : '/assets/mannequins/mannequin-base.png';

  // Count modified pieces
  const modifiedPiecesCount = useMemo(() => {
    return PIECES.filter((p) => {
      const a = alignments[p.id];
      if (!a) return false;
      const def = DEFAULT_PIECE_ALIGNMENTS[p.id] || DEFAULT_PIECE_ALIGNMENT;
      return (
        a.x !== def.x ||
        a.y !== def.y ||
        a.scale !== def.scale ||
        (a.scaleX ?? 1) !== (def.scaleX ?? 1) ||
        (a.scaleY ?? 1) !== (def.scaleY ?? 1) ||
        (a.rotate ?? 0) !== (def.rotate ?? 0)
      );
    }).length;
  }, [alignments]);

  return (
    <div className="min-h-screen bg-[#000000] text-[#f5f5f7] flex flex-col font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','SF_Pro_Text','Inter',sans-serif] selection:bg-[#0071e3]/40 selection:text-white select-none">
      {/* =========================================================================
          macOS Window Unified Header & Toolbar
         ========================================================================= */}
      <header className="sticky top-0 z-50 h-14 bg-[#16181d]/90 backdrop-blur-2xl border-b border-white/[0.08] px-4 flex items-center justify-between gap-3 shadow-[0_1px_12px_rgba(0,0,0,0.5)]">
        {/* Left: macOS Window Traffic Lights & Navigation */}
        <div className="flex items-center gap-3">
          {/* macOS Traffic Light Dots */}
          <div className="flex items-center gap-2 pr-1">
            <span
              onClick={onExit || (() => (window.location.href = '/'))}
              className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]/50 cursor-pointer shadow-sm hover:opacity-80 transition-opacity"
              title="Đóng cửa sổ"
            />
            <span
              className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]/50 cursor-pointer shadow-sm hover:opacity-80 transition-opacity"
              title="Thu nhỏ"
            />
            <span
              className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]/50 cursor-pointer shadow-sm hover:opacity-80 transition-opacity"
              title="Phóng to"
            />
          </div>

          <div className="h-4 w-px bg-white/10" />

          {/* Back Button */}
          <button
            onClick={onExit || (() => (window.location.href = '/'))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-white/[0.06] hover:bg-white/[0.1] active:bg-white/[0.16] border border-white/[0.08] text-xs font-medium text-white/90 transition-all shadow-sm"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Về Studio</span>
          </button>

          {/* Title & Pro Badge */}
          <div className="hidden sm:flex items-center gap-2 ml-1">
            <span className="text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-[#0071e3]/20 text-[#2997ff] border border-[#0071e3]/30">
              Dev Calibrator
            </span>
            <div className="leading-tight">
              <h1 className="text-xs font-semibold text-white tracking-tight flex items-center gap-1.5">
                <span>Trình Hiệu Chuẩn Trang Phục 2D</span>
              </h1>
              <p className="text-[10px] text-white/50">Căn chỉnh tỷ lệ phôi ma-nơ-canh Nam &amp; Nữ</p>
            </div>
          </div>
        </div>

        {/* Center: Apple Segmented Control for Mannequin Gender */}
        <div className="flex items-center">
          <div className="p-1 rounded-[12px] bg-black/50 border border-white/[0.1] flex items-center shadow-inner">
            {/* Male Mannequin Button */}
            <button
              onClick={() => setMannequinGender('men')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-[9px] text-xs font-medium transition-all cursor-pointer ${
                mannequinGender === 'men'
                  ? 'bg-[#0071e3] text-white shadow-[0_2px_8px_rgba(0,113,227,0.4)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
              }`}
              title="Chuyển sang Ma-nơ-canh Nam"
            >
              <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                <circle cx="10" cy="14" r="5" />
                <path d="M19 5l-5.4 5.4M19 5h-5M19 5v5" />
              </svg>
              <span>Nam (Men)</span>
            </button>

            {/* Female Mannequin Button */}
            <button
              onClick={() => setMannequinGender('women')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-[9px] text-xs font-medium transition-all cursor-pointer ${
                mannequinGender === 'women'
                  ? 'bg-[#0071e3] text-white shadow-[0_2px_8px_rgba(0,113,227,0.4)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
              }`}
              title="Chuyển sang Ma-nơ-canh Nữ"
            >
              <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                <circle cx="12" cy="9" r="5" />
                <path d="M12 14v7M9 18h6" />
              </svg>
              <span>Nữ (Women)</span>
            </button>
          </div>
        </div>

        {/* Right: Actions (Reset, Copy, Save to file) */}
        <div className="flex items-center gap-2">
          {/* Reset Current Piece */}
          <button
            onClick={handleResetCurrentPiece}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] bg-white/[0.05] hover:bg-white/[0.1] active:bg-white/[0.16] border border-white/[0.08] text-xs font-medium text-white/70 hover:text-white transition-all"
            title="Đặt lại món này về mặc định"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại món này</span>
          </button>

          {/* Copy TypeScript code */}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-white/[0.05] hover:bg-white/[0.1] active:bg-white/[0.16] border border-white/[0.08] text-xs font-medium text-white/90 transition-all"
            title="Sao chép toàn bộ mã cấu hình TypeScript"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-[#30d158]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Đã sao chép!' : 'Xuất mã TS'}</span>
          </button>

          {/* Save to Codebase (Primary Action Button) */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-[10px] text-xs font-semibold transition-all shadow-md ${
              saveStatus.type === 'success_file'
                ? 'bg-[#30d158] text-black shadow-[#30d158]/30'
                : isSaving
                ? 'bg-[#0071e3]/60 text-white cursor-wait'
                : hasUnsavedChanges
                ? 'bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-[0_4px_16px_rgba(0,113,227,0.45)] ring-2 ring-[#0071e3]/40'
                : 'bg-white/[0.08] hover:bg-white/[0.14] text-white/90 border border-white/[0.1]'
            }`}
            title="Ghi trực tiếp tọa độ vào file src/data/pieceAlignments.ts"
          >
            {isSaving ? (
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
            ) : saveStatus.type === 'success_file' ? (
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>
              {isSaving
                ? 'Đang lưu...'
                : saveStatus.type === 'success_file'
                ? 'Đã đồng bộ!'
                : hasUnsavedChanges
                ? 'Lưu thay đổi'
                : 'Đã lưu'}
            </span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          Apple Dynamic Island Style Floating Toast Notification
         ========================================================================= */}
      {saveStatus.type !== 'idle' && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-black/90 backdrop-blur-2xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-200">
          {saveStatus.type === 'success_file' && (
            <div className="w-5 h-5 rounded-full bg-[#30d158]/20 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-[#30d158] stroke-[3]" />
            </div>
          )}
          {saveStatus.type === 'success_local' && (
            <div className="w-5 h-5 rounded-full bg-[#ff9f0a]/20 flex items-center justify-center">
              <Info className="w-3.5 h-3.5 text-[#ff9f0a]" />
            </div>
          )}
          {saveStatus.type === 'error' && (
            <div className="w-5 h-5 rounded-full bg-[#ff453a]/20 flex items-center justify-center">
              <X className="w-3.5 h-3.5 text-[#ff453a]" />
            </div>
          )}
          <span className="text-xs font-medium text-white/90">{saveStatus.message}</span>
        </div>
      )}

      {/* =========================================================================
          Main Workspace: 3-Column macOS Pro Split View
          [1. Library / Source List] | [2. Canvas Viewport] | [3. Inspector Panel]
         ========================================================================= */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#0a0b0e]">
        {/* -----------------------------------------------------------------------
            COLUMN 1: Library & Catalog (macOS Source List)
           ----------------------------------------------------------------------- */}
        <div className="w-full lg:w-80 bg-[#121316] border-b lg:border-b-0 lg:border-r border-white/[0.08] flex flex-col flex-shrink-0">
          {/* Search Field */}
          <div className="p-3 border-b border-white/[0.06] space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm trang phục..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 rounded-[10px] bg-white/[0.05] border border-white/[0.08] text-xs text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/50 focus:border-[#0071e3] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Segmented Control */}
            <div className="grid grid-cols-5 p-1 rounded-[10px] bg-black/40 border border-white/[0.06] text-[11px] font-medium">
              {(
                [
                  { id: 'all', label: 'Tất cả' },
                  { id: 'top', label: 'Áo' },
                  { id: 'bottom', label: 'Quần' },
                  { id: 'footwear', label: 'Giày' },
                  { id: 'accessory', label: 'Nón' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`py-1 text-center rounded-[7px] transition-all cursor-pointer ${
                    categoryFilter === cat.id
                      ? 'bg-white/[0.16] text-white shadow-sm font-semibold'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Gender Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-0.5">
              <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider pr-1">Dành cho:</span>
              {(
                [
                  { id: 'all', label: 'Tất cả' },
                  { id: 'men', label: 'Nam ♂' },
                  { id: 'women', label: 'Nữ ♀' },
                  { id: 'unisex', label: 'Unisex' },
                ] as const
              ).map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGenderFilter(g.id)}
                  className={`px-2 py-0.5 rounded-[7px] text-[11px] font-medium transition-all flex-shrink-0 ${
                    genderFilter === g.id
                      ? 'bg-[#0071e3]/20 text-[#2997ff] border border-[#0071e3]/40'
                      : 'bg-white/[0.04] text-white/50 hover:text-white/80 border border-transparent'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Piece Cards List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
            {displayedPieces.length === 0 ? (
              <div className="p-8 text-center text-xs text-white/40">
                Không tìm thấy trang phục phù hợp với bộ lọc.
              </div>
            ) : (
              displayedPieces.map((piece) => {
                const isSelected = piece.id === selectedPiece.id;
                const align = alignments[piece.id] || DEFAULT_PIECE_ALIGNMENTS[piece.id] || DEFAULT_PIECE_ALIGNMENT;
                const defAlign = DEFAULT_PIECE_ALIGNMENTS[piece.id] || DEFAULT_PIECE_ALIGNMENT;
                const isModified =
                  align.x !== defAlign.x ||
                  align.y !== defAlign.y ||
                  align.scale !== defAlign.scale ||
                  (align.scaleX ?? 1) !== (defAlign.scaleX ?? 1) ||
                  (align.scaleY ?? 1) !== (defAlign.scaleY ?? 1) ||
                  (align.rotate ?? 0) !== (defAlign.rotate ?? 0);

                return (
                  <div
                    key={piece.id}
                    onClick={() => handleSelectPiece(piece)}
                    className={`p-2.5 rounded-[12px] border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[#0071e3]/15 border-[#0071e3]/60 shadow-[0_2px_12px_rgba(0,113,227,0.2)] ring-1 ring-[#0071e3]/40'
                        : 'bg-white/[0.03] border-white/[0.04] hover:bg-white/[0.07] hover:border-white/[0.08]'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-[10px] bg-black/40 border border-white/[0.08] flex items-center justify-center p-1 flex-shrink-0">
                      <img
                        src={piece.thumbnailUrl || piece.assetUrl}
                        alt={piece.name}
                        className="max-h-full max-w-full object-contain filter drop-shadow"
                      />
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4
                          className={`text-xs font-semibold truncate ${
                            isSelected ? 'text-white' : 'text-white/90'
                          }`}
                        >
                          {piece.name}
                        </h4>
                        {isModified && (
                          <span
                            className="w-2 h-2 rounded-full bg-[#30d158] flex-shrink-0 shadow-[0_0_6px_rgba(48,209,88,0.8)]"
                            title="Món này đã được tùy chỉnh"
                          />
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-white/50">
                        <span className="capitalize">
                          {piece.category === 'top'
                            ? 'Áo'
                            : piece.category === 'bottom'
                            ? 'Quần'
                            : piece.category === 'footwear'
                            ? 'Giày'
                            : 'Nón/Phụ kiện'}
                        </span>
                        <span>•</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                            piece.gender === 'men'
                              ? 'bg-blue-500/15 text-blue-400'
                              : piece.gender === 'women'
                              ? 'bg-pink-500/15 text-pink-400'
                              : 'bg-white/10 text-white/70'
                          }`}
                        >
                          {piece.gender === 'men' ? 'Nam' : piece.gender === 'women' ? 'Nữ' : 'Unisex'}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-white/40 text-[10px]">
                          X:{align.x} Y:{align.y}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Summary Bar */}
          <div className="p-3 border-t border-white/[0.06] bg-[#0e0f12] flex items-center justify-between text-[11px] text-white/50">
            <span>
              Tổng số: <strong className="text-white font-medium">{displayedPieces.length}</strong> món
            </span>
            {modifiedPiecesCount > 0 && (
              <span className="text-[#30d158] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
                Đã chỉnh {modifiedPiecesCount} món
              </span>
            )}
          </div>
        </div>

        {/* -----------------------------------------------------------------------
            COLUMN 2: Canvas Viewport (Center Stage)
           ----------------------------------------------------------------------- */}
        <div className="flex-1 bg-[#0a0b0e] p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/[0.08]">
          {/* Top Floating Control Capsule (Apple Dynamic Island Inspired) */}
          <div className="absolute top-4 z-40 flex items-center gap-1.5 p-1 rounded-full bg-[#1c1d22]/85 backdrop-blur-2xl border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-xs">
            {/* Background Mode Switcher */}
            <div className="flex items-center p-0.5 rounded-full bg-black/40">
              <button
                onClick={() => setBgMode('checker')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  bgMode === 'checker' ? 'bg-white/20 text-white font-medium shadow-sm' : 'text-white/50 hover:text-white'
                }`}
                title="Lưới Pixel"
              >
                Lưới
              </button>
              <button
                onClick={() => setBgMode('dark')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  bgMode === 'dark' ? 'bg-white/20 text-white font-medium shadow-sm' : 'text-white/50 hover:text-white'
                }`}
                title="Phông nền tối"
              >
                Tối
              </button>
              <button
                onClick={() => setBgMode('light')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  bgMode === 'light' ? 'bg-white/20 text-white font-medium shadow-sm' : 'text-white/50 hover:text-white'
                }`}
                title="Phông nền sáng (rất dễ nhìn khi căn chỉnh đồ đen)"
              >
                Sáng
              </button>
            </div>

            <div className="w-px h-4 bg-white/10" />

            {/* Anatomical Guidelines Switch */}
            <button
              onClick={() => setShowGuidelines(!showGuidelines)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                showGuidelines
                  ? 'bg-[#0071e3] text-white font-medium shadow-[0_2px_8px_rgba(0,113,227,0.4)]'
                  : 'text-white/50 hover:text-white'
              }`}
              title="Bật/Tắt thước gióng giải phẫu (Vai, Eo, Đầu gối, Cổ chân)"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Thước gióng</span>
            </button>

            {/* Full Outfit Context Switch */}
            <button
              onClick={() => setShowFullOutfit(!showFullOutfit)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                showFullOutfit
                  ? 'bg-purple-600 text-white font-medium shadow-[0_2px_8px_rgba(147,51,234,0.4)]'
                  : 'text-white/50 hover:text-white'
              }`}
              title="Bật/Tắt xem cùng trang phục phối mẫu để kiểm tra tổng thể"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Xem cùng outfit</span>
            </button>

            <div className="w-px h-4 bg-white/10" />

            {/* Quick Gender Toggle on Canvas */}
            <button
              onClick={() => setMannequinGender(mannequinGender === 'men' ? 'women' : 'men')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-white/70 hover:text-white hover:bg-white/[0.08] transition-all"
              title="Đổi nhanh ma-nơ-canh Nam/Nữ"
            >
              <span>Phôi:</span>
              <strong className="text-white font-semibold">
                {mannequinGender === 'men' ? 'Nam ♂' : 'Nữ ♀'}
              </strong>
            </button>
          </div>

          {/* Interactive Mannequin Canvas Container (Aspect 3:4) */}
          <div
            ref={stageRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            style={{ transform: `scale(${canvasZoom})` }}
            className={`relative w-full max-w-[430px] aspect-[3/4] rounded-[22px] border border-white/[0.12] shadow-[0_24px_70px_rgba(0,0,0,0.85)] flex items-center justify-center overflow-hidden cursor-move select-none transition-transform duration-100 ${
              bgMode === 'checker'
                ? 'bg-[radial-gradient(#2c3038_1px,transparent_1px)] [background-size:16px_16px] bg-[#14161c]'
                : bgMode === 'dark'
                ? 'bg-[#0f1014]'
                : 'bg-[#e5e5ea]'
            }`}
          >
            {/* Layer 1: Selected Mannequin (Male vs Female Base) */}
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
              <img
                src={mannequinSrc}
                alt={mannequinGender === 'men' ? 'Ma-nơ-canh Nam' : 'Ma-nơ-canh Nữ'}
                className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]"
              />
            </div>

            {/* Optional Full Outfit Context (Semi-transparent overlay for reference) */}
            {showFullOutfit && (
              <>
                {refBottom && refBottom.id !== selectedPiece.id && (
                  <div
                    className="absolute inset-0 z-20 pointer-events-none opacity-40"
                    style={getAlignmentStyle(
                      alignments[refBottom.id] || DEFAULT_PIECE_ALIGNMENTS[refBottom.id] || DEFAULT_PIECE_ALIGNMENT
                    )}
                  >
                    <img src={refBottom.assetUrl} alt="Ref Bottom" className="w-full h-full object-contain" />
                  </div>
                )}
                {refFootwear && refFootwear.id !== selectedPiece.id && (
                  <div
                    className="absolute inset-0 z-30 pointer-events-none opacity-40"
                    style={getAlignmentStyle(
                      alignments[refFootwear.id] || DEFAULT_PIECE_ALIGNMENTS[refFootwear.id] || DEFAULT_PIECE_ALIGNMENT
                    )}
                  >
                    <img src={refFootwear.assetUrl} alt="Ref Footwear" className="w-full h-full object-contain" />
                  </div>
                )}
                {refTop && refTop.id !== selectedPiece.id && (
                  <div
                    className="absolute inset-0 z-40 pointer-events-none opacity-40"
                    style={getAlignmentStyle(
                      alignments[refTop.id] || DEFAULT_PIECE_ALIGNMENTS[refTop.id] || DEFAULT_PIECE_ALIGNMENT
                    )}
                  >
                    <img src={refTop.assetUrl} alt="Ref Top" className="w-full h-full object-contain" />
                  </div>
                )}
                {refAccessory && refAccessory.id !== selectedPiece.id && (
                  <div
                    className="absolute inset-0 z-50 pointer-events-none opacity-40"
                    style={getAlignmentStyle(
                      alignments[refAccessory.id] ||
                        DEFAULT_PIECE_ALIGNMENTS[refAccessory.id] ||
                        DEFAULT_PIECE_ALIGNMENT
                    )}
                  >
                    <img src={refAccessory.assetUrl} alt="Ref Accessory" className="w-full h-full object-contain" />
                  </div>
                )}
              </>
            )}

            {/* THE ISOLATED TARGET PIECE BEING CALIBRATED */}
            <div
              className="absolute inset-0 z-40 pointer-events-none transition-transform duration-75 ring-1 ring-[#0071e3]/70"
              style={activePieceStyle}
            >
              <img
                src={selectedPiece.assetUrl}
                alt={selectedPiece.name}
                className="w-full h-full object-contain filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
              />
            </div>

            {/* Anatomical Reference Guidelines */}
            {showGuidelines && (
              <div className="absolute inset-0 pointer-events-none z-30 opacity-75">
                {/* Đỉnh đầu (Y ≈ 15%) */}
                <div className="absolute top-[15%] left-0 right-0 border-b border-dashed border-sky-400/70">
                  <span className="text-[9px] font-mono text-sky-300 bg-black/85 px-1.5 py-0.5 rounded-[4px] absolute right-2 -top-3">
                    Đỉnh đầu (15%)
                  </span>
                </div>
                {/* Vai & Cổ áo (Y ≈ 25%) */}
                <div className="absolute top-[25%] left-0 right-0 border-b border-dashed border-emerald-400/70">
                  <span className="text-[9px] font-mono text-emerald-300 bg-black/85 px-1.5 py-0.5 rounded-[4px] absolute right-2 -top-3">
                    Vai / Cổ áo (25%)
                  </span>
                </div>
                {/* Eo & Cạp quần (Y ≈ 50%) */}
                <div className="absolute top-[50%] left-0 right-0 border-b-2 border-dashed border-[#ff9f0a]">
                  <span className="text-[9px] font-mono text-[#ff9f0a] bg-black/85 px-1.5 py-0.5 rounded-[4px] absolute right-2 -top-3 font-semibold">
                    Eo / Cạp quần (50%)
                  </span>
                </div>
                {/* Gối (Y ≈ 72%) */}
                <div className="absolute top-[72%] left-0 right-0 border-b border-dashed border-amber-400/70">
                  <span className="text-[9px] font-mono text-amber-300 bg-black/85 px-1.5 py-0.5 rounded-[4px] absolute right-2 -top-3">
                    Đầu gối (72%)
                  </span>
                </div>
                {/* Gấu quần / Cổ chân (Y ≈ 87.5%) */}
                <div className="absolute top-[87.5%] left-0 right-0 border-b-2 border-dashed border-rose-400">
                  <span className="text-[9px] font-mono text-rose-300 bg-black/85 px-1.5 py-0.5 rounded-[4px] absolute right-2 -top-3 font-semibold">
                    Gấu quần / Cổ chân (87.5%)
                  </span>
                </div>
                {/* Bàn chân (Y ≈ 94%) */}
                <div className="absolute top-[94%] left-0 right-0 border-b border-dashed border-purple-400/70">
                  <span className="text-[9px] font-mono text-purple-300 bg-black/85 px-1.5 py-0.5 rounded-[4px] absolute right-2 -top-3">
                    Bàn chân (94%)
                  </span>
                </div>

                {/* Trục giữa cơ thể (Center line) */}
                <div className="absolute left-1/2 top-0 bottom-0 border-r border-dashed border-[#0071e3]/60" />
              </div>
            )}

            {/* Live Dragging HUD Capsule */}
            {isDragging && (
              <div className="absolute bottom-4 px-3.5 py-1.5 rounded-full bg-black/90 backdrop-blur-md border border-white/20 text-white font-mono text-xs shadow-2xl flex items-center gap-2 pointer-events-none z-50">
                <Crosshair className="w-3.5 h-3.5 text-[#0071e3]" />
                <span>
                  X: {currentAlignment.x}% | Y: {currentAlignment.y}% | Zoom: {currentAlignment.scale}x
                </span>
              </div>
            )}
          </div>

          {/* Keyboard Shortcut Hints Footer */}
          <div className="mt-4 flex items-center justify-center flex-wrap gap-2 text-[11px] text-white/50 text-center max-w-lg">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded-[5px] bg-white/[0.08] border border-white/[0.1] font-mono text-[10px] text-white/90">
                Kéo chuột
              </kbd>
              <span>Di chuyển</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded-[5px] bg-white/[0.08] border border-white/[0.1] font-mono text-[10px] text-white/90">
                Lăn chuột
              </kbd>
              <span>Phóng to/nhỏ</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded-[5px] bg-white/[0.08] border border-white/[0.1] font-mono text-[10px] text-white/90">
                ↑ ↓ ← →
              </kbd>
              <span>Vi chỉnh 0.2%</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded-[5px] bg-white/[0.08] border border-white/[0.1] font-mono text-[10px] text-white/90">
                [ ]
              </kbd>
              <span>Scale 0.05x</span>
            </span>
          </div>
        </div>

        {/* -----------------------------------------------------------------------
            COLUMN 3: Inspector Panel (macOS Utility Inspector)
           ----------------------------------------------------------------------- */}
        <div className="w-full lg:w-96 bg-[#121316] p-4 sm:p-5 overflow-y-auto flex flex-col gap-4 border-l border-white/[0.08] flex-shrink-0">
          {/* Active Piece Header Info Card */}
          <div className="p-3.5 rounded-[16px] bg-white/[0.04] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                Đang căn chỉnh:
              </span>
              <button
                onClick={handleResetCurrentPiece}
                className="text-[11px] text-[#ff453a] hover:underline font-medium"
              >
                Khôi phục gốc
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-[12px] bg-black/40 border border-white/[0.08] p-1.5 flex items-center justify-center flex-shrink-0">
                <img
                  src={selectedPiece.thumbnailUrl || selectedPiece.assetUrl}
                  alt={selectedPiece.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm text-white truncate tracking-tight">{selectedPiece.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-white/50 capitalize">
                    {selectedPiece.category === 'top'
                      ? 'Áo'
                      : selectedPiece.category === 'bottom'
                      ? 'Quần'
                      : selectedPiece.category === 'footwear'
                      ? 'Giày'
                      : 'Phụ kiện'}
                  </span>
                  <span>•</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      selectedPiece.gender === 'men'
                        ? 'bg-blue-500/15 text-blue-400'
                        : selectedPiece.gender === 'women'
                        ? 'bg-pink-500/15 text-pink-400'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {selectedPiece.gender === 'men'
                      ? 'Dành cho Nam'
                      : selectedPiece.gender === 'women'
                      ? 'Dành cho Nữ'
                      : 'Unisex'}
                  </span>
                </div>
                {selectedPiece.colorName && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-white/70">
                    {selectedPiece.swatchHex && (
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/20 flex-shrink-0 inline-block"
                        style={{ backgroundColor: selectedPiece.swatchHex }}
                      />
                    )}
                    <span className="truncate">{selectedPiece.colorName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section: Position (Vị trí X & Y) */}
          <div className="p-3.5 rounded-[16px] bg-white/[0.03] border border-white/[0.06] space-y-4">
            <h4 className="text-xs font-semibold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>Vị trí (Position)</span>
            </h4>

            {/* Position X (%) */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-white/60">Vị trí ngang (X)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.1"
                    value={currentAlignment.x}
                    onChange={(e) => updateCurrentAlignment({ x: parseFloat(e.target.value) || 0 })}
                    className="w-16 px-1.5 py-0.5 rounded-[6px] bg-black/40 border border-white/[0.1] text-xs font-mono text-right text-white focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
                  />
                  <span className="text-white/40 text-xs font-mono">%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCurrentAlignment({ x: Number((currentAlignment.x - 1).toFixed(2)) })}
                  className="px-2 py-1 rounded-[6px] bg-white/[0.06] hover:bg-white/[0.12] text-[11px] font-mono text-white/80"
                >
                  -1
                </button>
                <button
                  onClick={() => updateCurrentAlignment({ x: Number((currentAlignment.x - 0.2).toFixed(2)) })}
                  className="px-2 py-1 rounded-[6px] bg-white/[0.06] hover:bg-white/[0.12] text-[11px] font-mono text-white/80"
                >
                  -0.2
                </button>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  step="0.1"
                  value={currentAlignment.x}
                  onChange={(e) => updateCurrentAlignment({ x: parseFloat(e.target.value) })}
                  className="apple-slider flex-1"
                />
                <button
                  onClick={() => updateCurrentAlignment({ x: Number((currentAlignment.x + 0.2).toFixed(2)) })}
                  className="px-2 py-1 rounded-[6px] bg-white/[0.06] hover:bg-white/[0.12] text-[11px] font-mono text-white/80"
                >
                  +0.2
                </button>
                <button
                  onClick={() => updateCurrentAlignment({ x: Number((currentAlignment.x + 1).toFixed(2)) })}
                  className="px-2 py-1 rounded-[6px] bg-white/[0.06] hover:bg-white/[0.12] text-[11px] font-mono text-white/80"
                >
                  +1
                </button>
              </div>
            </div>

            {/* Position Y (%) */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-white/60">Vị trí dọc (Y)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.1"
                    value={currentAlignment.y}
                    onChange={(e) => updateCurrentAlignment({ y: parseFloat(e.target.value) || 0 })}
                    className="w-16 px-1.5 py-0.5 rounded-[6px] bg-black/40 border border-white/[0.1] text-xs font-mono text-right text-white focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
                  />
                  <span className="text-white/40 text-xs font-mono">%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCurrentAlignment({ y: Number((currentAlignment.y - 1).toFixed(2)) })}
                  className="px-2 py-1 rounded-[6px] bg-white/[0.06] hover:bg-white/[0.12] text-[11px] font-mono text-white/80"
                >
                  -1
                </button>
                <button
                  onClick={() => updateCurrentAlignment({ y: Number((currentAlignment.y - 0.2).toFixed(2)) })}
                  className="px-2 py-1 rounded-[6px] bg-white/[0.06] hover:bg-white/[0.12] text-[11px] font-mono text-white/80"
                >
                  -0.2
                </button>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  step="0.1"
                  value={currentAlignment.y}
                  onChange={(e) => updateCurrentAlignment({ y: parseFloat(e.target.value) })}
                  className="apple-slider flex-1"
                />
                <button
                  onClick={() => updateCurrentAlignment({ y: Number((currentAlignment.y + 0.2).toFixed(2)) })}
                  className="px-2 py-1 rounded-[6px] bg-white/[0.06] hover:bg-white/[0.12] text-[11px] font-mono text-white/80"
                >
                  +0.2
                </button>
                <button
                  onClick={() => updateCurrentAlignment({ y: Number((currentAlignment.y + 1).toFixed(2)) })}
                  className="px-2 py-1 rounded-[6px] bg-white/[0.06] hover:bg-white/[0.12] text-[11px] font-mono text-white/80"
                >
                  +1
                </button>
              </div>
            </div>

            {/* Quick center X button */}
            <button
              onClick={() => updateCurrentAlignment({ x: 0 })}
              className="w-full py-1 rounded-[8px] bg-white/[0.04] hover:bg-white/[0.08] text-[11px] text-white/70 hover:text-white transition-all text-center"
            >
              Căn thẳng trục giữa X (0%)
            </button>
          </div>

          {/* Section: Scale & Stretch (Kích thước & Tỷ lệ) */}
          <div className="p-3.5 rounded-[16px] bg-white/[0.03] border border-white/[0.06] space-y-4">
            <h4 className="text-xs font-semibold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
              <ZoomIn className="w-3.5 h-3.5 text-[#30d158]" />
              <span>Tỷ lệ &amp; Kích thước (Scale)</span>
            </h4>

            {/* Overall Scale */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-white/60">Phóng to / Thu nhỏ tổng thể</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.01"
                    value={currentAlignment.scale}
                    onChange={(e) => updateCurrentAlignment({ scale: parseFloat(e.target.value) || 1 })}
                    className="w-16 px-1.5 py-0.5 rounded-[6px] bg-black/40 border border-white/[0.1] text-xs font-mono text-right text-white focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
                  />
                  <span className="text-white/40 text-xs font-mono">x</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateCurrentAlignment({ scale: Math.max(0.3, Number((currentAlignment.scale - 0.05).toFixed(3))) })
                  }
                  className="px-2 py-1 rounded-[6px] bg-white/[0.06] hover:bg-white/[0.12] text-[11px] font-mono text-white/80"
                >
                  -0.05
                </button>
                <input
                  type="range"
                  min="0.4"
                  max="2.2"
                  step="0.01"
                  value={currentAlignment.scale}
                  onChange={(e) => updateCurrentAlignment({ scale: parseFloat(e.target.value) })}
                  className="apple-slider flex-1"
                />
                <button
                  onClick={() =>
                    updateCurrentAlignment({ scale: Math.min(2.5, Number((currentAlignment.scale + 0.05).toFixed(3))) })
                  }
                  className="px-2 py-1 rounded-[6px] bg-white/[0.06] hover:bg-white/[0.12] text-[11px] font-mono text-white/80"
                >
                  +0.05
                </button>
              </div>
            </div>

            {/* Stretch Horizontal (Scale X) */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-white/60">Co giãn chiều ngang (Scale X)</span>
                <span className="text-white/80 font-mono text-xs">{currentAlignment.scaleX}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.01"
                value={currentAlignment.scaleX}
                onChange={(e) => updateCurrentAlignment({ scaleX: parseFloat(e.target.value) })}
                className="apple-slider w-full"
              />
            </div>

            {/* Stretch Vertical (Scale Y) */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-white/60">Co giãn chiều dọc (Scale Y)</span>
                <span className="text-white/80 font-mono text-xs">{currentAlignment.scaleY}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.01"
                value={currentAlignment.scaleY}
                onChange={(e) => updateCurrentAlignment({ scaleY: parseFloat(e.target.value) })}
                className="apple-slider w-full"
              />
            </div>

            {/* Quick reset stretch */}
            <button
              onClick={() => updateCurrentAlignment({ scale: 1, scaleX: 1, scaleY: 1 })}
              className="w-full py-1 rounded-[8px] bg-white/[0.04] hover:bg-white/[0.08] text-[11px] text-white/70 hover:text-white transition-all text-center"
            >
              Đặt lại tỷ lệ chuẩn (1.0x)
            </button>
          </div>

          {/* Section: Rotation & Opacity (Xoay & Độ mờ) */}
          <div className="p-3.5 rounded-[16px] bg-white/[0.03] border border-white/[0.06] space-y-4">
            <h4 className="text-xs font-semibold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff9f0a]" />
              <span>Góc xoay &amp; Hiển thị</span>
            </h4>

            {/* Rotate */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-white/60">Góc xoay nghiêng</span>
                <span className="text-white/80 font-mono text-xs">{currentAlignment.rotate}°</span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="0.5"
                value={currentAlignment.rotate}
                onChange={(e) => updateCurrentAlignment({ rotate: parseFloat(e.target.value) })}
                className="apple-slider w-full"
              />
            </div>

            {/* Opacity */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-white/60">Độ mờ vải (nhìn xuyên thấu)</span>
                <span className="text-white/80 font-mono text-xs">{Math.round(pieceOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={pieceOpacity}
                onChange={(e) => setPieceOpacity(parseFloat(e.target.value))}
                className="apple-slider w-full"
              />
            </div>
          </div>

          {/* Section: Live Code Snippet */}
          <div className="mt-auto pt-3 border-t border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">
                Mã JSON cấu hình món này:
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(
                      {
                        [pieceKey]: {
                          x: currentAlignment.x,
                          y: currentAlignment.y,
                          scale: currentAlignment.scale,
                          scaleX: currentAlignment.scaleX,
                          scaleY: currentAlignment.scaleY,
                          rotate: currentAlignment.rotate,
                        },
                      },
                      null,
                      2
                    )
                  );
                }}
                className="text-[11px] text-[#0071e3] hover:underline"
              >
                Chép JSON
              </button>
            </div>
            <pre className="p-3 rounded-[12px] bg-black/50 border border-white/[0.08] text-[11px] font-mono text-[#2997ff] overflow-x-auto leading-relaxed">
              {JSON.stringify(
                {
                  [pieceKey]: {
                    x: currentAlignment.x,
                    y: currentAlignment.y,
                    scale: currentAlignment.scale,
                    scaleX: currentAlignment.scaleX,
                    scaleY: currentAlignment.scaleY,
                    rotate: currentAlignment.rotate,
                  },
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
