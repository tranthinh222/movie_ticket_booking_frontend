import { useState } from "react";
import { Link, useNavigate } from "react-router";
import authApi from "../services/api-auth";
import { message } from "antd";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      message.error("Vui lòng nhập email!");
      return;
    }
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      message.success("Mã xác thực đã được gửi đến email của bạn!");
      navigate("/verify-otp", { state: { email } });
    } catch (error: any) {
      message.error(error.message || "Gửi mã thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-[calc(100vh-64px)] flex flex-col overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Main Content Area with Background */}
      <main className="relative flex-grow flex items-center justify-center py-10 px-4">
        {/* Cinematic Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            alt="Dark movie theater background with bokeh lights"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJL1N-MkcL9K9Kr1l7pG0s3Bg-g_j55p9qbDe-phci0caG3OeQj-6wqiAda83s_jm5qE-12y4_Gd1qJFIbBoZQwgN4jlzjIxAgk4OuErpU3cA6cpKqtRe4h9Et85eH5sw0Gx5sxYpd0pRdklbgfDgCaQooRbXK2tFYkquNzKM03O1HT0DyFuLaFdABH3lWZmbhIBdHpa6jWZLqHaafHj6we_OcGfSyx1id4n_bW-iZNulTjpyXKZU7VOkgEnUbM6oV_wfXLiQy1pA"
          />
          <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
        </div>

        {/* Forgot Password Card */}
        <div className="relative z-10 w-full max-w-[520px] bg-[#221114]/95 border border-[#482329] shadow-2xl rounded-2xl p-6 md:p-10 backdrop-blur-md">
          {/* Page Heading Component */}
          <div className="flex flex-col gap-3 mb-8 text-center">
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">
                  lock_reset
                </span>
              </div>
            </div>
            <h1 className="text-white tracking-light text-[32px] font-bold leading-tight">
              Quên mật khẩu?
            </h1>
            <p className="text-[#c9929b] text-sm font-normal leading-normal max-w-md mx-auto">
              Đừng lo lắng. Hãy nhập email của bạn, chúng tôi sẽ gửi mã để đặt
              lại mật khẩu.
            </p>
          </div>

          {/* Form Component */}
          <form className="flex flex-col gap-6" onSubmit={handleSendOtp}>
            <div className="flex flex-col gap-2">
              <label
                className="text-white text-base font-medium leading-normal"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#c9929b] group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 rounded-lg text-white border border-[#67323b] bg-[#33191e] h-14 placeholder:text-[#c9929b]/70 p-[15px] pl-12 text-base font-normal leading-normal focus:outline-0 focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner"
                  id="email"
                  placeholder="Nhập email của bạn"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex pt-2">
              <button
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#ec1337] hover:bg-[#ff1e43] active:scale-[0.98] transition-all text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/20"
              >
                <span className="truncate">
                  {loading ? "Đang gửi..." : "Gửi mã xác thực"}
                </span>
                {!loading && (
                  <span className="material-symbols-outlined ml-2 text-xl">
                    send
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Meta Text Component */}
          <div className="mt-6 pt-6 border-t border-[#482329]">
            <p className="text-[#c9929b] text-sm font-normal leading-normal text-center">
              Bạn đã nhớ ra mật khẩu?
              <Link
                className="text-white font-semibold hover:text-primary transition-colors hover:underline ml-1"
                to="/login"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          {/* Support Link (Extra) */}
          <div className="mt-4 text-center">
            <Link
              className="inline-flex items-center gap-1 text-[#8a5a62] text-xs hover:text-[#c9929b] transition-colors"
              to="#"
            >
              <span className="material-symbols-outlined text-sm">help</span>
              Cần sự trợ giúp?
            </Link>
          </div>
        </div>
      </main>

      {/* Optional Footer */}
      <footer className="relative z-20 py-6 text-center text-xs text-[#c9929b]/60">
        <p>© 2024 MovieStream. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ForgotPassword;
