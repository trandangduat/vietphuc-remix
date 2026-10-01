export type PieceCategory = 'top' | 'bottom' | 'footwear' | 'accessory';
export type StyleFilter = 'all' | 'traditional' | 'modern';
export type GenderSelection = 'men' | 'women';

export interface CulturalInfo {
  period: string;
  meaning: string;
  context: string;
  source: string;
  citationUrl?: string;
}

export interface PieceVariant {
  variantId: string;
  colorName: string;
  swatchHex: string;
  assetUrl: string;
  zIndex: number;
  thumbnailUrl?: string;
}

export interface Piece {
  id: string;
  name: string;
  category: PieceCategory;
  gender: 'men' | 'women' | 'unisex';
  style: 'traditional' | 'modern' | 'remix';
  culturalInfo: CulturalInfo;
  colorName: string;
  swatchHex?: string;
  assetUrl: string;
  thumbnailUrl: string;
  zIndex: number;
  defaultVariantId?: string;
  variants?: PieceVariant[];
}

export interface EventBackground {
  id: string;
  name: string;
  description: string;
  bgUrl: string;
  isCustom?: boolean;
}

export interface PresetOutfit {
  id: string;
  name: string;
  style: 'traditional' | 'modern' | 'remix';
  description: string;
  gender: GenderSelection;
  topPieceId: string;
  topVariantId?: string;
  bottomPieceId: string;
  bottomVariantId?: string;
  footwearPieceId: string;
  footwearVariantId?: string;
  accessoryPieceId?: string;
  accessoryVariantId?: string;
  eventId: string;
  previewUrl?: string;
}

export interface ActiveOutfitState {
  topPiece?: Piece;
  topVariant?: Piece;
  bottomPiece?: Piece;
  bottomVariant?: Piece;
  footwearPiece?: Piece;
  footwearVariant?: Piece;
  accessoryPiece?: Piece;
  accessoryVariant?: Piece;
  event: EventBackground;
  mannequinGender: GenderSelection;
  styleFilter: StyleFilter;
}

export interface SavedOutfitSlot {
  piece: Piece;
  variant?: Piece | PieceVariant;
}

export interface SavedOutfit {
  id: string;
  name: string;
  createdAt: string;
  gender: GenderSelection;
  top: SavedOutfitSlot;
  bottom: SavedOutfitSlot;
  footwear: SavedOutfitSlot;
  accessory?: SavedOutfitSlot;
  event: EventBackground;
  aiAnalysis?: AIOverviewResult;
  tryOnImage?: string;
  tryOnImages?: string[];
  aspectRatio?: 'tall' | 'medium' | 'short';
}

export interface AICriterionScore {
  name: string;
  score: number;
  maxScore: number;
  comment: string;
}

export interface AIOverviewResult {
  totalScore: number;
  criteria: {
    colorHarmony: AICriterionScore;
    eventFit: AICriterionScore;
    culturalNorm: AICriterionScore;
  };
  colorHarmony: string;
  eventFit: string;
  culturalStatus: 'suitable' | 'caution' | 'not-recommended';
  explanation: string;
  suggestion?: string;
  source: string;
  mascotQuote?: string;
  mascotMood?: 'happy' | 'thinking' | 'curious' | 'reverent';
}
