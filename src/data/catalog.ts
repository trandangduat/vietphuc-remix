import { Piece, EventBackground, PresetOutfit } from '../types';

export const EVENTS: EventBackground[] = [
  {
    id: 'event-tet',
    name: 'Tết Cổ Truyền',
    description: 'Phố hoa xuân rực rỡ đào mai, câu đối đỏ và không khí lễ hội đầu năm.',
    bgUrl: '/assets/events/bg-tet-pho-co.jpg',
  },
  {
    id: 'event-prom',
    name: 'Dạ hội School Prom',
    description: 'Sảnh tiệc dạ hội trang trọng, ánh đèn lung linh hiện đại.',
    bgUrl: '/assets/events/bg-tet-pho-co.jpg', // can fallback or use stylized backdrop
  },
  {
    id: 'event-trung-thu',
    name: 'Tết Trung Thu',
    description: 'Phố đèn lồng truyền thống rực rỡ sắc màu dưới trăng rằm.',
    bgUrl: '/assets/events/bg-tet-pho-co.jpg',
  },
  {
    id: 'event-ngay-hoi',
    name: 'Ngày hội trường học',
    description: 'Sân trường rợp bóng cờ hội, gian hàng triển lãm văn hóa dân gian.',
    bgUrl: '/assets/events/bg-tet-pho-co.jpg',
  },
  {
    id: 'event-le-cuoi',
    name: 'Lễ cưới gia đình',
    description: 'Không gian tư gia trang trọng, phông đỏ truyền thống ấm cúng.',
    bgUrl: '/assets/events/bg-tet-pho-co.jpg',
  },
];

export const PIECES: Piece[] = [
  // --- ÁO (TOPS) ---
  {
    id: 'piece-ao-tac',
    name: 'Áo tấc tay thụng',
    category: 'top',
    gender: 'unisex',
    style: 'traditional',
    culturalInfo: {
      period: 'Thời Nguyễn (Thế kỷ XIX – XX)',
      meaning: 'Lễ phục trang trọng bậc nhất thời Nguyễn, tượng trưng cho đức khiêm tốn, sự đĩnh đạc và chuẩn mực lễ giáo.',
      context: 'Mặc trong các đại lễ, tế giao, lễ cưới gia đình, dâng hương ngày Tết.',
      source: 'Bảo tàng Lịch sử Quốc gia & "Ngàn năm áo mũ" (Trần Quang Đức)',
      citationUrl: 'https://baotanglichsu.vn',
    },
    defaultVariantId: 'top-ao-tac-crimson',
    variants: [
      {
        variantId: 'top-ao-tac-crimson',
        colorName: 'Đỏ đô hoàng triều',
        swatchHex: '#7A1C1C',
        assetUrl: '/assets/pieces/tops/top-ao-tac-crimson.png',
        zIndex: 4,
      },
      {
        variantId: 'top-ao-tac-indigo',
        colorName: 'Xanh cổ vịt quý tộc',
        swatchHex: '#1A4B54',
        assetUrl: '/assets/pieces/tops/top-ao-tac-indigo.png',
        zIndex: 4,
      },
    ],
    thumbnailUrl: '/assets/pieces/tops/top-ao-tac-crimson.png',
  },

  // --- QUẦN / CHÂN VÁY (BOTTOMS) ---
  {
    id: 'piece-quan-lua',
    name: 'Quần lụa ống suông',
    category: 'bottom',
    gender: 'unisex',
    style: 'traditional',
    culturalInfo: {
      period: 'Cổ truyền Việt Nam',
      meaning: 'Chất liệu lụa tơ tằm dệt mềm mại, thoáng mát, tạo nên dáng đi khoan thai thướt tha đặc trưng của người Việt xưa.',
      context: 'Phối chuẩn mực nhất bên trong áo dài, áo ngũ thân, áo tấc.',
      source: 'Bảo tàng Phụ nữ Nam Bộ & Nghiên cứu Trang phục Cổ Việt',
    },
    defaultVariantId: 'bottom-quan-lua-white',
    variants: [
      {
        variantId: 'bottom-quan-lua-white',
        colorName: 'Lụa tơ tằm trắng ngà',
        swatchHex: '#F7F4EE',
        assetUrl: '/assets/pieces/bottoms/bottom-quan-lua-white.png',
        zIndex: 2,
      },
    ],
    thumbnailUrl: '/assets/pieces/bottoms/bottom-quan-lua-white.png',
  },
  {
    id: 'piece-quan-tay',
    name: 'Quần tây xếp ly ống rộng',
    category: 'bottom',
    gender: 'unisex',
    style: 'modern',
    culturalInfo: {
      period: 'Đương đại Gen Z / Remix',
      meaning: 'Dáng quần âu ống rộng xếp ly đứng phom mang phong cách menswear hiện đại, tạo nét tương phản sắc sảo khi phối cùng cổ phục.',
      context: 'Hoàn hảo cho sự kiện trường học, dạo phố Tết, phong cách Cổ phong Remix năng động.',
      source: 'Xu hướng thời trang đương đại Gen Z Việt Nam',
    },
    defaultVariantId: 'bottom-quan-tay-charcoal',
    variants: [
      {
        variantId: 'bottom-quan-tay-charcoal',
        colorName: 'Xám than thanh lịch',
        swatchHex: '#3B3D43',
        assetUrl: '/assets/pieces/bottoms/bottom-quan-tay-charcoal.png',
        zIndex: 2,
      },
    ],
    thumbnailUrl: '/assets/pieces/bottoms/bottom-quan-tay-charcoal.png',
  },

  // --- GIÀY / DÉP (FOOTWEAR) ---
  {
    id: 'piece-hai-nhung',
    name: 'Hài nhung thêu sen vàng',
    category: 'footwear',
    gender: 'unisex',
    style: 'traditional',
    culturalInfo: {
      period: 'Thời Nguyễn / Cung đình Huế',
      meaning: 'Hài mũi cong bọc nhung cao cấp thêu họa tiết hoa sen chỉ kim tuyến, biểu trưng cho sự thanh cao, thuần khiết.',
      context: 'Đi cùng lễ phục cổ phong, không gian đền chùa, lễ gia tiên.',
      source: 'Trung tâm Bảo tồn Di tích Cố đô Huế',
    },
    defaultVariantId: 'footwear-hai-nhung-red',
    variants: [
      {
        variantId: 'footwear-hai-nhung-red',
        colorName: 'Nhung đỏ thêu chỉ vàng',
        swatchHex: '#8B1E1E',
        assetUrl: '/assets/pieces/footwear/footwear-hai-nhung-red.png',
        zIndex: 3,
      },
    ],
    thumbnailUrl: '/assets/pieces/footwear/footwear-hai-nhung-red.png',
  },
  {
    id: 'piece-loafer',
    name: 'Giày da Penny Loafer',
    category: 'footwear',
    gender: 'unisex',
    style: 'modern',
    culturalInfo: {
      period: 'Thời trang đương đại',
      meaning: 'Giày lười da cổ điển đem lại vẻ trí thức thanh lịch, đĩnh đạc nhưng vẫn phóng khoáng.',
      context: 'Dự dạ hội trường học, prom, triển lãm, phối ăn ý với áo tấc và quần tây.',
      source: 'Cẩm nang phối đồ Vintage & Heritage Remix',
    },
    defaultVariantId: 'footwear-loafer-darkbrown',
    variants: [
      {
        variantId: 'footwear-loafer-darkbrown',
        colorName: 'Da bò nâu bóng cổ điển',
        swatchHex: '#4A2E1B',
        assetUrl: '/assets/pieces/footwear/footwear-loafer-darkbrown.png',
        zIndex: 3,
      },
    ],
    thumbnailUrl: '/assets/pieces/footwear/footwear-loafer-darkbrown.png',
  },

  // --- PHỤ KIỆN (ACCESSORIES) ---
  {
    id: 'piece-non-la',
    name: 'Nón lá quai lụa hoa',
    category: 'accessory',
    gender: 'unisex',
    style: 'traditional',
    culturalInfo: {
      period: 'Di sản văn hóa dân tộc',
      meaning: 'Biểu tượng hồn cốt của đất nước hình chữ S, che nắng che mưa và tôn vinh nét e ấp, dịu dàng của người mặc.',
      context: 'Dạo phố hoa Tết, du xuân, chụp ảnh lưu niệm ngoại cảnh.',
      source: 'Làng nghề nón Chuông & Di sản phi vật thể quốc gia',
    },
    defaultVariantId: 'acc-non-la-traditional',
    variants: [
      {
        variantId: 'acc-non-la-traditional',
        colorName: 'Lá cọ tự nhiên & quai lụa hồng',
        swatchHex: '#D4A373',
        assetUrl: '/assets/pieces/accessories/acc-non-la-traditional.png',
        zIndex: 5,
      },
    ],
    thumbnailUrl: '/assets/pieces/accessories/acc-non-la-traditional.png',
  },
];

export const PRESET_OUTFITS: PresetOutfit[] = [
  {
    id: 'preset-dao-xuan',
    name: 'Dạo Xuân Cung Đình',
    style: 'traditional',
    description: 'Bộ lễ phục áo tấc đỏ rực thêu rồng phượng, kết hợp quần lụa trắng thướt tha, hài nhung và nón lá duyên dáng đón xuân.',
    gender: 'women',
    topPieceId: 'piece-ao-tac',
    topVariantId: 'top-ao-tac-crimson',
    bottomPieceId: 'piece-quan-lua',
    bottomVariantId: 'bottom-quan-lua-white',
    footwearPieceId: 'piece-hai-nhung',
    footwearVariantId: 'footwear-hai-nhung-red',
    accessoryPieceId: 'piece-non-la',
    accessoryVariantId: 'acc-non-la-traditional',
    eventId: 'event-tet',
  },
  {
    id: 'preset-thu-sinh-tan-thoi',
    name: 'Thư sinh Tân thời (Remix)',
    style: 'remix',
    description: 'Sự giao thoa phá cách giữa áo tấc xanh cổ vịt triều Nguyễn và quần âu xếp ly, giày da Loafer trí thức.',
    gender: 'men',
    topPieceId: 'piece-ao-tac',
    topVariantId: 'top-ao-tac-indigo',
    bottomPieceId: 'piece-quan-tay',
    bottomVariantId: 'bottom-quan-tay-charcoal',
    footwearPieceId: 'piece-loafer',
    footwearVariantId: 'footwear-loafer-darkbrown',
    accessoryPieceId: 'piece-non-la',
    accessoryVariantId: 'acc-non-la-traditional',
    eventId: 'event-tet',
  },
];
