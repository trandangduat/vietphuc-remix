import { ActiveOutfitState, AIOverviewResult } from '../types';

export const evaluateCulturalOutfit = (outfit: ActiveOutfitState): AIOverviewResult => {
  const hasAnyPiece = Boolean(outfit.topPiece || outfit.bottomPiece || outfit.footwearPiece || outfit.accessoryPiece);
  
  if (!hasAnyPiece) {
    return {
      totalScore: 0,
      criteria: {
        colorHarmony: { name: 'Hài hòa màu sắc', score: 0, maxScore: 10, comment: 'Chưa có trang phục nào được chọn trên ma-nơ-canh.' },
        eventFit: { name: 'Phù hợp sự kiện', score: 0, maxScore: 10, comment: 'Hãy chọn trang phục để Bé Nghê chấm điểm bối cảnh nhé!' },
        culturalNorm: { name: 'Chuẩn mực lễ nghi', score: 0, maxScore: 10, comment: 'Chưa đủ dữ liệu để đối chiếu điển lễ triều đại.' },
      },
      colorHarmony: 'Chưa chọn trang phục',
      eventFit: 'Chưa chọn trang phục',
      culturalStatus: 'caution',
      explanation: 'Ma-nơ-canh hiện chưa mặc trang phục nào. Hãy chọn Áo, Quần và Giày ở danh mục để bắt đầu khám phá nét đẹp cổ phục.',
      source: 'Hệ thống tri thức văn hóa Việt phục Remix',
      mascotQuote: 'Chàng/Nàng chớ vội xuất hành, hãy chọn một tà áo gấm xinh đẹp trước đã!',
      mascotMood: 'curious',
    };
  }

  const isAoTacDo = outfit.topPiece?.id === 'piece-ao-tac-do' || outfit.topPiece?.id === 'piece-ao-tac';
  const isAoTacXanh = outfit.topPiece?.id === 'piece-ao-tac-xanh';
  const isAoTac = isAoTacDo || isAoTacXanh;
  const isQuanLua = outfit.bottomPiece?.id === 'piece-quan-lua';
  const isQuanTay = outfit.bottomPiece?.id === 'piece-quan-tay';
  const isHaiNhung = outfit.footwearPiece?.id === 'piece-hai-nhung';
  const isLoafer = outfit.footwearPiece?.id === 'piece-loafer';
  const isEventTet = outfit.event.id === 'event-tet';

  // Case 1A: Pure Traditional Royal (Áo tấc đỏ + Quần lụa + Hài nhung)
  if (isAoTacDo && isQuanLua && isHaiNhung) {
    return {
      totalScore: isEventTet ? 9.8 : 9.5,
      criteria: {
        colorHarmony: {
          name: 'Hài hòa màu sắc',
          score: 9.8,
          maxScore: 10,
          comment: 'Tương phản Đỏ gấm hoàng triều và Lụa trắng ngà, đoan chính và quyền quý rực rỡ sắc xuân.',
        },
        eventFit: {
          name: 'Phù hợp sự kiện',
          score: isEventTet ? 10.0 : 9.2,
          maxScore: 10,
          comment: isEventTet
            ? 'Tuyệt đối phù hợp với không khí trang trọng ngày Tết cổ truyền.'
            : 'Trang trọng, phù hợp đại lễ và nghi thức cổ điển.',
        },
        culturalNorm: {
          name: 'Chuẩn mực lễ nghi',
          score: 9.7,
          maxScore: 10,
          comment: 'Bảo toàn trọn vẹn quy thức lễ phục triều Nguyễn, thể hiện sự đoan chính và tôn ti trật tự.',
        },
      },
      colorHarmony: 'Tương phản Đỏ gấm và Lụa trắng ngà hoàng tộc.',
      eventFit: isEventTet ? 'Tuyệt đối phù hợp với không khí trang trọng ngày Tết cổ truyền.' : 'Rất trang trọng, phù hợp đại lễ và nghi thức cổ điển.',
      culturalStatus: 'suitable',
      explanation: 'Bộ trang phục bảo toàn trọn vẹn quy thức lễ nghi thời Nguyễn. Áo tấc đỏ gấm đi cùng quần lụa trắng và hài thêu thể hiện sự đoan chính, phúc lộc đầu năm.',
      source: 'Bảo tàng Lịch sử Quốc gia & "Ngàn năm áo mũ" (Trần Quang Đức)',
      mascotQuote: isEventTet
        ? 'Tuyệt phẩm đầu xuân! Áo tấc đỏ gấm cùng lụa ngà tôn vinh phúc lộc hoàng triều!'
        : 'Đoan trang đĩnh đạc! Quy thức lễ nghi triều Nguyễn bảo toàn hoàn hảo!',
      mascotMood: 'reverent',
    };
  }

  // Case 1B: Traditional Scholar Royal (Áo tấc xanh + Quần lụa + Hài nhung)
  if (isAoTacXanh && isQuanLua && isHaiNhung) {
    return {
      totalScore: isEventTet ? 9.6 : 9.7,
      criteria: {
        colorHarmony: {
          name: 'Hài hòa màu sắc',
          score: 9.7,
          maxScore: 10,
          comment: 'Sắc xanh cổ vịt quý tộc đi cùng lụa trắng ngà, toát lên vẻ đĩnh đạc, trầm tĩnh và trí thức thanh tao.',
        },
        eventFit: {
          name: 'Phù hợp sự kiện',
          score: isEventTet ? 9.5 : 9.8,
          maxScore: 10,
          comment: isEventTet
            ? 'Trang nghiêm, thanh nhã cho du xuân và dâng hương đầu năm.'
            : 'Hoàn hảo cho sự kiện văn hóa, lễ kỷ niệm và đại lễ trang trọng.',
        },
        culturalNorm: {
          name: 'Chuẩn mực lễ nghi',
          score: 9.6,
          maxScore: 10,
          comment: 'Chuẩn mực phong thái Nho gia và quý tộc triều Nguyễn, khoan thai và đĩnh đạc.',
        },
      },
      colorHarmony: 'Sắc xanh cổ vịt quý tộc đi cùng lụa trắng ngà.',
      eventFit: 'Trang nghiêm, thanh nhã cho sự kiện văn hóa và lễ nghi truyền thống.',
      culturalStatus: 'suitable',
      explanation: 'Sắc xanh cổ vịt quý tộc đem lại vẻ trầm tĩnh, trí thức của giới học giả xưa, kết hợp hoàn hảo cùng quần lụa trắng và hài thêu.',
      source: 'Bảo tàng Lịch sử Quốc gia & "Ngàn năm áo mũ" (Trần Quang Đức)',
      mascotQuote: 'Sắc xanh cổ vịt thanh tao, phong thái Nho gia đĩnh đạc trí thức uyên bác!',
      mascotMood: 'reverent',
    };
  }

  // Case 2: Heritage Remix (Áo tấc + Quần tây / Loafer)
  if (isAoTac && (isQuanTay || isLoafer)) {
    return {
      totalScore: isEventTet ? 8.2 : 8.8,
      criteria: {
        colorHarmony: {
          name: 'Hài hòa màu sắc',
          score: 9.0,
          maxScore: 10,
          comment: 'Phối màu Menswear hiện đại (Áo tấc gấm nổi bật trên nền quần âu tối màu).',
        },
        eventFit: {
          name: 'Phù hợp sự kiện',
          score: isEventTet ? 7.8 : 9.2,
          maxScore: 10,
          comment: isEventTet
            ? 'Khá phá cách, thích hợp du xuân dạo phố nhưng không khuyến nghị cho lễ cúng gia tiên trang nghiêm.'
            : 'Rất ấn tượng cho dạ hội học sinh (Prom), sự kiện trường học hoặc dạo phố nghệ thuật.',
        },
        culturalNorm: {
          name: 'Chuẩn mực lễ nghi',
          score: 7.9,
          maxScore: 10,
          comment: 'Giao thoa giữa tà áo thụng triều Nguyễn và âu phục Tây phương. Vừa giữ được phẩm cách vừa mang hơi thở đương đại.',
        },
      },
      colorHarmony: 'Phối màu Menswear hiện đại (Áo tấc gấm nổi bật trên nền quần âu tối màu).',
      eventFit: 'Rất ấn tượng cho dạ hội học sinh (Prom), sự kiện trường học hoặc dạo phố nghệ thuật.',
      culturalStatus: 'caution',
      explanation: 'Cách phối Remix sáng tạo giữa tà áo thụng triều Nguyễn và âu phục Tây phương. Vẫn giữ được phẩm cách của cổ phục nhưng mang hơi thở trí thức đương đại. Lưu ý không nên diện vào các nghi thức tế lễ tôn nghiêm cổ truyền.',
      suggestion: 'Nếu tham gia lễ gia tiên trang trọng, bạn có thể chuyển sang Quần lụa trắng và Hài thêu.',
      source: 'Chuyên khảo Văn hóa Mặc đương đại & Bảo tàng Phụ nữ Nam Bộ',
      mascotQuote: 'Phối đồ Remix rất phá cách và có gu! Nhưng nhớ tránh mặc đi cúng lễ gia tiên nha!',
      mascotMood: 'happy',
    };
  }

  // Missing components partial
  if (!outfit.topPiece || !outfit.bottomPiece || !outfit.footwearPiece) {
    const missing: string[] = [];
    if (!outfit.topPiece) missing.push('Áo');
    if (!outfit.bottomPiece) missing.push('Quần/Váy');
    if (!outfit.footwearPiece) missing.push('Giày/Hài');

    return {
      totalScore: 7.0,
      criteria: {
        colorHarmony: { name: 'Hài hòa màu sắc', score: 7.2, maxScore: 10, comment: 'Đang hình thành bảng màu cơ bản cho trang phục.' },
        eventFit: { name: 'Phù hợp sự kiện', score: 6.8, maxScore: 10, comment: `Cần phối đủ bộ để đánh giá với ${outfit.event.name}.` },
        culturalNorm: { name: 'Chuẩn mực lễ nghi', score: 7.0, maxScore: 10, comment: `Đang thiếu ${missing.join(', ')} để hoàn chỉnh điển lễ.` },
      },
      colorHarmony: 'Đang hoàn thiện tổng thể màu sắc.',
      eventFit: `Đang phối trang phục cho bối cảnh ${outfit.event.name}.`,
      culturalStatus: 'caution',
      explanation: `Bộ trang phục còn thiếu ${missing.join(', ')}. Hãy chọn đủ để hoàn thiện phong cách cổ phong!`,
      source: 'Hệ thống tri thức văn hóa Việt phục Remix',
      mascotQuote: `Còn thiếu ${missing.join(', ')} nè, mau chọn thêm cho đủ bộ xiêm y nha!`,
      mascotMood: 'thinking',
    };
  }

  // Default Fallback
  return {
    totalScore: 8.5,
    criteria: {
      colorHarmony: {
        name: 'Hài hòa màu sắc',
        score: 8.6,
        maxScore: 10,
        comment: 'Màu sắc phối hợp tự nhiên, thể hiện phong cách tự do của người mặc.',
      },
      eventFit: {
        name: 'Phù hợp sự kiện',
        score: 8.5,
        maxScore: 10,
        comment: `Phù hợp khám phá cho bối cảnh ${outfit.event.name}.`,
      },
      culturalNorm: {
        name: 'Chuẩn mực lễ nghi',
        score: 8.4,
        maxScore: 10,
        comment: 'Tổ hợp trang phục đem lại diện mạo mới mẻ, tôn vinh nét đẹp trang phục truyền thống Việt Nam.',
      },
    },
    colorHarmony: 'Màu sắc phối hợp tự nhiên, thể hiện phong cách tự do của người mặc.',
    eventFit: `Phù hợp khám phá cho bối cảnh ${outfit.event.name}.`,
    culturalStatus: 'suitable',
    explanation: 'Tổ hợp trang phục đem lại diện mạo mới mẻ, tôn vinh nét đẹp trang phục truyền thống Việt Nam.',
    source: 'Hệ thống tri thức văn hóa Việt phục Remix',
    mascotQuote: `Phối đồ rất trang nhã, diện mạo mới mẻ hài hòa cùng ${outfit.event.name}!`,
    mascotMood: 'happy',
  };
};
