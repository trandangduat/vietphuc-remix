import React, { useState } from 'react';
import { ActiveOutfitState, AIOverviewResult } from '../types';
import { Sparkles, ShieldCheck, AlertTriangle, AlertCircle, BookCheck, Lock, ChevronDown, ChevronUp, X } from 'lucide-react';

interface AIOverviewCardProps {
  outfit: ActiveOutfitState;
  isLoggedIn: boolean;
  onLoginPrompt: () => void;
}

export const AIOverviewCard: React.FC<AIOverviewCardProps> = ({
  outfit,
  isLoggedIn,
  onLoginPrompt,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Compute cultural analysis with quantifiable scoring based on verified catalog rules
  const getAnalysis = (): AIOverviewResult => {
    const hasAnyPiece = Boolean(outfit.topPiece || outfit.bottomPiece || outfit.footwearPiece || outfit.accessoryPiece);
    if (!hasAnyPiece) {
      return {
        totalScore: 0,
        criteria: {
          colorHarmony: { name: 'Hài hòa màu sắc', score: 0, maxScore: 10, comment: 'Chưa có trang phục nào được chọn trên ma-nơ-canh.' },
          eventFit: { name: 'Phù hợp sự kiện', score: 0, maxScore: 10, comment: 'Chọn trang phục để đánh giá độ phù hợp với sự kiện.' },
          culturalNorm: { name: 'Chuẩn mực lễ nghi', score: 0, maxScore: 10, comment: 'Chưa đủ dữ liệu trang phục để đối chiếu văn hóa.' },
        },
        colorHarmony: 'Chưa chọn trang phục',
        eventFit: 'Chưa chọn trang phục',
        culturalStatus: 'caution',
        explanation: 'Ma-nơ-canh hiện chưa mặc trang phục nào. Hãy chọn Áo, Quần và Giày ở danh mục phía trên để hoàn tất bộ đồ và nhận đánh giá từ AI.',
        source: 'Hệ thống tri thức văn hóa Việt phục Remix',
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
    };
  };

  const analysis = getAnalysis();

  if (!isLoggedIn) {
    return (
      <div className="border-t border-lacquer-border bg-lacquer-surface flex-shrink-0 font-sans">
        <div className="h-11 px-4 sm:px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-imperial-gold" />
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-silk-ivory">
              Cố vấn Văn hóa AI
            </h4>
          </div>
          <button
            onClick={onLoginPrompt}
            className="py-1 px-3 bg-imperial-gold text-lacquer font-bold text-xs hover:bg-imperial-gold-light transition-all uppercase tracking-wider"
          >
            Đăng nhập để xem
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-lacquer-border bg-lacquer-surface flex-shrink-0 relative font-sans z-30">
      {/* 1. Permanent Fixed-Height Summary Dock Bar (Zero Layout Shift - Always ~44px) */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-11 px-4 sm:px-5 flex items-center justify-between cursor-pointer hover:bg-lacquer-hover/60 transition-colors select-none"
      >
        {/* Left: Sparkle Icon + Title + Score */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Sparkles className="w-3.5 h-3.5 text-imperial-gold flex-shrink-0" />
          <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-silk-ivory whitespace-nowrap">
            Đánh giá văn hóa
          </h4>

          {analysis.totalScore > 0 ? (
            <span className="text-[11px] font-serif font-bold px-2 py-0.5 bg-imperial-gold/15 text-imperial-gold border border-imperial-gold/40 whitespace-nowrap">
              {analysis.totalScore} / 10
            </span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 bg-lacquer text-silk-muted font-medium border border-lacquer-border whitespace-nowrap">
              Chờ phối đồ
            </span>
          )}

          {/* Quick 1-line verdict preview on desktop */}
          {analysis.totalScore > 0 && (
            <p className="hidden md:block text-[11px] text-silk-muted/80 truncate max-w-[220px] xl:max-w-xs font-normal ml-1">
              • {analysis.criteria.eventFit.comment}
            </p>
          )}
        </div>

        {/* Right: Cultural Status Badge + Expand Action */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {analysis.totalScore === 0 ? (
            <span className="hidden sm:inline-block text-[10px] text-silk-muted px-2 py-0.5 border border-lacquer-border bg-lacquer/40">
              Chưa chọn món nào
            </span>
          ) : analysis.culturalStatus === 'suitable' ? (
            <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-950/70 text-emerald-300 border border-emerald-500/50">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Phù hợp</span>
            </span>
          ) : analysis.culturalStatus === 'caution' ? (
            <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-950/70 text-amber-300 border border-amber-500/50">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>Cần lưu ý</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-950/70 text-rose-300 border border-rose-500/50">
              <AlertCircle className="w-3 h-3 text-rose-400" />
              <span>Chưa chuẩn</span>
            </span>
          )}

          <button
            className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 border transition-all ${
              isExpanded
                ? 'bg-imperial-gold text-lacquer border-imperial-gold font-bold'
                : 'text-silk-muted hover:text-silk-ivory bg-lacquer border-lacquer-border hover:border-imperial-gold/60'
            }`}
            title={isExpanded ? 'Đóng bảng thẩm định' : 'Mở rộng xem luận giải chi tiết'}
          >
            <span>{isExpanded ? 'Đóng' : 'Chi tiết'}</span>
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* 2. Floating Bottom Sheet Overlay (Rises above the dock bar, ZERO layout shift to piece grid) */}
      {isExpanded && (
        <>
          {/* Subtle click-away backdrop */}
          <div
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
          />

          {/* Floating Sheet Container */}
          <div
            className="absolute bottom-full left-0 right-0 z-40 mb-[1px] bg-lacquer-surface/98 backdrop-blur-2xl border-t-2 border-x border-imperial-gold/50 shadow-[0_-16px_40px_rgba(0,0,0,0.9)] max-h-[70vh] sm:max-h-[460px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Header */}
            <div className="px-4 py-3 sm:px-5 border-b border-lacquer-border/80 flex items-center justify-between bg-lacquer-card/70 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-imperial-gold" />
                <h4 className="font-serif font-bold text-sm text-silk-ivory uppercase tracking-wider">
                  Cố vấn Văn hóa & Lễ nghi
                </h4>
                {analysis.totalScore > 0 && (
                  <span className="text-xs font-serif font-bold px-2 py-0.5 bg-imperial-gold/20 text-imperial-gold border border-imperial-gold/40">
                    {analysis.totalScore} / 10 Điểm
                  </span>
                )}
              </div>

              <button
                onClick={() => setIsExpanded(false)}
                className="w-7 h-7 flex items-center justify-center text-silk-muted hover:text-white border border-lacquer-border hover:border-imperial-gold transition-colors"
                title="Đóng bảng thẩm định"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sheet Scrollable Body */}
            <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto scrollbar-thin">
              {/* 3 Aesthetic Criteria Cards (No RPG progress bars) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Criterion 1: Hài hòa màu sắc */}
                <div className="p-3 bg-lacquer/80 border border-lacquer-border flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-silk-muted uppercase tracking-wider text-[11px]">
                        Hài hòa màu sắc
                      </span>
                      <span className="font-serif font-bold text-imperial-gold text-xs">
                        {analysis.criteria.colorHarmony.score}/10
                      </span>
                    </div>
                    <p className="text-xs text-silk-ivory/90 leading-relaxed font-normal">
                      {analysis.criteria.colorHarmony.comment}
                    </p>
                  </div>
                </div>

                {/* Criterion 2: Phù hợp sự kiện */}
                <div className="p-3 bg-lacquer/80 border border-lacquer-border flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-silk-muted uppercase tracking-wider text-[11px]">
                        Phù hợp sự kiện
                      </span>
                      <span className="font-serif font-bold text-imperial-gold text-xs">
                        {analysis.criteria.eventFit.score}/10
                      </span>
                    </div>
                    <p className="text-xs text-silk-ivory/90 leading-relaxed font-normal">
                      {analysis.criteria.eventFit.comment}
                    </p>
                  </div>
                </div>

                {/* Criterion 3: Chuẩn mực lễ nghi */}
                <div className="p-3 bg-lacquer/80 border border-lacquer-border flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-silk-muted uppercase tracking-wider text-[11px]">
                        Chuẩn mực lễ nghi
                      </span>
                      <span className="font-serif font-bold text-imperial-gold text-xs">
                        {analysis.criteria.culturalNorm.score}/10
                      </span>
                    </div>
                    <p className="text-xs text-silk-ivory/90 leading-relaxed font-normal">
                      {analysis.criteria.culturalNorm.comment}
                    </p>
                  </div>
                </div>
              </div>

              {/* Curator Editorial Synthesis Block */}
              <div className="p-3.5 bg-lacquer/90 border-l-2 border-imperial-gold space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-imperial-gold font-bold uppercase tracking-wider">
                  <BookCheck className="w-3.5 h-3.5" />
                  <span>Luận giải của Giám tuyển</span>
                </div>
                <p className="font-serif italic text-sm text-silk-ivory leading-relaxed">
                  "{analysis.explanation}"
                </p>
                {analysis.suggestion && (
                  <p className="text-xs text-amber-300 font-medium pt-1.5 border-t border-lacquer-border/60">
                    💡 <strong>Gợi ý cải thiện:</strong> {analysis.suggestion}
                  </p>
                )}
              </div>

              {/* Archival Citation Seal */}
              <div className="flex items-center justify-between pt-1 border-t border-lacquer-border/60 text-[11px] text-silk-muted">
                <span className="truncate">
                  Nguồn kiểm chứng: <strong className="text-silk-ivory font-serif italic">{analysis.source}</strong>
                </span>
                <span className="text-[10px] tracking-widest uppercase text-imperial-gold/80 border border-imperial-gold/30 px-1.5 py-0.5 whitespace-nowrap">
                  Di sản đối chiếu
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
