import { 
  Users, 
  Film, 
  Eye, 
  TrendingUp, 
  Clock, 
  ArrowUpRight,
  Play,
  Star,
  Activity,
  ShieldCheck,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useMovies } from '../../hooks/useMovies';
import { useUsers } from '../../hooks/useUsers';
import { useComments } from '../../hooks/useComments';
import { dashboardData } from '../../lib/mockData';
import { PageHeader } from '../../components/shared/PageHeader';

const { recentActivity, announcements } = dashboardData;

export default function Dashboard() {
  const { movies } = useMovies();
  const { users } = useUsers();
  const { comments } = useComments();

  const stats = [
    { label: 'Phim đang quản lý', value: movies.length, trend: '+4', icon: Film, color: 'text-primary-container' },
    { label: 'Tổng thành viên', value: users.length.toLocaleString(), trend: '+12.5%', icon: Users, color: 'text-blue-400' },
    { label: 'Bình luận mới', value: comments.length, trend: '+24%', icon: MessageSquare, color: 'text-purple-400' },
    { label: 'Doanh thu tháng', value: '$42,500', trend: '+8.2%', icon: TrendingUp, color: 'text-green-400' },
  ];

  const trendingMovies = movies.slice(0, 2);

  return (
    <div className="p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader 
        title="Tổng quan hệ thống" 
        description="Chào mừng trở lại, Admin. Đây là những gì đang diễn ra hôm nay."
        badge="Live Dashboard"
      >
        <div className="flex gap-2 bg-surface-container p-1 rounded-xl border border-outline-variant/10 shadow-lg">
          <button className="px-4 py-1.5 text-xs font-bold bg-primary-container text-white rounded-lg shadow-lg">Hôm nay</button>
          <button className="px-4 py-1.5 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors">Tuần này</button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 hover:border-primary-container/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <stat.icon className="w-24 h-24" />
            </div>
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl bg-surface-container-highest", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-green-400 flex items-center gap-1 bg-green-400/10 px-2 py-1 rounded-full">
                {stat.trend}
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <h3 className="text-3xl font-black text-on-surface font-headline tracking-tight">{stat.value}</h3>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Activity className="w-32 h-32 text-primary-container" />
            </div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black font-headline uppercase italic tracking-tight">Hoạt động gần đây</h3>
              <button className="text-xs font-bold text-primary-container hover:underline uppercase tracking-widest">Xem tất cả</button>
            </div>
            <div className="space-y-6">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-outline-variant/10 group-hover:border-primary-container/50 transition-colors">
                    <img alt={item.user} className="w-full h-full object-cover" src={item.avatar} referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-on-surface group-hover:text-primary-container transition-colors">
                      {item.user} <span className="font-medium text-on-surface-variant">{item.action}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-on-surface-variant" />
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">{item.time}</span>
                    </div>
                  </div>
                  <button className="p-2 rounded-xl bg-surface-container-highest opacity-0 group-hover:opacity-100 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/10">
              <h3 className="text-xl font-black font-headline uppercase italic tracking-tight mb-6">Xu hướng</h3>
              <div className="space-y-4">
                {trendingMovies.map((movie, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-16 h-20 rounded-xl overflow-hidden bg-surface-container-highest">
                      <img alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={movie.image} referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-on-surface line-clamp-1">{movie.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-primary-container">
                          <Play className="w-3 h-3 fill-primary-container" />
                          {movie.views}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-500">
                          <Star className="w-3 h-3 fill-yellow-500" />
                          {movie.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary-container rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-primary-container/20">
              <div className="absolute -right-10 -bottom-10 opacity-20 rotate-12">
                <ShieldCheck className="w-48 h-48" />
              </div>
              <h3 className="text-xl font-black font-headline uppercase italic tracking-tight mb-2">Trạng thái hệ thống</h3>
              <p className="text-sm font-medium opacity-80 mb-6">Tất cả các dịch vụ đang hoạt động bình thường.</p>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                  <span>Server Load</span>
                  <span>24%</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-white h-full w-[24%] rounded-full"></div>
                </div>
                <button className="w-full py-3 bg-white text-primary-container rounded-xl font-black text-xs uppercase tracking-widest mt-4 hover:bg-white/90 transition-colors">
                  Kiểm tra chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/10 h-full">
            <h3 className="text-xl font-black font-headline uppercase italic tracking-tight mb-8">Thông báo quan trọng</h3>
            <div className="space-y-8">
              {announcements.map((note, i) => (
                <div key={i} className="relative pl-6 border-l-2 border-outline-variant/10">
                  <div className={cn("absolute -left-[5px] top-0 w-2 h-2 rounded-full", note.color)}></div>
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">{note.date}</p>
                  <h4 className="text-sm font-bold text-on-surface mb-1">{note.title}</h4>
                  <span className={cn("text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded", note.color + "/10 " + note.color.replace('bg-', 'text-'))}>
                    {note.type}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full py-4 border border-outline-variant/20 rounded-2xl text-xs font-bold text-on-surface-variant hover:bg-surface-container-highest transition-all mt-12 uppercase tracking-widest">
              Trung tâm thông báo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
