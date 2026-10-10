import { ActiveOutfitState, AIOverviewResult } from '../types';

/** Nhận xét khi chưa chọn trang phục. */
export const evaluateCulturalOutfit = (outfit: ActiveOutfitState): AIOverviewResult => {
  const hasAnyPiece = Boolean(outfit.topPiece || outfit.bottomPiece || outfit.footwearPiece || outfit.accessoryPiece);
  
  if (!hasAnyPiece) {
    return {
      totalScore: 0,
      criteria: {
        colorHarmony: {
          name: 'Hài hòa màu sắc',
          score: 0,
          maxScore: 10,
          comment: 'Chưa có trang phục nào được khoác lên ma-nơ-canh để đối chiếu tương phản sắc độ và nguyên lý hòa sắc ngũ hành truyền thống.',
        },
        eventFit: {
          name: 'Phù hợp sự kiện',
          score: 0,
          maxScore: 10,
          comment: 'Hãy chọn xiêm y để Bé Cáo giúp bạn thẩm định mức độ hài hòa với không gian và quy chuẩn lễ nghi của bối cảnh.',
        },
        culturalNorm: {
          name: 'Chuẩn mực lễ nghi',
          score: 0,
          maxScore: 10,
          comment: 'Hệ thống đang chờ bạn phối trang phục để đối chiếu cùng các quy chế phẩm hàm và điển lệ trang phục thời Nguyễn.',
        },
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
  const isAoNguThan = outfit.topPiece?.id === 'piece-ao-ngu-than-nam';
  const isAoSomiLinen = outfit.topPiece?.id === 'piece-ao-somi-linen-nam';

  const isQuanLuaTrang = outfit.bottomPiece?.id === 'piece-quan-lua';
  const isQuanLuaDen = outfit.bottomPiece?.id === 'piece-quan-lua-den';
  const isQuanLua = isQuanLuaTrang || isQuanLuaDen;
  const isQuanTay = outfit.bottomPiece?.id === 'piece-quan-tay';
  const isQuanAuBeige = outfit.bottomPiece?.id === 'piece-quan-au-beige';
  const isQuanAu = isQuanTay || isQuanAuBeige;

  const isHaiNhungDo = outfit.footwearPiece?.id === 'piece-hai-nhung';
  const isHaiNhungDen = outfit.footwearPiece?.id === 'piece-hai-nhung-den';
  const isHaiNhung = isHaiNhungDo || isHaiNhungDen;
  const isLoafer = outfit.footwearPiece?.id === 'piece-loafer';
  const isDerby = outfit.footwearPiece?.id === 'piece-giay-derby-den';
  const isGiayTay = isLoafer || isDerby;

  const isKhanDong = outfit.accessoryPiece?.id === 'piece-khan-dong-hoang-gia';
  const isEventTet = outfit.event.id === 'event-tet';

  // Case 0: Royal Traditional Men (Áo ngũ thân vàng đồng + Quần lụa đen/trắng + Hài nhung)
  if (isAoNguThan && isQuanLua && isHaiNhung) {
    return {
      totalScore: isEventTet ? 9.9 : 9.7,
      criteria: {
        colorHarmony: {
          name: 'Hài hòa màu sắc',
          score: 9.9,
          maxScore: 10,
          comment: 'Sắc vàng đồng hoàng tộc của gấm dệt chữ Thọ và hoa văn mây cát tường hòa quyện cùng sắc đen tuyền trang nhã của quần lụa và hài nhung. Bảng màu quyền uy, đĩnh đạc và mực thước theo điển lễ vương triều.',
        },
        eventFit: {
          name: 'Phù hợp sự kiện',
          score: isEventTet ? 10.0 : 9.6,
          maxScore: 10,
          comment: isEventTet
            ? 'Quốc phục chuẩn mực của nam giới thời Nguyễn cho ngày đầu năm mới: dâng hương tế tự, chúc Tết gia tộc và tiếp đón khách quý trong không khí trang nghiêm đầu xuân.'
            : 'Tuyệt đối mực thước cho các đại lễ kỷ niệm, sự kiện văn hóa cổ điển và nghi thức truyền thống.',
        },
        culturalNorm: {
          name: 'Chuẩn mực lễ nghi',
          score: 9.9,
          maxScore: 10,
          comment: `Điển chế quốc phục nam giới chuẩn chỉ triều Nguyễn. Năm thân áo và năm khuy cài tượng trưng cho tứ thân phụ mẫu và đạo Ngũ thường (Nhân, Lễ, Nghĩa, Trí, Tín)${isKhanDong ? ', kết hợp khăn đóng chữ Nhân hoàn hảo' : ''}.`,
        },
      },
      colorHarmony: 'Vàng đồng hoàng gia tương phản sắc sảo trên nền lụa đen quý phái.',
      eventFit: isEventTet ? 'Hoàn hảo tuyệt đối cho Tết Cổ Truyền và nghi lễ gia tiên.' : 'Mực thước, trang trọng cho sự kiện văn hóa truyền thống.',
      culturalStatus: 'suitable',
      explanation: 'Bộ quốc phục áo ngũ thân tay chẽn vàng đồng kết hợp cùng quần lụa đen và hài nhung thể hiện trọn vẹn phong thái quân tử đĩnh đạc của nam giới Việt xưa.',
      source: 'Bảo tàng Cổ vật Cung đình Huế & "Ngàn năm áo mũ"',
      mascotQuote: 'Phong thái bậc vương giả quân tử! Áo ngũ thân vàng đồng uy nghiêm rạng rỡ!',
      mascotMood: 'reverent',
    };
  }

  // Case 1A: Pure Traditional Royal (Áo tấc đỏ + Quần lụa + Hài nhung)
  if (isAoTacDo && isQuanLua && isHaiNhung) {
    return {
      totalScore: isEventTet ? 9.8 : 9.5,
      criteria: {
        colorHarmony: {
          name: 'Hài hòa màu sắc',
          score: 9.8,
          maxScore: 10,
          comment: 'Sắc đỏ đại hồng quyền quý của gấm dệt hoa văn sóng nước tương phản kinh điển cùng sắc trắng ngà thuần khiết của quần lụa tơ tằm. Bảng màu mang dương khí rực rỡ cát tường, toát lên vẻ đài các, đoan chính của giới quý tộc hoàng gia.',
        },
        eventFit: {
          name: 'Phù hợp sự kiện',
          score: isEventTet ? 10.0 : 9.2,
          maxScore: 10,
          comment: isEventTet
            ? 'Sắc đỏ son gấm vóc tượng trưng cho sinh khí, may mắn và phúc lộc đầu năm. Hoàn toàn chuẩn chỉnh cho các nghi thức chúc Tết gia tiên, tế tự trang nghiêm và vãng cảnh đền chùa đầu xuân.'
            : 'Đại lễ phục mang lại phong thái trang nghiêm, đĩnh đạc và mực thước trong các nghi thức cung đình cổ điển hay đại lễ kỷ niệm truyền thống.',
        },
        culturalNorm: {
          name: 'Chuẩn mực lễ nghi',
          score: 9.7,
          maxScore: 10,
          comment: 'Kế thừa trọn vẹn quy thức ngũ thân tay chẽn phối tay thụng (áo tấc) thời Nguyễn. Chiều dài vạt áo, độ rộng tay thụng khi chắp tay hành lễ cùng đôi hài nhung mũi cong thể hiện chuẩn mực cao nhất của lễ giáo Á Đông.',
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
          comment: 'Sắc thanh lục (xanh cổ vịt / xanh chàm) trầm mặc của tà áo kết hợp cùng dải lụa trắng ngà tao nhã. Bảng màu mang âm hưởng Nho phong, biểu đạt sự thâm trầm, đức độ khoan hòa và cốt cách thanh cao của bậc danh sĩ.',
        },
        eventFit: {
          name: 'Phù hợp sự kiện',
          score: isEventTet ? 9.5 : 9.8,
          maxScore: 10,
          comment: isEventTet
            ? 'Rất thích hợp cho các buổi tao đàn đầu xuân, dâng hương chiêm bái hoặc vãng cảnh danh lam thắng cảnh trong không khí mùa xuân thanh nhã, tôn nghiêm.'
            : 'Hoàn hảo cho sự kiện văn hóa, diễn đàn học thuật, triển lãm di sản và các nghi thức mang tính trang trọng, mẫu mực.',
        },
        culturalNorm: {
          name: 'Chuẩn mực lễ nghi',
          score: 9.6,
          maxScore: 10,
          comment: 'Tái hiện mẫu mực phong thái của giới sĩ phu, quan viên nho nhã triều đình. Từng đường khâu, dáng cổ đứng ngũ thân cài năm khuy đến thế tay thụng khi hành lễ đều chuẩn chỉ theo thể chế điển lệ triều Nguyễn.',
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
          comment: 'Sự va đập đầy sáng tạo giữa màu gấm dệt hoa văn truyền thống phương Đông và tông màu tối lịch lãm của quần âu menswear phương Tây. Tà áo rực rỡ trở thành tâm điểm thị giác nổi bật trên phom dáng gọn gàng, hiện đại.',
        },
        eventFit: {
          name: 'Phù hợp sự kiện',
          score: isEventTet ? 7.8 : 9.2,
          maxScore: 10,
          comment: isEventTet
            ? 'Mang lại diện mạo trẻ trung, năng động khi du xuân, chụp ảnh nghệ thuật hoặc dạo phố Tết. Tuy nhiên, tính chất phá cách này không khuyến nghị diện vào các nghi lễ cúng bái gia tiên trang nghiêm.'
            : 'Lựa chọn sáng tạo và cuốn hút cho các đêm dạ hội học sinh, sự kiện giao lưu văn hóa giới trẻ hoặc dạo phố nghệ thuật mang hơi thở di sản đương đại.',
        },
        culturalNorm: {
          name: 'Chuẩn mực lễ nghi',
          score: 7.9,
          maxScore: 10,
          comment: 'Thử nghiệm giao thoa văn hóa táo bạo giữa tà áo thụng cổ truyền và âu phục Tây phương. Dù vẫn giữ được vẻ đẹp nhận diện của cổ phục ở nửa thân trên, việc lược bỏ quần lụa và hài thêu cổ truyền làm giảm tính tôn ti và quy chuẩn lễ nghi truyền thống.',
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

  // Case 2B: Contemporary Smart Casual / Heritage Remix Men (Áo sơ mi linen + Quần âu + Giày Tây)
  if (isAoSomiLinen && isQuanAu && isGiayTay) {
    return {
      totalScore: 9.2,
      criteria: {
        colorHarmony: {
          name: 'Hài hòa màu sắc',
          score: 9.4,
          maxScore: 10,
          comment: 'Sắc trắng ngà mộc mạc của linen tự nhiên phối cùng tông be cát ấm áp và sắc đen bóng của giày Derby tạo nên bảng màu Minimalism tinh tế, thanh nhã và đậm chất thời trang đương đại.',
        },
        eventFit: {
          name: 'Phù hợp sự kiện',
          score: outfit.event.id === 'event-prom' || outfit.event.id === 'event-ngay-hoi' ? 9.8 : 8.9,
          maxScore: 10,
          comment: 'Rất ấn tượng cho các dịp dạ hội trường học (Prom), ngày hội văn hóa giới trẻ, triển lãm sáng tạo và gặp gỡ giao lưu nghệ thuật.',
        },
        culturalNorm: {
          name: 'Chuẩn mực lễ nghi',
          score: 8.5,
          maxScore: 10,
          comment: 'Lấy cảm hứng từ cổ đứng truyền thống Việt Nam nhưng giản lược theo ngôn ngữ sơ mi hiện đại. Đây là lối tiếp cận di sản bằng thời trang ứng dụng thực tế, gần gũi với thế hệ trẻ.',
        },
      },
      colorHarmony: 'Tối giản đương đại (Trắng ngà linen, be cát và da đen bóng).',
      eventFit: 'Hoàn hảo cho sự kiện trường học, dạ hội Prom và không gian sáng tạo trẻ trung.',
      culturalStatus: 'suitable',
      explanation: 'Phong cách Heritage Remix trẻ trung: Áo sơ mi cổ trụ linen kết hợp quần âu xếp ly và giày Derby bóng bẩy mang hơi thở hiện đại lấy cảm hứng từ trang phục truyền thống.',
      source: 'Xu hướng Thời trang Bền vững & Tạp chí ELLE Man Việt Nam',
      mascotQuote: 'Trang phục tân thời cực kỳ lịch lãm và có gu! Rất hợp với các bạn trẻ yêu văn hóa!',
      mascotMood: 'happy',
    };
  }

  // Case 2C: Ngũ thân Remix (Áo ngũ thân + Quần âu / Giày Tây)
  if (isAoNguThan && (isQuanAu || isGiayTay)) {
    return {
      totalScore: 8.6,
      criteria: {
        colorHarmony: {
          name: 'Hài hòa màu sắc',
          score: 8.9,
          maxScore: 10,
          comment: 'Sắc vàng đồng của áo ngũ thân nổi bật trên nền âu phục phương Tây, tạo điểm nhấn tương phản độc đáo giữa truyền thống và hiện đại.',
        },
        eventFit: {
          name: 'Phù hợp sự kiện',
          score: 8.8,
          maxScore: 10,
          comment: 'Lựa chọn phong cách cho các buổi biểu diễn nghệ thuật, tuần lễ thời trang di sản hoặc chụp ảnh lookbook đương đại.',
        },
        culturalNorm: {
          name: 'Chuẩn mực lễ nghi',
          score: 8.0,
          maxScore: 10,
          comment: 'Thử nghiệm cách tân phá cách. Vẫn giữ phẩm cách vạt áo ngũ thân nhưng kết hợp cùng hạ y hiện đại.',
        },
      },
      colorHarmony: 'Gấm vàng đồng vương giả phối hợp cùng âu phục đương đại.',
      eventFit: 'Thích hợp cho tuần lễ thời trang, chụp ảnh concept và sự kiện văn hóa nghệ thuật trẻ.',
      culturalStatus: 'caution',
      explanation: 'Sự kết hợp phá cách giữa áo ngũ thân triều Nguyễn và âu phục hiện đại. Thích hợp cho sự kiện nghệ thuật, dạo phố.',
      suggestion: 'Khi tham gia các nghi thức cúng lễ truyền thống, nên phối cùng Quần lụa đen và Hài nhung để đạt chuẩn mực cao nhất.',
      source: 'Bảo tàng Cổ vật Cung đình Huế & Trào lưu Việt phục đương đại',
      mascotQuote: 'Phối ngũ thân cùng âu phục trông rất cá tính và nghệ thuật đấy!',
      mascotMood: 'curious',
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
        colorHarmony: {
          name: 'Hài hòa màu sắc',
          score: 7.2,
          maxScore: 10,
          comment: 'Sắc độ hiện tại mới phản ánh một phần diện mạo tổng thể. Trong thẩm mỹ cổ phục, sự tương phản hay tương sinh giữa sắc áo, quần và hài phải hòa sắc chặt chẽ để tạo nên một chỉnh thể trang nhã.',
        },
        eventFit: {
          name: 'Phù hợp sự kiện',
          score: 6.8,
          maxScore: 10,
          comment: isEventTet
            ? 'Không gian ngày Tết đòi hỏi sự chỉn chu toàn diện từ mũ áo đến hài lí để nghênh đón phúc khí đầu năm. Việc thiếu mảnh trang phục khiến diện mạo chưa đạt được độ trang trọng tối ưu.'
            : `Khi tham gia bối cảnh "${outfit.event.name}", phong thái người mặc phụ thuộc rất lớn vào tính đồng bộ giữa áo choàng, thường/quần và đôi hài lễ nghi.`,
        },
        culturalNorm: {
          name: 'Chuẩn mực lễ nghi',
          score: 7.0,
          maxScore: 10,
          comment: `Quy chế trang phục cổ nhân luôn đề cao tính toàn bích "y thường hài lí". Hiện còn thiếu ${missing.join(', ')}, chưa thể định hình trọn vẹn thức bậc và quy chuẩn lễ nghi của trang phục thời Nguyễn.`,
        },
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
        comment: 'Các mảng màu trên tổng thể xiêm y kết nối tương đối nhịp nhàng. Để diện mạo thêm phần đài các, bạn có thể chú ý thêm nguyên tắc phối màu ngũ hành truyền thống giữa thân áo và các lớp phục sức đi kèm.',
      },
      eventFit: {
        name: 'Phù hợp sự kiện',
        score: 8.5,
        maxScore: 10,
        comment: `Trang phục tạo được điểm nhấn thị giác trong bối cảnh "${outfit.event.name}". Nếu diện vào các nghi thức đòi hỏi tính trang nghiêm cao, người mặc nên chú ý đồng bộ thêm phụ kiện cổ truyền đi kèm.`,
      },
      culturalNorm: {
        name: 'Chuẩn mực lễ nghi',
        score: 8.4,
        maxScore: 10,
        comment: 'Tổ hợp mang đậm dấu ấn phong cách cá nhân và tư duy thẩm mỹ mới mẻ. Việc kết hợp cổ phục cần khéo léo cân bằng giữa tính ứng dụng đời thường và sự tôn trọng đối với thức bậc, quy chế của trang phục truyền thống.',
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
