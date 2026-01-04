import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import authApi from "../services/api-auth";
import { message } from "antd";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const resetToken = location.state?.resetToken || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!resetToken) {
      message.warning("Vui lòng xác thực mã OTP trước!");
      navigate("/forgot-password");
    }
  }, [resetToken, navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      message.error("Vui lòng nhập mật khẩu mới!");
      return;
    }
    if (password !== confirmPassword) {
      message.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword(resetToken, password);
      message.success("Đặt lại mật khẩu thành công!");
      navigate("/login");
    } catch (error: any) {
      message.error(error.message || "Đổi mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-[calc(100vh-64px)] flex flex-col overflow-x-hidden selection:bg-primary selection:text-white">
      <main className="relative flex-grow flex items-center justify-center py-10 px-4">
        <div className="absolute inset-0 z-0">
          <img
            alt="Dark movie theater background with bokeh lights"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJL1N-MkcL9K9Kr1l7pG0s3Bg-g_j55p9qbDe-phci0caG3OeQj-6wqiAda83s_jm5qE-12y4_Gd1qJFIbBoZQwgN4jlzjIxAgk4OuErpU3cA6cpKqtRe4h9Et85eH5sw0Gx5sxYpd0pRdklbgfDgCaQooRbXK2tFYkquNzKM03O1HT0DyFuLaFdABH3lWZmbhIBdHpa6jWZLqHaafHj6we_OcGfSyx1id4n_bW-iZNulTjpyXKZU7VOkgEnUbM6oV_wfXLiQy1pA"
          />
          <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-[520px] bg-[#221114]/95 border border-[#482329] shadow-2xl rounded-2xl p-6 md:p-10 backdrop-blur-md">
          <div className="flex flex-col gap-3 mb-8 text-center">
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
              <span className="material-symbols-outlined text-3xl">
                verified_user
              </span>
            </div>
            <h1 className="text-white tracking-light text-[32px] font-bold leading-tight">
              Đặt lại mật khẩu
            </h1>
            <p className="text-[#c9929b] text-sm font-normal leading-relaxed max-w-md mx-auto">
              Sắp xong rồi! Hãy nhập mật khẩu mới để tiếp tục.
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleResetPassword}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label
                  className="text-white text-base font-medium leading-normal"
                  htmlFor="password"
                >
                  Mật khẩu mới
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#c9929b] group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined">lock</span>
                  </div>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 rounded-lg text-white border border-[#67323b] bg-[#33191e] h-12 placeholder:text-[#c9929b]/70 p-[15px] pl-12 text-base font-normal leading-normal focus:outline-0 focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner"
                    id="password"
                    placeholder="Nhập mật khẩu mới"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  className="text-white text-base font-medium leading-normal"
                  htmlFor="confirmPassword"
                >
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#c9929b] group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined">lock</span>
                  </div>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 rounded-lg text-white border border-[#67323b] bg-[#33191e] h-12 placeholder:text-[#c9929b]/70 p-[15px] pl-12 text-base font-normal leading-normal focus:outline-0 focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner"
                    id="confirmPassword"
                    placeholder="Xác nhận mật khẩu mới"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex pt-2">
              <button
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#ec1337] hover:bg-[#ff1e43] active:scale-[0.98] transition-all text-white text-base font-bold shadow-lg shadow-primary/20"
              >
                <span className="truncate">
                  {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                </span>
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-[#482329]">
            <p className="text-[#c9929b] text-sm font-normal leading-normal text-center">
              Nhớ ra mật khẩu?
              <Link
                className="text-white font-semibold hover:text-primary transition-colors hover:underline ml-1"
                to="/login"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
