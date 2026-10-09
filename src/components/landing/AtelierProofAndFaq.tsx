import React, { useState } from 'react';
import { Award, ChevronDown, Shield, CheckCircle2, Users, Compass } from 'lucide-react';
import { AncientCloudDivider } from '../heritage/HeritageDecorations';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'Việt phục Remix có làm biến tướng trang phục truyền thống không?',
    a: 'Không. Toàn bộ các mảnh y phục đều giữ nguyên phom dáng, hoa văn và cấu trúc nẹp cổ được đối chiếu từ Bảo tàng Lịch sử Quốc gia và công trình "Ngàn năm áo mũ". Chúng tôi khuyến khích sự tiếp nối sáng tạo trên nền tảng hiểu biết sâu sắc về cội nguồn.',
  },
  {
    q: 'Người chưa từng mặc Việt phục có dễ sử dụng không?',
    a: 'Rất dễ dàng. Ứng dụng đã chuẩn bị sẵn các bộ phối mẫu theo sự kiện (Tết, Dạ hội trường, Lễ cưới gia đình). Bạn chỉ cần chọn một mẫu ưng ý và nhấn thử, sau đó có thể tùy biến đổi màu hoặc chi tiết theo sở thích.',
  },
  {
    q: 'Dự án có thu phí người dùng không?',
    a: 'Việt phục Remix là dự án phi lợi nhuận dành cho học sinh, sinh viên và người yêu văn hóa Việt. Toàn bộ tính năng phối đồ 2D, thẩm định văn hóa và xuất Lookbook đều hoàn toàn miễn phí.',
  },
  {
    q: 'Hình ảnh khuôn mặt tải lên AI Try on được bảo mật thế nào?',
    a: 'Hình ảnh chân dung chỉ được dùng cho một phiên xử lý duy nhất và bị xóa ngay lập tức khỏi bộ nhớ tạm sau khi hoàn tất. Chúng tôi không bao giờ lưu trữ hay sử dụng ảnh của bạn cho mục đích khác.',
  },
];

export const AtelierProofAndFaq: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="py-20 sm:py-28 bg-[#0E131B] border-y-2 border-lacquer-border px-4 sm:px-6 lg:px-12" aria-label="Bảo chứng và hỏi đáp">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top Split: Museum Provenance & Voices */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Museum Provenance Vault (Col 6) */}
          <div className="lg:col-span-6 p-7 sm:p-9 bg-[#12161F] border-2 border-lacquer-border space-y-5">
            <div className="flex items-center gap-2.5 text-imperial-gold text-xs font-bold uppercase tracking-widest">
              <Award className="w-4 h-4" />
              <span>Bảo chứng tư liệu lịch sử</span>
            </div>

            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-silk-ivory">
              Khảo Cứu Chuẩn Mực Bảo Tàng
            </h3>

            <p className="text-xs sm:text-sm text-silk-muted leading-relaxed font-normal">
              Mọi cấu trúc nẹp cổ đứng ngũ khuy, tà thụng một thước và kỹ thuật can vải trong ứng dụng đều được đối chiếu cẩn trọng từ hiện vật triều Nguyễn đang lưu giữ tại các bảo tàng hàng đầu Việt Nam.
            </p>

            {/* Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#181E29] border border-lacquer-border text-xs">
                <span className="font-bold text-silk-ivory block">Bảo tàng Lịch sử Quốc gia</span>
                <span className="text-[11px] text-imperial-gold">Hiện vật phục trang thế kỷ XIX</span>
              </div>
              <div className="p-3 bg-[#181E29] border border-lacquer-border text-xs">
                <span className="font-bold text-silk-ivory">Bảo tàng Phụ nữ Nam Bộ</span>
                <span className="text-[11px] text-imperial-gold">Nghiên cứu phom dáng Áo tấc</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-silk-muted flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-imperial-gold" />
              <span>Tham chiếu chuyên môn: <strong>"Ngàn năm áo mũ" (Học giả Trần Quang Đức)</strong></span>
            </div>
          </div>

          {/* Right: Community Endorsements (Col 6) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 bg-[#12161F] border border-lacquer-border space-y-3">
              <p className="text-xs sm:text-sm text-silk-muted leading-relaxed font-normal">
                "Việt phục Remix giải quyết triệt để nỗi sợ mặc sai quy chế cổ truyền của sinh viên. Trích dẫn bảo tàng rõ ràng, giao diện trực quan giúp các bạn tự tin thể hiện lòng tự hào văn hóa."
              </p>
              <div className="flex items-center gap-2.5 pt-2 border-t border-lacquer-border text-xs">
                <div className="w-7 h-7 bg-imperial-gold/20 text-imperial-gold border border-imperial-gold/40 flex items-center justify-center font-bold text-xs font-serif">
                  BN
                </div>
                <div>
                  <h4 className="font-bold text-silk-ivory">Trần Vũ Bảo Ngọc</h4>
                  <p className="text-[11px] text-silk-muted">Nghiên cứu sinh Cổ phục, Dự án Hoa Văn Đại Việt</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#12161F] border border-lacquer-border space-y-3">
              <p className="text-xs sm:text-sm text-silk-muted leading-relaxed font-normal">
                "Dự án cho thấy tinh thần kế thừa rất đáng khen: tôn trọng nguyên bản Áo tấc nhưng không trói buộc. Phối cùng quần âu và loafer mang lại hơi thở hiện đại đầy cảm hứng."
              </p>
              <div className="flex items-center gap-2.5 pt-2 border-t border-lacquer-border text-xs">
                <div className="w-7 h-7 bg-imperial-gold/20 text-imperial-gold border border-imperial-gold/40 flex items-center justify-center font-bold text-xs font-serif">
                  LM
                </div>
                <div>
                  <h4 className="font-bold text-silk-ivory">Lê Hoàng Mai</h4>
                  <p className="text-[11px] text-silk-muted">Chủ nhiệm CLB Di sản Trẻ, ĐH KHXH&NV TP.HCM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Split: Crisp FAQ Accordion (Compact & Elegant) */}
        <div className="pt-6 border-t border-lacquer-border space-y-4 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="font-serif font-bold text-2xl text-silk-ivory">
              Giải Đáp Nhanh
            </h3>
          </div>

          <div className="space-y-2.5">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`border transition-all duration-300 ${
                    isOpen
                      ? 'border-imperial-gold bg-[#12161F]'
                      : 'border-lacquer-border bg-[#181E29] hover:border-lacquer-border/80'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-3.5 px-5 text-left flex items-center justify-between gap-4 focus-visible:outline-none"
                  >
                    <span className={`text-xs sm:text-sm font-bold ${isOpen ? 'text-imperial-gold' : 'text-silk-ivory'}`}>
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-imperial-gold flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs text-silk-muted leading-relaxed border-t border-lacquer-border/40 font-normal">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
