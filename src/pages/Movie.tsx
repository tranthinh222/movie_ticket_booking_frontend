import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import filmApi from "../services/api-film";

const Movie: React.FC = () => {
  const [nowShowingMovies, setNowShowingMovies] = useState<any[]>([]);
  const [comingSoonMovies, setComingSoonMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const [nowShowingRes, comingSoonRes] = await Promise.all([
          filmApi.getFilmByStatus("NOW_SHOWING", 1, 40),
          filmApi.getFilmByStatus("COMING_SOON", 1, 40),
        ]);

        const nowShowingData =
          nowShowingRes.data?.data || [];
        const comingSoonData =
          comingSoonRes.data?.data || [];

        setNowShowingMovies(
          nowShowingData.filter((m: any) => m.status === "NOW_SHOWING")
        );
        setComingSoonMovies(
          comingSoonData.filter((m: any) => m.status === "COMING_SOON")
        );
      } catch (error) {
        setLoadError("Không tải được danh sách phim. Kiểm tra backend và kết nối, rồi tải lại trang.");
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const featuredMovies = nowShowingMovies.slice(0, 3);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium animate-pulse">
            Đang tải danh sách phim...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-10 py-6 space-y-10">
      {loadError && (
        <div role="alert" className="rounded-xl border border-primary p-4 text-white">
          {loadError}
          <button className="ml-4 text-primary underline" onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      )}
      {/* Section 1: Phim đang chiếu */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            Phim đang chiếu
          </h2>
          <Link
            className="text-sm font-medium text-primary hover:text-white transition-colors flex items-center gap-1"
            to="/movie?status=NOW_SHOWING"
          >
            Xem tất cả{" "}
            <span className="material-symbols-outlined text-lg">
              chevron_right
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {nowShowingMovies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="group relative flex flex-col gap-3 cursor-pointer"
            >
              <div className="relative w-full aspect-[2/3] overflow-hidden rounded-xl bg-gray-800">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: `url('${movie.thumbnail}')`,
                  }}
                ></div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="bg-primary hover:bg-primary/90 text-white rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                    <span className="material-symbols-outlined text-3xl">
                      play_arrow
                    </span>
                  </button>
                </div>
                {movie.rating && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
                    {movie.rating}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-white font-semibold truncate group-hover:text-primary transition-colors">
                  {movie.name}
                </h3>
                <p className="text-[#c9929b] text-sm">
                  {movie.duration} phút • {movie.genre?.split(",")[0] || "Phim"}
                </p>
              </div>
            </Link>
          ))}
          {!loadError && nowShowingMovies.length === 0 && (
            <div className="col-span-full py-10 text-center text-gray-500 italic">
              Hiện tại không có phim nào đang chiếu.
            </div>
          )}
        </div>
      </section>

      {/* Section 2: Phim sắp chiếu */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            Phim sắp chiếu
          </h2>
          <Link
            className="text-sm font-medium text-primary hover:text-white transition-colors flex items-center gap-1"
            to="/movie?status=COMING_SOON"
          >
            Xem tất cả{" "}
            <span className="material-symbols-outlined text-lg">
              chevron_right
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {comingSoonMovies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="group relative flex flex-col gap-3 cursor-pointer"
            >
              <div className="relative w-full aspect-[2/3] overflow-hidden rounded-xl bg-gray-800 border-2 border-transparent group-hover:border-primary/50 transition-colors">
                <div
                  className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500"
                  style={{
                    backgroundImage: `url('${movie.thumbnail}')`,
                  }}
                ></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-12">
                  <p className="text-primary font-bold text-xs uppercase tracking-wider mb-1">
                    Coming Soon
                  </p>
                  <p className="text-white font-bold text-sm">
                    {movie.releaseDate
                      ? new Date(movie.releaseDate).toLocaleDateString("vi-VN")
                      : "Sắp ra mắt"}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold truncate group-hover:text-primary transition-colors">
                  {movie.name}
                </h3>
                <p className="text-[#c9929b] text-sm">
                  {movie.genre?.split(",")[0] || "Sắp chiếu"}
                </p>
              </div>
            </Link>
          ))}
          {!loadError && comingSoonMovies.length === 0 && (
            <div className="col-span-full py-10 text-center text-gray-500 italic">
              Hiện tại không có phim nào sắp chiếu.
            </div>
          )}
        </div>
      </section>

      <section className="pb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            Phim nổi bật
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredMovies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="relative rounded-xl overflow-hidden aspect-video md:aspect-auto md:h-64 group cursor-pointer bg-gray-800"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${movie.thumbnail}')` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-white text-2xl font-bold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                  {movie.name}
                </h3>
                <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                  {movie.description}
                </p>
                <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-400">
                  <span>{movie.duration} phút</span>
                  <span>{movie.genre}</span>
                </div>
              </div>
            </Link>
          ))}
          {!loadError && featuredMovies.length === 0 && (
            <div className="col-span-full py-10 text-center text-gray-500 italic">
              Hiện tại chưa có phim nổi bật.
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Movie;
