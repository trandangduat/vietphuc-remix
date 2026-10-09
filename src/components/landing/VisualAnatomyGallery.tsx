import React, { useState } from 'react';
import { BookOpen, Compass, Layers, CheckCircle } from 'lucide-react';
import { AncientCloudDivider } from '../heritage/HeritageDecorations';

interface AnatomyPoint {
  id: string;
  name: string;
  vietnameseName: string;
  meaning: string;
  spec: string;
  position: { top: string; left: string };
}

const ANATOMY_POINTS: AnatomyPoint[] = [
  {
    id: 'collar',
    name: 'Cổ đứng ngũ khuy',
    vietnameseName: 'Cổ đứng cài khuy hữu nhậm',
    meaning: 'Năm hạt cúc đồng tượng trưng cho Ngũ thường: Nhân, Lễ, Nghĩa, Trí, Tín.',
    spec: 'Cao 3-4cm ôm kín cổ, vạt nẹp lượn sang bên phải nghiêm trang.',
    position: { top: '22%', left: '49%' },
  },
  {
    id: 'sleeves',
    name: 'Tà thụng Áo tấc',
    vietnameseName: 'Thụy y rộng một thước',
    meaning: 'Tay áo thụng dài thể hiện đức khiêm nhường; khi chắp tay tạo thế chữ Nhất uy nghi.',
    spec: 'Độ rộng ống tay 40-45cm, buông dài bằng hoặc qua đầu ngón tay.',
    position: { top: '48%', left: '22%' },
  },
  {
    id: 'panels',
    name: 'Kết cấu Ngũ thân',
    vietnameseName: 'Năm vạt vải ghép liền',
    meaning: 'Bốn thân ngoài tượng trưng cho Tứ thân phụ mẫu, thân con thứ năm chở che người mặc.',
    spec: 'Ghép 5 tấm vải liền mạch, dáng áo xòe chữ A bay bổng khi bước đi.',
    position: { top: '58%', left: '52%' },
  },
  {
    id: 'seam',
    name: 'Đường can sống lưng',
    vietnameseName: 'Chính trung phùng',
    meaning: 'Đường chỉ chạy dọc sống lưng biểu trưng cho đạo liêm khiết, chính trực.',
    spec: 'Kỹ thuật can mí giấu chỉ 1mm đối xứng tuyệt đối qua trục cơ thể.',
    position: { top: '38%', left: '72%' },
  },
];

const FABRICS = [
  {
    name: 'Gấm dệt Thủy Ba',
    hex: '#7A1C1C',
    role: 'Áo tấc triều Nguyễn',
    feel: 'Hoa văn sóng nước dệt nổi óng ả theo ánh sáng.',
  },
  {
    name: 'Lụa tơ tằm Vạn Phúc',
    hex: '#F7F4EE',
    role: 'Quần lụa trắng ngà',
    feel: 'Tơ tằm tự nhiên 100%, mềm rũ, thoáng mát.',
  },
  {
    name: 'Vải tuyết than chì',
    hex: '#2A303C',
    role: 'Quần âu đương đại',
    feel: 'Đanh mịn, giữ nếp ly sắc nét, co giãn nhẹ.',
  },
  {
    name: 'Nhung the kim tuyến',
    hex: '#4A0E17',
    role: 'Hài thêu mũi cong',
    feel: 'Nhung tuyết êm ái, thêu tay chỉ vàng 18K.',
  },
];

export const VisualAnatomyGallery: React.FC = () => {
  const [activePointId, setActivePointId] = useState<string>('collar');
  const activePoint = ANATOMY_POINTS.find((p) => p.id === activePointId) || ANATOMY_POINTS[0];

  return (
    <section className="py-20 sm:py-28 bg-[#0E131B] border-y-2 border-lacquer-border px-4 sm:px-6 lg:px-12" aria-label="Giải phẫu & chất liệu">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-imperial-gold/30 bg-imperial-gold/10 text-imperial-gold text-xs font-semibold uppercase tracking-widest mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kỹ nghệ & Cấu trúc</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-silk-ivory mb-3 [text-wrap:balance]">
            Giải Phẫu Kết Cấu & Chất Liệu Di Sản
          </h2>
          <p className="text-sm sm:text-base text-silk-muted font-normal [text-wrap:pretty]">
            Đối chiếu tỉ mỉ từng đường kim mũi chỉ và cảm xúc xúc giác của gấm lụa hoàng cung kết hợp âu phục hiện đại.
          </p>
        </div>

        <AncientCloudDivider className="mb-12 opacity-30 max-w-xs mx-auto" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#12161F] border-2 border-lacquer-border p-6 sm:p-10">
          {/* Left Column: Visual Blueprint Image with Interactive Hotspots */}
          <div className="lg:col-span-6 flex justify-center relative">
            <div className="relative w-full max-w-[360px] aspect-[3/4] bg-[#0A0D12] border border-imperial-gold/30 overflow-hidden">
              <img
                src="/assets/pieces/tops/top-ao-tac-crimson.png"
                alt="Bản vẽ cấu trúc Áo tấc"
                className="w-full h-full object-contain p-4 select-none pointer-events-none"
              />

              {/* Grid Background Effect */}
              <div
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(#C69B56 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Hotspots */}
              {ANATOMY_POINTS.map((point, index) => {
                const isSelected = activePointId === point.id;
                return (
                  <button
                    key={point.id}
                    type="button"
                    onClick={() => setActivePointId(point.id)}
                    style={{ top: point.position.top, left: point.position.left }}
                    title={point.name}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-300 group focus-visible:outline-none"
                  >
                    <span
                      className={`relative flex items-center justify-center w-7 h-7 rounded-full border transition-all ${
                        isSelected
                          ? 'bg-imperial-gold text-lacquer border-white scale-110 shadow-gold-glow'
                          : 'bg-[#0A0D12]/95 text-imperial-gold border-imperial-gold/60 hover:scale-105'
                      }`}
                    >
                      <span className="text-xs font-bold font-serif">{index + 1}</span>
                      {isSelected && (
                        <span className="absolute inset-0 rounded-full border border-imperial-gold animate-ping opacity-75" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Combined Hotspot Details & Textile Swatches */}
          <div className="lg:col-span-6 space-y-6">
            {/* Hotspot Info */}
            <div className="space-y-3 pb-6 border-b border-lacquer-border">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold text-imperial-gold tracking-widest">
                  {activePoint.vietnameseName}
                </span>
                <span className="text-xs text-silk-muted">
                  Bảo tàng Lịch sử Quốc gia
                </span>
              </div>
              <h3 className="font-serif font-bold text-2xl text-silk-ivory">
                {activePoint.name}
              </h3>
              <p className="text-xs sm:text-sm text-silk-muted leading-relaxed font-normal">
                {activePoint.meaning}
              </p>
              <div className="p-3 bg-[#181E29] border border-lacquer-border text-xs text-silk-ivory/90 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-imperial-gold flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-imperial-gold">Quy cách may đo:</strong> {activePoint.spec}
                </span>
              </div>
            </div>

            {/* Quick Material Swatches Strip */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-imperial-gold">
                <Layers className="w-3.5 h-3.5" />
                <span>Bốn chất liệu chủ đạo trong bản phối</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {FABRICS.map((fabric, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#181E29] border border-lacquer-border flex items-start gap-2.5"
                  >
                    <span
                      className="w-4 h-4 flex-shrink-0 mt-0.5 border border-white/20"
                      style={{ backgroundColor: fabric.hex }}
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-silk-ivory truncate">
                        {fabric.name}
                      </h4>
                      <p className="text-[11px] text-imperial-gold truncate">
                        {fabric.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
