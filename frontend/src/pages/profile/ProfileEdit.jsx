import React from 'react';
import { Eye, EyeOff, ChevronRight, User, Mail, Globe, Calendar, Lock, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const ProfileEdit = ({ 
  editData, 
  setEditData, 
  setIsEditing, 
  updateProfile, 
}) => {
  return (
    <div className="space-y-16 max-w-5xl mx-auto pb-32">
      {/* Section 1: Personal Info */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10"
      >
        <div className="relative">
          <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Account Settings</p>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">Chỉnh sửa <span className="text-glow text-primary">Thông tin.</span></h2>
          <div className="absolute -bottom-4 left-0 w-20 h-1 bg-primary rounded-full"></div>
        </div>

        <div className="glass-dark rounded-[3.5rem] p-10 md:p-14 border border-white/5 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -z-10 group-hover:bg-primary/10 transition-colors"></div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                <User className="w-3 h-3" /> Họ và tên thành viên
              </label>
              <div className="relative group/input">
                <input
                  className="w-full bg-surface border border-white/5 rounded-2xl py-5 px-6 text-sm font-black text-white italic tracking-widest focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none shadow-2xl"
                  type="text"
                  value={editData.username}
                  onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                  placeholder="Nhập tên của bạn"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                <Mail className="w-3 h-3" /> Địa chỉ Email liên hệ
              </label>
              <div className="relative group/input">
                <input
                  className="w-full bg-surface border border-white/5 rounded-2xl py-5 px-6 text-sm font-black text-white italic tracking-widest focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none shadow-2xl"
                  type="email"
                  value={editData.email}
                  //onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  disabled
                  placeholder="name@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                <Globe className="w-3 h-3" /> Quốc gia / Khu vực
              </label>
              <div className="relative group/input">
                <select
                  className="w-full bg-surface border border-white/5 rounded-2xl py-5 px-6 text-sm font-black text-white italic tracking-widest focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none shadow-2xl appearance-none"
                  value={editData.country}
                  onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                >
                  <option>Việt Nam</option>
                  <option>United States</option>
                  <option>South Korea</option>
                  <option>Japan</option>
                </select>
                <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 rotate-90 w-5 h-5" />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Ngày sinh nhật
              </label>
              <div className="relative group/input">
                <input
                  className="w-full bg-surface border border-white/5 rounded-2xl py-5 px-6 text-sm font-black text-white tracking-widest focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none shadow-2xl custom-calendar-icon"
                  type="date"
                  defaultValue="1995-12-14"
                />
              </div>
            </div>

            <div className="md:col-span-2 pt-10 flex flex-col md:flex-row justify-end gap-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white hover:bg-white/5 transition-all"
              >
                Hủy bỏ thay đổi
              </button>
              <button
                onClick={() => {
                  updateProfile(editData);
                  setIsEditing(false);
                }}
                className="btn-primary px-14 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all hover:scale-[1.05] shadow-[0_20px_40px_rgba(229,9,20,0.3)] flex items-center justify-center gap-3"
              >
                Lưu cấu hình <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ProfileEdit;