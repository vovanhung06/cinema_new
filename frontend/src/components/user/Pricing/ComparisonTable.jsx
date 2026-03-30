import { CheckCircle2, XCircle } from 'lucide-react';

export default function ComparisonTable() {
  const features = [
    { name: 'Kho phim miễn phí', free: true, vip: true },
    { name: 'Quảng cáo khi xem', free: 'Có quảng cáo', vip: 'Không quảng cáo', highlight: true },
    { name: 'Độ phân giải tối đa', free: '720p HD', vip: '4K Ultra HD', highlight: true },
    { name: 'Phim độc quyền Cinema+', free: false, vip: true },
    { name: 'Số thiết bị xem cùng lúc', free: '1 thiết bị', vip: 'Tối đa 4 thiết bị', highlight: true },
    { name: 'Tải phim xem Offline', free: false, vip: true },
  ];

  return (
    <div className="overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-neutral-800/50">
            <th className="p-6 text-left text-neutral-400 font-medium">Tính năng</th>
            <th className="p-6 text-center font-bold text-neutral-100">Gói Miễn phí</th>
            <th className="p-6 text-center font-bold text-red-500">Gói VIP</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {features.map((feature, index) => (
            <tr key={index}>
              <td className="p-6 text-neutral-400">{feature.name}</td>
              <td className="p-6 text-center">
                {typeof feature.free === 'boolean' ? (
                  feature.free ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto fill-green-500/10" />
                  ) : (
                    <XCircle className="w-5 h-5 text-neutral-600 mx-auto opacity-20" />
                  )
                ) : (
                  <span className="text-neutral-100">{feature.free}</span>
                )}
              </td>
              <td className="p-6 text-center">
                {typeof feature.vip === 'boolean' ? (
                  feature.vip ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto fill-green-500/10" />
                  ) : (
                    <XCircle className="w-5 h-5 text-neutral-600 mx-auto opacity-20" />
                  )
                ) : (
                  <span className={feature.highlight ? "text-red-500 font-bold" : "text-neutral-100"}>
                    {feature.vip}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
