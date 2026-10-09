import React from 'react';
import { Sparkles, Shield, Compass } from 'lucide-react';
import { AncientCloudDivider } from '../heritage/HeritageDecorations';

export const ManifestoSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full" aria-label="Tuyên ngôn di sản">
      {/* Big Editorial Quote Spread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Monumental Quote */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-imperial-gold/30 bg-imperial-gold/10 text-imperial-gold text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tuyên ngôn Atelier</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-silk-ivory leading-[1.2] [text-wrap:balance]">
            "Di sản không phải cổ vật nằm yên trong tủ kính. Di sản là hơi thở của hôm nay khi bạn tự hào khoác lên mình."
          </h2>

          <div className="pt-4 border-t border-lacquer-border flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-imperial-gold" />
            <p className="text-xs text-silk-muted uppercase tracking-wider font-semibold">
              Triết lý kiến tạo của Việt phục Remix
            </p>
          </div>
        </div>

        {/* Right Column: Three Provocative Perspectives */}
        <div className="lg:col-span-7 space-y-6">
          {/* Principle 1 */}
          <div className="p-6 sm:p-8 bg-[#12161F] border-2 border-lacquer-border hover:border-imperial-gold transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 bg-imperial-gold/15 border border-imperial-gold/40 text-imperial-gold flex items-center justify-center font-serif font-bold text-sm">
                I
              </span>
              <h3 className="font-serif font-bold text-xl text-silk-ivory">
                Bảo lưu cốt cách, không cải biên tùy tiện
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-silk-muted leading-relaxed font-normal">
              Mọi tà áo tấc, áo ngũ thân, nẹp cổ và cấu trúc can vải trong ứng dụng đều tuân thủ 100% tỷ lệ lịch sử được thẩm định từ hiện vật bảo tàng. Sự sáng tạo bắt đầu từ cách kết hợp, không phải bóp méo cấu trúc gốc.
            </p>
          </div>

          {/* Principle 2 */}
          <div className="p-6 sm:p-8 bg-[#12161F] border-2 border-lacquer-border hover:border-imperial-gold transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 bg-imperial-teal/15 border border-imperial-teal/40 text-teal-300 flex items-center justify-center font-serif font-bold text-sm">
                II
              </span>
              <h3 className="font-serif font-bold text-xl text-silk-ivory">
                Xóa nhòa khoảng cách giữa cung đình và giảng đường
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-silk-muted leading-relaxed font-normal">
              Trang phục truyền thống không nên chỉ xuất hiện mỗi năm một lần vào ngày Tết hay những bộ ảnh đắt đỏ. Khi kết hợp cùng quần âu, loafer và phong cách tối giản, cổ phục trở thành một biểu tượng thời trang thanh lịch mỗi ngày.
            </p>
          </div>

          {/* Principle 3 */}
          <div className="p-6 sm:p-8 bg-[#12161F] border-2 border-lacquer-border hover:border-imperial-gold transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 bg-imperial-red/15 border border-imperial-red/40 text-imperial-red-bright flex items-center justify-center font-serif font-bold text-sm">
                III
              </span>
              <h3 className="font-serif font-bold text-xl text-silk-ivory">
                Đồng hành bằng tri thức văn hóa, không phán xét
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-silk-muted leading-relaxed font-normal">
              Trợ lý văn hóa Bé Cáo dựa trên nguyên lý hòa sắc ngũ hành và điển lệ để gợi ý cách phối màu hài hòa nhất theo từng bối cảnh sự kiện, trao cho bạn sự tự tin tuyệt đối trước mọi ánh nhìn.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
