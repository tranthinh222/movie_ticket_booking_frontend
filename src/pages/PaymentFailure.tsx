import React from "react";
import { useLocation, useNavigate } from "react-router";

interface PaymentState {
  movie: IFilm;
  cinema: ITheater;
  showtime: IShowtime;
  seats: IShowtimeSeat[];
  totalPrice: number;
}

const PaymentFailure: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as PaymentState | null;

  const handleRetry = () => {
    if (state) {
      navigate("/payment", { state });
    } else {
      navigate("/booking");
    }
  };

  const handleChangeMethod = () => {
    if (state) {
      navigate("/payment", { state });
    } else {
      navigate("/booking");
    }
  };

  return (
    <div className="min-h-screen bg-[#1a0b0d] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      {/* Failure Card */}
      <div className="relative z-10 w-full max-w-md bg-[#221114] rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
        {/* Top red accent bar */}
        <div className="h-1.5 w-full bg-primary" />

        <div className="p-8 md:p-10 flex flex-col items-center">
          {/* Failure Icon */}
          <div className="size-20 rounded-full bg-red-500/10 flex items-center justify-center mb-8">
            <div className="size-14 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-primary font-bold">
                close
              </span>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-3 mb-10">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Thanh toán không thành công
            </h1>
            <p className="text-[#c9929b] text-sm md:text-base leading-relaxed">
              Rất tiếc, giao dịch của bạn không thể thực hiện được. Vui lòng
              kiểm tra lại thông tin thẻ hoặc số dư tài khoản.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-3">
            <button
              onClick={handleRetry}
              className="h-14 w-full rounded-xl bg-primary text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined">restart_alt</span>
              Thử lại ngay
            </button>
            <button
              onClick={handleChangeMethod}
              className="h-14 w-full rounded-xl bg-[#1a0b0d] text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-black/40 transition-all border border-white/10"
            >
              <span className="material-symbols-outlined text-xl">
                credit_card
              </span>
              Đổi phương thức thanh toán
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-10 pt-8 border-t border-white/5 w-full flex flex-col items-center gap-4">
            <div className="px-4 py-2 bg-black/40 rounded-lg border border-white/5">
              <p className="text-[10px] font-mono text-[#c9929b] uppercase tracking-widest">
                Mã lỗi: ERR-204 | TXN-
                {Math.floor(100000 + Math.random() * 900000)}
              </p>
            </div>

            <button className="flex items-center gap-2 text-xs text-[#c9929b] hover:text-white transition-colors">
              <span className="material-symbols-outlined text-base">
                headset_mic
              </span>
              Cần giúp đỡ? Liên hệ bộ phận CSKH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
