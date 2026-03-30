import React from 'react';
import { Bell, Check, Trash2, Zap, Shield, CreditCard, Gift, MoreVertical, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Notifications = () => {
  const [notifications, setNotifications] = React.useState([
    { id: 1, title: 'Phim mới ra mắt!', desc: 'Bộ phim "Chuyến Tàu Sao Hỏa" đã có mặt trên Cinema+. Trải nghiệm chất lượng 4K Atmos ngay!', type: 'new', time: '1 giờ trước', read: false },
    { id: 2, title: 'Gia hạn thành công', desc: 'Gói VIP Cinema+ của bạn đã được gia hạn tự động. Cảm ơn bạn đã tiếp tục đồng hành!', type: 'billing', time: 'Hôm qua', read: true },
    { id: 3, title: 'Ưu đãi đặc biệt', desc: 'Giảm giá 50% cho gói VIP 1 năm chỉ dành riêng cho bạn trong hôm nay.', type: 'promo', time: '2 ngày trước', read: false },
    { id: 4, title: 'Cảnh báo bảo mật', desc: 'Tài khoản của bạn vừa được đăng nhập từ một thiết bị mới tại TP.HCM.', type: 'security', time: '3 ngày trước', read: true },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'new': return <Zap className="w-5 h-5 text-blue-400" />;
      case 'billing': return <CreditCard className="w-5 h-5 text-emerald-400" />;
      case 'promo': return <Gift className="w-5 h-5 text-purple-400" />;
      case 'security': return <Shield className="w-5 h-5 text-red-400" />;
      default: return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'new': return 'bg-blue-500/10 border-blue-500/20';
      case 'billing': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'promo': return 'bg-purple-500/10 border-purple-500/20';
      case 'security': return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-primary/10 border-primary/20';
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">System Alerts</p>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">Trung tâm <span className="text-glow text-primary">Thông báo.</span></h2>
        </motion.div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={markAllRead}
             className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
           >
              <Check className="w-4 h-4" /> Đánh dấu đã đọc
           </button>
        </div>
      </header>

      <AnimatePresence mode="popLayout">
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((n, i) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`glass-dark p-6 rounded-[2.5rem] border flex gap-6 hover:bg-white/5 transition-all group relative cursor-pointer ${n.read ? 'border-white/5 opacity-60 hover:opacity-100' : 'border-primary/20 shadow-[0_10px_30px_rgba(229,9,20,0.1)]'}`}
              >
                {!n.read && (
                   <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_15px_rgba(229,9,20,0.8)] animate-pulse"></div>
                )}
                
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border ${getBgColor(n.type)}`}>
                  {getIcon(n.type)}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-lg font-black italic uppercase tracking-tight ${n.read ? 'text-white/60' : 'text-white'}`}>{n.title}</h4>
                    <p className="text-[9px] font-black text-on-surface-variant/30 uppercase tracking-[0.2em]">{n.time}</p>
                  </div>
                  <p className="text-on-surface-variant/60 text-sm leading-relaxed max-w-2xl">{n.desc}</p>
                  
                  <div className="pt-2 flex items-center gap-6">
                     <button className="text-[9px] font-black text-primary uppercase tracking-[0.3em] hover:text-white transition-colors">Xem chi tiết</button>
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         deleteNotification(n.id);
                       }}
                       className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] hover:text-red-500 transition-colors flex items-center gap-1"
                     >
                        <X className="w-3 h-3" /> Gỡ bỏ
                     </button>
                  </div>
                </div>

                <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <MoreVertical className="w-5 h-5 text-white/10" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center space-y-8"
          >
            <div className="w-40 h-40 glass-dark rounded-[3rem] flex items-center justify-center border border-white/5 relative">
               <Bell className="w-16 h-16 text-white/5" />
               <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full"></div>
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter text-glow">Không có thông báo mới</h3>
              <p className="text-on-surface-variant/40 text-xs font-black uppercase tracking-[0.2em] max-w-sm mx-auto">Chúng tôi sẽ cập nhật tin tức và ưu đãi mới nhất tại đây cho bạn.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;
