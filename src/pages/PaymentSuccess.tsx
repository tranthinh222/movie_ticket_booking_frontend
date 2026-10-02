import React from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import bookingApi from "../services/api-booking";

interface PaymentState {
  id?: number;
  movie: { name: string; thumbnail?: string };
  cinema: { name: string };
  showtime: {
    date: string;
    startTime: string;
    auditorium?: { number?: number | string };
  };
  seats: Array<{ seatRow: string; number: number }>;
  totalPrice: number;
  paymentMethod?: string;
  qrCode?: string;
}

interface BookingDetailsResponse {
  statusCode?: number | string;
  data?: {
    id?: number;
    film?: { name?: string; thumbnail?: string };
    theater?: { name?: string };
    showtime?: {
      date?: string;
      startTime?: string;
      auditoriumNumber?: string;
    };
    seats?: Array<{ seatRow: string; number: number }>;
    total_price?: number;
    paymentMethod?: string;
    qrCode?: string;
  };
}

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [bookingData, setBookingData] = React.useState<PaymentState | null>(
    location.state as PaymentState | null,
  );
  const bookingId = searchParams.get("bookingId");

  // Initial loading should be true if we expect to fetch data
  const [loading, setLoading] = React.useState(!!bookingId && !location.state);

  React.useEffect(() => {
    const fetchBooking = async () => {
      // Fetch if we have an ID AND either no data or it's a direct link (no location.state)
      if (bookingId && !location.state) {
        setLoading(true);
        try {
          const response = (await bookingApi.getBookingById(
            parseInt(bookingId),
          )) as unknown as BookingDetailsResponse;
          const actualData = response.data;
          const statusCode = response.statusCode ?? 200;

          if (
            actualData &&
            (statusCode === 200 ||
              statusCode === 201 ||
              statusCode === "200" ||
              statusCode === "201")
          ) {
            const data = actualData;
            const mappedData: PaymentState = {
              id: data.id,
              movie: {
                name: data.film?.name ?? "Chưa cập nhật",
                thumbnail: data.film?.thumbnail,
              },
              cinema: {
                name: data.theater?.name ?? "Chưa cập nhật",
              },
              showtime: {
                startTime: data.showtime?.startTime ?? "",
                date: data.showtime?.date ?? "",
                auditorium: {
                  number: data.showtime?.auditoriumNumber,
                },
              },
              seats: data.seats ?? [],
              totalPrice: data.total_price ?? 0,
              paymentMethod: data.paymentMethod,
              qrCode: data.qrCode,
            };
            setBookingData(mappedData);
          }
        } catch (error) {
          console.error("Error fetching booking details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBooking();
  }, [bookingId, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a0b0d] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-[#c9929b] font-medium">Đang tải thông tin vé...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-[#221013] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">
          Không tìm thấy thông tin thanh toán
        </h1>
        <Link to="/" className="text-primary hover:underline">
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  const { movie, cinema, showtime, seats } = bookingData;
  const apiQrCode = bookingData.qrCode;

  return (
    <div className="min-h-screen bg-[#1a0b0d] text-white flex items-center justify-center p-4 md:p-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Column: Success Message */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
          <div className="size-16 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-4xl text-green-500 font-bold">
              check
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Thanh toán thành công!
            </h1>
            <p className="text-[#c9929b] text-lg max-w-md leading-relaxed">
              Vé của bạn đã được xác nhận. Vui lòng lưu lại mã QR hoặc kiểm tra
              email xác nhận. Chúc bạn có những giây phút xem phim tuyệt vời!
            </p>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 text-[#c9929b] hover:text-white transition-colors mt-6 font-medium"
          >
            <span className="material-symbols-outlined text-lg">
              arrow_back
            </span>
            Quay về trang chủ
          </Link>
        </div>

        {/* Right Column: Ticket Card */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-[400px] aspect-[1/1.5] rounded-3xl overflow-hidden border border-primary/30 shadow-[0_0_50px_rgba(236,19,55,0.15)] group">
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-10" />

            {/* Red Glow Border Effect */}
            <div className="absolute inset-0 border-[1px] border-primary/20 rounded-3xl animate-pulse" />

            {/* Background Poster */}
            <div className="absolute inset-0">
              <img
                src={movie.thumbnail}
                alt={movie.name}
                className="w-full h-full object-cover grayscale-[0.3] brightness-[0.4]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b0d] via-[#1a0b0d]/80 to-transparent" />
            </div>

            {/* Ticket Content */}
            <div className="relative z-20 h-full flex flex-col p-8">
              {/* Header */}
              <div className="flex flex-col gap-2 mb-8">
                <span className="inline-block px-3 py-1 bg-primary text-[10px] font-black uppercase tracking-widest rounded w-fit">
                  IMAX 2D
                </span>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                  {movie.name}
                </h2>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-8 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-[#c9929b] text-[10px] font-bold uppercase tracking-wider">
                    Thời gian
                  </span>
                  <p className="font-black text-white">
                    {showtime?.startTime?.slice(0, 5) || "--:--"}
                    <span className="text-white/60 font-normal ml-2">
                      {showtime?.date
                        ? new Date(showtime.date).toLocaleDateString("vi-VN")
                        : ""}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-[#c9929b] text-[10px] font-bold uppercase tracking-wider">
                    Rạp chiếu
                  </span>
                  <p className="font-black text-white">
                    {cinema?.name || "Chưa cập nhật"}
                  </p>
                  <p className="text-[#c9929b] text-[10px]">
                    {showtime?.auditorium?.number
                      ? `Phòng ${showtime.auditorium.number}`
                      : ""}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[#c9929b] text-[10px] font-bold uppercase tracking-wider">
                    Ghế ngồi
                  </span>
                  <p className="font-black text-primary uppercase">
                    {seats?.length > 0
                      ? seats.map((s) => `${s.seatRow}${s.number}`).join(", ")
                      : "Chưa cập nhật"}
                  </p>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-[#c9929b] text-[10px] font-bold uppercase tracking-wider">
                    Phòng
                  </span>
                  <p className="font-black text-white">
                    {showtime?.auditorium?.number
                      ? String(showtime.auditorium.number).padStart(2, "0")
                      : "--"}
                  </p>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="mt-auto flex flex-col items-center gap-4">
                <div className="bg-white p-4 rounded-2xl w-full flex items-center justify-center min-h-[220px]">
                  {bookingData.paymentMethod === "CASH" ? (
                    <div className="flex flex-col items-center gap-4 text-[#1a0b0d] p-4 text-center">
                      <span className="material-symbols-outlined text-6xl text-primary animate-bounce">
                        payments
                      </span>
                      <div>
                        <p className="font-black text-lg uppercase tracking-tight">
                          Thanh toán tại quầy
                        </p>
                        <p className="text-sm font-medium opacity-70 mt-1">
                          Vui lòng thanh toán tiền mặt để nhận mã QR vào rạp
                        </p>
                      </div>
                    </div>
                  ) : apiQrCode ? (
                    <img
                      src={`data:image/png;base64,${apiQrCode}`}
                      alt="QR Code"
                      className="size-48 md:size-56 object-contain"
                    />
                  ) : (
                    <div className="text-center text-sm font-semibold text-gray-700">
                      Mã QR chưa được phát hành. Vui lòng kiểm tra lại trong
                      lịch sử đặt vé.
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-[#c9929b] text-center max-w-[200px] leading-relaxed">
                  {bookingData.paymentMethod === "CASH"
                    ? "Nhận mã QR chính thức sau khi hoàn tất thanh toán tại quầy lễ tân."
                    : "Quét mã này tại quầy soát vé để vào rạp."}
                </p>
              </div>

              {/* Bottom Decoration */}
              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center opacity-50">
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  CineMovie Ticket
                </span>
                <span className="text-[10px] font-mono">
                  #TRX-
                  {bookingId || bookingData.id || "Chưa có"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
