import React from 'react';
import { CreditCard, CheckCircle2, ChevronRight, Zap, Download, Calendar, ArrowUpRight, ShieldCheck, History } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const Billing = () => {
  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Subscription & Billing</p>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">Thanh toán & <span className="text-glow text-primary">Dịch vụ.</span></h2>
        </motion.div>
        
        <div className="flex items-center gap-4">
           <div className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Tài khoản Đã Xác Thực
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Current Plan - High Impact */}
        <div className="xl:col-span-12">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="relative rounded-[3.5rem] p-12 text-white overflow-hidden shadow-2xl min-h-[350px] flex flex-col md:flex-row justify-between items-center group shadow-primary/20"
          >
            {/* Background Layer with Premium Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-container to-black -z-10 transition-transform duration-700 group-hover:scale-110"></div>
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1)_0%,transparent_70%)] -z-10"></div>
            
            <div className="relative z-10 space-y-8 text-center md:text-left">
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-block px-5 py-2 bg-white/10 backdrop-blur-xl rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] border border-white/10"
                >
                  Current Premium Plan
                </motion.div>
                <h3 className="text-6xl md:text-7xl font-black text-white italic truncate uppercase tracking-tighter leading-none">VIP GIA ĐÌNH.</h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 4K Ultra HD + Atmos
                  </div>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 5 Thiết bị đồng thời
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-8 pt-6">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Phí dịch vụ hàng tháng</p>
                   <p className="text-3xl font-black italic">199.000₫ <span className="text-sm font-medium not-italic opacity-40">/ Month</span></p>
                </div>
                <div className="w-px h-12 bg-white/10 hidden md:block"></div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Kỳ hạn thanh toán tiếp theo</p>
                   <div className="flex items-center gap-2 text-xl font-black italic">
                      <Calendar className="w-5 h-5 text-primary" /> 15/04/2026
                   </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex flex-col gap-4 w-full md:w-auto mt-12 md:mt-0">
               <Link to="/vip" className="btn-primary w-full md:w-64 py-6 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl hover:bg-white hover:text-black transition-all group/btn">
                  Quản lý gói cước <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
               </Link>
               <button className="w-full md:w-64 py-5 bg-white/10 backdrop-blur-3xl hover:bg-white/20 border border-white/5 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] transition-all">
                  Hủy gói dịch vụ
               </button>
            </div>
            
            <Zap className="absolute -bottom-12 -left-12 w-64 h-64 text-white/5 -rotate-12 group-hover:scale-110 transition-transform duration-1000" />
          </motion.div>
        </div>

        {/* Payment Method Section */}
        <div className="xl:col-span-5 space-y-8">
          <div className="glass-dark p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] -z-10"></div>
            
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-primary" /> Phương thức hiện tại
              </h4>
              <button className="text-[9px] font-black text-primary hover:text-white uppercase tracking-widest transition-colors">Cập nhật</button>
            </div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem] border border-white/10 relative overflow-hidden shadow-xl"
            >
              <div className="absolute top-0 right-0 p-6 opacity-20">
                 <div className="w-16 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-black italic text-xs">VISA</div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Card Number</p>
                  <p className="text-2xl font-black text-white tracking-[0.2em] italic">•••• •••• •••• 4242</p>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Expiry Date</p>
                    <p className="text-lg font-black text-white italic">12 / 28</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Card Holder</p>
                    <p className="text-sm font-black text-white uppercase tracking-widest">NGUYEN VAN A</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <button className="w-full py-5 border border-dashed border-white/20 hover:border-primary/40 rounded-2xl text-on-surface-variant/40 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary/5 transition-all">
              + Thêm phương thức mới
            </button>
          </div>
        </div>

        {/* Billing History Section */}
        <div className="xl:col-span-7 space-y-8">
          <div className="glass-dark rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="p-10 pb-4 flex items-center justify-between">
               <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                 <History className="w-4 h-4 text-primary" /> Lịch sử giao dịch
               </h3>
               <button className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white hover:text-black transition-all">
                  <Download className="w-4 h-4" />
               </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-10 py-6 text-[9px] font-black text-on-surface-variant/30 uppercase tracking-[0.3em]">Hóa đơn</th>
                    <th className="px-6 py-6 text-[9px] font-black text-on-surface-variant/30 uppercase tracking-[0.3em]">Ngày thực hiện</th>
                    <th className="px-6 py-6 text-[9px] font-black text-on-surface-variant/30 uppercase tracking-[0.3em]">Số tiền</th>
                    <th className="px-10 py-6 text-[9px] font-black text-on-surface-variant/30 uppercase tracking-[0.3em] text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { id: '#INV-001', date: '15/03/2026', amount: '199.000₫', status: 'Success' },
                    { id: '#INV-002', date: '15/02/2026', amount: '199.000₫', status: 'Success' },
                    { id: '#INV-003', date: '15/01/2026', amount: '199.000₫', status: 'Success' },
                    { id: '#INV-004', date: '15/12/2025', amount: '199.000₫', status: 'Success' },
                  ].map((row, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={i} 
                      className="hover:bg-white/[0.02] transition-colors group/row cursor-default"
                    >
                      <td className="px-10 py-6 font-black text-sm text-white italic tracking-widest">{row.id}</td>
                      <td className="px-6 py-6 text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest">{row.date}</td>
                      <td className="px-6 py-6 text-sm font-black text-white italic">{row.amount}</td>
                      <td className="px-10 py-6 text-right">
                         <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{row.status}</span>
                         </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-8 border-t border-white/5 flex justify-center">
               <button className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em] hover:text-white transition-colors">Xem toàn bộ lịch sử</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
