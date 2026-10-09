import React from 'react';
import { Sparkles } from 'lucide-react';

export const MarqueeTicker: React.FC = () => {
  const items = [
    'ÁO TẤC HOÀNG TRIỀU',
    'ÁO NGŨ THÂN 1885',
    'QUẦN ÂU XẾP LY THAN CHÌ',
    'LOAFER DA PHỐ CỔ',
    'NÓN LÁ QUAI LỤA VẠN PHÚC',
    'HÀI NHUNG THÊU KIM TUYẾN',
    'SARTORIAL GEN Z REMIX',
    'BẢO TÀNG LỊCH SỬ QUỐC GIA',
  ];

  return (
    <div className="w-full bg-[#0E131B] border-y border-imperial-gold/30 py-3.5 overflow-hidden select-none relative z-20">
      <div className="flex w-max animate-marquee space-x-8 text-xs font-bold uppercase tracking-[0.25em] text-imperial-gold/80">
        {[...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center space-x-6 flex-shrink-0">
            <span className="hover:text-imperial-gold-light transition-colors">{text}</span>
            <Sparkles className="w-3 h-3 text-imperial-gold/50" />
          </div>
        ))}
      </div>
    </div>
  );
};
