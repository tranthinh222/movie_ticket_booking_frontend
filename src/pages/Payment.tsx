import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import seatApi from "../services/api-seat";
import bookingApi from "../services/api-booking";
import { message } from "antd";

interface PaymentState {
  movie: IFilm;
  cinema: ITheater;
  showtime: IShowtime;
  seats: IShowtimeSeat[];
  totalPrice: number;
  holdTime: number;
}

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as PaymentState | null;

  // Timer state - 5 minutes countdown
  const [timeRemaining, setTimeRemaining] = useState(state?.holdTime || 300);
  const [isReleasingSeats, setIsReleasingSeats] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("CASH");
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if no state
  useEffect(() => {
    if (!state) {
      navigate("/booking");
    }
  }, [state, navigate]);

  // Timer countdown
  useEffect(() => {
    if (!state || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up - release seats and redirect
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state, timeRemaining]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle timeout - release seats
  const handleTimeOut = async () => {
    try {
      await seatApi.removeHoldSeat();
    } catch (error) {
      console.error("Error releasing seats on timeout:", error);
    }
    alert("Hết thời gian giữ ghế! Vui lòng đặt vé lại.");
    navigate("/booking");
  };

  // Handle back button - release seats and go back
  const handleBack = async () => {
    setIsReleasingSeats(true);
    try {
      await seatApi.removeHoldSeat();
    } catch (error) {
      console.error("Error releasing seats:", error);
    } finally {
      setIsReleasingSeats(false);
      navigate("/booking");
    }
  };

  // Handle cancel
  const handleCancel = async () => {
    if (
      confirm("Bạn có chắc muốn hủy đặt vé? Ghế đã chọn sẽ được giải phóng.")
    ) {
      await handleBack();
    }
  };

  // Handle Payment
  const handlePayment = async () => {
    if (!state) return;

    setIsProcessing(true);
    try {
      const response = await bookingApi.createBooking(selectedPaymentMethod);

      if (selectedPaymentMethod === "CASH") {
        message.success("Đặt vé thành công! Vui lòng thanh toán tại quầy.");
        navigate("/payment-success", {
          state: { ...state, paymentMethod: selectedPaymentMethod },
        });
      } else {
        // For VNPAY and MOMO, redirect to payment URL
        const paymentUrl =
          response.data?.paymentUrl || response.data?.data?.paymentUrl;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          message.error("Không tìm thấy link thanh toán. Vui lòng thử lại.");
        }
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      message.error(
        error.response?.data?.message ||
          "Đã có lỗi xảy ra khi thực hiện thanh toán."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!state) {
    return null;
  }

  const { movie, cinema, showtime, seats, totalPrice } = state;

  return (
    <div className="min-h-screen flex flex-col bg-[#221013] text-white">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#67323b] px-6 py-4 lg:px-10">
        <Link to="/" className="flex items-center gap-4">
          <div className="size-8 text-primary">
            <svg
              viewBox="0 0 48 48"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
              />
            </svg>
          </div>
          <h2 className="text-white text-xl font-bold leading-tight tracking-tight">
            CineMovie
          </h2>
        </Link>

        <div className="flex items-center gap-6">
          {/* Timer */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              timeRemaining <= 60
                ? "bg-red-500/20 border-red-500 text-red-400"
                : "bg-primary/10 border-primary/20 text-primary"
            }`}
          >
            <span className="material-symbols-outlined">timer</span>
            <span className="font-bold">{formatTime(timeRemaining)}</span>
          </div>

          {/* Steps */}
          <div className="hidden md:flex items-center gap-2 text-sm font-medium text-[#c9929b]">
            <span className="text-primary">1. Chọn ghế</span>
            <span className="material-symbols-outlined text-base">
              chevron_right
            </span>
            <span className="text-white">2. Thanh toán</span>
            <span className="material-symbols-outlined text-base">
              chevron_right
            </span>
            <span>3. Hoàn tất</span>
          </div>

          {/* Back Button */}
          <button
            onClick={handleBack}
            disabled={isReleasingSeats}
            className="flex items-center gap-2 text-sm font-medium text-[#c9929b] hover:text-white transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-lg">
              arrow_back
            </span>
            <span>{isReleasingSeats ? "Đang xử lý..." : "Quay lại"}</span>
          </button>

          <div className="flex items-center justify-center size-8 rounded-full bg-[#33191e]/50 text-white">
            <span className="material-symbols-outlined text-lg">lock</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 lg:px-10 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left Column: Payment Form */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Heading */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white">
                Thông tin thanh toán
              </h1>
              <p className="text-[#c9929b] text-base">
                Vui lòng kiểm tra kỹ thông tin trước khi xác nhận.
              </p>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="flex items-center justify-center size-6 rounded-full bg-primary text-white text-xs font-bold">
                  1
                </span>
                Phương thức thanh toán
              </h3>
              <div className="flex flex-col gap-3">
                {/* CASH Option */}
                <label className="group relative flex items-center gap-4 rounded-xl border border-[#67323b] bg-[#33191e] p-4 cursor-pointer hover:border-primary/50 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                  <input
                    checked={selectedPaymentMethod === "CASH"}
                    onChange={() => setSelectedPaymentMethod("CASH")}
                    className="h-5 w-5 border-slate-600 text-primary focus:ring-primary bg-transparent"
                    name="payment_method"
                    type="radio"
                  />
                  <div className="flex items-center justify-center size-12 rounded-lg bg-white p-1 border border-slate-100">
                    <span className="material-symbols-outlined text-3xl text-gray-700">
                      payments
                    </span>
                  </div>
                  <div className="flex grow flex-col">
                    <p className="text-white font-bold leading-normal">
                      Thanh toán tại quầy (Tiền mặt)
                    </p>
                    <p className="text-[#c9929b] text-sm font-normal leading-normal">
                      Vui lòng thanh toán tại quầy trước khi suất chiếu bắt đầu
                    </p>
                  </div>
                </label>

                {/* VNPay Option */}
                <label className="group relative flex items-center gap-4 rounded-xl border border-[#67323b] bg-[#33191e] p-4 cursor-pointer hover:border-primary/50 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                  <input
                    checked={selectedPaymentMethod === "VNPAY"}
                    onChange={() => setSelectedPaymentMethod("VNPAY")}
                    className="h-5 w-5 border-slate-600 text-primary focus:ring-primary bg-transparent"
                    name="payment_method"
                    type="radio"
                  />
                  <div className="flex items-center justify-center size-12 rounded-lg bg-white p-1 border border-slate-100">
                    <img
                      alt="VNPay Logo"
                      className="w-full h-auto object-contain"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJF52FG9-X2BPBTTT8w20Jhh2XFPI1JwZUA7lpbKoVjd7Q425nxO98d18vWVU1sisMudkWBUV4ii-Yt4ZuSept2LCyxNSYc5P7k7lAFfU3rD0l_sSozzDa93Jr90Lws6-HZl0f9GmxZUwWe-nC4yEx_T38IGk3X1qlaXHP4ZNedV69aORg21BikgqPYxPYEyClC0K9KYMbFUh0SlJ3pkqI-a0GVloVlRDj7blbI-R_pCHTdhkYgdE77TLGqvQhXQlSwvSfyug1ZgA"
                    />
                  </div>
                  <div className="flex grow flex-col">
                    <div className="flex justify-between items-center w-full">
                      <p className="text-white font-bold leading-normal">
                        VNPay QR / Ngân hàng
                      </p>
                      <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">
                        Miễn phí
                      </span>
                    </div>
                    <p className="text-[#c9929b] text-sm font-normal leading-normal">
                      Quét mã qua ứng dụng ngân hàng hoặc ví VNPay
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-[#c9929b]">
              <span className="material-symbols-outlined text-lg text-green-500">
                lock
              </span>
              <span>
                Thông tin thanh toán của bạn được mã hóa và bảo mật tuyệt đối.
              </span>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-6 rounded-2xl border border-[#67323b] bg-[#33191e] overflow-hidden shadow-xl">
              {/* Movie Info */}
              <div className="relative h-48 w-full overflow-hidden bg-gradient-to-tr from-gray-900 via-[#3a1c21] to-black">
                <div className="absolute inset-0 flex items-center justify-center text-white/10">
                  <span className="material-symbols-outlined !text-8xl">
                    movie
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent">
                  <h4 className="text-white text-lg font-bold line-clamp-1">
                    {movie?.name || "N/A"}
                  </h4>
                  <p className="text-white/80 text-sm">
                    {movie?.language} • {movie?.genre}
                  </p>
                </div>
              </div>

              {/* Booking Details */}
              <div className="p-6 flex flex-col gap-4">
                {/* Cinema & Showtime */}
                <div className="pb-4 border-b border-slate-800">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">
                      location_on
                    </span>
                    <div>
                      <p className="text-white text-sm font-bold">
                        {cinema?.name || "N/A"}
                      </p>
                      <p className="text-[#c9929b] text-xs">
                        Phòng {showtime?.auditorium?.number || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">
                      calendar_today
                    </span>
                    <div>
                      <p className="text-white text-sm font-bold">
                        {showtime?.date
                          ? new Date(showtime.date).toLocaleDateString(
                              "vi-VN",
                              {
                                weekday: "long",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </p>
                      <p className="text-[#c9929b] text-xs">
                        Suất: {showtime?.startTime?.slice(0, 5) || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Seats */}
                <div className="flex justify-between items-start pb-4 border-b border-slate-800">
                  <div>
                    <p className="text-[#c9929b] text-xs mb-1">Ghế đã chọn:</p>
                    <div className="flex gap-1 flex-wrap">
                      {seats?.map((seat) => (
                        <span
                          key={seat.seatId}
                          className="text-white text-sm font-bold bg-gray-800 px-2 py-0.5 rounded border border-gray-700"
                        >
                          {seat.seatRow}
                          {seat.number}
                        </span>
                      )) || "N/A"}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#c9929b] text-xs mb-1">Số lượng:</p>
                    <p className="text-white text-sm font-medium">
                      {seats?.length || 0} vé
                    </p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                  <span className="text-[#c9929b] text-sm">
                    Đơn giá (Phim + Ghế)
                  </span>
                  <span className="text-white font-medium">
                    {movie?.price && seats?.[0]
                      ? `${(movie.price + (seats[0].totalPrice || 0)).toLocaleString()}đ`
                      : `${movie?.price?.toLocaleString() || 0}đ`}
                  </span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-end pt-2">
                  <span className="text-white text-lg font-bold">
                    Tổng thanh toán
                  </span>
                  <span className="text-primary text-2xl font-black tracking-tight">
                    {totalPrice?.toLocaleString() || 0}đ
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 flex flex-col gap-3">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex w-full items-center justify-center rounded-lg bg-primary py-4 text-white font-bold text-base hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing
                    ? "Đang xử lý..."
                    : `Thanh toán ${totalPrice?.toLocaleString() || 0}đ`}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex w-full items-center justify-center rounded-lg bg-white/5 py-3 text-[#c9929b] font-medium text-sm hover:bg-white/10 transition-colors"
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Simple */}
      <footer className="mt-auto border-t border-[#67323b] py-8 px-6 bg-[#33191e]">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#c9929b] text-sm">
            © 2024 CineMovie. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/terms"
              className="text-[#c9929b] hover:text-primary text-sm"
            >
              Điều khoản sử dụng
            </Link>
            <Link
              to="/privacy"
              className="text-[#c9929b] hover:text-primary text-sm"
            >
              Chính sách bảo mật
            </Link>
            <Link
              to="/support"
              className="text-[#c9929b] hover:text-primary text-sm"
            >
              Hỗ trợ
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Payment;
