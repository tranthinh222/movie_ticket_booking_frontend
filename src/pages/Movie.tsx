import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import filmApi from "../services/api-film";

const Movie: React.FC = () => {
  const [nowShowingMovies, setNowShowingMovies] = useState<any[]>([]);
  const [comingSoonMovies, setComingSoonMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const [nowShowingRes, comingSoonRes] = await Promise.all([
          filmApi.getFilmByStatus("NOW_SHOWING", 1, 40),
          filmApi.getFilmByStatus("COMING_SOON", 1, 40),
        ]);

        const nowShowingData =
          nowShowingRes.data?.data?.data || nowShowingRes.data?.data || [];
        const comingSoonData =
          comingSoonRes.data?.data?.data || comingSoonRes.data?.data || [];

        setNowShowingMovies(
          nowShowingData.filter((m: any) => m.status === "NOW_SHOWING")
        );
        setComingSoonMovies(
          comingSoonData.filter((m: any) => m.status === "COMING_SOON")
        );
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

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
          {nowShowingMovies.length === 0 && (
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
          {comingSoonMovies.length === 0 && (
            <div className="col-span-full py-10 text-center text-gray-500 italic">
              Hiện tại không có phim nào sắp chiếu.
            </div>
          )}
        </div>
      </section>

      {/* Section 3: Phim Hot (Featured Layout) - Keeping static for now as it's a special layout */}
      <section className="pb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            Phim Hot Tuần Này
          </h2>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all text-gray-400">
              <span className="material-symbols-outlined text-lg">
                chevron_left
              </span>
            </button>
            <button className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all text-gray-400">
              <span className="material-symbols-outlined text-lg">
                chevron_right
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Hot Movie Wide Card 1 */}
          <div className="relative rounded-xl overflow-hidden aspect-video md:aspect-auto md:h-64 group cursor-pointer">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPk9_QbtCeJYJm-695dpb40S4AC0VMZSk9c4hYsXVgBIfvs-9XY9ch4mC4Sr5N4SatxLKaEYqHdraFPyOjOfDGCh6De34P-rJGNC1mzvK2Bin-2d42c-ttiQB-N8w2en-YUyjnArS0jHMRKhdjZqjATZ4m6sWFcuhih211aoXsSO2rnT6NuIs6qtMfvC1G6Aa2XHy9q7RognXeb7Dg6Q9dRbFyyNDKWl8S6fG_mvAOb1fY_ITwnKYpG8cHDJIQByUpi91_Y5wr6qQ')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
            <div className="absolute top-4 left-4">
              <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                Top 1
              </span>
            </div>
            <div className="absolute bottom-0 left-0 p-6 w-3/4">
              <h3 className="text-white text-2xl font-bold mb-1 group-hover:text-primary transition-colors">
                Exhuma: Quật Mộ
              </h3>
              <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                Một gia đình giàu có nhờ hai pháp sư trẻ giải cứu đứa con mới
                sinh khỏi một thế lực tà ác...
              </p>
              <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-yellow-500">
                    star
                  </span>{" "}
                  9.2
                </span>
                <span>Horror, Mystery</span>
                <span>2024</span>
              </div>
            </div>
          </div>

          {/* Hot Movie Wide Card 2 */}
          <div className="relative rounded-xl overflow-hidden aspect-video md:aspect-auto md:h-64 group cursor-pointer hidden md:block">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAUXfrgySy30pb5vUgnKqlJDDHIMHUOq_edUG7HVA9ftd1rHjq5eORlLgC5EKjJ94PlCVW5C9WwNFjOiV3h_OxuwLUIBsm2D62bfHL_N43P2CQWnAnF2pTC8pw6eDnf0uvsbAOLRKnkwwc_whxlQCFUvL9x_9DzDNXi1pqGlcMya34cxrTeTXYJWxMaE7imsZ0Inw_GQwzzgLiogG3XAw_5xPQbFOBOu1jFrg90jl3Pkdf5NDshQ7sr59ZRFkWIEdmhHzGB6_8Cjco')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
            <div className="absolute top-4 left-4">
              <span className="bg-gray-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Top 2
              </span>
            </div>
            <div className="absolute bottom-0 left-0 p-6 w-3/4">
              <h3 className="text-white text-2xl font-bold mb-1 group-hover:text-primary transition-colors">
                House of Dragon
              </h3>
              <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                Phần tiền truyện của Game of Thrones, xoay quanh sự sụp đổ của
                nhà Targaryen...
              </p>
              <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-yellow-500">
                    star
                  </span>{" "}
                  8.9
                </span>
                <span>Fantasy, Drama</span>
                <span>2023</span>
              </div>
            </div>
          </div>

          {/* Hot Movie Wide Card 3 */}
          <div className="relative rounded-xl overflow-hidden aspect-video md:aspect-auto md:h-64 group cursor-pointer hidden lg:block">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBiaAIo8r5ak2XOdS9ue_XclhMs3ppFLx62iW17-aOYtwjSblAgjnWTxvx42qM81GCcOG7KF2Wcg2NZaaxM_o4zanZr6uLQZtq9uEXuECrIKc21CgnkW2aqiXnmUpg9FSVHaz8nNwDpokwZ4P7CBU4snuHW3YavsYpdejGZEa_0ZwhZcpQG2oMqZsnrAIpCQ2SP8IVth5_B5r6Jsi2b8lpOZ9DrxErKg7txMEomzvzNSAeaFFmc3RDB9wvdqs3mcqSyKWZFZN_ceE8')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
            <div className="absolute top-4 left-4">
              <span className="bg-gray-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Top 3
              </span>
            </div>
            <div className="absolute bottom-0 left-0 p-6 w-3/4">
              <h3 className="text-white text-2xl font-bold mb-1 group-hover:text-primary transition-colors">
                Poor Things
              </h3>
              <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                Câu chuyện về sự tiến hóa kỳ diệu của Bella Baxter, một phụ nữ
                trẻ được hồi sinh...
              </p>
              <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-yellow-500">
                    star
                  </span>{" "}
                  8.4
                </span>
                <span>Comedy, Sci-Fi</span>
                <span>2023</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Movie;
