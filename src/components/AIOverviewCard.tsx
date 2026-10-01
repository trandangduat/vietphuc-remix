import React, { useState } from 'react';
import { ActiveOutfitState, AIOverviewResult } from '../types';
import { Sparkles, ShieldCheck, AlertTriangle, AlertCircle, BookCheck, Lock, ChevronDown, ChevronUp } from 'lucide-react';

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

    const isAoTac = outfit.topPiece?.id === 'piece-ao-tac';
    const isQuanLua = outfit.bottomPiece?.id === 'piece-quan-lua';
    const isQuanTay = outfit.bottomPiece?.id === 'piece-quan-tay';
    const isHaiNhung = outfit.footwearPiece?.id === 'piece-hai-nhung';
    const isLoafer = outfit.footwearPiece?.id === 'piece-loafer';
    const isEventTet = outfit.event.id === 'event-tet';

    // Case 1: Pure Traditional Royal (Áo tấc + Quần lụa + Hài nhung)
    if (isAoTac && isQuanLua && isHaiNhung) {
      return {
        totalScore: isEventTet ? 9.8 : 9.5,
        criteria: {
          colorHarmony: {
            name: 'Hài hòa màu sắc',
            score: 9.8,
            maxScore: 10,
            comment: 'Tương phản Đỏ gấm và Lụa trắng ngà hoàng tộc, đoan chính và quý phái.',
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
            comment: 'Bảo toàn trọn vẹn quy thức lễ nghi thời Nguyễn, thể hiện sự đoan chính và tôn ti trật tự.',
          },
        },
        colorHarmony: 'Tương phản Cung đình Huế (Đỏ/Xanh tấc đi cùng lụa trắng ngà).',
        eventFit: isEventTet ? 'Tuyệt đối phù hợp với không khí trang trọng ngày Tết cổ truyền.' : 'Rất trang trọng, phù hợp đại lễ và nghi thức cổ điển.',
        culturalStatus: 'suitable',
        explanation: 'Bộ trang phục bảo toàn trọn vẹn quy thức lễ nghi thời Nguyễn. Áo tấc đi cùng quần lụa trắng và hài thêu thể hiện sự đoan chính, lễ giáo tôn ti trật tự.',
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
      <div className="border-t-2 border-lacquer-border bg-lacquer-surface/95 backdrop-blur-md flex-shrink-0 font-sans">
        <div className="p-3.5 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-imperial-gold" />
            <h4 className="font-sans font-bold text-sm uppercase tracking-wider text-silk-ivory">
              AI Overview (Cố vấn Văn hóa)
            </h4>
          </div>
          <button
            onClick={onLoginPrompt}
            className="py-1.5 px-4 rounded-none bg-imperial-gold text-lacquer font-bold text-sm hover:bg-imperial-gold-light transition-all uppercase tracking-wider"
          >
            Đăng nhập để xem
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t-2 border-lacquer-border bg-lacquer-surface/95 backdrop-blur-md flex-shrink-0 relative overflow-hidden font-sans transition-all">
      {/* Clickable Header Bar (Allows Expand / Collapse) */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 py-3 sm:px-5 flex items-center justify-between cursor-pointer hover:bg-lacquer-hover transition-colors select-none"
      >
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-imperial-gold" />
          <h4 className="font-sans font-bold text-sm uppercase tracking-wider text-silk-ivory">
            AI Overview (Đánh giá văn hóa)
          </h4>
          {analysis.totalScore > 0 ? (
            <span className="text-xs px-2 py-0.5 rounded-none bg-imperial-gold/20 text-imperial-gold font-extrabold border border-imperial-gold/40">
              {analysis.totalScore} / 10
            </span>
          ) : (
            <span className="text-xs px-2 py-0.5 rounded-none bg-lacquer text-silk-muted font-medium border border-lacquer-border">
              Chờ phối đồ
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {analysis.totalScore === 0 ? (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-none text-xs font-medium text-silk-muted border border-lacquer-border bg-lacquer/50">
              Chưa chọn món nào
            </span>
          ) : analysis.culturalStatus === 'suitable' ? (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-none text-xs font-bold uppercase tracking-wider bg-green-500/15 text-green-400 border border-green-500/40">
              <ShieldCheck className="w-3.5 h-3.5" /> Phù hợp
            </span>
          ) : analysis.culturalStatus === 'caution' ? (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-none text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/40">
              <AlertTriangle className="w-3.5 h-3.5" /> Cần lưu ý
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-none text-xs font-bold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/40">
              <AlertCircle className="w-3.5 h-3.5" /> Chưa khuyến nghị
            </span>
          )}

          <button
            className="flex items-center gap-1 text-xs text-silk-muted hover:text-silk-ivory font-semibold px-2 py-1 rounded-none border border-lacquer-border bg-lacquer-surface"
            title={isExpanded ? 'Thu gọn AI Overview' : 'Mở rộng xem chi tiết'}
          >
            <span>{isExpanded ? 'Thu gọn' : 'Chi tiết'}</span>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Body */}
      {isExpanded && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 space-y-3.5 border-t border-lacquer-border/60 max-h-[340px] overflow-y-auto scrollbar-thin animate-fadeIn">
          {/* 1. Score Breakdown Bars for each criterion */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Color Harmony Score */}
            <div className="p-2.5 rounded-none bg-lacquer border border-lacquer-border">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-silk-muted uppercase tracking-wider text-xs">Hài hòa màu sắc:</span>
                <span className="font-bold text-imperial-gold">{analysis.criteria.colorHarmony.score}/10</span>
              </div>
              <div className="w-full bg-lacquer-card h-1.5 rounded-none overflow-hidden">
                <div
                  className="bg-imperial-gold h-full transition-all duration-500"
                  style={{ width: `${(analysis.criteria.colorHarmony.score / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Event Fit Score */}
            <div className="p-2.5 rounded-none bg-lacquer border border-lacquer-border">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-silk-muted uppercase tracking-wider text-xs">Phù hợp sự kiện:</span>
                <span className="font-bold text-imperial-gold">{analysis.criteria.eventFit.score}/10</span>
              </div>
              <div className="w-full bg-lacquer-card h-1.5 rounded-none overflow-hidden">
                <div
                  className="bg-imperial-gold h-full transition-all duration-500"
                  style={{ width: `${(analysis.criteria.eventFit.score / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Cultural Norm Score */}
            <div className="p-2.5 rounded-none bg-lacquer border border-lacquer-border">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-silk-muted uppercase tracking-wider text-xs">Chuẩn mực lễ nghi:</span>
                <span className="font-bold text-imperial-gold">{analysis.criteria.culturalNorm.score}/10</span>
              </div>
              <div className="w-full bg-lacquer-card h-1.5 rounded-none overflow-hidden">
                <div
                  className="bg-imperial-gold h-full transition-all duration-500"
                  style={{ width: `${(analysis.criteria.culturalNorm.score / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* 2. Detailed Feedback Content for each criterion */}
          <div className="space-y-2 text-sm">
            <div className="p-3 rounded-none bg-lacquer/80 border border-lacquer-border space-y-1.5">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-none bg-imperial-gold mt-1.5 flex-shrink-0" />
                <p className="text-silk-ivory leading-relaxed font-normal">
                  <strong className="text-imperial-gold font-bold">Màu sắc: </strong>
                  {analysis.criteria.colorHarmony.comment}
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-none bg-imperial-gold mt-1.5 flex-shrink-0" />
                <p className="text-silk-ivory leading-relaxed font-normal">
                  <strong className="text-imperial-gold font-bold">Bối cảnh: </strong>
                  {analysis.criteria.eventFit.comment}
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-none bg-imperial-gold mt-1.5 flex-shrink-0" />
                <p className="text-silk-ivory leading-relaxed font-normal">
                  <strong className="text-imperial-gold font-bold">Quy thức di sản: </strong>
                  {analysis.criteria.culturalNorm.comment}
                </p>
              </div>

              {analysis.suggestion && (
                <div className="mt-2 pt-2 border-t border-lacquer-border text-amber-300 font-medium">
                  💡 <strong>Gợi ý:</strong> {analysis.suggestion}
                </div>
              )}
            </div>

            {/* 3. Citation */}
            <div className="flex items-center gap-2 text-xs text-silk-muted pt-1 font-medium">
              <BookCheck className="w-4 h-4 text-imperial-gold flex-shrink-0" />
              <span className="truncate">Nguồn kiểm chứng: {analysis.source}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
