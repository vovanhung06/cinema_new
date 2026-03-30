import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Wallet,
  Smartphone
} from 'lucide-react';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const plan = location.state?.plan;

  // ❌ nếu vào trực tiếp /checkout
  if (!plan) {
    return (
      <div className="text-white p-10">
        <h1>Không có gói được chọn</h1>
        <button onClick={() => navigate('/vip')} className="mt-4 bg-red-600 px-4 py-2 rounded">
          Quay lại
        </button>
      </div>
    );
  }

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      setTimeout(() => {
        navigate('/');
      }, 2000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-center">Thanh toán thành công!</h1>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 text-white">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">Thanh toán</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* LEFT */}
          <div className="space-y-6">

            {/* chọn method */}
            <div className="grid grid-cols-3 gap-4">
              <button onClick={() => setPaymentMethod('card')}>
                <CreditCard />
              </button>
              <button onClick={() => setPaymentMethod('momo')}>
                <Smartphone />
              </button>
              <button onClick={() => setPaymentMethod('vnpay')}>
                <Wallet />
              </button>
            </div>

            {/* form card */}
            {paymentMethod === 'card' && (
              <form onSubmit={handlePayment} className="space-y-4">
                <input placeholder="Tên" required className="w-full p-3 bg-neutral-800 rounded" />
                <input placeholder="Số thẻ" required className="w-full p-3 bg-neutral-800 rounded" />
                <button disabled={isProcessing} className="w-full bg-red-600 p-3 rounded">
                  {isProcessing ? 'Đang xử lý...' : `Thanh toán ${plan.price}`}
                </button>
              </form>
            )}

            {/* QR */}
            {paymentMethod !== 'card' && (
              <div className="text-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${plan.name}`}
                  alt="qr"
                  className="mx-auto"
                />
                <button onClick={handlePayment} className="mt-4 bg-red-600 p-3 rounded">
                  Tôi đã thanh toán
                </button>
              </div>
            )}

          </div>

          {/* RIGHT */}
          <div className="bg-neutral-900 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Đơn hàng</h2>
            <p>{plan.name}</p>
            <p className="text-red-500 text-2xl">{plan.price}</p>
          </div>

        </div>
      </div>
    </div>
  );
}