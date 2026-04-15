import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Smartphone,
  Laptop,
  Tv,
  ArrowRight,
  Star,
  Loader2,
  DollarSign,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Crown,
  Calendar,
  Clock,
  RefreshCw,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { useStatistics } from '../../hooks/useStatistics.js';
import { getRevenueHistory, getPaymentSessions } from '../../service/statistics_service.js';
import { PageHeader } from '../../components/shared/PageHeader.jsx';

export default function Statistics() {
  const {
    revenueData,
    genres,
    topMovies,
    userStats,
    vipTrend,
    timeRange,
    handleTimeRangeChange,
    loading,
    error
  } = useStatistics();

  // Revenue History state
  const [revHistory, setRevHistory] = useState({ rows: [], pagination: { total: 0, page: 1, totalPages: 1 }, summary: { totalRevenue: 0, monthRevenue: 0 } });
  const [revPage, setRevPage] = useState(1);
  const [revLoading, setRevLoading] = useState(false);

  useEffect(() => {
    const fetchRevHistory = async () => {
      setRevLoading(true);
      try {
        const res = await getRevenueHistory(revPage, 10);
        if (res.success) setRevHistory(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setRevLoading(false);
      }
    };
    fetchRevHistory();
  }, [revPage]);

  // Payment Sessions state
  const [sessions, setSessions] = useState([]);
  const [sessionPage, setSessionPage] = useState(1);
  const [sessionMeta, setSessionMeta] = useState({ total: 0, totalPages: 1, counts: { all: 0, completed: 0, pending: 0, expired: 0 } });
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionFilter, setSessionFilter] = useState('all');

  const fetchSessions = async (page = sessionPage, filter = sessionFilter) => {
    setSessionsLoading(true);
    try {
      const res = await getPaymentSessions(page, 10, filter);
      if (res.success) {
        setSessions(res.sessions);
        setSessionMeta({
          total: res.pagination.total,
          totalPages: res.pagination.totalPages,
          counts: res.counts
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions(sessionPage, sessionFilter);

    // Auto-refresh every 10 seconds to catch new sessions
    const interval = setInterval(() => {
      fetchSessions(sessionPage, sessionFilter);
    }, 10000);
    
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionPage, sessionFilter]);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary-container animate-spin" />
        <p className="text-on-surface-variant font-medium animate-pulse uppercase tracking-[0.2em] text-xs">Đang tải dữ liệu thống kê...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4 text-center p-8">
        <div className="bg-primary/10 p-6 rounded-full">
          <TrendingUp className="w-12 h-12 text-primary rotate-180" />
        </div>
        <h2 className="text-2xl font-bold font-headline">Có lỗi xảy ra</h2>
        <p className="text-on-surface-variant max-w-md">Không thể kết nối với máy chủ để lấy dữ liệu thống kê. Vui lòng thử lại sau.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-primary-container text-white rounded-xl shadow-lg hover:shadow-primary-container/20 transition-all font-bold"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const quickStats = [
    { label: 'Tổng người dùng', value: userStats.total, icon: Smartphone, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Thành viên VIP', value: userStats.vip, sub: userStats.vipPercentage, icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Người dùng mới (30 ngày)', value: userStats.new, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader
        title="Báo cáo & Thống kê"
        description="Dữ liệu phân tích chi tiết cho chu kỳ kinh doanh hiện tại."
        badge="Analytics Engine"
      >
        <div className="flex bg-surface-container p-1 rounded-xl shadow-inner border border-outline-variant/10">
          {['Tháng', 'Quý', 'Năm'].map((range) => (
            <button
              key={range}
              onClick={() => handleTimeRangeChange(range)}
              className={cn(
                "px-6 py-2 text-sm font-semibold transition-all rounded-lg",
                timeRange === range ? "bg-primary-container text-white shadow-lg" : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </PageHeader>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, i) => (
          <div key={i} className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 flex items-center justify-between group hover:border-primary-container/30 transition-all">
            <div>
              <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h4 className="text-2xl font-black font-headline text-on-surface">{stat.value.toLocaleString()}</h4>
                {stat.sub && <span className="text-[10px] font-bold text-primary-container bg-primary-container/10 px-1.5 py-0.5 rounded">{stat.sub}</span>}
              </div>
            </div>
            <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="  gap-6">
        {/* Revenue Chart */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-xl p-6 shadow-2xl relative overflow-hidden group border border-outline-variant/10">
          <div className="absolute top-0 right-0 p-4">
            <BarChart3 className="w-24 h-24 text-primary-container opacity-20 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </div>
          <div className="flex justify-between items-start mb-8">
            <div className="w-full lg:w-auto">
              <h3 className="text-lg md:text-xl font-bold font-headline mb-1">Doanh thu tổng hợp</h3>
              <p className="text-[10px] md:text-sm text-on-surface-variant font-medium uppercase tracking-widest">{revenueData.growth} so với kỳ trước</p>
            </div>
            <div className="flex items-center gap-2 text-primary-container font-black text-xl md:text-2xl mt-4 lg:mt-0">
              <span>{revenueData.total}</span>
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>

          <div className="flex items-end justify-between h-64 gap-3 px-4">
            {revenueData.heights.map((h, i) => (
              <div
                key={i}
                className={cn(
                  "w-full rounded-t-lg transition-all relative group/bar",
                  i === revenueData.heights.length - 1 ? "bg-primary-container shadow-[0_0_20px_rgba(229,9,20,0.3)]" : "bg-surface-container-highest hover:bg-primary-container"
                )}
                style={{ height: `${Math.max(10, h)}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container-highest text-[10px] py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold border border-outline-variant/10">
                  ${Math.floor(h * 1.5)}k
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest px-4">
            {revenueData.labels.map(label => <span key={label}>{label}</span>)}
          </div>
        </div>

        {/* Genre Trends */}
        

        {/* High Visibility VIP Trends Chart (Bar Chart) */}
        <div className="col-span-12 bg-surface-container-low rounded-xl p-8 border border-outline-variant/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <Star className="w-48 h-48 text-primary" />
          </div>

          <div className="flex justify-between items-start mb-12">
            <div className="space-y-1">
              <h3 className="text-2xl font-black font-headline flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                Tăng trưởng Thành viên VIP
              </h3>
              <p className="text-on-surface-variant max-w-lg">Số lượng người dùng nâng cấp gói Premium qua từng giai đoạn ({timeRange}).</p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <div className="flex items-center gap-2 bg-primary-container text-white px-3 md:px-5 py-2 md:py-2.5 rounded-xl shadow-lg shadow-primary-container/20">
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-white" />
                <span className="text-[10px] md:text-sm font-black uppercase tracking-widest">{userStats.vip} VIP</span>
              </div>
              <span className="text-[8px] md:text-[10px] font-bold text-on-surface-variant italic uppercase tracking-tighter">Live Update</span>
            </div>
          </div>

          <div className="relative h-72 w-full mt-4 flex items-end justify-between gap-4 px-2">
            {/* Background Grid Lines (Horizontal) */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-full border-t border-dashed border-outline-variant" />
              ))}
            </div>

            {vipTrend.counts.map((val, i) => {
              const max = Math.max(...vipTrend.counts, 5);
              const heightPercent = (val / max) * 100;

              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end relative group/bar z-10 h-full">
                  {/* Value Label */}
                  <div className="mb-3 text-sm font-black text-primary animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {val > 0 ? val : ''}
                  </div>

                  {/* Bar */}
                  <div
                    className={cn(
                      "w-full max-w-[80px] rounded-t-2xl transition-all duration-700 ease-out relative shadow-lg",
                      val > 0 ? "bg-primary" : "bg-surface-container-highest",
                      "group-hover/bar:bg-primary-container group-hover/bar:scale-105"
                    )}
                    style={{ height: `${Math.max(5, heightPercent)}%` }}
                  >
                    {/* Glossy Effect */}
                    <div className="absolute inset-0 bg-white/10 rounded-t-2xl opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                  </div>

                  {/* Label */}
                  <div className="mt-6 text-[10px] font-black text-on-surface-variant uppercase tracking-widest text-center whitespace-nowrap overflow-hidden text-ellipsis w-full">
                    {vipTrend.labels[i]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Movies Table */}
      <section className="bg-surface-container-low rounded-xl overflow-hidden shadow-xl border border-outline-variant/10">
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low">
          <div>
            <h3 className="text-xl font-bold font-headline mb-1">Phim xem nhiều nhất</h3>
            <p className="text-sm text-on-surface-variant">Top xu hướng trong khoảng thời gian đã chọn</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary-container hover:bg-primary-container/10 px-4 py-2 rounded-xl transition-all">
            <span>Chi tiết</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container text-[10px] uppercase font-bold text-on-surface-variant tracking-[0.2em]">
                <th className="px-6 py-4 whitespace-nowrap">Hạng</th>
                <th className="px-6 py-4 whitespace-nowrap">Phim</th>
                <th className="px-6 py-4 whitespace-nowrap">Lượt Xem</th>
                <th className="px-6 py-4 whitespace-nowrap">Đánh Giá</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {topMovies.map((movie, i) => (
                <tr key={i} className="hover:bg-surface-container/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-lg font-black",
                      i === 0 ? "bg-yellow-400/20 text-yellow-500" :
                        i === 1 ? "bg-slate-400/20 text-slate-500" :
                          i === 2 ? "bg-orange-400/20 text-orange-500" :
                            "bg-surface-container-highest text-on-surface-variant"
                    )}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 rounded-lg bg-surface-container-highest shrink-0 overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                        <img
                          className="w-full h-full object-cover"
                          src={movie.image}
                          alt={movie.title}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150x225?text=No+Poster';
                          }}
                        />
                      </div>
                      <div>
                        <span className="block font-bold text-on-surface group-hover:text-primary-container transition-colors">{movie.title}</span>
                        <span className="text-[10px] text-on-surface-variant font-medium uppercase">{movie.genre}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-on-surface">{movie.views}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 bg-primary-container/10 w-fit px-2 py-1 rounded-lg border border-primary-container/20">
                      <Star className="w-3 h-3 fill-primary-container text-primary-container" />
                      <span className="text-sm font-black text-primary-container">{movie.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── REVENUE HISTORY TABLE ── */}
      <section className="bg-surface-container-low rounded-xl overflow-hidden shadow-xl border border-outline-variant/10">
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/10 bg-surface-container-low flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full lg:w-auto">
            <h3 className="text-lg md:text-xl font-bold font-headline mb-1 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              Lịch sử Doanh thu
            </h3>
            <p className="text-[10px] md:text-sm text-on-surface-variant font-medium">Báo cáo giao dịch từ <code className="bg-surface-container px-1.5 py-0.5 rounded text-primary text-[10px] font-mono whitespace-nowrap">vip_history</code></p>
          </div>
          {/* Summary mini-cards */}
          <div className="flex gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl">
              <DollarSign className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-[9px] uppercase tracking-widest font-bold text-green-400/70">Tổng doanh thu</p>
                <p className="text-sm font-black text-green-400">{(revHistory.summary.totalRevenue || 0).toLocaleString('vi-VN')}đ</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl">
              <Calendar className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-[9px] uppercase tracking-widest font-bold text-blue-400/70">Tháng này</p>
                <p className="text-sm font-black text-blue-400">{(revHistory.summary.monthRevenue || 0).toLocaleString('vi-VN')}đ</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl">
              <Crown className="w-4 h-4 text-primary" />
              <div>
                <p className="text-[9px] uppercase tracking-widest font-bold text-primary/70">Tổng giao dịch</p>
                <p className="text-sm font-black text-primary">{revHistory.pagination.total}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto relative">
          {revLoading && (
            <div className="absolute inset-0 bg-surface/60 backdrop-blur-sm flex items-center justify-center z-10">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container text-[10px] uppercase font-bold text-on-surface-variant tracking-[0.2em]">
                <th className="px-6 py-4 whitespace-nowrap">#ID</th>
                <th className="px-6 py-4 whitespace-nowrap">Khách hàng</th>
                <th className="px-6 py-4 whitespace-nowrap">Email</th>
                <th className="px-6 py-4 whitespace-nowrap">Gói VIP</th>
                <th className="px-6 py-4 whitespace-nowrap">Số tiền</th>
                <th className="px-6 py-4 whitespace-nowrap">Ngày đăng ký</th>
                <th className="px-6 py-4 whitespace-nowrap">Hết hạn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {revHistory.rows.length === 0 && !revLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                    Chưa có giao dịch nào được ghi nhận.
                  </td>
                </tr>
              ) : (
                revHistory.rows.map((row, i) => (
                  <tr key={row.id} className="hover:bg-surface-container/40 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-mono text-on-surface-variant bg-surface-container px-2 py-1 rounded">#{row.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-xs font-black text-primary">{row.username?.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{row.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{row.email}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wide w-fit">
                        <Crown className="w-3 h-3" />{row.vip_package}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-400 font-black text-sm">
                        {typeof row.price_paid === 'number'
                          ? row.price_paid.toLocaleString('vi-VN') + 'đ'
                          : row.price_paid}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {row.start_date ? new Date(row.start_date).toLocaleDateString('vi-VN') : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {row.end_date ? new Date(row.end_date).toLocaleDateString('vi-VN') : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {revHistory.pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between bg-surface-container-low">
            <span className="text-xs text-on-surface-variant font-medium">
              Trang {revHistory.pagination.page} / {revHistory.pagination.totalPages} — {revHistory.pagination.total} giao dịch
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRevPage(p => Math.max(1, p - 1))}
                disabled={revPage === 1}
                className="p-2 rounded-lg border border-outline-variant/20 hover:border-primary/40 hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setRevPage(p => Math.min(revHistory.pagination.totalPages, p + 1))}
                disabled={revPage === revHistory.pagination.totalPages}
                className="p-2 rounded-lg border border-outline-variant/20 hover:border-primary/40 hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── PAYMENT SESSIONS TABLE ── */}
      <section className="bg-surface-container-low rounded-xl overflow-hidden shadow-xl border border-outline-variant/10">
        <div className="p-6 border-b border-outline-variant/10 bg-surface-container-low flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold font-headline mb-1 flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              Phiên Thanh toán QR
            </h3>
            <p className="text-sm text-on-surface-variant">Theo dõi trạng thái thời gian thực từng mã QR đã tạo</p>
          </div>
          <div className="flex bg-surface-container/50 p-1 rounded-xl border border-outline-variant/20 shadow-inner">
            <button 
              onClick={() => { setSessionFilter('all'); setSessionPage(1); }}
              className={cn(
                "px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all",
                sessionFilter === 'all' 
                  ? "bg-primary-container text-white shadow-lg" 
                  : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
              )}
            >
              Tất cả <span className="opacity-40 ml-1">({sessionMeta.counts.all})</span>
            </button>
            <button 
              onClick={() => { setSessionFilter('completed'); setSessionPage(1); }}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all",
                sessionFilter === 'completed'
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-500/10"
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Thành công <span className={cn("opacity-60 ml-0.5", sessionFilter === 'completed' && "text-white")}>({sessionMeta.counts.completed})</span>
            </button>
            <button 
              onClick={() => { setSessionFilter('pending'); setSessionPage(1); }}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all",
                sessionFilter === 'pending'
                  ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
                  : "text-yellow-400/60 hover:text-yellow-400 hover:bg-yellow-500/10"
              )}
            >
              <Loader2 className={cn("w-3.5 h-3.5", sessionFilter === 'pending' && "animate-spin")} />
              Đang chờ <span className={cn("opacity-60 ml-0.5", sessionFilter === 'pending' && "text-black")}>({sessionMeta.counts.pending})</span>
            </button>
            <button 
              onClick={() => { setSessionFilter('expired'); setSessionPage(1); }}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all",
                sessionFilter === 'expired'
                  ? "bg-on-surface-variant text-white shadow-lg"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
              )}
            >
              <XCircle className="w-3.5 h-3.5" />
              Hết hạn <span className={cn("opacity-40 ml-0.5", sessionFilter === 'expired' && "text-white")}>({sessionMeta.counts.expired})</span>
            </button>
            <div className="w-px h-6 bg-outline-variant/20 mx-2 self-center" />
            <button onClick={() => fetchSessions(sessionPage, sessionFilter)} className="p-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all" title="Làm mới dữ liệu">
              <RefreshCw className={cn("w-4 h-4", sessionsLoading && "animate-spin")} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto relative">
          {sessionsLoading && sessions.length === 0 && (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container text-[10px] uppercase font-bold text-on-surface-variant tracking-[0.2em]">
                <th className="px-6 py-4">Mã QR</th>
                <th className="px-6 py-4">Người dùng</th>
                <th className="px-6 py-4">Số tiền</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Tạo lúc</th>
                <th className="px-6 py-4">Hết hạn lúc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {sessions.length === 0 && !sessionsLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                    Chưa có phiên thanh toán nào. Phiên mới sẽ xuất hiện khi người dùng mở màn hình QR.
                  </td>
                </tr>
              ) : (
                sessions.map((s) => (
                  <tr key={`${s.userId}-${s.randomCode}`} className="hover:bg-surface-container/40 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-black text-sm text-primary tracking-widest bg-primary/10 px-2 py-1 rounded">{s.randomCode}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-xs font-black text-primary">{s.username?.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="font-bold text-sm">{s.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-green-400">
                      {s.amount ? s.amount.toLocaleString('vi-VN') + 'đ' : '—'}
                    </td>
                    <td className="px-6 py-4">
                      {s.status === 'completed' && (
                        <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg text-[11px] font-black w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Đã thanh toán
                        </span>
                      )}
                      {s.status === 'pending' && (
                        <span className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-lg text-[11px] font-black w-fit animate-pulse">
                          <Loader2 className="w-3 h-3 animate-spin" /> Đang xử lý
                        </span>
                      )}
                      {s.status === 'expired' && (
                        <span className="flex items-center gap-1.5 bg-on-surface-variant/10 text-on-surface-variant border border-outline-variant/20 px-3 py-1 rounded-lg text-[11px] font-black w-fit">
                          <XCircle className="w-3 h-3" /> Hết hạn
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {s.createdAt ? new Date(s.createdAt).toLocaleString('vi-VN') : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {s.expiresAt ? new Date(s.expiresAt).toLocaleString('vi-VN') : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Sessions Pagination */}
        {sessionMeta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between bg-surface-container-low">
            <span className="text-xs text-on-surface-variant font-medium">
              Trang {sessionPage} / {sessionMeta.totalPages} — {sessionMeta.total} phiên
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSessionPage(p => Math.max(1, p - 1))}
                disabled={sessionPage === 1}
                className="p-2 rounded-lg border border-outline-variant/20 hover:border-primary/40 hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSessionPage(p => Math.min(sessionMeta.totalPages, p + 1))}
                disabled={sessionPage === sessionMeta.totalPages}
                className="p-2 rounded-lg border border-outline-variant/20 hover:border-primary/40 hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      <footer className="mt-auto py-12 border-t border-outline-variant/10 text-on-surface-variant text-xs flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-medium">© 2026 CINEMA+ Premium Streaming Administration System.</p>
        <div className="flex gap-8 font-bold uppercase tracking-widest text-[10px]">
          <a className="hover:text-primary-container transition-colors" href="#">Chính sách bảo mật</a>
          <a className="hover:text-primary-container transition-colors" href="#">Điều khoản dịch vụ</a>
          <a className="hover:text-primary-container transition-colors" href="#">Trung tâm hỗ trợ</a>
        </div>
      </footer>
    </div>
  );
}
