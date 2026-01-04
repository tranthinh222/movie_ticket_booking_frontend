import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import filmApi from "../services/api-film";

interface Film {
  id: number;
  name: string;
  director: string;
  actors: string;
  duration: number;
  price: number;
  description: string;
  genre: string;
  language: string;
  releaseDate: string;
  status: string | null;
  thumbnail: string | null;
}

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilm = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await filmApi.getFilmById(Number(id));
        setFilm(res.data.data || res.data);
      } catch (error) {
        console.error("Error fetching film:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFilm();
  }, [id]);

  // Helper function to format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Helper function to format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium animate-pulse">
            Đang tải thông tin phim...
          </p>
        </div>
      </div>
    );
  }

  if (!film) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Không tìm thấy phim</div>
      </div>
    );
  }

  return (
    <>
      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col items-center">
        {/* Breadcrumbs & Hero Area */}
        <div className="w-full relative">
          {/* Backdrop Image */}
          <div className="absolute inset-0 h-[500px] md:h-[600px] w-full overflow-hidden z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-background-dark/40 z-10"></div>
            <img
              className="w-full h-full object-cover opacity-60 blur-sm"
              alt={film.name}
              src={
                film.thumbnail ||
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDA6b9suL4nftborhsxovc3R3hVESZtMq1DK83-E66tCsUHKcMrIUVjmUvUNX_XeuBKenW3rA4cHUTapW20nxCM5cpBm1ilzr37gFBYhsiS50MTm7V9aSRMh_Hqamr5vgHrDxQ6cFQ8IHbseINxXaCWIofpLFz3KgfA_aBUuLS0gi9_i42vVoKMa0XLsMsxVco5_iT75O_Unh-kQ5pPiFjn1h0J8osfCfB5oWbgtmUjKGfEnEQOOTa0XmQmU7rOpqXLNdW4bgiVVnQ"
              }
            />
          </div>

          <div className="layout-content-container max-w-[1200px] w-full mx-auto px-4 md:px-10 relative z-20 pt-4">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-2 py-4 mb-4">
              <a
                className="text-gray-300 text-sm font-medium hover:text-white transition-colors"
                href="/"
              >
                Trang chủ
              </a>
              <span className="text-gray-500 text-sm font-medium">/</span>
              <a
                className="text-gray-300 text-sm font-medium hover:text-white transition-colors"
                href="/movies"
              >
                Phim đang chiếu
              </a>
              <span className="text-gray-500 text-sm font-medium">/</span>
              <span className="text-white text-sm font-medium">
                {film.name}
              </span>
            </div>

            {/* Hero Content: Poster & Info */}
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start pb-10">
              {/* Poster */}
              <div className="shrink-0 mx-auto md:mx-0 w-[240px] lg:w-[300px] aspect-[2/3] rounded-xl shadow-2xl overflow-hidden border border-white/10 group">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={`Poster ${film.name}`}
                  src={
                    film.thumbnail ||
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuBm333q6vyhagBlgDUIUGqhyrSnOsDKdIlHv4mbJy339wAm63LyPb6SwYVELW0Wy7CAqcWVzq0G7yNdVLULVvdbsg-9anfyF_-DbLO214OH_iCrVwJedcFn3tCSHVOPbuNWAskvZZxCQFK06RociiOMRlkLygDPIwUsMFEujtnCVcwWUvYwBZf-EDCmandkUVv15qKfcTU7UDb5en2PM9ZzR4Qv2yyN0McmtgJGIYxxUYwsOeSi_0fISDfOfIBKbbE80fXtR6oDD2c"
                  }
                />
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1 pt-2 text-center md:text-left">
                <h1 className="text-white tracking-tight text-3xl md:text-5xl font-bold leading-tight mb-4">
                  {film.name}
                </h1>

                {/* Chips */}
                <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start">
                  {/* Genre chips */}
                  {film.genre.split(",").map((g, index) => (
                    <div
                      key={index}
                      className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full border border-white/10 bg-white/5 pl-4 pr-4 backdrop-blur-sm"
                    >
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        movie
                      </span>
                      <p className="text-white text-xs md:text-sm font-medium">
                        {g.trim()}
                      </p>
                    </div>
                  ))}

                  {/* Duration */}
                  <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full border border-white/10 bg-white/5 pl-4 pr-4 backdrop-blur-sm">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      schedule
                    </span>
                    <p className="text-white text-xs md:text-sm font-medium">
                      {formatDuration(film.duration)}
                    </p>
                  </div>

                  {/* Language */}
                  <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full border border-white/10 bg-white/5 pl-4 pr-4 backdrop-blur-sm">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      translate
                    </span>
                    <p className="text-white text-xs md:text-sm font-medium">
                      {film.language}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                  <button className="flex items-center gap-2 px-6 h-12 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/20 backdrop-blur-md">
                    <span className="material-symbols-outlined">
                      play_circle
                    </span>
                    Trailer
                  </button>
                  <Link
                    to={`booking`}
                    className="flex items-center gap-2 px-8 h-12 rounded-lg bg-primary hover:bg-red-600 text-white font-bold shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-0.5"
                  >
                    <span className="material-symbols-outlined">
                      confirmation_number
                    </span>
                    Đặt vé ngay
                  </Link>
                </div>

                {/* Short Description for Hero */}
                <p className="text-gray-300 leading-relaxed max-w-2xl hidden md:block">
                  {film.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="mt-10 layout-content-container max-w-[1200px] w-full mx-auto px-4 md:px-10 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column (Main) */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              {/* Synopsis */}
              <section>
                <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2 border-l-4 border-primary pl-3">
                  Nội dung phim
                </h3>
                <div className="bg-surface-dark/50 p-6 rounded-xl border border-white/5">
                  <p className="text-gray-300 leading-7 text-justify">
                    {film.description}
                  </p>
                </div>
              </section>

              {/* Trailer */}
              <section>
                <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2 border-l-4 border-primary pl-3">
                  Trailer
                </h3>
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black relative group cursor-pointer">
                  <img
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                    alt="Trailer thumbnail"
                    src={
                      film.thumbnail ||
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuAynl8-xmlktKETy2afeSSmgl6JWxL8Jq6NkwKBf4ix-c-0I6pFxtYO68laGVRwkZWFtmSVHLxsyTQO1yIHUp-5VEzRmytcDRJ8Nt5hJsB21-wTwsPtsQsVlcuT58dlQ3Mo4S3jA4ufFMUhaAZjNzMCBmug9bmzq_nEg0O2_WTGWrTg3D6m0VvXlCHMc6nvZ9jT72Nl1dgDGedZLm6-gZ9-0-knGmjkqBdKLxKDNencP6Rr7fKKjU-c57GPmdD_6MlFESBPQunTF98"
                    }
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-16 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[32px]">
                        play_arrow
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column (Sidebar Info) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Movie Details Card */}
              <div className="bg-surface-dark p-6 rounded-xl border border-white/5 flex flex-col gap-5">
                <h4 className="text-white text-lg font-bold border-b border-white/10 pb-2">
                  Thông tin chi tiết
                </h4>
                <div className="grid grid-cols-[100px_1fr] gap-y-4 text-sm">
                  <span className="text-gray-400 font-medium">Thể loại</span>
                  <span className="text-white font-medium">{film.genre}</span>

                  <span className="text-gray-400 font-medium">Thời lượng</span>
                  <span className="text-white font-medium">
                    {formatDuration(film.duration)}
                  </span>

                  <span className="text-gray-400 font-medium">Khởi chiếu</span>
                  <span className="text-white font-medium">
                    {formatDate(film.releaseDate)}
                  </span>

                  <span className="text-gray-400 font-medium">Ngôn ngữ</span>
                  <span className="text-white font-medium">
                    {film.language}
                  </span>

                  <span className="text-gray-400 font-medium">Đạo diễn</span>
                  <span className="text-white font-medium">
                    {film.director}
                  </span>

                  <span className="text-gray-400 font-medium">Diễn viên</span>
                  <span className="text-white font-medium">{film.actors}</span>

                  {film.status && (
                    <>
                      <span className="text-gray-400 font-medium">
                        Trạng thái
                      </span>
                      <span className="text-white font-medium">
                        {film.status}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default MovieDetail;
