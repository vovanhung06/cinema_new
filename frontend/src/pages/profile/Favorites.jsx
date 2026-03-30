import React from 'react';
import { Star, X, Play, Heart, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

const Favorites = () => {
  // Mock data for demonstration, in a real app this would come from a store/API
  const [favorites, setFavorites] = React.useState([
    { id: 1, title: 'Interstellar', rating: 8.9, year: 2014, img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=400' },
    { id: 2, title: 'The Dark Knight', rating: 9.0, year: 2008, img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=400' },
    { id: 3, title: 'Inception', rating: 8.8, year: 2010, img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400' },
    { id: 4, title: 'Arrival', rating: 7.9, year: 2016, img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400' },
    { id: 5, title: 'Blade Runner 2049', rating: 8.0, year: 2017, img: 'https://images.unsplash.com/photo-1485125639709-a60c3a500bf1?auto=format&fit=crop&q=80&w=400' },
  ]);

  const removeFavorite = (id) => {
    setFavorites(favorites.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Your Collection</p>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">Danh sách <span className="text-glow text-primary">Yêu thích.</span></h2>
        </motion.div>
        
        <div className="flex items-center gap-4">
           <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">
              {favorites.length} Tác phẩm
           </div>
        </div>
      </header>

      <AnimatePresence mode="popLayout">
        {favorites.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {favorites.map((movie) => (
              <motion.div
                key={movie.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                whileHover={{ y: -10 }}
                className="relative group aspect-[2/3] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 bg-surface"
              >
                <img
                  src={movie.img}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                />
                
                {/* Premium Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                   <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="space-y-4"
                   >
                      <div className="space-y-1">
                        <h4 className="text-xl font-black text-white italic leading-tight uppercase tracking-tight">{movie.title}</h4>
                        <div className="flex items-center gap-3">
                           <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-primary fill-primary" />
                              <span className="text-[10px] font-black text-white">{movie.rating}</span>
                           </div>
                           <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{movie.year}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Link to={`/watch/${movie.id}`} className="flex-1 bg-white text-black py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all group/btn">
                           <Play className="w-4 h-4 fill-current group-hover/btn:scale-110 transition-transform" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Xem</span>
                        </Link>
                        <button 
                          onClick={() => removeFavorite(movie.id)}
                          className="w-12 h-12 glass-dark rounded-2xl flex items-center justify-center hover:bg-red-500 transition-colors group/remove"
                          title="Xóa khỏi yêu thích"
                        >
                           <X className="w-5 h-5 text-white transition-transform group-hover/remove:rotate-90" />
                        </button>
                      </div>
                   </motion.div>
                </div>
                
                {/* Static indicator */}
                <div className="absolute top-6 right-6 w-10 h-10 glass-dark rounded-2xl flex items-center justify-center border border-white/10 group-hover:opacity-0 transition-opacity">
                   <Heart className="w-5 h-5 text-primary fill-primary" />
                </div>
              </motion.div>
            ))}
          </motion.div>
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
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter text-glow">Danh sách của bạn đang trống</h3>
              <p className="text-on-surface-variant/40 text-xs font-black uppercase tracking-[0.2em] max-w-sm mx-auto">Hãy bắt đầu hành trình điện ảnh bằng cách khám phá kho phim khổng lồ của Cinema+</p>
            </div>
            <Link to="/" className="btn-primary px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
               Khám phá ngay
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Favorites;
