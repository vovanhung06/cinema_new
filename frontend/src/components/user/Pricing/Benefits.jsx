import { Ban, Zap, Star } from 'lucide-react';

export default function Benefits() {
  const benefits = [
    {
      title: 'Không quảng cáo',
      description: 'Tận hưởng trọn vẹn từng khoảnh khắc cảm xúc mà không bị ngắt quãng bởi bất kỳ nội dung quảng cáo nào.',
      icon: Ban,
      color: 'text-red-500',
      bg: 'bg-red-500/10'
    },
    {
      title: 'Chất lượng 4K',
      description: 'Hình ảnh sắc nét đến từng chi tiết với độ phân giải 4K Ultra HD kết hợp cùng công nghệ âm thanh vòm sống động.',
      icon: Zap,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
    {
      title: 'Xem phim độc quyền',
      description: 'Truy cập kho phim Original đặc sắc và các bộ phim bom tấn mới nhất chỉ dành riêng cho hội viên VIP.',
      icon: Star,
      color: 'text-red-500',
      bg: 'bg-red-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {benefits.map((benefit, index) => (
        <div key={index} className="p-8 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-red-500/30 transition-all group">
          <div className={`w-14 h-14 rounded-2xl ${benefit.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
            <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
          <p className="text-neutral-400 leading-relaxed">{benefit.description}</p>
        </div>
      ))}
    </div>
  );
}
