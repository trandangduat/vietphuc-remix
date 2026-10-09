import React from 'react';
import { ArrowRight, Sparkles, Shield, CheckCircle2 } from 'lucide-react';
import { NewsletterForm } from './NewsletterForm';

interface AtelierPortalFooterProps {
  onOpenStudio: () => void;
}

export const AtelierPortalFooter: React.FC<AtelierPortalFooterProps> = ({ onOpenStudio }) => {
  return (
    <footer className="bg-[#0A0D12] border-t-2 border-lacquer-border relative overflow-hidden select-none">
      {/* 1. Grand Closing Invitation (CTA) */}
      <div className="py-24 px-4 sm:px-6 lg:px-12 max-w-4xl mx-auto text-center space-y-7 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-imperial-gold/40 bg-imperial-gold/10 text-imperial-gold text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cánh cửa Atelier đã mở</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-silk-ivory leading-tight [text-wrap:balance]">
          Hãy là người tiếp theo đưa di sản bước ra ánh sáng
        </h2>

        <p className="text-sm sm:text-base text-silk-muted max-w-xl mx-auto font-normal leading-relaxed [text-wrap:pretty]">
          Không tốn chi phí may đo, không e ngại vì chưa rành điển lễ. Bước vào Studio ngay để kiến tạo bản phối mang đậm dấu ấn riêng của bạn.
        </p>

        {/* Primary CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onOpenStudio}
            className="py-4 px-10 bg-imperial-gold hover:bg-imperial-gold-light text-lacquer font-bold text-base flex items-center gap-3 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-gold-glow uppercase tracking-wider active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imperial-gold"
          >
            <span>Bắt đầu phối đồ trong Studio</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Biometric Safety Promise */}
        <div className="pt-4 flex items-center justify-center gap-2 text-xs text-teal-300">
          <Shield className="w-4 h-4 flex-shrink-0" />
          <span>Cam kết bảo mật: Ảnh chân dung AI Try on được xóa tức thì khỏi bộ nhớ tạm.</span>
        </div>

        {/* Integrated Newsletter Subscription */}
        <div className="pt-10 max-w-md mx-auto">
          <p className="text-xs text-silk-muted mb-3 font-medium">
            Đăng ký nhận cẩm nang phối màu ngũ hành và cập nhật mảnh y phục mới:
          </p>
          <NewsletterForm />
        </div>
      </div>

      {/* 2. Haute Atelier Minimal Bottom Bar */}
      <div className="py-8 border-t border-lacquer-border/80 px-4 sm:px-6 lg:px-12 text-xs text-silk-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-serif font-bold text-sm text-silk-ivory">Việt phục Remix</span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-imperial-gold/10 text-imperial-gold border border-imperial-gold/30">
              Haute Atelier 2D
            </span>
          </div>

          <p className="text-[11px] text-silk-muted text-center">
            © 2026 Việt phục Remix. Dự án phi lợi nhuận tôn vinh di sản trang phục truyền thống Việt Nam.
          </p>

          <div className="text-[11px] text-imperial-gold font-medium">
            Tư liệu đối chiếu: Bảo tàng Lịch sử Quốc gia
          </div>
        </div>
      </div>
    </footer>
  );
};
