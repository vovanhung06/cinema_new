import { Check, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function PricingCard({ 
  title, 
  price, 
  period, 
  description, 
  features, 
  isFeatured, 
  badge, 
  subPrice 
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/checkout', {
      state: {
        plan: {
          name: title,
          price: price,
          period: period
        }
      }
    });
  };

  return (
    <div className={cn(
      "p-8 rounded-xl flex flex-col h-full transition-all duration-300",
      isFeatured 
        ? "relative bg-neutral-800 border-2 border-red-600 shadow-[0_0_50px_rgba(229,9,20,0.15)] transform scale-105 z-10" 
        : "bg-neutral-900 border border-neutral-800 hover:border-red-600/20"
    )}>
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
          {badge}
        </div>
      )}
      
      <h4 className="font-bold text-xl mb-2 text-white">{title}</h4>
      <p className="text-neutral-400 text-sm mb-6">{description}</p>
      
      <div className="mb-2">
        <span className="text-4xl font-bold text-white">{price}</span>
        <span className="text-neutral-400">/{period}</span>
      </div>
      
      {subPrice && (
        <p className="text-red-500 text-xs font-bold mb-8 uppercase">
          {subPrice}
        </p>
      )}
      
      <ul className="space-y-4 mb-10 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3 text-sm">
            {isFeatured && index === 0 ? (
              <CheckCircle2 className="w-5 h-5 text-red-500" />
            ) : (
              <Check className="w-5 h-5 text-red-500" />
            )}
            <span className="text-neutral-300">{feature}</span>
          </li>
        ))}
      </ul>
      
      <button 
        onClick={handleClick}
        className={cn(
          "w-full py-4 rounded-xl font-bold transition-all",
          isFeatured 
            ? "bg-red-600 text-white hover:scale-[1.02]" 
            : "border border-red-600 text-red-600 hover:bg-red-600/5"
        )}
      >
        Đăng ký ngay
      </button>
    </div>
  );
}