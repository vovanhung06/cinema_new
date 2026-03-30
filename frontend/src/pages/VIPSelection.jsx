import PricingCard from '../components/user/Pricing/PricingCard.jsx';
import ComparisonTable from '../components/user/Pricing/ComparisonTable.jsx';
import Benefits from '../components/user/Pricing/Benefits.jsx';

export default function VIPSelection() {
  const plans = [
    {
      title: 'Gói Tháng',
      description: 'Trải nghiệm linh hoạt',
      price: '79.000đ',
      period: 'tháng',
      features: ['Tất cả quyền lợi VIP', 'Tự động gia hạn hàng tháng', 'Hủy bất cứ lúc nào'],
      isFeatured: false
    },
    {
      title: 'Gói Năm',
      description: 'Tiết kiệm 30% hàng năm',
      price: '660.000đ',
      period: 'năm',
      subPrice: 'Chỉ ~55.000đ/tháng',
      features: ['Đặc quyền xem trước phim mới', 'Ưu đãi voucher CGV/Lotte', 'Chất lượng hình ảnh tốt nhất'],
      isFeatured: true,
      badge: 'Phổ biến nhất'
    },
    {
      title: 'Gói Gia đình',
      description: 'Dành cho 6 người dùng',
      price: '149.000đ',
      period: 'tháng',
      features: ['Chia sẻ tối đa 6 tài khoản', 'Hồ sơ trẻ em bảo mật', 'Mỗi người một danh sách riêng'],
      isFeatured: false
    }
  ];

  return (
    <div className="animate-in fade-in duration-700 pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/60 to-transparent"></div>
          <img 
            className="w-full h-full object-cover opacity-30" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNFusLKRJ-AGoOVSEHj5J23HUC7Dq99K5b2p02hW0W5bR90CIB2gSggU3BIXeTlzV3AzFxKyafZ2UClZxiI_IVsgYHVXGTb1kIUrhhwgOfKQM8aeHToHOiVtY-Px9RSLejiwbSE6ZFEexOwSAC9CefvC_cBgRU4aZRCegBSOFkR2IjajOrEWyOrhNE07kZNk8DwYnHg3ntmIz2IZz7-seJ5ueErhGercA10vistraA4LmGjt2ehWDIa19gnf5FeC-ZzxDhSW_RbNw" 
            alt="Cinema background"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 text-center max-w-4xl py-20">
          <span className="inline-block py-1 px-4 rounded-full border border-red-500/30 text-red-500 text-xs tracking-[0.2em] uppercase mb-6 bg-red-500/5">
            Cinema+ Premium
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-white mb-6 leading-[1.1]">
            Nâng cấp trải nghiệm với <span className="bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">Gói VIP</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Đắm chìm trong không gian điện ảnh không giới hạn. Xem phim bom tấn sớm nhất, chất lượng tuyệt đỉnh và hoàn toàn không bị làm phiền bởi quảng cáo.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Các gói VIP linh hoạt</h2>
          <p className="text-neutral-400">Tiết kiệm hơn với các gói đăng ký dài hạn</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </section>

      {/* Comparison Section */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">So sánh quyền lợi</h2>
          <p className="text-neutral-400">Lựa chọn gói dịch vụ phù hợp nhất với nhu cầu giải trí của bạn</p>
        </div>
        <ComparisonTable />
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <Benefits />
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="p-12 rounded-[2rem] bg-gradient-to-br from-red-600/20 to-neutral-800 border border-neutral-700 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-orange-600/10 rounded-full blur-[100px]"></div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 relative z-10">
            Bạn đã sẵn sàng cho trải nghiệm mới?
          </h2>
          <p className="text-neutral-400 mb-10 text-lg relative z-10 max-w-2xl mx-auto">
            Tham gia cộng đồng CINEMA+ VIP ngay hôm nay để nhận ưu đãi dùng thử 7 ngày hoàn toàn miễn phí.
          </p>
          <div className="flex justify-center relative z-10">
            <button className="bg-white text-black font-bold py-5 px-12 rounded-2xl hover:bg-neutral-200 transition-colors">
              Dùng thử miễn phí
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
