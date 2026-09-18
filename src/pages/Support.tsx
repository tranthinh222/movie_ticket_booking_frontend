import { Link } from "react-router";

const questions = [
  ["Tôi không đăng nhập được?", "Kiểm tra email và mật khẩu, cùng thông báo lỗi bên dưới biểu mẫu. Nếu quên mật khẩu, dùng chức năng Quên mật khẩu để nhận mã xác thực và đặt mật khẩu mới."],
  ["Làm sao để đặt vé?", "Chọn phim, khu vực, rạp, ngày và suất chiếu. Chọn ghế còn trống, kiểm tra thông tin rồi chuyển sang thanh toán. Bạn cần đăng nhập để đặt vé."],
  ["Phim không có suất chiếu?", "Thử ngày khác hoặc rạp khác. Chỉ những suất chiếu còn đặt được mới xuất hiện; một phim có trong danh sách chưa chắc có lịch tại rạp và ngày bạn chọn."],
  ["Thời gian giữ ghế đã hết thì sao?", "Quay lại trang đặt vé và chọn ghế lại. Ghế được giữ tạm thời trong quá trình đặt và có thể được người khác chọn khi thời gian giữ hết."],
  ["Tôi sử dụng mã ưu đãi thế nào?", "Xem mã và điều kiện tại trang Khuyến mãi. Nhập mã ở bước thanh toán và kiểm tra số tiền sau giảm trước khi xác nhận. Mỗi đơn sử dụng một mã."],
  ["Thanh toán tại quầy như thế nào?", "Chọn Thanh toán tại quầy, xác nhận đặt vé và kiểm tra đơn trong Lịch sử đặt vé. Vui lòng đến quầy thanh toán trước khi suất chiếu bắt đầu."],
  ["Thanh toán trực tuyến báo lỗi?", "Kiểm tra trạng thái đơn trong Lịch sử đặt vé trước khi thử lại. Nếu đã bị trừ tiền nhưng đơn chưa cập nhật, giữ mã đơn và mã giao dịch để đối chiếu với rạp hoặc cổng thanh toán; không gửi mật khẩu hoặc mã OTP."],
  ["Tôi xem vé đã đặt ở đâu?", "Mở menu tài khoản ở góc trên và chọn Lịch sử đặt vé để xem phim, ghế, suất chiếu và thông tin đơn."],
  ["Trợ lý CineMovie giúp được gì?", "Bạn có thể hỏi phim theo thể loại, ngày, thời lượng hoặc ngân sách, tra cứu ưu đãi và nhờ gợi ý ghế cho suất đã chọn. Gợi ý chưa tự giữ ghế hay áp dụng mã vào đơn."]
];

export default function Support() {
  return <article className="max-w-[900px] mx-auto px-6 py-12 text-gray-900 dark:text-white">
    <Link to="/" className="text-primary hover:underline">← Về trang chủ</Link>
    <h1 className="text-3xl md:text-4xl font-bold mt-6 mb-4">Trợ giúp</h1>
    <p className="text-gray-600 dark:text-gray-400 leading-7 mb-8">Hướng dẫn tài khoản, đặt vé và thanh toán trên CineMovie.</p>
    <nav aria-label="Liên kết trợ giúp" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <Link to="/forgot-password" className="flex items-center justify-center rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 text-primary font-semibold text-center transition-colors hover:bg-primary/10 hover:border-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">Quên mật khẩu</Link>
      <Link to="/booking-history" className="flex items-center justify-center rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 text-primary font-semibold text-center transition-colors hover:bg-primary/10 hover:border-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">Lịch sử đặt vé</Link>
      <Link to="/promotion" className="flex items-center justify-center rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 text-primary font-semibold text-center transition-colors hover:bg-primary/10 hover:border-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">Xem ưu đãi</Link>
    </nav>
    <div className="space-y-4">{questions.map(([title, text]) => <details key={title} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2d161b] p-6">
      <summary className="text-lg font-semibold cursor-pointer">{title}</summary>
      <p className="text-gray-600 dark:text-gray-300 leading-7 mt-4">{text}</p>
    </details>)}</div>
  </article>;
}
