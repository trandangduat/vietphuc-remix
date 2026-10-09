import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus('error');
      setErrorMessage('Vui lòng nhập địa chỉ email của bạn.');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage('Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.');
      return;
    }

    // Success simulation
    setStatus('success');
    setErrorMessage('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {status === 'success' ? (
        <div className="p-4 bg-[#12161F] border border-imperial-gold/60 text-xs sm:text-sm text-silk-ivory flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-imperial-gold flex-shrink-0" />
          <div>
            <p className="font-bold text-imperial-gold">Đăng ký nhận tin thành công</p>
            <p className="text-silk-muted text-xs mt-0.5">
              Cảm ơn bạn. Bản tin nghiên cứu cổ phục và cập nhật trang phục mới sẽ được gửi định kỳ.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <label htmlFor="newsletter-email" className="sr-only">
                Email nhận bản tin
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="Nhập email của bạn (vd: student@edu.vn)..."
                className={`w-full py-3 px-4 bg-[#0A0D12] border text-xs sm:text-sm text-silk-ivory placeholder:text-silk-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-imperial-gold ${
                  status === 'error' ? 'border-imperial-red-bright' : 'border-lacquer-border focus:border-imperial-gold'
                }`}
              />
            </div>
            <button
              type="submit"
              className="py-3 px-5 bg-imperial-gold hover:bg-imperial-gold-light text-lacquer font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 flex-shrink-0"
            >
              <span>Đăng ký</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {status === 'error' && (
            <p className="text-xs text-imperial-red-bright flex items-center gap-1.5 pt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMessage}</span>
            </p>
          )}
        </form>
      )}
    </div>
  );
};
