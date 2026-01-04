import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router";
import addressApi from "../services/api-address";
import showtimeApi from "../services/api-showtime";
import seatApi from "../services/api-seat";
import filmApi from "../services/api-film";

// Extended seat type for UI state
interface SeatWithSelection extends IShowtimeSeat {
  isSelected: boolean;
}

const Booking: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Step states
  const [currentStep, setCurrentStep] = useState(1);

  // Data states
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [theaters, setTheaters] = useState<ITheater[]>([]);
  const [showtimes, setShowtimes] = useState<IShowtime[]>([]);
  const [seats, setSeats] = useState<SeatWithSelection[]>([]);
  const [film, setFilm] = useState<IFilm | null>(null);

  // Selection states
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<ITheater | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<IShowtime | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Loading states
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [loadingTheaters, setLoadingTheaters] = useState(false);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [isHoldingSeats, setIsHoldingSeats] = useState(false);

  // Get selected seats
  const selectedSeats = seats.filter((seat) => seat.isSelected);

  // Get sample seats for price display
  const regSeat = seats.find((s) => s.seatVariantName === "REG");
  const vipSeat = seats.find((s) => s.seatVariantName === "VIP");

  // Get film info
  const filmInfo = film || selectedShowtime?.film;

  // Calculate total price based on selected seats' individual prices + movie price
  const totalPrice = selectedSeats.reduce((total, seat) => {
    const moviePrice = filmInfo?.price || 0;
    return total + (moviePrice + (seat.totalPrice || 0));
  }, 0);

  // Generate date options (today + next 6 days)
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      value: date.toISOString().split("T")[0],
      label: date.toLocaleDateString("vi-VN", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
      }),
    };
  });

  // Fetch addresses on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      setLoadingAddresses(true);
      try {
        const response = await addressApi.getAllAddresses(1, 100);
        if (response.statusCode === 200) {
          // Handle paginated response
          const data = response.data?.data || response.data || [];
          setAddresses(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoadingAddresses(false);
      }
    };
    fetchAddresses();
  }, []);

  // Fetch film details on mount
  useEffect(() => {
    const fetchFilm = async () => {
      if (!id) return;
      try {
        const response = await filmApi.getFilmById(parseInt(id));
        if (response.statusCode === 200 || response.statusCode === 201) {
          setFilm(response.data);
        }
      } catch (error) {
        console.error("Error fetching film details:", error);
      }
    };
    fetchFilm();
  }, [id]);

  // Fetch theaters when address is selected
  const fetchTheaters = useCallback(async (addressId: number) => {
    setLoadingTheaters(true);
    setTheaters([]);
    setSelectedTheater(null);
    setShowtimes([]);
    setSelectedShowtime(null);
    setSeats([]);
    setCurrentStep(2);

    try {
      const response = await addressApi.getTheaterByAddress(addressId);
      if (response.statusCode === 200) {
        const data = response.data || [];
        setTheaters(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching theaters:", error);
    } finally {
      setLoadingTheaters(false);
    }
  }, []);

  // Fetch showtimes when theater is selected - accepts theaterId as parameter
  const fetchShowtimes = useCallback(
    async (filmId: number, date: string, theaterId: number) => {
      setLoadingShowtimes(true);
      setShowtimes([]);
      setSelectedShowtime(null);
      setSeats([]);
      setCurrentStep(3);

      try {
        const response = await showtimeApi.getListShowtimeByFilmAndDate(
          date,
          filmId
        );
        if (response.statusCode === 200) {
          const data = response.data?.data || response.data || [];
          // Filter showtimes for selected theater using passed theaterId
          const filteredShowtimes = Array.isArray(data)
            ? data.filter(
                (st: IShowtime) => st.auditorium?.theater?.id === theaterId
              )
            : [];
          setShowtimes(filteredShowtimes);
        }
      } catch (error) {
        console.error("Error fetching showtimes:", error);
      } finally {
        setLoadingShowtimes(false);
      }
    },
    []
  );

  // Fetch seats when showtime is selected
  const fetchSeats = useCallback(async (showtimeId: number) => {
    setLoadingSeats(true);
    setSeats([]);
    setCurrentStep(4);

    try {
      const response = await showtimeApi.getSeatAvailable(showtimeId);
      if (response.status === 200 || response.statusCode === 200) {
        const data = response.data?.data || response.data || [];
        const seatsWithSelection: SeatWithSelection[] = (
          Array.isArray(data) ? data : []
        ).map((seat: IShowtimeSeat) => ({
          ...seat,
          isSelected: false,
        }));
        setSeats(seatsWithSelection);
      }
    } catch (error) {
      console.error("Error fetching seats:", error);
    } finally {
      setLoadingSeats(false);
    }
  }, []);

  // Handle address selection
  const handleAddressSelect = (address: IAddress) => {
    setSelectedAddress(address);
    fetchTheaters(address.id);
  };

  // Handle theater selection - automatically fetch showtimes with current date
  const handleTheaterSelect = (theater: ITheater) => {
    setSelectedTheater(theater);
    // Use id from URL or default to 1 for testing
    const filmId = id ? parseInt(id) : 1;
    // Fetch showtimes immediately with the selected theater's ID
    fetchShowtimes(filmId, selectedDate, theater.id);
  };

  // Handle date change
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    if (selectedTheater) {
      const filmId = id ? parseInt(id) : 1;
      fetchShowtimes(filmId, date, selectedTheater.id);
    }
  };

  // Handle showtime selection
  const handleShowtimeSelect = (showtime: IShowtime) => {
    setSelectedShowtime(showtime);
    fetchSeats(showtime.id);
  };

  // Handle seat click
  const handleSeatClick = (seatId: number) => {
    setSeats((prev) =>
      prev.map((seat) => {
        if (seat.seatId === seatId && seat.status === "AVAILABLE") {
          return { ...seat, isSelected: !seat.isSelected };
        }
        return seat;
      })
    );
  };

  // Handle next - hold seats and navigate to payment
  const handleNext = async () => {
    if (selectedSeats.length === 0 || !selectedShowtime) return;

    setIsHoldingSeats(true);
    try {
      // Call hold seat API
      const seatIds = selectedSeats.map((seat) => seat.seatId);
      const response = await seatApi.holdSeat(selectedShowtime.id, seatIds);

      if (response.statusCode === 200 || response.statusCode === 201) {
        // Navigate to payment page with booking info
        navigate("/payment", {
          state: {
            movie: filmInfo,
            cinema: selectedTheater,
            showtime: selectedShowtime,
            seats: selectedSeats,
            totalPrice,
            holdTime: 300, // 5 minutes in seconds
          },
        });
      } else {
        alert("Không thể giữ ghế. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error holding seats:", error);
      alert("Đã xảy ra lỗi khi giữ ghế. Vui lòng thử lại.");
    } finally {
      setIsHoldingSeats(false);
    }
  };

  // Group seats by row
  const seatsByRow = seats.reduce(
    (acc, seat) => {
      if (!acc[seat.seatRow]) acc[seat.seatRow] = [];
      acc[seat.seatRow].push(seat);
      return acc;
    },
    {} as Record<string, SeatWithSelection[]>
  );

  const rows = Object.keys(seatsByRow).sort();

  // Render seat button
  const renderSeat = (seat: SeatWithSelection) => {
    const baseClasses =
      "size-8 md:size-9 rounded-t-lg rounded-b-md transition-all focus:outline-none flex items-center justify-center text-xs font-bold";

    if (seat.status === "BOOKED" || seat.status === "HOLD") {
      return (
        <button
          key={seat.seatId}
          disabled
          className={`${baseClasses} bg-gray-800/40 cursor-not-allowed border border-transparent opacity-50 text-white/20`}
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      );
    }

    if (seat.isSelected) {
      return (
        <button
          key={seat.seatId}
          onClick={() => handleSeatClick(seat.seatId)}
          className={`${baseClasses} bg-primary border-2 border-primary text-white shadow-[0_0_15px_rgba(236,19,55,0.6)] scale-110 relative z-10`}
        >
          {seat.seatRow}
          {seat.number}
        </button>
      );
    }

    if (seat.seatVariantName === "VIP") {
      return (
        <button
          key={seat.seatId}
          onClick={() => handleSeatClick(seat.seatId)}
          className={`${baseClasses} border-2 border-[#d4af37] bg-[#3a3020] hover:bg-primary hover:border-primary hover:scale-105`}
        />
      );
    }

    return (
      <button
        key={seat.seatId}
        onClick={() => handleSeatClick(seat.seatId)}
        className={`${baseClasses} bg-gray-700 hover:bg-primary hover:scale-105`}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-[#221013]">
      {/* Breadcrumbs */}
      <div className="w-full bg-[#221114]/50 border-b border-[#482329]/50">
        <div className="container mx-auto px-4 lg:px-6 py-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link
              className="text-[#c9929b] hover:text-primary transition-colors"
              to="/"
            >
              Trang chủ
            </Link>
            <span className="text-[#c9929b]">/</span>
            <Link
              className="text-[#c9929b] hover:text-primary transition-colors"
              to="/movie"
            >
              Đặt vé
            </Link>
            <span className="text-[#c9929b]">/</span>
            <span className="text-white font-medium">
              {filmInfo?.name || "Chọn phim"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-2">
              Đặt vé{filmInfo ? `: ${filmInfo.name}` : ""}
            </h1>
            {filmInfo && (
              <p className="text-[#c9929b] text-base">
                {filmInfo.language} • {filmInfo.duration} phút •{" "}
                {filmInfo.genre}
              </p>
            )}
          </div>
        </div>

        {/* Step Progress */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { step: 1, label: "Chọn khu vực" },
            { step: 2, label: "Chọn rạp" },
            { step: 3, label: "Chọn suất chiếu" },
            { step: 4, label: "Chọn ghế" },
          ].map(({ step, label }) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`size-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  currentStep >= step
                    ? "bg-primary text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {step}
              </div>
              <span
                className={`text-sm font-medium whitespace-nowrap ${
                  currentStep >= step ? "text-white" : "text-gray-500"
                }`}
              >
                {label}
              </span>
              {step < 4 && (
                <div
                  className={`w-8 h-0.5 ${
                    currentStep > step ? "bg-primary" : "bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Selection Steps */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Step 1: Address Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="size-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                  1
                </span>
                Khu vực
              </label>
              {loadingAddresses ? (
                <div className="h-12 rounded-lg bg-[#33191e] flex items-center justify-center">
                  <span className="text-[#c9929b] text-sm">Đang tải...</span>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={selectedAddress?.id || ""}
                    onChange={(e) => {
                      const addr = addresses.find(
                        (a) => a.id === parseInt(e.target.value)
                      );
                      if (addr) handleAddressSelect(addr);
                    }}
                    className="w-full h-12 rounded-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-[#67323b] bg-[#33191e] px-4 appearance-none cursor-pointer"
                  >
                    <option value="">Chọn khu vực</option>
                    {addresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.city} - {address.street_name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c9929b] pointer-events-none">
                    <span className="material-symbols-outlined">
                      expand_more
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Theater Selection */}
            {currentStep >= 2 && (
              <div className="flex flex-col gap-2">
                <label className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="size-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                    2
                  </span>
                  Chọn Rạp
                </label>
                {loadingTheaters ? (
                  <div className="h-24 rounded-lg bg-[#33191e] flex items-center justify-center">
                    <span className="text-[#c9929b] text-sm">
                      Đang tải rạp...
                    </span>
                  </div>
                ) : theaters.length === 0 ? (
                  <div className="h-24 rounded-lg bg-[#33191e] flex items-center justify-center">
                    <span className="text-[#c9929b] text-sm">
                      Không có rạp nào
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {theaters.map((theater) => (
                      <div
                        key={theater.id}
                        onClick={() => handleTheaterSelect(theater)}
                        className={`p-4 rounded-xl border cursor-pointer group transition-all ${
                          selectedTheater?.id === theater.id
                            ? "border-primary bg-[#3a1c21]"
                            : "border-[#67323b] bg-[#33191e]/50 hover:bg-[#33191e] hover:border-[#c9929b]"
                        }`}
                      >
                        <h3 className="font-bold text-white mb-1 group-hover:text-primary transition-colors">
                          {theater.name}
                        </h3>
                        {theater.address && (
                          <p className="text-xs text-[#c9929b] truncate">
                            {theater.address.street_number}{" "}
                            {theater.address.street_name}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Date & Showtime Selection */}
            {currentStep >= 3 && selectedTheater && (
              <div className="flex flex-col gap-4">
                {/* Date Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="size-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                      3
                    </span>
                    Chọn ngày & suất chiếu
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {dateOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleDateChange(option.value)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                          selectedDate === option.value
                            ? "bg-primary text-white"
                            : "bg-[#33191e] border border-[#67323b] text-[#c9929b] hover:border-primary"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Showtime Selection */}
                {loadingShowtimes ? (
                  <div className="h-16 rounded-lg bg-[#33191e] flex items-center justify-center">
                    <span className="text-[#c9929b] text-sm">
                      Đang tải suất chiếu...
                    </span>
                  </div>
                ) : showtimes.length === 0 ? (
                  <div className="h-16 rounded-lg bg-[#33191e] flex items-center justify-center">
                    <span className="text-[#c9929b] text-sm">
                      Không có suất chiếu
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {showtimes.map((showtime) => (
                      <button
                        key={showtime.id}
                        onClick={() => handleShowtimeSelect(showtime)}
                        className={`h-10 px-4 rounded-lg text-sm font-medium transition-all ${
                          selectedShowtime?.id === showtime.id
                            ? "bg-primary text-white font-bold shadow-lg shadow-primary/20"
                            : "bg-[#33191e] border border-[#67323b] text-[#c9929b] hover:border-primary hover:text-white"
                        }`}
                      >
                        {showtime.startTime.slice(0, 5)}
                        <span className="text-xs ml-1 opacity-70">
                          - {showtime.endTime.slice(0, 5)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Middle Column: Seat Map */}
          <div className="lg:col-span-6 bg-[#221114] rounded-2xl p-6 border border-[#482329] flex flex-col items-center min-h-[400px]">
            {currentStep < 4 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">
                  event_seat
                </span>
                <p className="text-[#c9929b] text-lg mb-2">
                  Vui lòng hoàn thành các bước
                </p>
                <p className="text-gray-500 text-sm">
                  {currentStep === 1 && "Chọn khu vực để tiếp tục"}
                  {currentStep === 2 && "Chọn rạp chiếu phim"}
                  {currentStep === 3 && "Chọn suất chiếu"}
                </p>
              </div>
            ) : loadingSeats ? (
              <div className="flex-1 flex items-center justify-center">
                <span className="text-[#c9929b]">Đang tải sơ đồ ghế...</span>
              </div>
            ) : (
              <>
                {/* Screen Visual */}
                <div className="w-full flex flex-col items-center mb-12">
                  <div className="h-1.5 w-3/4 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full shadow-[0_10px_30px_-5px_rgba(255,255,255,0.4)] mb-2"></div>
                  <p className="text-[#c9929b] text-xs uppercase tracking-[0.2em]">
                    Màn hình
                  </p>
                </div>

                {/* Seat Grid */}
                <div className="w-full max-w-lg mx-auto">
                  {rows.map((row) => (
                    <div
                      key={row}
                      className="flex justify-center gap-2 md:gap-3 mb-3"
                    >
                      <span className="w-6 flex items-center justify-center text-[#c9929b] text-xs font-bold">
                        {row}
                      </span>
                      {seatsByRow[row]
                        .sort((a, b) => a.number - b.number)
                        .map(renderSeat)}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-auto pt-6 border-t border-[#482329] w-full">
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded bg-gray-700"></div>
                    <span className="text-sm text-[#c9929b]">Ghế thường</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded border-2 border-[#d4af37] bg-[#3a3020]"></div>
                    <span className="text-sm text-[#c9929b]">Ghế VIP</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded bg-primary shadow-[0_0_10px_rgba(236,19,55,0.4)]"></div>
                    <span className="text-sm text-[#c9929b]">Đang chọn</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded bg-gray-800 opacity-50 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[12px] text-white">
                        close
                      </span>
                    </div>
                    <span className="text-sm text-[#c9929b]">Đã đặt</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 bg-[#221114] rounded-2xl border border-[#482329] overflow-hidden">
              {/* Movie Header */}
              <div className="relative h-64 w-full bg-gradient-to-tr from-gray-900 via-[#3a1c21] to-black overflow-hidden">
                {filmInfo?.thumbnail ? (
                  <img
                    src={filmInfo.thumbnail}
                    alt={filmInfo.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/10">
                    <span className="material-symbols-outlined !text-8xl">
                      movie
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-4">
                  <h3 className="text-white text-xl font-bold line-clamp-2">
                    {filmInfo?.name || "Chưa chọn phim"}
                  </h3>
                  <p className="text-sm text-[#c9929b]">
                    {filmInfo?.language || "---"}
                  </p>
                </div>
              </div>

              <div className="p-4 flex flex-col gap-4">
                {/* Cinema Info */}
                <div className="pb-4 border-b border-[#482329] border-dashed">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">
                      location_on
                    </span>
                    <div>
                      <p className="text-white text-sm font-bold">
                        {selectedTheater?.name || "Chưa chọn rạp"}
                      </p>
                      <p className="text-[#c9929b] text-xs">
                        {selectedShowtime?.auditorium
                          ? `Phòng ${selectedShowtime.auditorium.number}`
                          : "---"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">
                      calendar_today
                    </span>
                    <div>
                      <p className="text-white text-sm font-bold">
                        {selectedShowtime
                          ? new Date(selectedShowtime.date).toLocaleDateString(
                              "vi-VN",
                              {
                                weekday: "long",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )
                          : "Chưa chọn ngày"}
                      </p>
                      <p className="text-[#c9929b] text-xs">
                        Suất:{" "}
                        {selectedShowtime
                          ? selectedShowtime.startTime.slice(0, 5)
                          : "--:--"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Seats & Price */}
                <div className="flex justify-between items-start pb-4 border-b border-[#482329] border-dashed">
                  <div>
                    <p className="text-[#c9929b] text-xs mb-1">Ghế đã chọn:</p>
                    <div className="flex gap-1 flex-wrap max-w-[120px]">
                      {selectedSeats.length > 0 ? (
                        selectedSeats.map((seat) => (
                          <span
                            key={seat.seatId}
                            className="text-white text-sm font-bold bg-gray-800 px-2 py-0.5 rounded border border-gray-700"
                          >
                            {seat.seatRow}
                            {seat.number}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#c9929b] text-sm">
                          Chưa chọn
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#c9929b] text-xs mb-1">Đơn giá:</p>
                    <div className="text-white text-[11px] flex flex-col items-end gap-1">
                      {regSeat && (
                        <p>
                          Ghế thường:{" "}
                          <span className="font-bold">
                            {(
                              (filmInfo?.price || 0) + regSeat.totalPrice
                            ).toLocaleString()}
                            đ
                          </span>
                        </p>
                      )}
                      {vipSeat && (
                        <p>
                          Ghế VIP:{" "}
                          <span className="font-bold">
                            {(
                              (filmInfo?.price || 0) + vipSeat.totalPrice
                            ).toLocaleString()}
                            đ
                          </span>
                        </p>
                      )}
                      {!regSeat && !vipSeat && "---"}
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[#c9929b] text-sm">Tổng cộng</span>
                  <span className="text-primary text-2xl font-black">
                    {totalPrice.toLocaleString()}đ
                  </span>
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  disabled={selectedSeats.length === 0 || isHoldingSeats}
                  className="w-full h-12 rounded-lg bg-primary hover:bg-red-700 text-white font-bold text-base shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
                >
                  {isHoldingSeats ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      Tiếp theo
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #33191e;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #67323b;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ec1337;
        }
      `}</style>
    </div>
  );
};

export default Booking;
