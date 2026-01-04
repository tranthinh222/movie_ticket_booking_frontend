import { useState, useEffect } from "react";
import { useAuth } from "../store/useAuth";
import { Modal } from "antd";
import bookingApi from "../services/api-booking";
import AccountLayout from "../components/layout/AccountLayout";

// Define ticket status types
type TicketStatus = "upcoming" | "completed" | "cancelled";

// Define ticket interface
interface ITicket {
  id: string;
  movieName: string;
  posterUrl: string;
  theater: string;
  auditorium: string;
  date: string;
  time: string;
  seats: string[];
  bookingCode: string;
  totalPrice: number;
  status: TicketStatus;
  qrCode?: string;
}

const BookingHistory: React.FC = () => {
  const { user, authenticated } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQr, setSelectedQr] = useState<string | null>(null);

  // Fetch tickets from API
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return;
      try {
        const size = 5;
        const res = await bookingApi.getUserBooking(user.id, currentPage, size);

        // Handle paginated response structure
        const responseData = (res as any).data || res;
        const data = responseData.data || [];
        const meta = responseData.meta || {};

        if (meta.totalPages) {
          setTotalPages(meta.totalPages);
        }

        const mapped: ITicket[] = data.map((b: any) => {
          let status: TicketStatus = "completed";

          if (b.status === "CANCELLED") {
            status = "cancelled";
          } else {
            // Determine status based on showtime date and time
            const showDate = b.showtime?.date; // Expecting YYYY-MM-DD
            const startTime = b.showtime?.startTime; // Expecting HH:mm:ss or HH:mm

            if (showDate && startTime) {
              const showtimeDateTime = new Date(`${showDate}T${startTime}`);
              const now = new Date();

              if (showtimeDateTime > now) {
                status = "upcoming";
              } else {
                status = "completed";
              }
            } else if (b.status === "PENDING") {
              status = "upcoming";
            }
          }

          return {
            id: String(b.id),
            movieName: b.film?.name || b.showtime?.film?.name || "N/A",
            posterUrl: b.film?.thumbnail || b.showtime?.film?.thumbnail || "",
            theater: b.theater?.name || b.showtime?.theater?.name || "N/A",
            auditorium: b.showtime?.auditoriumName || "Rạp",
            date: b.showtime?.date || b.createdAt?.split(" ")[0] || "",
            time: b.showtime?.startTime?.slice(0, 5) || "",
            seats:
              b.seats?.map((s: any) => `${s.seatRow || ""}${s.number}`) || [],
            bookingCode: b.paymentId || `#BK${b.id}`,
            totalPrice: b.total_price || 0,
            status: status,
            qrCode: b.qrCode || b.qr_code || null,
          };
        });

        setTickets(mapped);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    if (authenticated && user?.id) {
      fetchBookings();
    }
  }, [authenticated, user?.id, currentPage]);

  // Format price to Vietnamese currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  // Get status badge
  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "upcoming":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Sắp chiếu
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-900/30 text-green-400 text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">
              check_circle
            </span>
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">cancel</span>
            Đã hủy
          </span>
        );
    }
  };

  return (
    <AccountLayout
      title="Lịch sử đặt vé"
      subtitle="Quản lý và xem lại danh sách vé xem phim của bạn."
    >
      <div className="flex flex-col gap-8">
        {/* Ticket List */}
        <div className="flex flex-col gap-4">
          {tickets.length === 0 ? (
            <div className="bg-[#2a1519] border border-[#482329] rounded-xl p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-[#c9929b] mb-4 block">
                confirmation_number
              </span>
              <h3 className="text-white text-lg font-bold mb-2">
                Không tìm thấy vé nào
              </h3>
              <p className="text-[#c9929b] text-sm">
                Bạn chưa có giao dịch đặt vé nào trong khoảng thời gian này.
              </p>
            </div>
          ) : (
            tickets.map((ticket: ITicket) => (
              <div
                key={ticket.id}
                className={`group bg-[#2a1519] border border-[#482329] rounded-xl p-4 flex flex-col md:flex-row gap-5 transition-all shadow-sm hover:shadow-md ${
                  ticket.status === "upcoming"
                    ? "hover:border-primary/50"
                    : ticket.status === "cancelled"
                      ? "opacity-75 hover:opacity-100 bg-[#1a0e10]"
                      : "opacity-90 hover:opacity-100 hover:border-gray-600"
                }`}
              >
                {/* Poster */}
                <div
                  className={`shrink-0 w-full md:w-[100px] aspect-[2/3] rounded-lg bg-cover bg-center shadow-inner relative overflow-hidden ${
                    ticket.status === "cancelled"
                      ? "grayscale"
                      : ticket.status === "completed"
                        ? "grayscale group-hover:grayscale-0 transition-all duration-300"
                        : ""
                  }`}
                  style={{ backgroundImage: `url("${ticket.posterUrl}")` }}
                >
                  {ticket.status === "upcoming" && (
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col justify-between py-1">
                  <div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <h3
                        className={`text-xl font-bold transition-colors ${
                          ticket.status === "cancelled"
                            ? "text-slate-400 line-through decoration-2"
                            : ticket.status === "upcoming"
                              ? "text-white group-hover:text-primary"
                              : "text-white"
                        }`}
                      >
                        {ticket.movieName}
                      </h3>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(ticket.status)}
                        {ticket.qrCode && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider">
                            <span className="material-symbols-outlined text-xs">
                              payments
                            </span>
                            Đã thanh toán
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className={`grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm mt-3 ${
                        ticket.status === "cancelled"
                          ? "text-slate-500"
                          : "text-[#c9929b]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">
                          location_on
                        </span>
                        <span>
                          {ticket.theater} -{" "}
                          {ticket.status !== "cancelled" && (
                            <span className="text-white font-medium">
                              {ticket.auditorium}
                            </span>
                          )}
                          {ticket.status === "cancelled" && ticket.auditorium}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">
                          schedule
                        </span>
                        <span>
                          {ticket.time} -{" "}
                          {ticket.status !== "cancelled" && (
                            <span className="text-white font-medium">
                              {ticket.date}
                            </span>
                          )}
                          {ticket.status === "cancelled" && ticket.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">
                          event_seat
                        </span>
                        <span>
                          Ghế:{" "}
                          {ticket.status !== "cancelled" && (
                            <span className="text-white font-bold">
                              {ticket.seats.join(", ")}
                            </span>
                          )}
                          {ticket.status === "cancelled" &&
                            ticket.seats.join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">
                          receipt_long
                        </span>
                        <span>
                          Mã vé:{" "}
                          {ticket.status !== "cancelled" && (
                            <span className="text-white font-mono">
                              {ticket.bookingCode}
                            </span>
                          )}
                          {ticket.status === "cancelled" && ticket.bookingCode}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end justify-between mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-[#482329]">
                    <div className="flex flex-col">
                      <span
                        className={`text-xs ${
                          ticket.status === "cancelled"
                            ? "text-slate-500"
                            : "text-[#c9929b]"
                        }`}
                      >
                        {ticket.status === "cancelled"
                          ? "Hoàn tiền"
                          : "Tổng tiền"}
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          ticket.status === "upcoming"
                            ? "text-primary"
                            : ticket.status === "cancelled"
                              ? "text-slate-500 line-through"
                              : "text-slate-300"
                        }`}
                      >
                        {formatPrice(ticket.totalPrice)}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      {ticket.qrCode && ticket.status !== "cancelled" && (
                        <button
                          onClick={() => {
                            setSelectedQr(ticket.qrCode || null);
                            setIsModalOpen(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#482329] text-white hover:bg-white/5 text-sm font-medium transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">
                            qr_code_2
                          </span>
                          Mã QR
                        </button>
                      )}
                      {ticket.status === "cancelled" && (
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white text-sm font-medium transition-colors">
                          Xem chi tiết
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {tickets.length > 0 && (
          <div className="flex justify-center py-6">
            <nav className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((p: number) => Math.max(1, p - 1))
                }
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#482329] text-[#c9929b] hover:bg-[#2a1519] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-colors ${
                      currentPage === page
                        ? "bg-primary text-white shadow-md"
                        : "border border-[#482329] text-[#c9929b] hover:bg-[#2a1519]"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p: number) => Math.min(totalPages, p + 1))
                }
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#482329] text-[#c9929b] hover:bg-[#2a1519] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      <Modal
        title={<span className="text-white font-bold">Mã vé của bạn</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        styles={{
          body: { backgroundColor: "#1a0e10", padding: "20px" },
          mask: { backdropFilter: "blur(4px)" },
          header: {
            backgroundColor: "#2a1519",
            borderBottom: "1px solid #482329",
            padding: "16px 24px",
          },
        }}
        closeIcon={
          <span className="material-symbols-outlined text-white">close</span>
        }
      >
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="bg-white p-6 rounded-3xl shadow-2xl">
            {selectedQr ? (
              <img
                src={`data:image/png;base64,${selectedQr}`}
                alt="Booking QR Code"
                className="size-64 object-contain shadow-inner"
              />
            ) : (
              <div className="size-64 flex flex-col items-center justify-center text-gray-400 gap-3 border-2 border-dashed border-gray-200 rounded-xl">
                <span className="material-symbols-outlined text-5xl">
                  qr_code_scanner
                </span>
                <p className="text-sm font-medium">Chưa có mã QR</p>
              </div>
            )}
          </div>
          <div className="text-center space-y-2">
            <p className="text-[#c9929b] font-medium leading-relaxed max-w-[280px]">
              Vui lòng xuất trình mã này tại quầy soát vé để vào rạp xem phim.
            </p>
            <p className="text-xs text-slate-500 italic">
              Lưu ý: Không chia sẻ mã này với bất kỳ ai.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="mt-4 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-primary/20 w-full"
          >
            Đóng
          </button>
        </div>
      </Modal>
    </AccountLayout>
  );
};

export default BookingHistory;
