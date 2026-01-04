import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import authApi from "../services/api-auth";
import { message } from "antd";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      message.warning("Vui lòng nhập email trước!");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      message.success("Mã xác thực đã được gửi lại!");
      setTimer(30);
      setOtp(["", "", "", "", "", ""]);
    } catch (error: any) {
      message.error(error.message || "Gửi mã thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      message.error("Vui lòng nhập đủ 6 chữ số!");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.verifyOtp(email, otpCode);
      const resetToken = res.data?.resetToken;
      if (resetToken) {
        message.success("Xác thực thành công!");
        navigate("/reset-password", { state: { resetToken } });
      } else {
        message.error("Không tìm thấy mã đặt lại mật khẩu!");
      }
    } catch (error: any) {
      message.error(error.message || "Mã xác thực không chính xác!");
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
                mark_email_read
              </span>
            </div>
            <h1 className="text-white tracking-light text-[32px] font-bold leading-tight">
              Xác thực tài khoản
            </h1>
            <p className="text-[#c9929b] text-sm font-normal leading-relaxed max-w-md mx-auto">
              Vui lòng nhập mã xác thực gồm 6 chữ số đã được gửi đến email{" "}
              <span className="font-medium text-white">{email}</span>
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleVerifyOtp}>
            <div className="flex justify-center py-2">
              <fieldset className="flex gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    pattern="[0-9]*"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="flex h-12 w-10 sm:h-14 sm:w-12 rounded-lg bg-[#221114] text-center [appearance:textfield] focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#67323b] focus:border-primary text-xl font-bold leading-normal text-white transition-all shadow-inner"
                  />
                ))}
              </fieldset>
            </div>

            <div className="flex flex-col gap-4">
              <button
                disabled={loading || otp.join("").length < 6}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary hover:bg-red-600 transition-colors text-white text-base font-bold shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                <span className="truncate">
                  {loading ? "Đang xác nhận..." : "Xác nhận"}
                </span>
              </button>
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-[#c9929b]">Bạn không nhận được mã?</span>
                <button
                  type="button"
                  disabled={timer > 0 || loading}
                  onClick={handleResendOtp}
                  className="font-bold text-primary hover:underline cursor-pointer disabled:opacity-50 disabled:no-underline"
                >
                  {timer > 0 ? `Gửi lại (${timer}s)` : "Gửi lại ngay"}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-[#482329]">
            <p className="text-[#c9929b] text-sm font-normal leading-normal text-center">
              Quay lại?
              <Link
                className="text-white font-semibold hover:text-primary transition-colors hover:underline ml-1"
                to="/forgot-password"
              >
                Nhập lại email
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifyOTP;
