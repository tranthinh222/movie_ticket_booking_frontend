import { useState } from "react";
import { Link, useNavigate } from "react-router";
import authApi from "../services/api-auth";
import { useAuth } from "../store/useAuth";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { setUser, setAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email.trim()) {
      setError("Vui lòng nhập email hoặc số điện thoại");
      return;
    }
    if (!password.trim()) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.login(email, password);

      if (response.statusCode === 200 || response.statusCode === 201) {
        // Store access token
        if (response.data?.accessToken) {
          localStorage.setItem("access_token", response.data.accessToken);
        }

        // Update auth store
        if (response.data?.user) {
          setUser(response.data.user);
          setAuthenticated(true);
        }

        // Navigate to home
        navigate("/");
      } else {
        // Handle error from backend
        const errorMessage =
          typeof response.message === "string"
            ? response.message
            : response.error || "Đăng nhập thất bại. Vui lòng thử lại.";
        setError(errorMessage);
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        setError(
          axiosError.response?.data?.message ||
            "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
        );
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD2i1BGpS0-tthdGzaNCbmJr-vN5OnZ3de-QXGfQKylFEtREfEEhP0nDu6okD0ej3xECR5e9IY1_E8Ev26jNxlkPtE8Y3cLG6SZmp5Mql8Swv-8lczUX861nFPekS0tSpWAvo0NXTz9DQ9cXwQQs4Zlua_eZS6SzKtXNnqVFbL0TtTpstdBdkXVuVaY6T3abFoBGo-LJRqk6TaLM5IfkzjZAk8uS9kiBqzu2YaI2-dVClMsNFUXLPD3gUJYhTQdeTVMzJfUTnr-Ccc')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#221013]/80 to-[#221013] z-10"></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-20 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 lg:px-12">
          <Link
            to="/"
            className="flex items-center gap-3 text-primary hover:opacity-90 transition-opacity"
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
            <span className="text-white text-2xl font-bold tracking-tight">
              CineMovie
            </span>
          </Link>
        </header>

        {/* Main Content: Login Form */}
        <main className="flex-1 flex items-center justify-center p-4 py-12">
          <div className="w-full max-w-[480px]">
            <div className="bg-[#221013]/85 backdrop-blur-xl border border-primary/10 rounded-2xl shadow-2xl p-8 md:p-10">
              {/* Headline */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Đăng nhập
                </h1>
                <p className="text-gray-400 text-sm">
                  Chào mừng trở lại! Vui lòng nhập thông tin của bạn.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    error
                  </span>
                  {error}
                </div>
              )}

              {/* Form */}
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {/* Email Input */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-white text-sm font-medium"
                    htmlFor="email"
                  >
                    Email hoặc số điện thoại
                  </label>
                  <input
                    className="w-full h-12 px-4 rounded-lg bg-[#482329] border-transparent text-white placeholder-rose-200/50 focus:border-primary focus:bg-[#2d1519] focus:ring-1 focus:ring-primary transition-colors duration-200"
                    id="email"
                    placeholder="name@example.com"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {/* Password Input */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label
                      className="text-white text-sm font-medium"
                      htmlFor="password"
                    >
                      Mật khẩu
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      className="w-full h-12 pl-4 pr-12 rounded-lg bg-[#482329] border-transparent text-white placeholder-rose-200/50 focus:border-primary focus:bg-[#2d1519] focus:ring-1 focus:ring-primary transition-colors duration-200"
                      id="password"
                      placeholder="Nhập mật khẩu"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <button
                      className="absolute right-0 top-0 h-full px-4 text-rose-300 hover:text-white transition-colors flex items-center justify-center"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="flex items-center justify-end text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-primary hover:text-red-400 font-medium transition-colors"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  className="w-full h-12 bg-primary hover:bg-red-600 active:bg-red-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                      <span>Đang đăng nhập...</span>
                    </>
                  ) : (
                    <span>Đăng nhập</span>
                  )}
                </button>
              </form>

              {/* Footer Sign Up Prompt */}
              <div className="mt-8 text-center">
                <p className="text-gray-400 text-sm">
                  Bạn chưa có tài khoản?
                  <Link
                    to="/register"
                    className="text-white hover:text-primary font-bold transition-colors ml-1"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </div>

            {/* Bottom Links */}
            <div className="mt-6 flex justify-center gap-6 text-xs text-gray-500">
              <a className="hover:text-gray-300" href="#">
                Trợ giúp
              </a>
              <a className="hover:text-gray-300" href="#">
                Quyền riêng tư
              </a>
              <a className="hover:text-gray-300" href="#">
                Điều khoản sử dụng
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;
