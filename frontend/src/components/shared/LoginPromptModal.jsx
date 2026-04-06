import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, X, LogIn, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const LoginPromptModal = () => {
  const { isLoginModalOpen, setLoginModalOpen } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isLoginModalOpen) return null;

  const handleLoginRedirect = () => {
    setLoginModalOpen(false);
    navigate('/login', { state: { from: location } });
  };

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLoginModalOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md glass-dark rounded-[3rem] border border-white/5 overflow-hidden shadow-[0_48px_96px_rgba(0,0,0,0.8)]"
          >
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 blur-[60px] -z-10"></div>

            <div className="p-10 text-center space-y-8">
              {/* Icon Container */}
              <div className="relative mx-auto w-24 h-24">
                <motion.div
                  initial={{ rotate: -15, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="w-full h-full bg-primary/10 rounded-[2rem] flex items-center justify-center border border-primary/20 shadow-2xl relative z-10"
                >
                  <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                </motion.div>
                <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse -z-10"></div>
              </div>

              {/* Text content */}
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic text-glow">
                  Yêu cầu đăng nhập
                </h3>
                <p className="text-on-surface-variant/80 font-medium leading-relaxed px-2 text-sm">
                  Bạn cần có tài khoản Thành viên để trải nghiệm CINEMA+
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleLoginRedirect}
                  className="btn-primary w-full py-5 text-xs font-black uppercase tracking-[0.3em] shadow-[0_24px_48px_rgba(229,9,20,0.3)] hover:scale-[1.02] active:scale-95 transition-all group"
                >
                  <span className="flex items-center justify-center gap-3">
                    Đăng nhập ngay
                    <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button
                  onClick={() => setLoginModalOpen(false)}
                  className="w-full py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-white transition-colors"
                >
                  Để sau vậy
                </button>
              </div>

              {/* Closing X */}
              <button
                onClick={() => setLoginModalOpen(false)}
                className="absolute top-8 right-8 p-3 rounded-2xl hover:bg-white/5 group transition-colors"
              >
                <X className="w-5 h-5 text-on-surface-variant group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Quality Badges footer */}
            <div className="bg-white/5 border-t border-white/5 px-10 py-5 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 grayscale opacity-40">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Bảo mật</span>
              </div>
              <div className="w-px h-3 bg-white/10"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">Full HD / 4K</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginPromptModal;
