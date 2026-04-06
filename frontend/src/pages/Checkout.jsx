import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import {
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Wallet,
  Smartphone,
  Check,
  ChevronRight,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Clock,
  XCircle
} from 'lucide-react';
import { upgradeVip } from '../service/vip_service';
import { useAuth } from '../hooks/useAuth';
import API_BASE_URL from '../config/api';

const BANK_BIN = 'MB';
const ACCOUNT_NO = '8804514092004';
const ACCOUNT_NAME = 'NGUYEN CONG HUY';
const QR_TIMEOUT_SECONDS = 300; // 5 minutes

const removeAccents = (str) => {
  return str
    ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase()
    : '';
};

const generateRandomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  // Recovery logic: Try to get plan and session from location or localStorage
  const [plan] = useState(() => {
    if (location.state?.plan) {
      localStorage.setItem('checkout_plan', JSON.stringify(location.state.plan));
      const savedPlan = localStorage.getItem('checkout_plan');
      if (savedPlan && JSON.parse(savedPlan).id !== location.state.plan.id) {
          localStorage.removeItem('checkout_session');
      }
      return location.state.plan;
    }
    const saved = localStorage.getItem('checkout_plan');
    return saved ? JSON.parse(saved) : null;
  });

  // QR session state
  const [randomCode, setRandomCode] = useState(() => {
    const saved = localStorage.getItem('checkout_session');
    if (saved) {
      const { code, expiresAt, userId } = JSON.parse(saved);
      if (expiresAt > Date.now() && userId === user?.id) {
        return code;
      }
    }
    return generateRandomCode();
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('checkout_session');
    if (saved && randomCode) {
      const { expiresAt, userId, code } = JSON.parse(saved);
      if (expiresAt > Date.now() && userId === user?.id && code === randomCode) {
        return Math.floor((expiresAt - Date.now()) / 1000);
      }
    }
    return QR_TIMEOUT_SECONDS;
  });

  const pollRef = useRef(null);
  const timerRef = useRef(null);

  const priceNumber = plan ? parseInt(plan.price.replace(/[^\d]/g, ''), 10) || 50000 : 50000;
  const transferContent = `${removeAccents(user?.name)} ${user?.id || ''} CINEMA VIP ${randomCode}`;
  const vietQrUrl = `https://img.vietqr.io/image/${BANK_BIN}-${ACCOUNT_NO}-print.png?amount=${priceNumber}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  // Save/Update session in localStorage
  useEffect(() => {
    if (user && randomCode && !isSuccess && !isExpired) {
        const saved = localStorage.getItem('checkout_session');
        if (!saved || JSON.parse(saved).code !== randomCode) {
            const expiresAt = Date.now() + (timeLeft * 1000);
            localStorage.setItem('checkout_session', JSON.stringify({
                code: randomCode,
                expiresAt,
                userId: user.id
            }));
        }
    }
  }, [randomCode, user, isSuccess, isExpired, timeLeft]);

  // Register session with backend
  const registerSession = useCallback(async (code) => {
    if (!user) return;
    try {
      await axios.post(`${API_BASE_URL}/vip/session`, { randomCode: code, amount: priceNumber }, getAuthHeaders());
    } catch (e) {
      console.error('Failed to register payment session:', e);
    }
  }, [user, priceNumber]);

  // Generate a new QR code (reset everything)
  const regenerateQR = useCallback(() => {
    const newCode = generateRandomCode();
    setRandomCode(newCode);
    setIsExpired(false);
    setTimeLeft(QR_TIMEOUT_SECONDS);
    
    if (user) {
        localStorage.setItem('checkout_session', JSON.stringify({
            code: newCode,
            expiresAt: Date.now() + (QR_TIMEOUT_SECONDS * 1000),
            userId: user.id
        }));
    }
    
    registerSession(newCode);
  }, [registerSession, user]);

  // Countdown timer + QR expiry
  useEffect(() => {
    if (isSuccess || isExpired) return;

    registerSession(randomCode);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          clearInterval(pollRef.current);
          setIsExpired(true);
          localStorage.removeItem('checkout_session');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isSuccess, isExpired, randomCode, registerSession]);

  // Polling: check session status
  useEffect(() => {
    if (isSuccess || isExpired || !user) return;

    pollRef.current = setInterval(async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/vip/session/${randomCode}`, getAuthHeaders());
        if (res.data.status === 'completed') {
          clearInterval(pollRef.current);
          clearInterval(timerRef.current);
          
          localStorage.removeItem('checkout_session');
          localStorage.removeItem('checkout_plan');
          
          await refreshProfile();
          setIsSuccess(true);
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (e) {
        // silently ignore poll errors
      }
    }, 5000);

    return () => clearInterval(pollRef.current);
  }, [isSuccess, isExpired, randomCode, user, refreshProfile, navigate]);

  // Fallback if accessed without plan
  if (!plan) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 blur-[100px] rounded-full" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex flex-col items-center justify-center p-12 glass-dark rounded-[3rem] border border-white/5 text-center shadow-2xl">
          <AlertCircle className="w-16 h-16 text-yellow-500 mb-6" />
          <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-4 text-white">Chưa chọn Gói dịch vụ</h1>
          <p className="text-on-surface-variant text-sm font-medium mb-10 max-w-sm leading-relaxed">Vui lòng quay lại danh sách các gói VIP để lựa chọn một gói phù hợp.</p>
          <button onClick={() => navigate('/vip')} className="btn-primary px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3">
            <ArrowLeft className="w-4 h-4" /> Quay lại Gói VIP
          </button>
        </motion.div>
      </div>
    );
  }

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const timerPercent = (timeLeft / QR_TIMEOUT_SECONDS) * 100;
  const timerColor = timeLeft > 60 ? 'text-emerald-400' : timeLeft > 30 ? 'text-yellow-400' : 'text-primary';
  const timerBg = timeLeft > 60 ? 'bg-emerald-500' : timeLeft > 30 ? 'bg-yellow-500' : 'bg-primary';

  // Success screen
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center text-white relative overflow-hidden">
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="w-[600px] h-[600px] bg-emerald-500/20 blur-[120px] rounded-full animate-pulse" />
        </div>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 flex flex-col items-center glass-dark p-16 rounded-[4rem] border border-emerald-500/30 shadow-[0_20px_60px_rgba(16,185,129,0.2)] text-center max-w-md w-full mx-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-8 border-4 border-emerald-500/50">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </motion.div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-4 text-white">Thanh toán hoàn tất!</h1>
          <p className="text-on-surface-variant font-medium text-sm leading-relaxed mb-10">
            Tuyệt vời! Gói <span className="text-emerald-400 font-bold">{plan.name}</span> đã được kích hoạt thành công. Đang chuyển hướng...
          </p>
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-32 pb-24 px-6 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        <header className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="w-14 h-14 flex items-center justify-center glass-dark rounded-3xl border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all group shadow-xl">
            <ArrowLeft className="w-6 h-6 text-on-surface-variant group-hover:text-primary transition-colors" />
          </button>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-1">Secure Checkout</p>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Thanh toán an toàn</h1>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* LEFT: QR Section */}
          <div className="lg:col-span-7">
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-dark rounded-[3rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -z-10 group-hover:bg-primary/10 transition-colors pointer-events-none" />
              
              <div className="flex flex-col items-center justify-center py-6 relative z-10">
                {isExpired ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 border-2 border-primary/30">
                      <XCircle className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black italic tracking-tighter mb-2 uppercase text-white">Mã QR đã hết hạn</h3>
                    <p className="text-on-surface-variant/60 text-sm font-medium mb-8 text-center leading-relaxed max-w-xs">
                      Mã QR chỉ có hiệu lực trong 5 phút. Vui lòng tạo mã mới để tiếp tục thanh toán.
                    </p>
                    <button onClick={regenerateQR} className="btn-primary px-10 py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_15px_30px_rgba(229,9,20,0.3)]">
                      <RefreshCw className="w-4 h-4" /> Tạo mã QR mới
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <div className="relative mb-8">
                      <div className="w-64 h-64 bg-white p-4 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500">
                        <img src={vietQrUrl} alt="VietQR" className="w-full h-full rounded-2xl" />
                      </div>
                      <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-surface-container rounded-full flex items-center justify-center border-2 border-white/10 shadow-lg">
                        <Clock className={`w-5 h-5 ${timerColor}`} />
                      </div>
                    </div>

                    <div className="w-full mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Mã hết hạn sau</span>
                        <span className={`text-sm font-black tabular-nums ${timerColor}`}>{formatTime(timeLeft)}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${timerBg}`}
                          style={{ width: `${timerPercent}%` }}
                        />
                      </div>
                    </div>

                    <h3 className="text-xl font-black italic tracking-tighter mb-2 uppercase text-white">Quét mã thanh toán</h3>
                    <p className="text-on-surface-variant/60 text-sm font-medium mb-4 text-center leading-relaxed">
                      Sử dụng ứng dụng ngân hàng để quét mã QR. Nội dung đã được điền sẵn.
                    </p>

                    <div className="w-full bg-surface border border-primary/30 rounded-2xl px-5 py-4 mb-6 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-2">Nội dung chuyển khoản</p>
                      <p className="text-primary font-black text-sm tracking-wider uppercase break-all">{transferContent}</p>
                      <p className="text-[9px] text-on-surface-variant/50 mt-1">⚠️ Không được sửa nội dung này</p>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 animate-pulse bg-emerald-500/10 px-4 py-2 rounded-full mb-6">
                      <Sparkles className="w-4 h-4" /> Hệ thống đang chờ tiền vào tự động...
                    </div>
                  </>
                )}
              </div>
            </motion.section>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32 glass-dark p-10 md:p-12 rounded-[3.5rem] border border-white/5 overflow-hidden group shadow-2xl">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10 group-hover:bg-primary/20 transition-colors duration-700 pointer-events-none" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-10 flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-primary" /> Tóm tắt Đơn hàng
              </h2>
              <div className="flex items-end justify-between pb-8 border-b border-white/10 mb-8">
                <div>
                  <p className="text-on-surface-variant font-black text-[9px] uppercase tracking-[0.4em] mb-2">Gói dịch vụ chọn lọc</p>
                  <h3 className="text-4xl font-black italic text-white uppercase mt-1">{plan.name}</h3>
                </div>
              </div>
              <ul className="space-y-6 mb-10">
                {plan.features?.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-white/80 flex-1 leading-snug">{feat}</span>
                  </li>
                ))}
                {(!plan.features || plan.features.length === 0) && (
                  <>
                    <li className="flex items-start gap-4"><div className="mt-0.5 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><Check className="w-3.5 h-3.5 text-primary" /></div><span className="text-sm font-medium text-white/80 flex-1 leading-snug">Toàn quyền truy cập kho phim đặc quyền.</span></li>
                    <li className="flex items-start gap-4"><div className="mt-0.5 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><Check className="w-3.5 h-3.5 text-primary" /></div><span className="text-sm font-medium text-white/80 flex-1 leading-snug">Chất lượng 4K HDR &amp; Âm thanh vòm Atmos.</span></li>
                    <li className="flex items-start gap-4"><div className="mt-0.5 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><Check className="w-3.5 h-3.5 text-primary" /></div><span className="text-sm font-medium text-white/80 flex-1 leading-snug">Trải nghiệm thuần khiết không quảng cáo.</span></li>
                  </>
                )}
              </ul>
              <div className="pt-8 border-t border-white/10 flex items-end justify-between mt-auto">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">Thành tiền</span>
                  <p className="text-xs font-bold text-white/50 italic">Đã bao gồm VAT</p>
                </div>
                <span className="text-[2.5rem] font-black italic tracking-tighter text-primary">{plan.price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}