import React, { useState } from 'react';
import { BookOpen, Compass, ShieldCheck, CheckCircle } from 'lucide-react';
import { AncientCloudDivider } from '../heritage/HeritageDecorations';

interface AnatomyPoint {
  id: string;
  name: string;
  vietnameseName: string;
  philosophicalMeaning: string;
  constructionDetails: string;
  museumCitation: string;
  position: { top: string; left: string };
}

const ANATOMY_POINTS: AnatomyPoint[] = [
  {
    id: 'collar',
    name: 'Cổ đứng ngũ khuy',
    vietnameseName: 'Cổ đứng cài khuy hữu nhậm',
    philosophicalMeaning:
      'Năm hạt cúc đồng hoặc ngọc tượng trưng cho Ngũ thường: Nhân, Lễ, Nghĩa, Trí, Tín; đồng thời tương ứng với nguyên lý Ngũ hành hòa hợp đất trời.',
    constructionDetails:
      'Cổ áo dựng đứng cao khoảng 3cm đến 4cm ôm vừa vặn quanh cổ, vạt nẹp lượn sang bên phải (hữu nhậm) kín đáo, giữ tư thế người mặc luôn ngay ngắn, đĩnh đạc.',
    museumCitation: 'Hiện vật phục trang triều Nguyễn, Bảo tàng Lịch sử Quốc gia.',
    position: { top: '24%', left: '49%' },
  },
  {
    id: 'sleeves',
    name: 'Tà thụng Áo tấc',
    vietnameseName: 'Thụy y (Tay thụng rộng một thước)',
    philosophicalMeaning:
      'Đại diện cho phong thái ung dung, đài các của giới quý tộc. Khi chắp tay bái lễ, hai tay áo phủ chồng tạo thành đường ngang chữ Nhất trang nghiêm.',
    constructionDetails:
      'Độ rộng ống tay từ 40cm đến 45cm (đúng một thước ta xưa), tà áo buông dài bằng hoặc qua đầu ngón tay khi thả lỏng, may nối ở nách bằng đường ráp cong tỉ mỉ.',
    museumCitation: 'Khảo cứu "Ngàn năm áo mũ", học giả Trần Quang Đức.',
    position: { top: '48%', left: '22%' },
  },
  {
    id: 'panels',
    name: 'Kết cấu Ngũ thân',
    vietnameseName: 'Năm vạt vải ghép liền',
    philosophicalMeaning:
      'Bốn thân ngoài (hai thân trước, hai thân sau) tượng trưng cho tứ thân phụ mẫu (cha mẹ đẻ và cha mẹ chồng/vợ). Thân con thứ năm nằm ẩn bên trong tượng trưng cho người mặc luôn được bao bọc chở che.',
    constructionDetails:
      'Vì khổ vải dệt xưa chỉ rộng khoảng 35cm đến 40cm, người thợ may phải ghép 5 tấm vải liền mạch, tạo nên dáng áo suông rộng dần về phía gấu (hình chữ A) bay bổng khi bước đi.',
    museumCitation: 'Tư liệu Bảo tàng Phụ nữ Nam Bộ & Trung tâm Bảo tồn Di tích Cố đô Huế.',
    position: { top: '56%', left: '52%' },
  },
  {
    id: 'dorsal-seam',
    name: 'Đường can sống lưng',
    vietnameseName: 'Chính trung phùng',
    philosophicalMeaning:
      'Đường chỉ chạy thẳng tắp chính giữa sống lưng thể hiện nhân cách liêm khiết, chính trực của người quân tử và phụ nữ đoan trang.',
    constructionDetails:
      'Kỹ thuật can hai vạt vải đối xứng tuyệt đối qua trục sống lưng, các mũi chỉ khâu tay giấu nếp mí chỉ 1mm đòi hỏi tay nghề thượng thừa của nghệ nhân cung đình.',
    museumCitation: 'Quy chế Điển lệ Phục sức triều Nguyễn, Viện Sử học.',
    position: { top: '38%', left: '68%' },
  },
];

export const GarmentAnatomy: React.FC = () => {
  const [activePointId, setActivePointId] = useState<string>('collar');

  const activePoint = ANATOMY_POINTS.find((p) => p.id === activePointId) || ANATOMY_POINTS[0];

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full" aria-label="Giải phẫu phục trang">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-imperial-gold/30 bg-imperial-gold/10 text-imperial-gold text-xs font-semibold uppercase tracking-widest mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Khảo cứu cấu trúc</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-silk-ivory mb-4 [text-wrap:balance]">
          Giải phẫu kết cấu Y phục Cổ truyền
        </h2>
        <p className="text-sm sm:text-base text-silk-muted font-normal [text-wrap:pretty] leading-relaxed">
          Mỗi chi tiết tà áo không đơn thuần là thẩm mỹ thị giác, mà là một công trình triết học luân lý và đỉnh cao kỹ nghệ may đo thủ công Việt Nam.
        </p>
      </div>

      <AncientCloudDivider className="mb-14 opacity-35 max-w-sm mx-auto" />

      {/* Main Interactive Anatomy Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#12161F] border-2 border-lacquer-border p-6 sm:p-10 relative">
        {/* Left Column: Interactive Visual Blueprint */}
        <div className="lg:col-span-6 flex justify-center relative">
          <div className="relative w-full max-w-[380px] aspect-[3/4] bg-[#0A0D12] border border-imperial-gold/30 overflow-hidden">
            {/* Base Garment Image */}
            <img
              src="/assets/pieces/tops/top-ao-tac-crimson.png"
              alt="Áo tấc đỏ gấm thủy ba triều Nguyễn"
              className="w-full h-full object-contain p-4 select-none pointer-events-none"
            />

            {/* Soft grid background representing tailoring blueprint */}
            <div
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                backgroundImage: 'radial-gradient(#C69B56 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Interactive Hotspots */}
            {ANATOMY_POINTS.map((point) => {
              const isSelected = activePointId === point.id;
              return (
                <button
                  key={point.id}
                  type="button"
                  onClick={() => setActivePointId(point.id)}
                  style={{ top: point.position.top, left: point.position.left }}
                  title={`Xem khảo cứu: ${point.name}`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imperial-gold`}
                >
                  <span
                    className={`relative flex items-center justify-center w-8 h-8 rounded-full border transition-all ${
                      isSelected
                        ? 'bg-imperial-gold text-lacquer border-white scale-110 shadow-gold-glow'
                        : 'bg-[#0A0D12]/90 text-imperial-gold border-imperial-gold/60 hover:scale-105'
                    }`}
                  >
                    <span className="text-xs font-bold font-serif">
                      {point.id === 'collar' ? '1' : point.id === 'sleeves' ? '2' : point.id === 'panels' ? '3' : '4'}
                    </span>
                    {/* Pulsing ring if selected */}
                    {isSelected && (
                      <span className="absolute inset-0 rounded-full border-2 border-imperial-gold animate-ping opacity-75" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Curatorial Breakdown */}
        <div className="lg:col-span-6 space-y-6">
          {/* Hotspot Selector Tabs */}
          <div className="flex flex-wrap gap-2 pb-4 border-b border-lacquer-border">
            {ANATOMY_POINTS.map((pt, idx) => (
              <button
                key={pt.id}
                type="button"
                onClick={() => setActivePointId(pt.id)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all border ${
                  activePointId === pt.id
                    ? 'bg-imperial-gold text-lacquer border-imperial-gold shadow-sm'
                    : 'bg-[#181E29] text-silk-muted border-lacquer-border hover:border-imperial-gold/40 hover:text-silk-ivory'
                }`}
              >
                <span>{idx + 1}. {pt.name}</span>
              </button>
            ))}
          </div>

          {/* Active Detail Header */}
          <div>
            <span className="text-xs uppercase font-bold text-imperial-gold tracking-widest block">
              {activePoint.vietnameseName}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-silk-ivory mt-1">
              {activePoint.name}
            </h3>
          </div>

          {/* Philosophical Meaning */}
          <div className="p-4 bg-[#181E29] border border-lacquer-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-imperial-gold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Triết lý biểu trưng:</span>
            </div>
            <p className="text-xs sm:text-sm text-silk-ivory/95 leading-relaxed font-normal">
              {activePoint.philosophicalMeaning}
            </p>
          </div>

          {/* Construction Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-silk-muted uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-imperial-gold" />
              <span>Quy chuẩn may đo cổ truyền:</span>
            </div>
            <p className="text-xs sm:text-sm text-silk-muted leading-relaxed font-normal">
              {activePoint.constructionDetails}
            </p>
          </div>

          {/* Archival Citation */}
          <div className="pt-4 border-t border-lacquer-border text-xs text-silk-muted flex items-start gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-imperial-gold flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-silk-ivory font-semibold">Tư liệu đối chiếu:</strong>{' '}
              {activePoint.museumCitation}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
