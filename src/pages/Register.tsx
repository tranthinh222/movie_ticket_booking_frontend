import { useState } from "react";
import { Link, useNavigate } from "react-router";
import authApi from "../services/api-auth";

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }
    if (!username.trim()) {
      setError("Vui lòng nhập tên người dùng");
      return;
    }
    if (!password.trim()) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    if (!agreeTerms) {
      setError("Vui lòng đồng ý với điều khoản sử dụng");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register(username, email, password);

      if (response.statusCode === 200 || response.statusCode === 201) {
        // Registration successful, redirect to homepage
        navigate("/login");
      } else {
        // Handle error from backend
        const errorMessage =
          typeof response.message === "string"
            ? response.message
            : response.error || "Đăng ký thất bại. Vui lòng thử lại.";
        setError(errorMessage);
      }
    } catch (err: unknown) {
      console.error("Register error:", err);
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        setError(
          axiosError.response?.data?.message ||
            "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin."
        );
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
        <img
          alt="Cinematic movie poster montage background with dark overlay"
          className="w-full h-full object-cover opacity-40"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPRuU8NXxdsmZH8O71ep23FLe95iGQa0kSflAp6cmzhKJmQktnspF8Ew7Qhut3P8DRHqp3xO4G3EpIUyT17C4vH_ylXb6ujl90PPlbh6LGh7UXg8NicVl7JmunPOfTKo1hZoE1DR1-JXbn-VL1x40LQXTmWeyled050PVeQWP_dbomeLDO92jR7Lu5PSYz9xLFnZoMHzngTcd2uB7rYOLcHUZpcCCA9T5n2moWVi6pGeMpSTZ8P0neM2m_E_4FrsHpiuqLHld-CVk"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#221013] via-[#221013]/90 to-[#221013]/60"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap px-6 lg:px-10 py-4 lg:py-6">
          <Link
            to="/"
            className="flex items-center gap-4 text-white cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="size-8 text-primary">
              <svg
                viewBox="0 0 48 48"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                />
              </svg>
            </div>
            <h2 className="text-white text-xl lg:text-2xl font-black tracking-tight">
              CineMovie
            </h2>
          </Link>
          <Link
            to="/login"
            className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-colors"
          >
            <span className="truncate">Đăng nhập</span>
          </Link>
        </header>

        {/* Registration Form Section */}
        <main className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-[520px] bg-[#2d1519]/80 backdrop-blur-md border border-[#482329] rounded-2xl p-6 sm:p-10 shadow-2xl">
            {/* Heading */}
            <div className="mb-8 text-center sm:text-left">
              <h1 className="text-white text-3xl sm:text-4xl font-black leading-tight tracking-tight mb-2">
                Tạo tài khoản
              </h1>
              <p className="text-[#c9929b] text-base font-normal">
                Khám phá thế giới điện ảnh không giới hạn
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            {/* Form */}
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Email Input */}
              <label className="flex flex-col gap-2">
                <span className="text-white text-sm font-bold">Email</span>
                <input
                  className="w-full rounded-lg bg-[#482329] border-transparent focus:border-primary focus:ring-0 text-white placeholder-[#c9929b]/50 h-12 px-4 transition-all"
                  placeholder="example@mail.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </label>

              {/* Username Input */}
              <label className="flex flex-col gap-2">
                <span className="text-white text-sm font-bold">
                  Tên người dùng
                </span>
                <input
                  className="w-full rounded-lg bg-[#482329] border-transparent focus:border-primary focus:ring-0 text-white placeholder-[#c9929b]/50 h-12 px-4 transition-all"
                  placeholder="MovieFan123"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </label>

              {/* Password Input */}
              <label className="flex flex-col gap-2">
                <span className="text-white text-sm font-bold">Mật khẩu</span>
                <div className="relative">
                  <input
                    className="w-full rounded-lg bg-[#482329] border-transparent focus:border-primary focus:ring-0 text-white placeholder-[#c9929b]/50 h-12 px-4 pr-12 transition-all"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    className="absolute right-0 top-0 bottom-0 px-4 text-[#c9929b] hover:text-white transition-colors flex items-center"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </label>

              {/* Confirm Password Input */}
              <label className="flex flex-col gap-2">
                <span className="text-white text-sm font-bold">
                  Xác nhận mật khẩu
                </span>
                <div className="relative">
                  <input
                    className="w-full rounded-lg bg-[#482329] border-transparent focus:border-primary focus:ring-0 text-white placeholder-[#c9929b]/50 h-12 px-4 pr-12 transition-all"
                    placeholder="••••••••"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    className="absolute right-0 top-0 bottom-0 px-4 text-[#c9929b] hover:text-white transition-colors flex items-center"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showConfirmPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </label>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-3 mt-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-[#c9929b] bg-transparent checked:bg-primary checked:border-primary transition-all"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="material-symbols-outlined text-[16px] font-bold">
                      check
                    </span>
                  </span>
                </div>
                <span className="text-[#c9929b] text-sm leading-tight group-hover:text-white transition-colors">
                  Tôi đồng ý với{" "}
                  <Link
                    to="/terms"
                    className="text-white font-bold hover:underline"
                  >
                    Điều khoản sử dụng
                  </Link>{" "}
                  và{" "}
                  <Link
                    to="/privacy"
                    className="text-white font-bold hover:underline"
                  >
                    Chính sách bảo mật
                  </Link>
                  .
                </span>
              </label>

              {/* Submit Button */}
              <button
                className="mt-4 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary hover:bg-red-600 text-white text-base font-bold tracking-wide shadow-lg shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang đăng ký...
                  </>
                ) : (
                  "Đăng ký ngay"
                )}
              </button>
            </form>

            {/* Footer Link */}
            <div className="mt-8 text-center">
              <p className="text-[#c9929b] text-sm">
                Bạn đã có tài khoản?
                <Link
                  to="/login"
                  className="text-white font-bold hover:text-primary transition-colors ml-1"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </main>

        {/* Simple Footer */}
        <footer className="py-6 text-center z-10">
          <p className="text-[#c9929b]/60 text-xs">
            © 2023 CineMovie. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Register;
