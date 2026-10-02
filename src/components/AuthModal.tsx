import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { HeritageModal } from './heritage/HeritageFrame';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { signInWithGoogle, isConfigured } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMsg(error);
        setIsLoading(false);
        return;
      }
      // If mock, call onSuccess & close; if OAuth, browser redirects to Google
      if (!isConfigured) {
        setIsLoading(false);
        onSuccess?.();
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi kết nối với tài khoản Google');
      setIsLoading(false);
    }
  };

  return (
    <HeritageModal
      isOpen={isOpen}
      onClose={onClose}
      title="Đăng Nhập Việt Phục"
      badge="HOÀNG GIA"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <p className="text-xs text-[#EDE5D8]/85 font-serif leading-relaxed text-center px-1">
          Lưu trữ vĩnh viễn các tác phẩm phối đồ cổ phong, đồng bộ dữ liệu và xuất bản Lookbook của riêng bạn
        </p>

        {/* Error Message */}
        {errorMsg && (
          <div className="p-3 rounded-none bg-red-950/80 border border-red-500/60 text-red-200 text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Primary Action: Google Sign-in Button */}
        <div className="pt-1 space-y-2.5">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold text-sm rounded-none shadow-lg border border-gray-200 hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <GoogleIcon className="w-5 h-5" />
                <span className="font-sans font-bold text-gray-900 tracking-wide">
                  Đăng nhập nhanh với Google
                </span>
              </>
            )}
          </button>
          <p className="text-[11px] text-center text-[#EDE5D8]/60 font-serif italic">
            An toàn • Nhanh chóng • Không cần mật khẩu
          </p>
        </div>

        {/* Benefits Feature List */}
        <div className="pt-3 border-t border-[#C5A059]/20 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#EDE5D8]/90 font-serif">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Tự do lưu trữ không giới hạn bộ sưu tập outfit</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#EDE5D8]/90 font-serif">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Xuất bản Lookbook tạp chí thời trang độ phân giải cao</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#EDE5D8]/90 font-serif">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Đồng bộ tự động giữa các thiết bị</span>
          </div>
        </div>

        {/* Guest / Footer info */}
        <div className="pt-3 border-t border-[#C5A059]/15 flex flex-col items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[#C5A059] hover:text-[#F9E29D] font-serif underline decoration-[#C5A059]/40 underline-offset-2 transition-colors cursor-pointer"
          >
            Tiếp tục trải nghiệm chế độ khách
          </button>

          <div className="flex items-center gap-1.5 text-[11px] text-[#EDE5D8]/50 font-serif">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Bảo mật an toàn qua giao thức OAuth Google</span>
          </div>
        </div>
      </div>
    </HeritageModal>
  );
};
