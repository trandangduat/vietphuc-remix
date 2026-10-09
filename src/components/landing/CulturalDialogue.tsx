import React from 'react';
import { Compass, Sparkles, Check } from 'lucide-react';
import { AncientCloudDivider } from '../heritage/HeritageDecorations';

export const CulturalDialogue: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-[#0E131B] border-y-2 border-lacquer-border px-4 sm:px-6 lg:px-12" aria-label="Đối thoại hai thế kỷ">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-imperial-gold/30 bg-imperial-gold/10 text-imperial-gold text-xs font-semibold uppercase tracking-widest mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Đối thoại thời gian</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-silk-ivory mb-4 [text-wrap:balance]">
            Cuộc Gặp Gỡ Giữa Hai Thế Kỷ
          </h2>
          <p className="text-sm sm:text-base text-silk-muted font-normal [text-wrap:pretty] leading-relaxed">
            Nhìn lại hành trình chuyển mình của cổ phục Việt: từ chốn cung đình tôn nghiêm thế kỷ 19 đến nhịp sống tự do, đầy kiêu hãnh của giới trẻ thế kỷ 21.
          </p>
        </div>

        <AncientCloudDivider className="mb-14 opacity-30 max-w-sm mx-auto" />

        {/* Two Grand Architectural Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Column 1: 19th Century Imperial Court */}
          <div className="p-8 sm:p-10 bg-[#12161F] border-2 border-lacquer-border flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-lacquer-border">
                <span className="text-xs font-bold uppercase tracking-widest text-imperial-gold">
                  THẾ KỶ XIX · CỐ ĐÔ HUẾ
                </span>
                <span className="text-[11px] font-semibold text-silk-muted px-2 py-0.5 bg-black/40 border border-lacquer-border">
                  ĐIỂN LỄ TRIỀU NGUYỄN
                </span>
              </div>

              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-silk-ivory">
                Quy thức Hoàng triều & Sự Tôn nghiêm
              </h3>

              <p className="text-xs sm:text-sm text-silk-muted leading-relaxed font-normal">
                Dưới thời vua Minh Mạng, quy chế y quan được chuẩn hóa chặt chẽ trên toàn cõi Việt Nam. Tà Áo tấc và Áo ngũ thân trở thành quốc phục chính thức, thể hiện tôn ti trật tự, đức khiêm nhường và đạo làm người đoan chính.
              </p>

              <div className="space-y-3 pt-2 text-xs text-silk-muted">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-imperial-gold flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-silk-ivory">Chất liệu:</strong> Gấm dệt hoa văn sóng nước, lụa tơ tằm nhuộm thủ công bằng thảo mộc tự nhiên.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-imperial-gold flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-silk-ivory">Bối cảnh:</strong> Đại lễ triều đình, tế Giao, lễ Thượng tiêu, bái tổ tiên và hôn lễ quý tộc.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-imperial-gold flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-silk-ivory">Phong thái:</strong> Dáng đi khoan thai, hai tay chắp ngang ngực tạo thế chữ Nhất uy nghi.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-lacquer-border text-[11px] text-imperial-gold font-semibold uppercase tracking-wider">
              Khảo cứu: Bảo tàng Lịch sử Quốc gia
            </div>
          </div>

          {/* Column 2: 21st Century Contemporary Remix */}
          <div className="p-8 sm:p-10 bg-[#12161F] border-2 border-imperial-gold/60 flex flex-col justify-between relative overflow-hidden shadow-atrium">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-lacquer-border">
                <span className="text-xs font-bold uppercase tracking-widest text-imperial-gold">
                  THẾ KỶ XXI · GIẢNG ĐƯỜNG & ĐƯỜNG PHỐ
                </span>
                <span className="text-[11px] font-semibold text-imperial-gold px-2 py-0.5 bg-imperial-gold/15 border border-imperial-gold/40">
                  VIỆT PHỤC REMIX
                </span>
              </div>

              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-silk-ivory">
                Bản sắc Tự hào & Sức sống Mới
              </h3>

              <p className="text-xs sm:text-sm text-silk-muted leading-relaxed font-normal">
                Thế hệ Z không ngần ngại mang tà áo tấc bước ra khỏi bảo tàng, kết hợp linh hoạt cùng quần âu dáng suông, giày loafer và sneakers tối giản. Cổ phục trở thành ngôn ngữ thời trang khẳng định cá tính độc bản trên trường quốc tế.
              </p>

              <div className="space-y-3 pt-2 text-xs text-silk-muted">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-imperial-gold flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-silk-ivory">Chất liệu phối:</strong> Áo tấc gấm lụa kết hợp vải tuyết hàn than chì, dạ dệt len và da thuộc bóng.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-imperial-gold flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-silk-ivory">Bối cảnh:</strong> Dạ hội School Prom, triển lãm mỹ thuật, kỷ yếu giảng đường, dạo phố xuân.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-imperial-gold flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-silk-ivory">Phong thái:</strong> Tự tin, năng động, thanh lịch và giàu tính ứng dụng trong nhịp sống đô thị.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-lacquer-border text-[11px] text-imperial-gold font-semibold uppercase tracking-wider">
              Khởi xướng bởi thế hệ trẻ Việt Nam
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
