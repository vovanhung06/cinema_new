import React from 'react';
import { Play, Trash2, Clock, Calendar, ChevronRight, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

const History = () => {
  // Mock data for demonstration
  const [historyItems, setHistoryItems] = React.useState([
    { id: 1, title: 'Interstellar', ep: 'Tập 1: Hố Đen Vũ Trụ', progress: 85, time: '2 ngày trước', duration: '169:00', watched: '143:00', img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=600' },
    { id: 2, title: 'The Dark Knight', ep: 'Movie Special', progress: 100, time: '3 ngày trước', duration: '152:00', watched: '152:00', img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=600' },
    { id: 3, title: 'Arrival', ep: 'Movie Special', progress: 45, time: '1 tuần trước', duration: '116:00', watched: '52:00', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600' },
  ]);

  const clearHistory = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử xem?')) {
       setHistoryItems([]);
    }
  };

  const removeItem = (id) => {
    setHistoryItems(historyItems.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Viewing Activity</p>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">Lịch sử <span className="text-glow text-primary">Theo dõi.</span></h2>
        </motion.div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={clearHistory}
             className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl"
           >
              Xóa toàn bộ
           </button>
        </div>
      </header>

      <AnimatePresence mode="popLayout">
        {historyItems.length > 0 ? (
          <div className="space-y-6">
            {historyItems.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-dark p-6 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row gap-8 group hover:bg-white/5 transition-all relative overflow-hidden"
              >
                {/* Background decorative glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="w-full md:w-80 h-48 rounded-[1.5rem] overflow-hidden shrink-0 relative shadow-2xl border border-white/5">
                  <img src={item.img} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" alt={item.title} referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(229,9,20,0.5)] transform scale-90 group-hover:scale-100 transition-transform">
                       <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between flex-1 py-2">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="text-2xl font-black text-white italic group-hover:text-primary transition-colors uppercase tracking-tighter">{item.title}</h4>
                        <p className="text-on-surface-variant/60 text-[10px] font-black uppercase tracking-[0.2em]">{item.ep}</p>
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-black text-white/30 uppercase tracking-[0.2em] bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                         <Clock className="w-3 h-3" /> {item.time}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 pt-2">
                       <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                          <Calendar className="w-3 h-3 text-white/40" />
                          <span className="text-[10px] font-black text-white/60 uppercase tracking-widest leading-none">Cập nhật 2024</span>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6">
                    <div className="flex justify-between text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em]">
                      <span>Đã xem {item.watched}</span>
                      <span>{item.duration}</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className="h-full bg-gradient-to-r from-primary via-primary-container to-primary shadow-[0_0_15px_rgba(229,9,20,0.4)]" 
                      />
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex md:flex-col justify-end gap-3 px-2">
                   <button 
                     onClick={() => removeItem(item.id)}
                     className="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-red-500/20 text-white/20 hover:text-red-500 transition-all border border-transparent hover:border-red-500/40"
                     title="Xóa khỏi lịch sử"
                   >
                      <Trash2 className="w-5 h-5" />
                   </button>
                   <Link 
                     to={`/watch/${item.id}`}
                     className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 hover:bg-white text-white hover:text-black transition-all border border-white/10"
                   >
                      <ChevronRight className="w-5 h-5" />
                   </Link>
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
               <Film className="w-16 h-16 text-white/10" />
               <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full"></div>
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter text-glow">Chưa có lịch sử xem</h3>
              <p className="text-on-surface-variant/40 text-xs font-black uppercase tracking-[0.2em] max-w-sm mx-auto">Các bộ phim bạn đã xem sẽ xuất hiện tại đây để bạn có thể xem lại bất cứ lúc nào.</p>
            </div>
            <Link to="/" className="btn-primary px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
               Bắt đầu xem phim
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;
