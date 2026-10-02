import { Link } from "react-router";

const FooterLogo = () => (
  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
    <svg className="size-7" fill="none" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor" />
      <path clipRule="evenodd" d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z" fill="currentColor" fillRule="evenodd" />
    </svg>
  </div>
);

const footerLinks = {
  "Khám phá": [
    { label: "Phim đang chiếu", to: "/movie" },
    { label: "Hệ thống rạp", to: "/theater" },
    { label: "Tin tức điện ảnh", to: "/news" },
    { label: "Khuyến mãi", to: "/promotion" },
  ],
  "Hỗ trợ": [
    { label: "Trung tâm hỗ trợ", to: "/support" },
    { label: "Điều khoản sử dụng", to: "/terms" },
    { label: "Chính sách bảo mật", to: "/privacy" },
  ],
};

const Footer: React.FC = () => {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 bg-[#12090b] text-white">
      <div className="pointer-events-none absolute -left-24 top-8 size-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="mx-auto w-full max-w-[1280px] px-5 py-12 md:px-10 lg:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.15fr]">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center gap-3" aria-label="Về trang chủ CineMovie">
              <FooterLogo />
              <span className="text-xl font-extrabold tracking-tight">CineMovie</span>
            </Link>
            <p className="mt-5 text-sm leading-7 text-[#bd9299]">
              Chạm đến thế giới điện ảnh với lịch chiếu mới nhất, hệ thống rạp hiện đại và trải nghiệm đặt vé nhanh chóng.
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm text-[#d6adb4]">
              <span className="material-symbols-outlined text-lg text-primary">verified_user</span>
              Đặt vé an toàn, thuận tiện
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <nav key={title} aria-label={title}>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-white">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-[#bd9299] transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <span className="material-symbols-outlined text-3xl text-primary">confirmation_number</span>
            <h3 className="mt-3 text-lg font-bold">Sẵn sàng xem phim?</h3>
            <p className="mt-2 text-sm leading-6 text-[#bd9299]">
              Chọn bộ phim yêu thích và giữ ngay vị trí đẹp nhất của bạn.
            </p>
            <Link to="/movie" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#ff294c]">
              Chọn phim ngay
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-[#8f7075] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CineMovie. Mọi quyền được bảo lưu.</p>
          <p className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-primary">movie</span>
            Điện ảnh hay, khoảnh khắc đẹp
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
