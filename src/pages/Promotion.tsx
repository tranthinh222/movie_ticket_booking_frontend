const Promotion: React.FC = () => {
  return (
    <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 flex flex-col gap-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb">
        <div className="flex flex-wrap gap-2 items-center">
          <a
            className="text-[#c9929b] text-sm font-medium hover:text-primary transition-colors"
            href="#"
          >
            Trang chủ
          </a>
          <span className="text-[#c9929b] text-sm font-medium">/</span>
          <span aria-current="page" className="text-white text-sm font-medium">
            Khuyến mãi
          </span>
        </div>
      </nav>

      {/* Page Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
            Ưu đãi &amp; Khuyến mãi
          </h1>
          <p className="text-[#c9929b] text-base font-normal">
            Khám phá các ưu đãi độc quyền dành cho tín đồ điện ảnh
          </p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="overflow-x-auto hide-scrollbar pb-2">
        <div className="flex gap-3 min-w-max">
          <button className="flex h-9 items-center justify-center gap-x-2 rounded-full bg-primary px-5 hover:opacity-90 transition-opacity">
            <span className="text-white text-sm font-medium">Tất cả</span>
          </button>
          <button className="flex h-9 items-center justify-center gap-x-2 rounded-full bg-[#482329] px-5 hover:bg-[#5a2d35] transition-colors group">
            <span className="text-white text-sm font-medium group-hover:text-primary transition-colors">
              Vé phim
            </span>
          </button>
          <button className="flex h-9 items-center justify-center gap-x-2 rounded-full bg-[#482329] px-5 hover:bg-[#5a2d35] transition-colors group">
            <span className="text-white text-sm font-medium group-hover:text-primary transition-colors">
              Bắp nước
            </span>
          </button>
          <button className="flex h-9 items-center justify-center gap-x-2 rounded-full bg-[#482329] px-5 hover:bg-[#5a2d35] transition-colors group">
            <span className="text-white text-sm font-medium group-hover:text-primary transition-colors">
              Đối tác
            </span>
          </button>
          <button className="flex h-9 items-center justify-center gap-x-2 rounded-full bg-[#482329] px-5 hover:bg-[#5a2d35] transition-colors group">
            <span className="text-white text-sm font-medium group-hover:text-primary transition-colors">
              Thành viên
            </span>
          </button>
        </div>
      </div>

      {/* Featured Section */}
      <section>
        <div className="flex flex-col md:flex-row items-stretch overflow-hidden rounded-2xl shadow-lg bg-[#33191e] group hover:shadow-xl transition-all duration-300">
          <div
            className="w-full md:w-3/5 bg-center bg-no-repeat bg-cover min-h-[240px] md:min-h-[320px] relative overflow-hidden"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDVZdJJkl8bwUvWfhqp33i0aXVpSV_hBmnaJxPgwArH09WZHHX38pjw1vA-LCGjnybXdGYmPRjz2LLHKSwOXE34DCkdxzlh-WHMNQqaeAok3Fa02y8rUWjMdQTt8w5hqE42CFNPN8t-VPDksqgZfjBJ-6FKAyv58avN_8SRvYUhLrevCSblYYJ-wsUifqZYgLe25S-Aqsq8HyUD_LV2Qg5mwQSxNHKo49OQXZQvK7k713cv8IW1FHtvUHEjYcSzjUg1sM7Wgw6dhhc")',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#33191e]/90"></div>
            <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              Nổi bật
            </div>
          </div>
          <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-center gap-4 relative z-10">
            <div className="flex flex-col gap-2">
              <h2 className="text-white text-2xl md:text-3xl font-black leading-tight">
                Big Summer Sale - Vé chỉ từ 45k
              </h2>
              <p className="text-[#c9929b] text-base leading-relaxed">
                Áp dụng cho mọi suất chiếu trong tháng này. Đừng bỏ lỡ cơ hội
                thưởng thức bom tấn giá rẻ cùng bạn bè và người thân!
              </p>
            </div>
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="material-symbols-outlined text-[18px]">
                  calendar_today
                </span>
                <span>Hết hạn: 31/08/2023</span>
              </div>
              <button className="w-fit cursor-pointer items-center justify-center rounded-lg h-10 px-6 bg-primary hover:bg-red-600 text-white text-sm font-bold transition-colors shadow-lg shadow-primary/30 mt-2">
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Promotions Grid */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-xl font-bold">Mới nhất</h3>
          <a
            className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
            href="#"
          >
            Xem tất cả{" "}
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="flex flex-col rounded-xl overflow-hidden bg-[#33191e] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full">
            <div className="relative w-full aspect-video overflow-hidden">
              <div
                className="w-full h-full bg-center bg-cover bg-no-repeat group-hover:scale-105 transition-transform duration-500"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC9qxqcDMJrKlg0KLc0sYUmnLSeunc5Tf4neEfewzLErj1X22E7GVvvIBO-l4XWe70e69sNfYIhFL3jGS8j4jPhwzX2NIamW6b_wOl92k2t1Z55F4b16JrIbEC5ScpLGJljaDfl4-IM6tSlSr1R3Oylq5h6qc3KVNnIPy4H_4zorKWT1LoGKYFygvBBeSz18uV2unaXsoYGdz1sm3lYdrVTCLym65Hp69zjCMzdsy1hSO_A9c6DZnFYb5rh6AwoI9OyUrGMuJD4P4I")',
                }}
              ></div>
              <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                -50%
              </div>
            </div>
            <div className="p-5 flex flex-col gap-3 flex-1">
              <div className="flex-1">
                <h4 className="text-white text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
                  Combo Bắp Nước Siêu Hời
                </h4>
                <p className="text-[#c9929b] text-sm line-clamp-2">
                  Giảm ngay 50% khi mua combo bắp nước size L cho thành viên
                  mới.
                </p>
              </div>
              <div className="border-t border-white/10 pt-4 mt-auto flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400 bg-white/5 px-2 py-1 rounded">
                  Bắp nước
                </span>
                <button className="text-primary text-sm font-semibold hover:underline">
                  Chi tiết
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col rounded-xl overflow-hidden bg-[#33191e] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full">
            <div className="relative w-full aspect-video overflow-hidden">
              <div
                className="w-full h-full bg-center bg-cover bg-no-repeat group-hover:scale-105 transition-transform duration-500"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB34Zy7yvitt3fsvCyvMgUgLwFcOeMHy4d_k4m1olRBrVFgwrsSa1p94we_fvxYKkYc9mOPWxo-tWvWbSesOqB67vDOESQjO-EZ_5165pUOEzMJXDtjr9NvBb86GjeBG1gKDo6SdOXbqzmFSwhMuhJr6JcVgbDsVVUursVVh8Wi3lCTwAs_7rutT-K8GD5kBICRVzPcxGJscFL8A80Pz9BJjwVKrKNxyMJd6niTEUVcX5chvMHLqlioD9OGZtnnRUL5MAeBLozZ08s")',
                }}
              ></div>
              <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                U22
              </div>
            </div>
            <div className="p-5 flex flex-col gap-3 flex-1">
              <div className="flex-1">
                <h4 className="text-white text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
                  Ưu Đãi Học Sinh - Sinh Viên
                </h4>
                <p className="text-[#c9929b] text-sm line-clamp-2">
                  Đồng giá 55k cho vé 2D tất cả các ngày trong tuần. Chỉ cần thẻ
                  HSSV/CCCD.
                </p>
              </div>
              <div className="border-t border-white/10 pt-4 mt-auto flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400 bg-white/5 px-2 py-1 rounded">
                  Thành viên
                </span>
                <button className="text-primary text-sm font-semibold hover:underline">
                  Chi tiết
                </button>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col rounded-xl overflow-hidden bg-[#33191e] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full">
            <div className="relative w-full aspect-video overflow-hidden">
              <div
                className="w-full h-full bg-center bg-cover bg-no-repeat group-hover:scale-105 transition-transform duration-500"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBiTWD8GPMGaMi6uTU1Cb85yxhGluwJg3tPn53pRUvQ5vwlg5qI4sFfSq6tWJmKGf922BXxgz8HG1br1UA5V0JvHcr6lLEVfevrIrStfo76NliqLghXkFGodRf9zW36FDx4agvhqvFyT0mUAwrkbZYynDrFycWpPRChNrsPVlvmlPCZFo5AF6AEo7_N3UjM2jrpztkklu892xDyUKwcr3iOiF3aDI8DHFxldFVdDfQPn32d8GRfYz_jg8LI2zETZ9wWw4u7AKaoSVI")',
                }}
              ></div>
              <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                Đối tác
              </div>
            </div>
            <div className="p-5 flex flex-col gap-3 flex-1">
              <div className="flex-1">
                <h4 className="text-white text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
                  Thanh Toán VNPAY - Giảm 20k
                </h4>
                <p className="text-[#c9929b] text-sm line-clamp-2">
                  Nhập mã CINEMAVNPAY giảm ngay 20k cho hóa đơn từ 100k.
                </p>
              </div>
              <div className="border-t border-white/10 pt-4 mt-auto flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400 bg-white/5 px-2 py-1 rounded">
                  Đối tác
                </span>
                <button className="text-primary text-sm font-semibold hover:underline">
                  Chi tiết
                </button>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="flex flex-col rounded-xl overflow-hidden bg-[#33191e] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full">
            <div className="relative w-full aspect-video overflow-hidden">
              <div
                className="w-full h-full bg-center bg-cover bg-no-repeat group-hover:scale-105 transition-transform duration-500"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA0dtCJD2tfErlEXoxwUymXVMkFWqPTTNxvANJKiHgRJ11ythxOtlfzxgAC7KuFLEml7NozxWjZZB1d7HpP84Do6PPY5OidqZekfnnZ32O79U8tfOlmjdr1OC6vdMTBXeAUPa3pn-pisLQD2Qh6QvO-rOX9T50RrvYq4SrLR8_LH-vEC8wIhSJVGpJdXlrNV42ZMhpR6le-VP1I4bYFwD9BcV5XqoR5WgOeg27U8TJ3nu8FPs2uHA6IFmvZADv1JBjoa0_j1Op67MA")',
                }}
              ></div>
              <div className="absolute top-3 right-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded shadow-sm">
                HOT
              </div>
            </div>
            <div className="p-5 flex flex-col gap-3 flex-1">
              <div className="flex-1">
                <h4 className="text-white text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
                  Thứ 3 Vui Vẻ - Happy Tuesday
                </h4>
                <p className="text-[#c9929b] text-sm line-clamp-2">
                  Giá vé ưu đãi đặc biệt vào ngày thứ 3 hàng tuần cho tất cả
                  thành viên.
                </p>
              </div>
              <div className="border-t border-white/10 pt-4 mt-auto flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400 bg-white/5 px-2 py-1 rounded">
                  Vé phim
                </span>
                <button className="text-primary text-sm font-semibold hover:underline">
                  Chi tiết
                </button>
              </div>
            </div>
          </div>

          {/* Card 5 */}
          <div className="flex flex-col rounded-xl overflow-hidden bg-[#33191e] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full">
            <div className="relative w-full aspect-video overflow-hidden">
              <div
                className="w-full h-full bg-center bg-cover bg-no-repeat group-hover:scale-105 transition-transform duration-500"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDzaSVVAebmdE_tdXwe6GRqRgbBJ81Jzde9GsXPgA-UofqheUsV4DKSc0allOnSPteTAtyRr2ON30htqNoxGHJyLTZ82Ikv3UDSI55l9oZmlprIsX3_SsaoBxY8GwfUgeiEwUxEJXCL0uyEIFSwv6lcJOFQ6jUnIT13-qb8Ri5_VQPPgpwqSgPCpGkvC6dvnsqSIm7EB5GxC6y1Ms-Aa0F0Ks-exiMgF-j74tBnhzpb_KQSRn6vy2I6rmHtMoAy81E73HIwd9TUFDE")',
                }}
              ></div>
            </div>
            <div className="p-5 flex flex-col gap-3 flex-1">
              <div className="flex-1">
                <h4 className="text-white text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
                  Nâng Hạng Thành Viên Gold
                </h4>
                <p className="text-[#c9929b] text-sm line-clamp-2">
                  Tích điểm đổi quà và nhận vé miễn phí sinh nhật khi nâng hạng
                  thẻ.
                </p>
              </div>
              <div className="border-t border-white/10 pt-4 mt-auto flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400 bg-white/5 px-2 py-1 rounded">
                  Thành viên
                </span>
                <button className="text-primary text-sm font-semibold hover:underline">
                  Chi tiết
                </button>
              </div>
            </div>
          </div>

          {/* Card 6 */}
          <div className="flex flex-col rounded-xl overflow-hidden bg-[#33191e] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full">
            <div className="relative w-full aspect-video overflow-hidden">
              <div
                className="w-full h-full bg-center bg-cover bg-no-repeat group-hover:scale-105 transition-transform duration-500"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBGBPxsqEzSFh66duREDHM-rOzxcjU-WJcvMdnOppGMBWRFUiNafLAQLE5NYnF0GWolmJR8i00i8cdVoLzmAaPTWzxnuyDZwtdwkUuk4P0tPfLfptwovP1Gy5-z6FKln1dEsnJjIRXxfNJJxUe0WCDgxWMI-HDtfWL7ZH_Wx6QEQedN3k306EzXllEXhlIFOJ9HRLd4bDhdIcBrFvVTjG7Um8fJ8fM8LrjnNIDDlX-peaImrdlGAPsjCctr_55ZkbSZd6xum2raakA")',
                }}
              ></div>
              <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                Mới
              </div>
            </div>
            <div className="p-5 flex flex-col gap-3 flex-1">
              <div className="flex-1">
                <h4 className="text-white text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
                  Thuê Rạp Riêng - Private Cinema
                </h4>
                <p className="text-[#c9929b] text-sm line-clamp-2">
                  Tận hưởng không gian riêng tư cùng nhóm bạn với gói thuê phòng
                  chiếu mini.
                </p>
              </div>
              <div className="border-t border-white/10 pt-4 mt-auto flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400 bg-white/5 px-2 py-1 rounded">
                  Dịch vụ
                </span>
                <button className="text-primary text-sm font-semibold hover:underline">
                  Chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA Secondary */}
      <section className="mt-8 rounded-2xl bg-gradient-to-r from-[#33191e] via-[#4a242b] to-[#33191e] p-8 md:p-12 text-center border border-white/5">
        <h3 className="text-white text-2xl font-bold mb-3">
          Không muốn bỏ lỡ ưu đãi?
        </h3>
        <p className="text-[#c9929b] mb-6 max-w-md mx-auto">
          Đăng ký nhận tin để cập nhật những chương trình khuyến mãi hấp dẫn
          nhất mỗi tuần.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            className="flex-1 rounded-lg border-none bg-[#482329] px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none placeholder:text-[#c9929b]"
            placeholder="Email của bạn"
            type="email"
          />
          <button
            className="bg-primary hover:bg-red-600 text-white font-bold py-2.5 px-6 rounded-lg transition-colors"
            type="button"
          >
            Đăng ký
          </button>
        </form>
      </section>
    </main>
  );
};

export default Promotion;
