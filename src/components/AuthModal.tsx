import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin',
}) => {
  const { signIn, signUp, isConfigured } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ Email và Mật khẩu.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu cần có tối thiểu 6 ký tự.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await signUp(email.trim(), password, displayName.trim());
        if (error) {
          setErrorMsg(error);
          setIsLoading(false);
          return;
        }
      } else {
        const { error } = await signIn(email.trim(), password);
        if (error) {
          setErrorMsg(error);
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(false);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-lacquer-surface border-2 border-imperial-gold/60 shadow-[0_24px_64px_rgba(0,0,0,0.95)] rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent Banner */}
        <div className="h-1.5 w-full bg-gradient-to-r from-imperial-red via-imperial-gold to-imperial-red" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-imperial-gold text-silk-muted hover:text-lacquer flex items-center justify-center border border-white/10 transition-all cursor-pointer"
          title="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-imperial-gold/15 border border-imperial-gold/40 text-imperial-gold mb-3 shadow-[0_0_15px_rgba(198,155,86,0.3)]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-silk-ivory tracking-wide">
              {mode === 'signin' ? 'Đăng Nhập Tài Khoản' : 'Tạo Tài Khoản Mới'}
            </h2>
            <p className="text-xs text-silk-muted mt-1.5">
              Lưu giữ vĩnh viễn các tác phẩm phối đồ Việt phục và ảnh AI của bạn
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-black/40 border border-imperial-gold/30 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs uppercase font-bold tracking-wider rounded-md transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-imperial-gold text-lacquer shadow-md font-black'
                  : 'text-silk-muted hover:text-silk-ivory'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs uppercase font-bold tracking-wider rounded-md transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-imperial-gold text-lacquer shadow-md font-black'
                  : 'text-silk-muted hover:text-silk-ivory'
              }`}
            >
              Đăng Ký
            </button>
          </div>

          {/* Notice if Supabase not configured in .env */}
          {!isConfigured && (
            <div className="mb-5 p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200/90 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">Chế độ Demo/Phát triển:</span> Bạn có thể nhập email/mật khẩu bất kỳ để thử nghiệm phiên đăng nhập ngay lập tức. Sau đó kết nối Supabase qua file <code className="bg-black/40 px-1 py-0.5 rounded text-amber-200">.env</code>.
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-silk-muted uppercase tracking-wider mb-1.5">
                  Tên hiển thị / Danh xưng
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-silk-muted pointer-events-none" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ví dụ: Hoàng Nam, Tú Anh..."
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-imperial-gold/40 focus:border-imperial-gold rounded-lg text-sm text-silk-ivory placeholder-silk-muted/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-silk-muted uppercase tracking-wider mb-1.5">
                Địa chỉ Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-silk-muted pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nhan.vat@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-imperial-gold/40 focus:border-imperial-gold rounded-lg text-sm text-silk-ivory placeholder-silk-muted/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-silk-muted uppercase tracking-wider mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-silk-muted pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-imperial-gold/40 focus:border-imperial-gold rounded-lg text-sm text-silk-ivory placeholder-silk-muted/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-imperial-gold via-imperial-gold-light to-imperial-gold hover:brightness-110 active:scale-[0.99] text-lacquer font-bold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(198,155,86,0.35)] rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-lacquer border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Đăng Nhập Ngay' : 'Đăng Ký Tài Khoản'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Guest / Footer info */}
          <div className="mt-6 pt-5 border-t border-imperial-gold/20 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-silk-muted hover:text-silk-ivory transition-colors cursor-pointer"
            >
              Tiếp tục với chế độ khách (không lưu vĩnh viễn)
            </button>

            <div className="flex items-center gap-1.5 text-[11px] text-silk-muted/70">
              <ShieldCheck className="w-3.5 h-3.5 text-imperial-gold" />
              <span>Dữ liệu được bảo mật an toàn với PostgreSQL & RLS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
