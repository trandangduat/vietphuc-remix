import { CSSProperties } from 'react';

export interface PieceAlignment {
  x: number; // Horizontal offset in % of canvas (-50 to +50, center = 0)
  y: number; // Vertical offset in % of canvas (-50 to +50, center = 0)
  scale: number; // Overall scale multiplier (1.0 = default)
  scaleX: number; // Horizontal stretch factor (1.0 = default)
  scaleY: number; // Vertical stretch factor (1.0 = default)
  rotate: number; // Rotation in degrees (0 = default)
  opacity?: number; // Opacity for preview/inspection (default 1)
}

export type AlignmentMap = Record<string, PieceAlignment>;

export const DEFAULT_PIECE_ALIGNMENT: PieceAlignment = {
  x: 0,
  y: 0,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  rotate: 0,
  opacity: 1,
};

// Base calibrated defaults for production
export const DEFAULT_PIECE_ALIGNMENTS: AlignmentMap = {
  'piece-non-la': {
    x: 0,
    y: -3.57,
    scale: 0.86,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
  },
  'piece-khan-dong-hoang-gia': {
    x: -0.23,
    y: -4.55,
    scale: 0.84,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
  },
  'piece-quan-tay': {
    x: 0,
    y: 0.54,
    scale: 0.86,
    scaleX: 0.98,
    scaleY: 1,
    rotate: 0,
  },
  'piece-quan-lua': {
    x: 0,
    y: 0,
    scale: 0.92,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
  },
  'piece-quan-lua-den': {
    x: 0,
    y: 0.2,
    scale: 0.92,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
  },
  'piece-quan-au-beige': {
    x: -0.24,
    y: 0.32,
    scale: 0.98,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
  },
  'piece-hai-nhung': {
    x: 0,
    y: 0,
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
  },
  'piece-hai-nhung-den': {
    x: -0.23,
    y: -12.21,
    scale: 1.29,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
  },
  'piece-giay-derby-den': {
    x: 0.23,
    y: -10.81,
    scale: 1.24,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
  },
  'piece-ao-tac-do': {
    x: 0.48,
    y: -1.24,
    scale: 0.9,
    scaleX: 1.06,
    scaleY: 0.99,
    rotate: -0.5,
  },
  'piece-ao-tac-xanh': {
    x: 0.23,
    y: -1.96,
    scale: 0.84,
    scaleX: 1.09,
    scaleY: 1.03,
    rotate: 0,
  },
  'piece-ao-ngu-than-nam': {
    x: 0,
    y: -3.76,
    scale: 0.85,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
  },
  'piece-ao-somi-linen-nam': {
    x: -0.01,
    y: -5.14,
    scale: 0.79,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
  },
  'piece-ao-tac': {
    x: 0,
    y: 0,
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
  },
  'piece-loafer': {
    x: 0,
    y: 0,
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
  },
};

const STORAGE_KEY = 'vietphuc_dev_piece_alignments_v2';

/**
 * Retrieve saved alignments from localStorage, merged with production defaults
 */
export function getStoredPieceAlignments(): AlignmentMap {
  if (typeof window === 'undefined') return { ...DEFAULT_PIECE_ALIGNMENTS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PIECE_ALIGNMENTS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PIECE_ALIGNMENTS, ...parsed };
  } catch (err) {
    console.warn('Failed to parse piece alignments from localStorage:', err);
    return { ...DEFAULT_PIECE_ALIGNMENTS };
  }
}

/**
 * Get alignment for a specific piece or variant
 */
export function getPieceAlignment(pieceId?: string, variantId?: string): PieceAlignment {
  if (!pieceId) return { ...DEFAULT_PIECE_ALIGNMENT };
  const alignments = getStoredPieceAlignments();
  // Check variant first, fallback to pieceId, fallback to default
  const config =
    (variantId && alignments[variantId]) ||
    alignments[pieceId] ||
    DEFAULT_PIECE_ALIGNMENTS[pieceId] ||
    DEFAULT_PIECE_ALIGNMENT;

  return {
    ...DEFAULT_PIECE_ALIGNMENT,
    ...config,
  };
}

/**
 * Save alignment map to localStorage
 */
export function savePieceAlignmentsToStorage(map: AlignmentMap): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map, null, 2));
    // Dispatch custom event to notify all active components to re-render
    window.dispatchEvent(new CustomEvent('vietphuc_alignments_updated', { detail: map }));
  } catch (err) {
    console.error('Failed to save piece alignments:', err);
  }
}

export interface SaveAlignmentsResult {
  success: boolean;
  savedToFile: boolean;
  message: string;
}

/**
 * Save alignment map to both localStorage and the codebase source file (in dev mode)
 */
export async function savePieceAlignments(map: AlignmentMap): Promise<SaveAlignmentsResult> {
  // 1. Immediately save to localStorage for client responsiveness and offline fallback
  savePieceAlignmentsToStorage(map);

  // 2. In dev mode, write directly to src/data/pieceAlignments.ts via Vite dev server
  try {
    const res = await fetch('/api/dev/save-alignments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ alignments: map }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        savedToFile: true,
        message: data.message || 'Đã ghi trực tiếp vào src/data/pieceAlignments.ts!',
      };
    } else {
      const data = await res.json().catch(() => ({}));
      return {
        success: true,
        savedToFile: false,
        message: data.message || 'Đã lưu vào bộ nhớ tạm trình duyệt (localStorage)',
      };
    }
  } catch {
    // Vite dev server endpoint not available (e.g. static production build)
    return {
      success: true,
      savedToFile: false,
      message: 'Đã lưu vào bộ nhớ tạm trình duyệt (localStorage)',
    };
  }
}

/**
 * Reset all alignments back to default
 */
export function resetPieceAlignments(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('vietphuc_alignments_updated', { detail: DEFAULT_PIECE_ALIGNMENTS }));
}

/**
 * Convert alignment parameters into CSS transform properties
 */
export function getAlignmentStyle(alignment: PieceAlignment): CSSProperties {
  const sx = alignment.scale * (alignment.scaleX ?? 1);
  const sy = alignment.scale * (alignment.scaleY ?? 1);
  const rot = alignment.rotate || 0;
  const op = alignment.opacity ?? 1;

  return {
    transform: `translate(${alignment.x}%, ${alignment.y}%) scale(${sx}, ${sy}) rotate(${rot}deg)`,
    transformOrigin: '50% 50%',
    opacity: op,
    willChange: 'transform',
  };
}

/**
 * Format alignment config into copyable TypeScript source code
 */
export function exportAlignmentsAsCode(map: AlignmentMap): string {
  const entries = Object.entries(map).map(([id, val]) => {
    return `  '${id}': {
    x: ${Number(val.x.toFixed(2))},
    y: ${Number(val.y.toFixed(2))},
    scale: ${Number(val.scale.toFixed(3))},
    scaleX: ${Number((val.scaleX ?? 1).toFixed(3))},
    scaleY: ${Number((val.scaleY ?? 1).toFixed(3))},
    rotate: ${Number((val.rotate ?? 0).toFixed(1))},
  },`;
  });

  return `export const DEFAULT_PIECE_ALIGNMENTS: AlignmentMap = {\n${entries.join('\n')}\n};`;
}
