const News: React.FC = () => {
  return (
    <main className="flex-1 flex flex-col items-center w-full">
      <div className="w-full max-w-[1200px] px-4 md:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="mb-10">
          <div className="group relative overflow-hidden rounded-xl shadow-2xl">
            <div
              className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-start justify-end p-6 md:p-10 transition-transform duration-700 hover:scale-105"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(34, 16, 19, 1) 0%, rgba(34, 16, 19, 0.4) 50%, rgba(0, 0, 0, 0) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuArmkqQE_epUSmiPGYEWZ1RgdXqoegqHVU5EX2JYaET7PTK3rQZm_xL7y4_49k-jcy21hzo14pxISfWqFMrzCvwTczQK-CZxZ-bnYn9xX07Xt9pRq5zCJwvQIyPvWmbMnyocakNG_7OGvn01SRE6ZvfH_zk3wm3p_uzn271IZHQOJG950y6Q9MnfRxTYkTCpDnSNWZFgnVisAMVrr6F5ljJe9G_Td6bbEc_IFVp2mnD0K7SfX2v2GHeOgieoJExRRk_bc5tf9OxE38")`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-90"></div>
              <div className="relative z-10 flex flex-col gap-3 text-left max-w-2xl">
                <span className="inline-flex items-center gap-1 w-fit px-3 py-1 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">
                    star
                  </span>{" "}
                  Spotlight
                </span>
                <h1 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-tight drop-shadow-lg">
                  Review: Oppenheimer - Kiệt tác điện ảnh hay chỉ là sự cường
                  điệu?
                </h1>
                <p className="text-gray-200 text-sm md:text-lg font-normal leading-relaxed line-clamp-2 md:line-clamp-none drop-shadow-md">
                  Khám phá những góc nhìn sâu sắc về bộ phim bom tấn lịch sử mới
                  nhất của Christopher Nolan và tác động của nó đến nền điện ảnh
                  đương đại.
                </p>
                <div className="flex gap-4 mt-2">
                  <button className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary hover:bg-red-600 text-white text-base font-bold transition-all transform hover:translate-y-[-2px]">
                    <span>Đọc ngay</span>
                    <span className="material-symbols-outlined text-[20px]">
                      arrow_forward
                    </span>
                  </button>
                  <button className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-white/10 hover:bg-white/20 text-white text-base font-bold backdrop-blur-sm transition-all">
                    <span className="material-symbols-outlined text-[20px]">
                      bookmark
                    </span>
                    <span>Lưu lại</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <h1 className="text-white text-3xl font-bold leading-tight flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">
              newspaper
            </span>
            Tin tức mới nhất
          </h1>

          {/* Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary px-4 hover:bg-red-600 transition-colors">
              <p className="text-white text-sm font-bold">Tất cả</p>
            </button>
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#2f161a] border border-[#482329] px-4 hover:border-primary hover:text-primary transition-all group">
              <p className="text-gray-300 group-hover:text-primary text-sm font-medium">
                Tin mới
              </p>
            </button>
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#2f161a] border border-[#482329] px-4 hover:border-primary hover:text-primary transition-all group">
              <p className="text-gray-300 group-hover:text-primary text-sm font-medium">
                Review phim
              </p>
            </button>
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#2f161a] border border-[#482329] px-4 hover:border-primary hover:text-primary transition-all group">
              <p className="text-gray-300 group-hover:text-primary text-sm font-medium">
                Sắp chiếu
              </p>
            </button>
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#2f161a] border border-[#482329] px-4 hover:border-primary hover:text-primary transition-all group">
              <p className="text-gray-300 group-hover:text-primary text-sm font-medium">
                Diễn viên
              </p>
            </button>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <article className="flex flex-col gap-3 group cursor-pointer bg-[#2f161a] rounded-xl p-3 border border-[#482329] hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
            <div className="relative w-full aspect-video overflow-hidden rounded-lg">
              <div
                className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBpv8NyImhJo-WQK7Uk38DqNFzDAtEmasWtti4uSpja5X_XjECgzcFPbgKNg4TCXLJ3CtagCL_pSXevbde_5K5FwmWE5TRQt_UIhJMMDsH9LQCDRFV2g9UckrC4QQjeQbS8ZHhZycVolvstT-uYI7q1gL9Db2Aw_cG7C0Rm80QjkFNfY4wyvklItliGuyNqIAyWcwJ7qApVQrneooilAgF3LYi8bFvTIQRwSR5TYI3Qg3Dd6nQ875li3G1RmdZZ7bFzRUpvOGEn5QA")',
                }}
              ></div>
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                Top List
              </div>
            </div>
            <div className="flex flex-col flex-1 px-1">
              <div className="flex items-center gap-2 text-xs text-primary font-bold mb-1">
                <span className="material-symbols-outlined text-[14px]">
                  calendar_today
                </span>{" "}
                2 giờ trước
              </div>
              <h3 className="text-white text-lg font-bold leading-snug group-hover:text-primary transition-colors mb-2">
                Top 10 phim kinh dị đáng xem nhất tháng 10
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                Tổng hợp danh sách phim kinh dị hay nhất cho mùa Halloween này,
                từ những tác phẩm kinh điển đến những bộ phim mới ra mắt đầy ám
                ảnh.
              </p>
            </div>
          </article>

          {/* Card 2 */}
          <article className="flex flex-col gap-3 group cursor-pointer bg-[#2f161a] rounded-xl p-3 border border-[#482329] hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
            <div className="relative w-full aspect-video overflow-hidden rounded-lg">
              <div
                className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCm5IZcvFOTi36DWlXoneco4jOhx2F5ReIzcPAWew-Ox_BSHdKmzV4hwDEacPdKGgDrkoyMm1C1WALg0Ps5dzEbGY_alGEIMK3AvcZZn6lLqiVaPLgAAKwvT7fORRChowtx5SgxdvczXSnIn3QTzUCFQ_0SP0zeQoMb2Nzy7ySkbaCdnoBFcOfFn2xvTy9mM68IlD56cf8F7EoFCuOLFa0AhRpw3Fi2p0n_GJQZz6vfKlZ8PyTrYuS1nAzdRB--NswItyePNsZ7y4E")',
                }}
              ></div>
              <div className="absolute top-2 left-2 bg-primary/90 px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                Tin nóng
              </div>
            </div>
            <div className="flex flex-col flex-1 px-1">
              <div className="flex items-center gap-2 text-xs text-primary font-bold mb-1">
                <span className="material-symbols-outlined text-[14px]">
                  calendar_today
                </span>{" "}
                4 giờ trước
              </div>
              <h3 className="text-white text-lg font-bold leading-snug group-hover:text-primary transition-colors mb-2">
                Marvel công bố dàn diễn viên cho dự án mới
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                Thông tin mới nhất về phase 5 của vũ trụ điện ảnh Marvel vừa
                được Kevin Feige tiết lộ tại Comic-Con, hứa hẹn nhiều bất ngờ.
              </p>
            </div>
          </article>

          {/* Card 3 */}
          <article className="flex flex-col gap-3 group cursor-pointer bg-[#2f161a] rounded-xl p-3 border border-[#482329] hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
            <div className="relative w-full aspect-video overflow-hidden rounded-lg">
              <div
                className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_J3AV8s3sp_ujX9Qul3FK2jHHCwFFXauv4oOJX-SWXF0kbT-2FIicbyCHvqb1Q-W_U4NFGau4tLbAqvLAXYPtRTCOUjdiURictTCgLWBV68ItGThYHmRwKmxOwIVfGUL9DQWNRcin_08deH_PvJET4zMP85_N90m34bLKC1Bwcxfxfv-DQX3MSUPo7KqgWUlhZnfIfm-URoFb54_4G3Nae1lAT6u9AHw46NMyAU3kdvLA0zW40TJ29wNqhPjIE_YoJ0vu1A4iXJA")',
                }}
              ></div>
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                Phân tích
              </div>
            </div>
            <div className="flex flex-col flex-1 px-1">
              <div className="flex items-center gap-2 text-xs text-primary font-bold mb-1">
                <span className="material-symbols-outlined text-[14px]">
                  calendar_today
                </span>{" "}
                1 ngày trước
              </div>
              <h3 className="text-white text-lg font-bold leading-snug group-hover:text-primary transition-colors mb-2">
                Phân tích trailer: Dune Part 2
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                Những chi tiết ẩn giấu bạn có thể đã bỏ lỡ trong trailer mới
                nhất của Dune Part 2. Tương lai của Arrakis sẽ ra sao?
              </p>
            </div>
          </article>

          {/* Card 4 */}
          <article className="flex flex-col gap-3 group cursor-pointer bg-[#2f161a] rounded-xl p-3 border border-[#482329] hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
            <div className="relative w-full aspect-video overflow-hidden rounded-lg">
              <div
                className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCFnJ6zcl5Edjjhz2vI10hrB3wuo_rGA-BccLFafy4RfKgZeejFd7xdcLc-dkcjBRJ76FP6rQmh5p2A7VEh4ya_38kke1z6dttaa82cnWktGTAkA3KC3vXLwUH7qFrJOVuVHJ91aOJMQGxwjLUh-Fk1JJYUjbbRf8UdUzcuT7IaMINnh0B4kEzLKQUxB30L8ky9YPUGYtQuAJ5-IDcNWhMBhOcgP5YEpVRcTYOBIajtS_Xztvf2EcQ15lEoaFq6wq5OgwK4n8Gs5Ms")',
                }}
              ></div>
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                Sự kiện
              </div>
            </div>
            <div className="flex flex-col flex-1 px-1">
              <div className="flex items-center gap-2 text-xs text-primary font-bold mb-1">
                <span className="material-symbols-outlined text-[14px]">
                  calendar_today
                </span>{" "}
                2 ngày trước
              </div>
              <h3 className="text-white text-lg font-bold leading-snug group-hover:text-primary transition-colors mb-2">
                Oscar 2024: Những ứng cử viên sáng giá
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                Dự đoán sớm về các bộ phim sẽ thống trị lễ trao giải năm sau.
                Liệu có bất ngờ nào từ các hãng phim độc lập?
              </p>
            </div>
          </article>

          {/* Card 5 */}
          <article className="flex flex-col gap-3 group cursor-pointer bg-[#2f161a] rounded-xl p-3 border border-[#482329] hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
            <div className="relative w-full aspect-video overflow-hidden rounded-lg">
              <div
                className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDMuiJyWIr56RN45ceOPW3bUx77D95OZo3oIap-0ac6BqQtxn-zcYvry6P54QDYWFv5Ji-X4o0WmSq-cz14LqztYeFEmrFVajAG6JPXAVw_RFa6rAst8eA0RYdtaTxCnIkf-Cc3ZcoLuBW9p_L5vrrz7mrkjHYYWvUuVmL4fCPLof0semHQA5Wts4ZNy6RhZ4upInkaCy5I5YuQmzXjC7e5i7HylEhVwjK3iVYue73iZtNSI2VEtwQaetxSxI6o3fcQRBrIi62XrwQ")',
                }}
              ></div>
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                Review
              </div>
            </div>
            <div className="flex flex-col flex-1 px-1">
              <div className="flex items-center gap-2 text-xs text-primary font-bold mb-1">
                <span className="material-symbols-outlined text-[14px]">
                  calendar_today
                </span>{" "}
                3 ngày trước
              </div>
              <h3 className="text-white text-lg font-bold leading-snug group-hover:text-primary transition-colors mb-2">
                Review: The Creator - Hình ảnh mãn nhãn
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                Đánh giá chi tiết về bộ phim khoa học viễn tưởng mới nhất.
                Gareth Edwards đã tạo ra một thế giới tuyệt đẹp nhưng liệu cốt
                truyện có đủ sức thuyết phục?
              </p>
            </div>
          </article>

          {/* Card 6 */}
          <article className="flex flex-col gap-3 group cursor-pointer bg-[#2f161a] rounded-xl p-3 border border-[#482329] hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
            <div className="relative w-full aspect-video overflow-hidden rounded-lg">
              <div
                className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAkqGMpCAzUZjSwVOe0IbjZnZRd8lLRsPD03gl-Fa2GpFJ_h8t2sqi8ho-CUbUmN96axKXYxOXQNSR_0xq-SyBDR-BNA3pSsnwIY3EeyGbxX59j6ypQ17rtF8g9_26dtw6Ci0tz6mH9zk22PszUA2m1yt5InN2PijngcDA5Sj4dahjDv0W-RlIrwXzO25-OTzQ19rlvid6mlq6MRPdZRlRUVOv9ESLog0sv6JinTysFwG4ovu5fUvOytvVCWxWMCZELtAbVGgOR0pE")',
                }}
              ></div>
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                Phỏng vấn
              </div>
            </div>
            <div className="flex flex-col flex-1 px-1">
              <div className="flex items-center gap-2 text-xs text-primary font-bold mb-1">
                <span className="material-symbols-outlined text-[14px]">
                  calendar_today
                </span>{" "}
                1 tuần trước
              </div>
              <h3 className="text-white text-lg font-bold leading-snug group-hover:text-primary transition-colors mb-2">
                Phỏng vấn độc quyền: Greta Gerwig
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                Chia sẻ về quá trình làm phim Barbie, những áp lực từ thương
                hiệu tỷ đô và tầm nhìn nghệ thuật của nữ đạo diễn tài năng.
              </p>
            </div>
          </article>
        </div>

        {/* Pagination / Load More */}
        <div className="flex justify-center pb-12">
          <button className="group flex items-center justify-center gap-2 bg-[#2f161a] border border-[#482329] hover:border-primary text-white font-medium py-3 px-8 rounded-lg transition-all hover:bg-white/5">
            <span className="group-hover:text-primary transition-colors">
              Xem thêm tin tức
            </span>
            <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform text-primary">
              expand_more
            </span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default News;
