import {
  BarChart3,
  TrendingUp,
  Smartphone,
  Laptop,
  Tv,
  ArrowRight,
  Star
} from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { useStatistics } from '../../hooks/useStatistics.js';
import { PageHeader } from '../../components/shared/PageHeader.jsx';

export default function Statistics() {
  const {
    genres,
    topMovies,
    timeRange,
    handleTimeRangeChange,
  } = useStatistics();

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader
        title="Báo cáo & Thống kê"
        description="Dữ liệu phân tích chi tiết cho chu kỳ kinh doanh hiện tại."
        badge="Analytics Engine"
      >
        <div className="flex bg-surface-container p-1 rounded-xl shadow-inner border border-outline-variant/10">
          <button
            onClick={() => handleTimeRangeChange('Tháng')}
            className={cn(
              "px-6 py-2 text-sm font-semibold transition-all rounded-lg",
              timeRange === 'Tháng' ? "bg-primary-container text-white shadow-lg" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            Tháng
          </button>
          <button
            onClick={() => handleTimeRangeChange('Quý')}
            className={cn(
              "px-6 py-2 text-sm font-semibold transition-all rounded-lg",
              timeRange === 'Quý' ? "bg-primary-container text-white shadow-lg" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            Quý
          </button>
          <button
            onClick={() => handleTimeRangeChange('Năm')}
            className={cn(
              "px-6 py-2 text-sm font-semibold transition-all rounded-lg",
              timeRange === 'Năm' ? "bg-primary-container text-white shadow-lg" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            Năm
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-xl p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4">
            <BarChart3 className="w-24 h-24 text-primary-container opacity-20 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </div>
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold font-headline mb-1">Doanh thu tổng hợp</h3>
              <p className="text-sm text-on-surface-variant">Tăng trưởng 12.4% so với quý trước</p>
            </div>
            <div className="flex items-center gap-2 text-primary-container font-bold text-2xl">
              <span>$428.5k</span>
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="flex items-end justify-between h-64 gap-3 px-4">
            {[40, 65, 90, 55, 75, 45].map((h, i) => (
              <div
                key={i}
                className={cn(
                  "w-full rounded-t-lg transition-all relative group/bar",
                  i === 2 ? "bg-primary-container shadow-[0_0_20px_rgba(229,9,20,0.3)]" : "bg-surface-container-highest hover:bg-primary-container"
                )}
                style={{ height: `${h}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container-highest text-[10px] py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                  ${Math.floor(h * 1.2)}k
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest px-4">
            {['Tháng 01', 'Tháng 02', 'Tháng 03', 'Tháng 04', 'Tháng 05', 'Tháng 06'].map(m => <span key={m}>{m}</span>)}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-surface-container-low rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold font-headline mb-1">Xu hướng thể loại</h3>
            <p className="text-sm text-on-surface-variant mb-6">Tỷ lệ xem theo danh mục phim</p>
          </div>
          <div className="relative flex items-center justify-center py-6">
            <svg className="w-48 h-48 -rotate-90">
              <circle cx="96" cy="96" fill="transparent" r="80" stroke="#353534" strokeWidth="24"></circle>
              <circle cx="96" cy="96" fill="transparent" r="80" stroke="#e50914" strokeDasharray="502" strokeDashoffset="120" strokeWidth="24"></circle>
              <circle cx="96" cy="96" fill="transparent" r="80" stroke="#ffb4aa" strokeDasharray="502" strokeDashoffset="400" strokeWidth="24"></circle>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black">74%</span>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Hành động</span>
            </div>
          </div>
          <div className="space-y-2">
            {genres.map(g => (
              <div key={g.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", g.color)}></div>
                  <span>{g.label}</span>
                </div>
                <span className="font-bold">{g.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 bg-surface-container-low rounded-xl p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold font-headline mb-1">Biến động VIP</h3>
              <p className="text-sm text-on-surface-variant">Người dùng nâng cấp gói Premium</p>
            </div>
            <div className="bg-primary-container/10 px-3 py-1 rounded-full text-primary-container text-xs font-bold border border-primary-container/20">
              Live Update
            </div>
          </div>
          <div className="relative h-48 w-full mt-4">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 100">
              <defs>
                <linearGradient id="line-grad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#e50914" stopOpacity="0.3"></stop>
                  <stop offset="100%" stopColor="#e50914" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path d="M0,80 Q50,90 100,50 T200,60 T300,20 T400,30 V100 H0 Z" fill="url(#line-grad)"></path>
              <path d="M0,80 Q50,90 100,50 T200,60 T300,20 T400,30" fill="none" stroke="#e50914" strokeLinecap="round" strokeWidth="3"></path>
              <circle cx="100" cy="50" fill="#e50914" r="4"></circle>
              <circle cx="200" cy="60" fill="#e50914" r="4"></circle>
              <circle cx="300" cy="20" fill="#e50914" r="4"></circle>
            </svg>
            <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">
              {['Tháng trước', 'Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'].map(t => <span key={t}>{t}</span>)}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 bg-surface-container-low rounded-xl p-6 flex flex-col justify-between">
          <h3 className="text-xl font-bold font-headline mb-1">Thiết bị truy cập</h3>
          <div className="space-y-6">
            {[
              { icon: Smartphone, label: 'Mobile App', value: '65%', color: 'bg-primary-container' },
              { icon: Laptop, label: 'Web Desktop', value: '25%', color: 'bg-primary' },
              { icon: Tv, label: 'Smart TV', value: '10%', color: 'bg-on-surface-variant' },
            ].map((d, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center gap-2"><d.icon className="w-4 h-4" /> {d.label}</span>
                  <span className="font-bold">{d.value}</span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", d.color)} style={{ width: d.value }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-outline-variant/10 mt-4 flex items-center justify-between">
            <span className="text-xs text-on-surface-variant italic">Cập nhật lúc: 14:30 Hôm nay</span>
            <button className="text-xs font-bold text-primary-container hover:underline">Tải CSV</button>
          </div>
        </div>
      </div>

      <section className="bg-surface-container-low rounded-xl overflow-hidden shadow-xl border border-outline-variant/5">
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
          <h3 className="text-xl font-bold font-headline">Phim xem nhiều nhất theo Quý</h3>
          <button className="flex items-center gap-2 text-sm font-semibold hover:text-primary-container transition-colors">
            <span>Chi tiết</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">
                <th className="px-6 py-4">Tên Phim</th>
                <th className="px-6 py-4">Thể Loại</th>
                <th className="px-6 py-4">Lượt Xem</th>
                <th className="px-6 py-4">Doanh Thu</th>
                <th className="px-6 py-4">Đánh Giá</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {topMovies.map((movie, i) => (
                <tr key={i} className="hover:bg-surface-container transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 rounded-lg bg-surface-container-highest flex-shrink-0 overflow-hidden">
                        <img className="w-full h-full object-cover" src={movie.image} referrerPolicy="no-referrer" />
                      </div>
                      <span className="font-bold text-on-surface group-hover:text-primary-container transition-colors">{movie.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{movie.genre}</td>
                  <td className="px-6 py-4 text-sm font-medium">{movie.views}</td>
                  <td className="px-6 py-4 text-sm font-bold text-primary-container">{movie.revenue}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-primary-container">
                      <Star className="w-3 h-3 fill-primary-container" />
                      <span className="text-sm font-bold">{movie.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="mt-auto py-8 border-t border-outline-variant/10 text-on-surface-variant text-xs flex justify-between items-center">
        <p>© 2026 CINEMA+ Premium Streaming Administration System.</p>
        <div className="flex gap-6">
          <a className="hover:text-primary-container transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-primary-container transition-colors" href="#">Service Terms</a>
          <a className="hover:text-primary-container transition-colors" href="#">Help Center</a>
        </div>
      </footer>
    </div>
  );
}
