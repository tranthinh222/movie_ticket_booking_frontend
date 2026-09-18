import { Link } from "react-router";

const sections = [
  ["Tài khoản và thông tin", "Cung cấp thông tin chính xác khi đăng ký và đặt vé. Bạn cần giữ kín mật khẩu, không chia sẻ tài khoản và đăng xuất khi sử dụng thiết bị dùng chung."],
  ["Chọn phim và đặt vé", "Kiểm tra phim, rạp, ngày giờ, phòng chiếu và ghế trước khi xác nhận. Tình trạng ghế có thể thay đổi trong lúc bạn thao tác; ghế chỉ được giữ trong thời gian hiển thị trên ứng dụng."],
  ["Giá vé và ưu đãi", "Giá vé phụ thuộc phim và loại ghế. Mỗi đơn áp dụng một mã ưu đãi theo điều kiện và thời hạn của mã. Số tiền được kiểm tra lại ở bước thanh toán; gợi ý của trợ lý không thay thế tổng tiền của đơn hàng."],
  ["Thanh toán", "Với thanh toán tại quầy, vui lòng thanh toán tại rạp trước khi suất chiếu bắt đầu. Với thanh toán trực tuyến, hãy hoàn tất giao dịch tại cổng thanh toán và kiểm tra trạng thái đơn trong lịch sử đặt vé; việc mở trang thanh toán không có nghĩa giao dịch đã thành công."],
  ["Thay đổi và hủy vé", "Kiểm tra kỹ thông tin trước khi đặt. Không mặc định rằng vé đã đặt có thể đổi, hủy hoặc hoàn tiền; khả năng xử lý phụ thuộc trạng thái đơn và quy định của rạp."],
  ["Sử dụng trợ lý", "Trợ lý hỗ trợ tìm phim, tra cứu ưu đãi và gợi ý ghế theo dữ liệu hiện có. Kết quả có thể thay đổi; gợi ý ghế không tự giữ ghế và gợi ý mã không tự áp dụng vào đơn. Không gửi thông tin nhạy cảm trong trò chuyện."],
  ["Sử dụng dịch vụ đúng mục đích", "Không cố truy cập tài khoản của người khác, can thiệp đơn hàng, lạm dụng việc giữ ghế hoặc làm gián đoạn hoạt động của ứng dụng. Nội dung và hình ảnh trên ứng dụng được cung cấp để tìm hiểu phim và đặt vé."]
];

export default function Terms() {
  return <article className="max-w-[900px] mx-auto px-6 py-12 text-gray-900 dark:text-white">
    <Link to="/" className="text-primary hover:underline">← Về trang chủ</Link>
    <h1 className="text-3xl md:text-4xl font-bold mt-6 mb-4">Điều khoản sử dụng</h1>
    <p className="text-gray-600 dark:text-gray-400 leading-7 mb-8">Vui lòng đọc các điều khoản dưới đây trước khi tạo tài khoản và đặt vé trên CineMovie.</p>
    <div className="space-y-6">{sections.map(([title, text]) => <section key={title} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2d161b] p-6">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <p className="text-gray-600 dark:text-gray-300 leading-7">{text}</p>
    </section>)}</div>
    <Link to="/privacy" className="inline-block mt-8 text-primary hover:underline">Xem Chính sách bảo mật →</Link>
  </article>;
}
