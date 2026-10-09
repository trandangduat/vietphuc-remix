import React from 'react';
import { Users, Award, Shield, CheckCircle2 } from 'lucide-react';
import { AncientCloudDivider } from '../heritage/HeritageDecorations';

export const VisualCommunityProof: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full" aria-label="Bảo chứng chuyên môn">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-imperial-gold/30 bg-imperial-gold/10 text-imperial-gold text-xs font-semibold uppercase tracking-widest mb-3">
          <Users className="w-3.5 h-3.5" />
          <span>Bảo chứng & Cộng đồng</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-silk-ivory mb-3 [text-wrap:balance]">
          Đồng Hành Cùng Học Giới & Người Trẻ
        </h2>
        <p className="text-sm sm:text-base text-silk-muted font-normal [text-wrap:pretty]">
          Được tin cậy bởi các câu lạc bộ di sản sinh viên, giảng viên lịch sử văn hóa và sinh viên thiết kế thời trang.
        </p>
      </div>

      <AncientCloudDivider className="mb-12 opacity-30 max-w-xs mx-auto" />

      {/* 3 Compact Testimonial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-7 bg-[#12161F] border-2 border-lacquer-border flex flex-col justify-between">
          <p className="text-xs sm:text-sm text-silk-muted leading-relaxed mb-6 font-normal">
            "Việt phục Remix giải quyết triệt để rào cản e ngại của sinh viên: sợ mặc sai quy chế cổ truyền. Khảo cứu nẹp cổ và tà áo rất tỉ mỉ, giúp các bạn tự tin trong các dịp lễ hội trường."
          </p>
          <div className="pt-4 border-t border-lacquer-border flex items-center gap-3">
            <div className="w-8 h-8 bg-imperial-gold/20 text-imperial-gold border border-imperial-gold/40 flex items-center justify-center font-bold text-xs font-serif">
              BN
            </div>
            <div>
              <h4 className="font-bold text-xs text-silk-ivory">Trần Vũ Bảo Ngọc</h4>
              <p className="text-[11px] text-silk-muted">Nghiên cứu sinh Cổ phục, Dự án Hoa Văn Đại Việt</p>
            </div>
          </div>
        </div>

        <div className="p-7 bg-[#12161F] border-2 border-lacquer-border flex flex-col justify-between">
          <p className="text-xs sm:text-sm text-silk-muted leading-relaxed mb-6 font-normal">
            "Dự án cho thấy tinh thần kế thừa rất đáng khen: tôn trọng nguyên bản lịch sử của Áo tấc nhưng không trói buộc. Phối cùng quần âu và loafer mang lại hơi thở hiện đại đầy cảm hứng."
          </p>
          <div className="pt-4 border-t border-lacquer-border flex items-center gap-3">
            <div className="w-8 h-8 bg-imperial-gold/20 text-imperial-gold border border-imperial-gold/40 flex items-center justify-center font-bold text-xs font-serif">
              NL
            </div>
            <div>
              <h4 className="font-bold text-xs text-silk-ivory">ThS. Nguyễn Hoàng Long</h4>
              <p className="text-[11px] text-silk-muted">Giảng viên Khoa Lịch sử Văn hóa, ĐHQG Hà Nội</p>
            </div>
          </div>
        </div>

        <div className="p-7 bg-[#12161F] border-2 border-lacquer-border flex flex-col justify-between">
          <p className="text-xs sm:text-sm text-silk-muted leading-relaxed mb-6 font-normal">
            "Câu lạc bộ của mình dùng Việt phục Remix để lên ý tưởng trang phục chụp kỷ yếu tốt nghiệp. Khả năng đối chiếu bảo tàng giúp đề án ngoại khóa đạt đánh giá xuất sắc."
          </p>
          <div className="pt-4 border-t border-lacquer-border flex items-center gap-3">
            <div className="w-8 h-8 bg-imperial-gold/20 text-imperial-gold border border-imperial-gold/40 flex items-center justify-center font-bold text-xs font-serif">
              LM
            </div>
            <div>
              <h4 className="font-bold text-xs text-silk-ivory">Lê Hoàng Mai</h4>
              <p className="text-[11px] text-silk-muted">Chủ nhiệm CLB Di sản Trẻ, ĐH KHXH&NV TP.HCM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Museum Citation Strip */}
      <div className="p-6 bg-[#12161F] border border-imperial-gold/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5 text-silk-ivory font-semibold">
          <Award className="w-4 h-4 text-imperial-gold flex-shrink-0" />
          <span>Tư liệu khảo cứu bảo chứng bởi:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-imperial-gold font-medium">
          <span className="px-2.5 py-1 bg-[#181E29] border border-imperial-gold/30">
            Bảo tàng Lịch sử Quốc gia
          </span>
          <span className="px-2.5 py-1 bg-[#181E29] border border-imperial-gold/30">
            Bảo tàng Phụ nữ Nam Bộ
          </span>
          <span className="px-2.5 py-1 bg-[#181E29] border border-imperial-gold/30">
            "Ngàn năm áo mũ" (Trần Quang Đức)
          </span>
        </div>
      </div>
    </section>
  );
};
