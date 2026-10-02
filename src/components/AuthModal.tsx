import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Sparkles, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-lacquer-surface border-2 border-imperial-gold/60 shadow-[0_24px_64px_rgba(0,0,0,0.95)] rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold/Red Imperial Border Banner */}
        <div className="h-1.5 w-full bg-gradient-to-r from-imperial-red via-imperial-gold to-imperial-red" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-imperial-gold text-silk-muted hover:text-lacquer flex items-center justify-center border border-white/10 transition-all cursor-pointer"
          title="Đóng cửa sổ"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-imperial-gold/15 border border-imperial-gold/40 text-imperial-gold mb-3 shadow-[0_0_20px_rgba(198,155,86,0.35)]">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-silk-ivory tracking-wide">
              Đăng Nhập Việt Phục
            </h2>
            <p className="text-xs sm:text-sm text-silk-muted mt-1.5 px-2">
              Lưu giữ vĩnh viễn các tác phẩm phối đồ cổ phong và bộ sưu tập AI cá nhân của bạn
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Primary Action: Google Sign-in Button */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold text-sm rounded-xl shadow-lg border border-gray-200 hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
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
            <p className="text-[11px] text-center text-silk-muted/80">
              An toàn • Nhanh chóng • Không cần tạo mật khẩu mới
            </p>
          </div>

          {/* Benefits Feature List */}
          <div className="mt-6 pt-5 border-t border-imperial-gold/20 space-y-2.5">
            <div className="flex items-center gap-2.5 text-xs text-silk-muted">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Tự động đồng bộ các bản phối từ phiên khách vào tài khoản</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-silk-muted">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Tự do lưu trữ không giới hạn bộ sưu tập ảnh AI phục dựng</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-silk-muted">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Quản lý hồ sơ phong cách trang phục cá nhân</span>
            </div>
          </div>

          {/* Guest / Footer info */}
          <div className="mt-6 pt-4 border-t border-imperial-gold/15 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-silk-muted hover:text-silk-ivory transition-colors cursor-pointer"
            >
              Tiếp tục trải nghiệm với chế độ khách
            </button>

            <div className="flex items-center gap-1.5 text-[11px] text-silk-muted/60">
              <ShieldCheck className="w-3.5 h-3.5 text-imperial-gold" />
              <span>Xác thực an toàn qua giao thức OAuth Google</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
