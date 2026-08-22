import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Mail, 
  Key, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const result = await login(email, password);
      if (!result.ok) {
        setErrorMessage(result.error || 'Невалиден имейл или парола.');
      }
    } catch (err: any) {
      setErrorMessage('Грешка при комуникация със сървъра.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden text-slate-200 selection:bg-cyan-500 selection:text-white">
      {/* Background Ambient Glow Spheres */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Cyber Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ 
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)', 
          backgroundSize: '28px 28px' 
        }} 
      />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Liquid Glass Card */}
        <div className="bg-[#0b1222]/90 backdrop-blur-2xl border border-white/10 hover:border-cyan-500/30 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-cyan-950/20 relative overflow-hidden transition-all">
          {/* Top Highlight Gradient Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

          {/* Header Brand Section */}
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex items-center justify-center p-0.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
              <div className="w-14 h-14 rounded-[14px] bg-[#090f1d] flex items-center justify-center">
                <Shield className="w-7 h-7 text-cyan-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Open Balancer Control Center
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Вход за Оператори
              </h1>
              <p className="text-xs text-slate-400">
                Защитен достъп до Finans Protect Hub, Клъстерна Телеметрия &amp; Счетоводен Радар
              </p>
            </div>
          </div>

          {/* Error Alert Message */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-3 text-xs text-rose-300 overflow-hidden"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="flex-1 font-medium">{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300">
                Имейл адрес (Email Identity)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#090f1d]/90 border border-white/10 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/15 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300">
                Парола за достъп (Security Key)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Key className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-[#090f1d]/90 border border-white/10 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/15 transition-all shadow-inner font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Скрий паролата' : 'Покажи паролата'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2 active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Верификация на сесията...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Вход в Системата</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Security Footer Note */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col items-center gap-1.5">
            <span className="text-[10px] text-slate-500 font-mono text-center">
              HMAC-SHA256 • 256-bit Edge Encryption • SLA 99.9%
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
