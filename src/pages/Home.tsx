import { useState, useEffect } from "react";
import { Link } from "react-router";
import filmApi from "../services/api-film";

const Home: React.FC = () => {
  const [nowShowingMovies, setNowShowingMovies] = useState<any[]>([]);
  const [comingSoonMovies, setComingSoonMovies] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"NOW_SHOWING" | "COMING_SOON">(
    "NOW_SHOWING"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const [nowShowingRes, comingSoonRes] = await Promise.all([
          filmApi.getFilmByStatus("NOW_SHOWING", 1, 10),
          filmApi.getFilmByStatus("COMING_SOON", 1, 10),
        ]);

        const nowShowingData =
          nowShowingRes.data?.data?.data || nowShowingRes.data?.data || [];
        const comingSoonData =
          comingSoonRes.data?.data?.data || comingSoonRes.data?.data || [];

        setNowShowingMovies(
          Array.isArray(nowShowingData) ? nowShowingData.slice(0, 10) : []
        );
        setComingSoonMovies(
          Array.isArray(comingSoonData) ? comingSoonData.slice(0, 10) : []
        );
      } catch (error) {
        console.error("Error fetching homepage movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const featuredMovie = nowShowingMovies[0] || null;

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden group">
        {/* Background Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url('${featuredMovie?.thumbnail || "https://lh3.googleusercontent.com/aida-public/AB6AXuB5dvgl_5TIycwn2te9WR7LSb7doNIeeEhUzaaK6lOZKTVj1E_8kKbqENuqQks0uBsOPP7lfBog2fPvaWaG2qyXroe-oNeJG_UVnvJULycxiTKDCroNEiVaYwhnWOzyyUvM0zMwYVJu890u9i9KTna4PzOLZxA-54Jojl-s8hvpRLE34kcLTBdhZOVH5f144UUrkQ3sm7n5R97InsArhguzXi-hKl3ehP_R_KHEHXqFRiiTyVvbmww0sKpu3pYqyh-D9hkZKWdjVEg"}')`,
          }}
        ></div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

        {/* Content */}
        <div className="relative h-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded">
                P (13+)
              </span>
              <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded border border-white/30">
                {featuredMovie?.genre?.split(",")[0] || "Hành động"}
              </span>
              <span className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                <span className="material-symbols-outlined text-sm">star</span>{" "}
                {featuredMovie?.rating || "9.0"}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-4 tracking-tight drop-shadow-lg uppercase">
              {featuredMovie?.name || "CineMovie"}
            </h2>
            <p className="text-gray-200 text-sm sm:text-base md:text-lg mb-8 line-clamp-3 md:line-clamp-2 max-w-xl">
              {featuredMovie?.description ||
                "Trải nghiệm điện ảnh đỉnh cao với những bộ phim mới nhất tại hệ thống rạp CineMovie."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to={featuredMovie ? `/movie/${featuredMovie.id}` : "/movie"}
                className="flex items-center justify-center gap-2 h-12 px-8 bg-primary hover:bg-red-700 text-white font-bold rounded-lg shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-1"
              >
                <span className="material-symbols-outlined">
                  confirmation_number
                </span>
                Đặt vé ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Movie Tabs Section */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b border-gray-800 pb-2">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("NOW_SHOWING")}
                className={`relative pb-4 text-xl sm:text-2xl font-bold transition-all ${
                  activeTab === "NOW_SHOWING"
                    ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-primary after:rounded-t-full"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Phim đang chiếu
              </button>
              <button
                onClick={() => setActiveTab("COMING_SOON")}
                className={`relative pb-4 text-xl sm:text-2xl font-bold transition-all ${
                  activeTab === "COMING_SOON"
                    ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-primary after:rounded-t-full"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Phim sắp chiếu
              </button>
            </div>
            <Link
              to="/movie"
              className="text-primary font-bold text-sm flex items-center gap-1 hover:underline"
            >
              Xem tất cả{" "}
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Movies Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 animate-pulse">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="w-full aspect-[2/3] rounded-xl bg-gray-800"></div>
                  <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
              {(activeTab === "NOW_SHOWING"
                ? nowShowingMovies
                : comingSoonMovies
              ).map((movie) => (
                <div key={movie.id} className="group flex flex-col gap-3">
                  <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg bg-gray-800">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: `url('${movie.thumbnail}')`,
                      }}
                    ></div>
                    {movie.rating && (
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded text-white text-xs font-bold border border-white/10 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px] text-yellow-400">
                          star
                        </span>{" "}
                        {movie.rating}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 gap-2">
                      <Link
                        to={`/movie/${movie.id}/booking`}
                        className="w-full py-2 bg-primary text-white text-center font-bold rounded-lg shadow-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Mua vé
                      </Link>
                      <Link
                        to={`/movie/${movie.id}`}
                        className="w-full py-2 bg-white/20 backdrop-blur text-white text-center font-bold rounded-lg border border-white/30 hover:bg-white/30 transition-colors text-sm"
                      >
                        Chi tiết
                      </Link>
                    </div>
                  </div>
                  <div>
                    <Link
                      to={`/movie/${movie.id}`}
                      className="text-base font-bold text-white line-clamp-1 hover:text-primary transition-colors block"
                    >
                      {movie.name}
                    </Link>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {activeTab === "NOW_SHOWING"
                        ? movie.genre?.split(",")[0] || "Phim"
                        : movie.releaseDate
                          ? new Date(movie.releaseDate).toLocaleDateString(
                              "vi-VN"
                            )
                          : "Sắp ra mắt"}
                    </p>
                  </div>
                </div>
              ))}
              {(activeTab === "NOW_SHOWING"
                ? nowShowingMovies
                : comingSoonMovies
              ).length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-500 italic border border-dashed border-gray-800 rounded-2xl">
                  Hiện tại không có bộ phim nào trong danh mục này.
                </div>
              )}
            </div>
          )}
        </section>

        {/* Promotions Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/20 p-2 rounded-lg">
              <span className="material-symbols-outlined text-primary text-2xl">
                local_activity
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Khuyến mãi &amp; Ưu đãi
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Promo Card 1 */}
            <Link
              to="/promotion"
              className="group relative overflow-hidden rounded-xl bg-[#262626] shadow-md border border-gray-800 hover:border-primary/50 transition-all cursor-pointer"
            >
              <div
                className="w-full h-40 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBqbypn6sPcDYL-oAixgk2n8YuT1lhju7L5vGewJPQ0qHUBVv_AiQIsSLi66fMP1csr42wfMUeLmJr5amB47NP5ACa5AIYqNVENrJSMMrjC3MaQHJHDKVgAjMdp9zAcaRdgJoQqbYi1gjWWplL9P7qryLhOMhas4IYbWLTx_tmsFgVzhrvc10jbBleuzivwwBiYnwbNotyTuHLg2HGNjGQtNkl81It9uTWx6amN4qcaYaNwMOHg-W7R1FI4TUrME-CONb5mkHPuIog')`,
                }}
              ></div>
              <div className="p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 block">
                  Thành viên mới
                </span>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                  Giảm 50% Combo Bắp Nước
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Dành riêng cho khách hàng lần đầu đăng ký thành viên
                  CinemaHub.
                </p>
                <span className="text-xs font-medium text-gray-400">
                  Hết hạn: 31/12/2024
                </span>
              </div>
            </Link>

            {/* Promo Card 2 */}
            <Link
              to="/promotion"
              className="group relative overflow-hidden rounded-xl bg-[#262626] shadow-md border border-gray-800 hover:border-primary/50 transition-all cursor-pointer"
            >
              <div
                className="w-full h-40 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAGLj-r0saGIMjGr72W0xKGSlsBUDsagbLBqqwHLuK0DDM_ThMGp6ONNBmsmtG085egM246kQd8Im4Czw5xH3ULcFACkHXNh8CiJQbbukjzl4Qx3kLkqZgX5-MeKI9D-jo2Wi6AYnJglKIDtCI7xPBzhGpMA0hiCq9UpjccCLuk4z9gu2L-kDD7vbahjfd124BYj_WQVoyImlcjz1gKhTWtjf7ceZvwEmA1UsRdzojgGOh-inKNPg2JOG9K26YwuZlEJrEazoFGGsw')`,
                }}
              ></div>
              <div className="p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 block">
                  Happy Day
                </span>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                  Thứ 3 Vui Vẻ - Đồng Giá 50k
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Áp dụng cho mọi suất chiếu vào ngày thứ 3 hàng tuần tại mọi
                  cụm rạp.
                </p>
                <span className="text-xs font-medium text-gray-400">
                  Hàng tuần
                </span>
              </div>
            </Link>

            {/* Promo Card 3 */}
            <Link
              to="/promotion"
              className="group relative overflow-hidden rounded-xl bg-[#262626] shadow-md border border-gray-800 hover:border-primary/50 transition-all cursor-pointer"
            >
              <div
                className="w-full h-40 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC6DTwGyTmEX7ucSIev_PBKsYrMkJDOXaGG8i0KvQdffaNRvJd1lq9RjGYXPSfoqP98NK0MXgWRtjXwsqpYPCNWOqzNK5F8q2OzOnaTmx_A-QGCtxCgoiSGTQLy77BYX3YVF3WIt5OA5OUTTEU9CahYF-DCqwPrQ37NqhZL7YkF6t4WYPbFezts3QOrhbVLIql45Yc2ZcqnxvKU-kAfErDQmUUeFVwnRUx2KQ0ZmmizPa4fSdqdaKo3jPbAVe96H-N78V38O76__YQ')`,
                }}
              ></div>
              <div className="p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 block">
                  Học sinh - Sinh viên
                </span>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                  Ưu đãi U22 - Vé chỉ 45k
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Chương trình đặc biệt dành cho các bạn học sinh, sinh viên
                  dưới 22 tuổi.
                </p>
                <span className="text-xs font-medium text-gray-400">
                  Áp dụng T2 - T6
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* News / Blog Mini Section */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Tin Điện Ảnh</h2>
              <Link
                to="/news"
                className="text-sm text-gray-400 hover:text-primary"
              >
                Xem tất cả
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {/* News Item 1 */}
              <Link
                to="/news"
                className="flex gap-4 group cursor-pointer items-start"
              >
                <div
                  className="w-32 h-20 sm:w-48 sm:h-28 rounded-lg bg-gray-800 bg-cover bg-center shrink-0 overflow-hidden"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAeLNHis19sSdM92uOtUTNMiB57lkoRcnvvlTnN65gLySdSBxin8iOt-Udm8sJRusb9eOG-iXSR_Qs7GjPOXInwo7xyd9TLkcbMk6h3TYoFH3ItbEJVZYByo9iqfDvD38tSlabJrKdsfqx5LUz9Xq0gf99jz7fVjFYE1mcsLpw2r3qGDNDaC1bOn-5ocq2cqRkgfEW8nL96ypKNkLHwaXmfrHhDeI8sA6t5NEbF7WIOiy0_rM9LchigjN926p283PaR_025-E9-Tew')`,
                  }}
                ></div>
                <div>
                  <h4 className="font-bold text-white text-base sm:text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    Review: Dune 2 - Kiệt tác điện ảnh không thể bỏ lỡ của năm
                    2024
                  </h4>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    Phần 2 của Dune không chỉ mở rộng quy mô câu chuyện mà còn
                    nâng tầm trải nghiệm thị giác lên một tầm cao mới...
                  </p>
                  <span className="text-xs text-gray-500 mt-2 block">
                    2 giờ trước
                  </span>
                </div>
              </Link>

              {/* News Item 2 */}
              <Link
                to="/news"
                className="flex gap-4 group cursor-pointer items-start"
              >
                <div
                  className="w-32 h-20 sm:w-48 sm:h-28 rounded-lg bg-gray-800 bg-cover bg-center shrink-0 overflow-hidden"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDwvnofJcv9Tkr0kEMcNDSVWQBeLuMSWHWp5DpTV9wGQDFZXmrXlh0kBYXNFt2N0eYEoxj7SQc3CIjSUIqvAeSPX12ySHcPQIAr6tJ7UorfTAlVthfmSfHtb78-mGU9B5rN3z0ChV6Qq4J3OfbJe4sCHGA5ImyH5Hv6FQf4yp8zl51cqG8EDWjFpTZTOOnmTlvpuND8JkFQCi-_DiMHdf6lKieyFIYmgzhQ7vyBIDBA7dBzdW6NGiEGvt3KKquFnl7BsH9W7Z28RGg')`,
                  }}
                ></div>
                <div>
                  <h4 className="font-bold text-white text-base sm:text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    Công bố dàn diễn viên chính thức cho dự án phim mới của
                    Marvel
                  </h4>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    Sau nhiều đồn đoán, cuối cùng Marvel Studios cũng đã chính
                    thức xác nhận những cái tên sẽ góp mặt...
                  </p>
                  <span className="text-xs text-gray-500 mt-2 block">
                    5 giờ trước
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
