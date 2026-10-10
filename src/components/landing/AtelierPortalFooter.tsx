import React from 'react';
import { ArrowRight } from 'lucide-react';

interface AtelierPortalFooterProps {
  onOpenStudio: () => void;
}

export const AtelierPortalFooter: React.FC<AtelierPortalFooterProps> = ({ onOpenStudio }) => {
  return (
    <footer className="bg-[#0A0D12] border-t border-lacquer-border/60 select-none">
      {/* Closing invitation */}
      <div className="py-16 sm:py-20 px-4 max-w-2xl mx-auto text-center space-y-5">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-silk-ivory leading-tight [text-wrap:balance]">
          Đưa di sản bước ra ánh sáng
        </h2>

        <p className="text-sm sm:text-base text-silk-muted font-normal leading-relaxed [text-wrap:pretty]">
          Miễn phí, không cần may đo. Vào Studio phối ngay bộ Việt phục của riêng bạn.
        </p>

        <div className="pt-1">
          <button
            type="button"
            onClick={onOpenStudio}
            className="py-3.5 px-9 bg-imperial-gold hover:bg-imperial-gold-light text-lacquer font-bold text-sm flex items-center gap-2.5 mx-auto transition-all uppercase tracking-wider active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imperial-gold"
          >
            <span>Vào phối đồ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Minimal bottom bar */}
      <div className="py-6 border-t border-lacquer-border/60 px-4 text-center">
        <p className="font-serif font-bold text-sm text-silk-ivory">Việt phục Remix</p>
        <p className="mt-1 text-[11px] text-silk-muted">
          © 2026 Việt phục Remix. Dự án phi lợi nhuận tôn vinh trang phục truyền thống Việt Nam.
        </p>
      </div>
    </footer>
  );
};
