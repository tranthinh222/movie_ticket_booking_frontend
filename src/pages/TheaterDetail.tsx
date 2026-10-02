import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import theaterApi from "../services/api-theater";

interface AuditoriumSummary {
  id: number;
  number: number;
  totalSeats: number;
}

const unwrapData = <T,>(response: unknown): T => {
  const wrapped = response as { data?: T };
  return wrapped?.data ?? (response as T);
};

const TheaterDetail: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const initialTheater = (location.state as { theater?: ITheater } | null)?.theater;
  const [theater, setTheater] = useState<ITheater | null>(initialTheater ?? null);
  const [auditoriums, setAuditoriums] = useState<AuditoriumSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const theaterId = Number(id);
    if (!Number.isInteger(theaterId) || theaterId <= 0) {
      setError(true);
      setLoading(false);
      return;
    }

    const loadTheater = async () => {
      try {
        const [theaterResponse, auditoriumResponse] = await Promise.all([
          theaterApi.getTheaterById(theaterId),
          theaterApi.getAuditoriumByTheaterId(theaterId),
        ]);
        setTheater(unwrapData<ITheater>(theaterResponse));
        const rooms = unwrapData<AuditoriumSummary[]>(auditoriumResponse);
        setAuditoriums(Array.isArray(rooms) ? rooms : []);
      } catch (loadError) {
        console.error("Error fetching theater details:", loadError);
        if (!initialTheater) setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadTheater();
  }, [id, initialTheater]);

  if (loading && !theater) {
    return (
      <main className="flex min-h-[55vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 text-[#c9929b]">
          <span className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p>Đang tải thông tin rạp...</p>
        </div>
      </main>
    );
  }

  if (error || !theater) {
    return (
      <main className="flex min-h-[55vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="material-symbols-outlined text-5xl text-primary">location_off</span>
        <h1 className="text-2xl font-bold text-white">Không tìm thấy rạp chiếu</h1>
        <Link to="/theater" className="font-bold text-primary hover:text-red-400">
          Quay lại danh sách rạp
        </Link>
      </main>
    );
  }

  const address = theater.address;
  const fullAddress = address
    ? `${address.street_number} ${address.street_name}, ${address.city}`
    : "Địa chỉ đang được cập nhật";

  return (
    <main className="flex-1 px-4 py-8 md:px-10 lg:px-40">
      <div className="mx-auto max-w-[1200px]">
        <Link to="/theater" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#c9929b] transition hover:text-white">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Danh sách rạp
        </Link>

        <section className="relative overflow-hidden rounded-3xl border border-[#5b2b33] bg-gradient-to-br from-[#3a1b20] to-[#241114] p-6 shadow-2xl md:p-9">
          <div className="absolute -right-16 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4 md:gap-6">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/25 md:size-20">
                <span className="material-symbols-outlined text-4xl">theaters</span>
              </div>
              <div>
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">CineMovie</span>
                <h1 className="mt-2 text-2xl font-black text-white md:text-4xl">{theater.name}</h1>
                <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-[#d0a0a8] md:text-base">
                  <span className="material-symbols-outlined mt-0.5 text-lg text-primary">location_on</span>
                  {fullAddress}
                </p>
              </div>
            </div>
            <Link to="/movie" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-[#ff294c]">
              Chọn phim và đặt vé
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Phòng chiếu</h2>
              <p className="mt-1 text-sm text-[#c9929b]">Thông tin các phòng hiện có tại rạp</p>
            </div>
            <span className="rounded-full bg-[#482329] px-3 py-1 text-sm font-bold text-[#e4b6bd]">
              {auditoriums.length} phòng
            </span>
          </div>

          {auditoriums.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {auditoriums.map((room) => (
                <article key={room.id} className="rounded-2xl border border-[#482329] bg-[#2a171a] p-5 transition hover:border-primary/40">
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <span className="material-symbols-outlined">meeting_room</span>
                    </div>
                    <span className="rounded-lg bg-[#3b2024] px-2.5 py-1 text-xs font-semibold text-[#d5a4ac]">
                      {room.totalSeats ?? 0} ghế
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-white">Phòng {room.number}</h3>
                  <p className="mt-1 text-sm text-[#c9929b]">Phòng chiếu tiêu chuẩn CineMovie</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#5b2b33] bg-[#2a171a]/60 px-5 py-10 text-center text-[#c9929b]">
              Thông tin phòng chiếu đang được cập nhật.
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default TheaterDetail;
