import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { AncientCloudDivider } from '../heritage/HeritageDecorations';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'Việt phục Remix có làm biến tướng trang phục truyền thống không?',
    answer:
      'Không. Mọi mảnh phục trang truyền thống đều giữ nguyên phom dáng, hoa văn và cấu trúc nẹp cổ được đối chiếu từ Bảo tàng Lịch sử Quốc gia và công trình "Ngàn năm áo mũ". Chúng tôi khuyến khích sự tiếp nối sáng tạo của người trẻ trên nền tảng hiểu biết sâu sắc về cội nguồn.',
  },
  {
    question: 'Tôi chưa từng mặc Việt phục, ứng dụng có dễ dùng cho người mới không?',
    answer:
      'Rất dễ dàng. Ứng dụng đã chuẩn bị sẵn các bộ phối mẫu theo sự kiện (Tết, Dạ hội trường, Lễ cưới gia đình, Dạo phố). Bạn chỉ cần chọn một mẫu ưng ý và nhấn thử, sau đó có thể tùy biến đổi màu hoặc chi tiết theo ý thích.',
  },
  {
    question: 'Sự khác biệt giữa tính năng Thử đồ 2D và AI Try on là gì?',
    answer:
      'Thử đồ 2D là không gian xếp lớp đồ họa trực quan tức thì trên ma-nơ-canh chuẩn, hoàn toàn không có độ trễ. AI Try on là tính năng nâng cao cho phép người dùng đã đăng nhập tải ảnh cá nhân để tạo ảnh mặc bộ trang phục đó trong bối cảnh thực tế.',
  },
  {
    question: 'Dự án này có thu phí người dùng không?',
    answer:
      'Việt phục Remix là dự án phi lợi nhuận hướng tới cộng đồng học sinh, sinh viên và người yêu văn hóa Việt. Toàn bộ tính năng phối đồ 2D, thẩm định văn hóa và tra cứu tư liệu lịch sử đều hoàn toàn miễn phí.',
  },
  {
    question: 'Hình ảnh tôi tải lên để thử AI Try on được bảo mật như thế nào?',
    answer:
      'Hình ảnh khuôn mặt của bạn chỉ được dùng cho một phiên tạo ảnh duy nhất và bị xóa ngay lập tức khỏi bộ nhớ tạm sau khi hoàn tất. Chúng tôi không bao giờ lưu trữ hay sử dụng ảnh của bạn cho mục đích khác.',
  },
];

export const FAQAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full" aria-label="Câu hỏi thường gặp">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-imperial-gold/30 bg-imperial-gold/10 text-imperial-gold text-xs font-semibold uppercase tracking-widest mb-4">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Giải đáp băn khoăn</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-silk-ivory mb-4 [text-wrap:balance]">
          Câu hỏi thường gặp
        </h2>
        <p className="text-sm sm:text-base text-silk-muted font-normal max-w-xl mx-auto [text-wrap:pretty]">
          Mọi thắc mắc về tính chuẩn xác của phục trang, cách phối đồ và cam kết bảo vệ dữ liệu cá nhân của bạn.
        </p>
      </div>

      <AncientCloudDivider className="mb-10 opacity-30 max-w-xs mx-auto" />

      <div className="space-y-3">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`border transition-all duration-300 ${
                isOpen
                  ? 'border-imperial-gold bg-[#12161F]'
                  : 'border-lacquer-border bg-[#0E131B] hover:border-lacquer-border/80'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imperial-gold"
              >
                <span className={`text-sm sm:text-base font-bold transition-colors ${
                  isOpen ? 'text-imperial-gold' : 'text-silk-ivory'
                }`}>
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-imperial-gold flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-silk-muted leading-relaxed border-t border-lacquer-border/40 font-normal">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
