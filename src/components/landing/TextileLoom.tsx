import React, { useState } from 'react';
import { Layers, Sparkles, Check } from 'lucide-react';
import { AncientCloudDivider } from '../heritage/HeritageDecorations';

interface Textile {
  id: string;
  name: string;
  origin: string;
  colorHex: string;
  tag: string;
  tactileFeel: string;
  technique: string;
  stylingRole: string;
  description: string;
}

const TEXTILES: Textile[] = [
  {
    id: 'brocade',
    name: 'Gấm dệt Thủy Ba',
    origin: 'Cố đô Huế & Thợ dệt cung đình',
    colorHex: '#7A1C1C',
    tag: 'Hoàng tộc triều Nguyễn',
    tactileFeel: 'Dày dặn, gân hoa văn dệt nổi óng ả, phản chiếu ánh sáng đổi chiều lộng lẫy.',
    technique: 'Dệt jacquard thủ công với mật độ sợi tơ dày, hoa văn sóng cuộn và mây lành cát tường.',
    stylingRole: 'Chủ đạo cho Áo tấc, tạo nên vạt áo buông rủ uy nghi không bị xô lệch.',
    description:
      'Chất liệu cao quý nhất trong điển lễ hoàng triều. Từng đường dệt hoa văn sóng nước đại diện cho sự trường tồn và phúc trạch của quốc gia.',
  },
  {
    id: 'silk',
    name: 'Lụa tơ tằm Hà Đông',
    origin: 'Làng dệt Vạn Phúc, Hà Nội',
    colorHex: '#F7F4EE',
    tag: 'Tự nhiên thủ công',
    tactileFeel: 'Mềm mượt như nước, mát rượi vào mùa hè và giữ ấm cơ thể tự nhiên vào mùa đông.',
    technique: 'Kéo sợi từ kén tằm dâu tằm tự nhiên 100%, dệt mật độ vừa phải cho độ rũ mềm khoan thai.',
    stylingRole: 'May quần lụa trắng ngà bên trong, tạo dáng đi thướt tha uyển chuyển theo từng bước chân.',
    description:
      'Biểu tượng thuần khiết của trang phục Việt xưa. Màu trắng ngà mộc mạc tôn vinh vẻ đài các kín đáo của người mặc.',
  },
  {
    id: 'suiting',
    name: 'Vải tuyết hàn than chì',
    origin: 'Tailoring đương đại cao cấp',
    colorHex: '#2A303C',
    tag: 'Thời trang đương đại',
    tactileFeel: 'Đanh mịn, giữ nếp ly sắc cạnh, co giãn nhẹ nhàng tạo sự linh hoạt khi di chuyển.',
    technique: 'Dệt sợi len pha tổng hợp với trọng lượng 280gsm, bề mặt hoàn thiện lì (matte).',
    stylingRole: 'Phối ngẫu hoàn hảo cùng áo tấc, mang dáng dấp thời thượng của phong cách Sartorial.',
    description:
      'Chiếc cầu nối đưa cổ phục vào đời sống học đường và công sở hiện đại. Tạo độ tương phản mạnh mẽ giữa tà áo thụng cổ và phom quần âu dứt khoát.',
  },
  {
    id: 'velvet',
    name: 'Nhung the thêu kim tuyến',
    origin: 'Phường thêu cung đình xưa',
    colorHex: '#4A0E17',
    tag: 'Kỹ nghệ thủ công mỹ nghệ',
    tactileFeel: 'Nhung tuyết êm ái, các mũi thêu chỉ vàng nổi cộm tinh tế dưới ngón tay.',
    technique: 'Thêu tay đâm xô truyền thống bằng sợi chỉ bọc lá kim loại ánh vàng 18K bền màu vĩnh cửu.',
    stylingRole: 'Dùng cho mũi hài nhung cong cổ phong, nâng niu từng bước chân đoan chính.',
    description:
      'Điểm chạm hoàn mỹ nơi gót hài. Sắc nhung trầm phối chỉ kim tuyến rực rỡ tạo nên điểm nhấn quý tộc không thể trộn lẫn.',
  },
];

export const TextileLoom: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('brocade');
  const activeTextile = TEXTILES.find((t) => t.id === selectedId) || TEXTILES[0];

  return (
    <section className="py-24 sm:py-32 bg-[#0E131B] border-y-2 border-lacquer-border px-4 sm:px-6 lg:px-12" aria-label="Chất liệu di sản">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-imperial-gold/30 bg-imperial-gold/10 text-imperial-gold text-xs font-semibold uppercase tracking-widest mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Kỹ nghệ dệt may</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-silk-ivory mb-4 [text-wrap:balance]">
            Chạm vào Chất liệu Di sản
          </h2>
          <p className="text-sm sm:text-base text-silk-muted font-normal [text-wrap:pretty] leading-relaxed">
            Sự thăng hoa của trang phục đến từ xúc giác. Khám phá sự tương phản tuyệt mỹ giữa gấm lụa thủ công truyền thống và vải may âu phục hiện đại.
          </p>
        </div>

        <AncientCloudDivider className="mb-14 opacity-30 max-w-sm mx-auto" />

        {/* Material Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {TEXTILES.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`p-5 text-left border transition-all duration-300 relative ${
                  isSelected
                    ? 'bg-[#181E29] border-imperial-gold shadow-gold-glow'
                    : 'bg-[#12161F] border-lacquer-border hover:border-imperial-gold/40'
                }`}
              >
                {/* Visual Swatch Pill */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-8 h-8 border border-white/20 shadow-sm"
                    style={{ backgroundColor: item.colorHex }}
                  />
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border border-imperial-gold/30 text-imperial-gold bg-imperial-gold/10">
                    {item.tag}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-silk-ivory">
                  {item.name}
                </h3>
                <p className="text-xs text-silk-muted mt-1 truncate">
                  {item.origin}
                </p>

                {isSelected && (
                  <div className="absolute top-2 right-2 text-imperial-gold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Material Deep Inspection Box */}
        <div className="p-8 sm:p-10 bg-[#12161F] border-2 border-imperial-gold/50 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 space-y-4">
            <div className="w-full aspect-[4/3] bg-[#0A0D12] border border-imperial-gold/30 relative flex items-center justify-center overflow-hidden">
              <div
                className="w-3/4 h-3/4 shadow-2xl transition-all duration-700"
                style={{ backgroundColor: activeTextile.colorHex }}
              />
              <div className="absolute bottom-3 inset-x-3 text-center text-[10px] uppercase font-bold tracking-widest text-silk-ivory bg-black/60 py-1">
                BẢN MẪU XÚC GIÁC
              </div>
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-imperial-gold tracking-wider">
                Xuất xứ & Nguồn gốc
              </span>
              <p className="font-serif font-bold text-lg text-silk-ivory mt-0.5">
                {activeTextile.origin}
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-5">
            <div>
              <h4 className="font-serif text-2xl sm:text-3xl font-bold text-silk-ivory">
                {activeTextile.name}
              </h4>
              <p className="text-xs sm:text-sm text-silk-muted mt-2 leading-relaxed">
                {activeTextile.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#181E29] border border-lacquer-border space-y-1">
                <span className="text-[11px] uppercase font-bold text-imperial-gold block">
                  Cảm giác khi chạm:
                </span>
                <p className="text-xs text-silk-ivory/90 leading-relaxed font-normal">
                  {activeTextile.tactileFeel}
                </p>
              </div>

              <div className="p-4 bg-[#181E29] border border-lacquer-border space-y-1">
                <span className="text-[11px] uppercase font-bold text-imperial-gold block">
                  Kỹ nghệ chế tác:
                </span>
                <p className="text-xs text-silk-ivory/90 leading-relaxed font-normal">
                  {activeTextile.technique}
                </p>
              </div>
            </div>

            <div className="p-4 bg-imperial-gold/10 border border-imperial-gold/30 flex items-start gap-3 text-xs text-silk-ivory">
              <Check className="w-4 h-4 text-imperial-gold flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-imperial-gold uppercase font-bold tracking-wide">
                  Vai trò trong bản phối:
                </strong>{' '}
                {activeTextile.stylingRole}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
