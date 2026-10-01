export type PieceCategory = 'top' | 'bottom' | 'footwear' | 'accessory';
export type StyleFilter = 'all' | 'traditional' | 'modern' | 'remix';
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
}

export interface Piece {
  id: string;
  name: string;
  category: PieceCategory;
  gender: 'men' | 'women' | 'unisex';
  style: 'traditional' | 'modern' | 'remix';
  culturalInfo: CulturalInfo;
  defaultVariantId: string;
  variants: PieceVariant[];
  thumbnailUrl?: string;
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
  topVariantId: string;
  bottomPieceId: string;
  bottomVariantId: string;
  footwearPieceId: string;
  footwearVariantId: string;
  accessoryPieceId?: string;
  accessoryVariantId?: string;
  eventId: string;
  previewUrl?: string;
}

export interface ActiveOutfitState {
  topPiece?: Piece;
  topVariant?: PieceVariant;
  bottomPiece?: Piece;
  bottomVariant?: PieceVariant;
  footwearPiece?: Piece;
  footwearVariant?: PieceVariant;
  accessoryPiece?: Piece;
  accessoryVariant?: PieceVariant;
  event: EventBackground;
  mannequinGender: GenderSelection;
  styleFilter: StyleFilter;
}

export interface SavedOutfit {
  id: string;
  name: string;
  createdAt: string;
  gender: GenderSelection;
  top: { piece: Piece; variant: PieceVariant };
  bottom: { piece: Piece; variant: PieceVariant };
  footwear: { piece: Piece; variant: PieceVariant };
  accessory?: { piece: Piece; variant: PieceVariant };
  event: EventBackground;
  aiAnalysis?: AIOverviewResult;
  tryOnImage?: string;
}

export interface AIOverviewResult {
  colorHarmony: string;
  eventFit: string;
  culturalStatus: 'suitable' | 'caution' | 'not-recommended';
  explanation: string;
  suggestion?: string;
  source: string;
}
