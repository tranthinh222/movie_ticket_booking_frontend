import { Link } from 'react-router'

const sections = [
  [
    'Thông tin tài khoản',
    'CineMovie sử dụng thông tin bạn cung cấp khi đăng ký và cập nhật hồ sơ để quản lý tài khoản, hỗ trợ đăng nhập và khôi phục mật khẩu.',
  ],
  [
    'Thông tin đặt vé',
    'Phim, rạp, suất chiếu, ghế, số tiền và trạng thái đặt vé được lưu để xử lý đơn hàng và hiển thị lịch sử đặt vé của bạn.',
  ],
  [
    'Thanh toán',
    'Khi chọn thanh toán trực tuyến, bạn được chuyển đến cổng thanh toán để thực hiện giao dịch. Hãy kiểm tra thông tin đơn hàng và chính sách của cổng thanh toán trước khi xác nhận.',
  ],
  [
    'Trò chuyện với trợ lý',
    'Khi gửi yêu cầu bằng ngôn ngữ tự nhiên, tin nhắn, lịch sử hội thoại gần đây và điều kiện tìm kiếm được gửi đến dịch vụ Gemini để hiểu yêu cầu. Không gửi mật khẩu, thông tin thẻ hoặc dữ liệu nhạy cảm trong chat. Bạn có thể bấm Trò chuyện mới để xóa ngữ cảnh hội thoại đang giữ trên giao diện.',
  ],
  [
    'Dịch vụ hình ảnh',
    'Ảnh được tải lên qua chức năng của ứng dụng được xử lý bởi dịch vụ lưu trữ Cloudinary để hiển thị trên CineMovie.',
  ],
  [
    'Quản lý thông tin của bạn',
    'Bạn có thể xem và chỉnh sửa thông tin trong trang tài khoản, đổi mật khẩu và xem lịch sử đặt vé. Hãy đăng xuất khi sử dụng thiết bị dùng chung.',
  ],
]

export default function Privacy() {
  return (
    <article className="max-w-[900px] mx-auto px-6 py-12 text-gray-900 dark:text-white">
      <Link to="/" className="text-primary hover:underline">
        ← Về trang chủ
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold mt-6 mb-4">
        Chính sách bảo mật
      </h1>
      <p className="text-gray-600 dark:text-gray-400 leading-7 mb-8">
        Tìm hiểu cách thông tin của bạn được sử dụng khi tạo tài khoản, đặt vé
        và trò chuyện với trợ lý CineMovie.
      </p>
      <div className="space-y-6">
        {sections.map(([title, text]) => (
          <section
            key={title}
            className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2d161b] p-6"
          >
            <h2 className="text-xl font-semibold mb-3">{title}</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-7">{text}</p>
          </section>
        ))}
      </div>
      <Link
        to="/profile"
        className="inline-block mt-8 text-primary hover:underline"
      >
        Quản lý tài khoản →
      </Link>
    </article>
  )
}
