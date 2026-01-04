import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../store/useAuth";
import userApi from "../services/api-user";
import authApi from "../services/api-auth";
import AccountLayout from "../components/layout/AccountLayout";

// Password strength levels
type PasswordStrength = "weak" | "medium" | "strong" | "very-strong";

interface PasswordStrengthInfo {
  level: PasswordStrength;
  label: string;
  percentage: number;
  color: string;
}

const ChangePassword: React.FC = () => {
  const { clearUser } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Calculate password strength
  const passwordStrength = useMemo((): PasswordStrengthInfo => {
    if (!newPassword) {
      return {
        level: "weak",
        label: "Yếu",
        percentage: 0,
        color: "bg-red-500",
      };
    }

    let score = 0;

    // Length check
    if (newPassword.length >= 8) score += 1;
    if (newPassword.length >= 12) score += 1;

    // Character variety checks
    if (/[a-z]/.test(newPassword)) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^a-zA-Z0-9]/.test(newPassword)) score += 1;

    if (score <= 2) {
      return {
        level: "weak",
        label: "Yếu",
        percentage: 25,
        color: "bg-red-500",
      };
    } else if (score <= 4) {
      return {
        level: "medium",
        label: "Trung bình",
        percentage: 50,
        color: "bg-yellow-500",
      };
    } else if (score <= 5) {
      return {
        level: "strong",
        label: "Mạnh",
        percentage: 75,
        color: "bg-green-500",
      };
    } else {
      return {
        level: "very-strong",
        label: "Rất mạnh",
        percentage: 100,
        color: "bg-emerald-500",
      };
    }
  }, [newPassword]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

    if (!newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự";
    } else if (!/[A-Z]/.test(newPassword)) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 1 chữ hoa";
    } else if (!/[0-9]/.test(newPassword)) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 1 số";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Call change password API
      await userApi.changePassword(currentPassword, newPassword);

      // Logout immediately after success
      try {
        await authApi.logout();
      } catch (err) {
        console.error("Logout error:", err);
      }
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      clearUser();

      // Redirect immediately
      navigate("/login", { replace: true });
    } catch (error: any) {
      console.error("Change password error:", error);
      const errorMessage =
        error?.message || "Có lỗi xảy ra. Vui lòng thử lại sau.";
      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    setMessage(null);
    navigate(-1);
  };

  return (
    <AccountLayout
      title="Đổi mật khẩu"
      subtitle="Để bảo mật tài khoản, vui lòng sử dụng mật khẩu mạnh và không chia sẻ cho người khác."
    >
      <div className="bg-[#2f161a] rounded-xl border border-[#482329] overflow-hidden shadow-sm">
        {/* Success/Error Message */}
        {message && (
          <div
            className={`m-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-500/10 border border-green-500/30 text-green-400"
                : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}
          >
            <span className="material-symbols-outlined">
              {message.type === "success" ? "check_circle" : "error"}
            </span>
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        {/* Form */}
        <form
          className="flex flex-col gap-6 p-6 md:p-8"
          onSubmit={handleSubmit}
        >
          {/* Current Password */}
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm font-medium">
              Mật khẩu hiện tại
            </label>
            <div
              className={`flex w-full items-stretch rounded-lg group focus-within:ring-2 ring-primary/50 transition-all ${
                errors.currentPassword ? "ring-2 ring-red-500/50" : ""
              }`}
            >
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (errors.currentPassword) {
                    setErrors((prev) => ({ ...prev, currentPassword: "" }));
                  }
                }}
                className="flex-1 rounded-l-lg text-white focus:outline-0 focus:ring-0 border border-[#67323b] bg-[#33191e] focus:border-primary h-12 placeholder:text-[#c9929b]/50 px-4 text-sm border-r-0"
                placeholder="Nhập mật khẩu hiện tại"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="text-[#c9929b] hover:text-white transition-colors flex border border-[#67323b] bg-[#33191e] items-center justify-center px-4 rounded-r-lg border-l-0 focus:outline-none"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showCurrentPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            {errors.currentPassword && (
              <span className="text-red-400 text-xs">
                {errors.currentPassword}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* New Password */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-medium">
                Mật khẩu mới
              </label>
              <div
                className={`flex w-full items-stretch rounded-lg group focus-within:ring-2 ring-primary/50 transition-all ${
                  errors.newPassword ? "ring-2 ring-red-500/50" : ""
                }`}
              >
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.newPassword) {
                      setErrors((prev) => ({ ...prev, newPassword: "" }));
                    }
                  }}
                  className="flex-1 rounded-l-lg text-white focus:outline-0 focus:ring-0 border border-[#67323b] bg-[#33191e] focus:border-primary h-12 placeholder:text-[#c9929b]/50 px-4 text-sm border-r-0"
                  placeholder="Nhập mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="text-[#c9929b] hover:text-white transition-colors flex border border-[#67323b] bg-[#33191e] items-center justify-center px-4 rounded-r-lg border-l-0 focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showNewPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {errors.newPassword && (
                <span className="text-red-400 text-xs">
                  {errors.newPassword}
                </span>
              )}

              {/* Password Strength */}
              {newPassword && (
                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[#c9929b] text-[11px] font-medium">
                      Độ mạnh mật khẩu
                    </span>
                    <span className="text-white text-[11px] font-medium">
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-[#482329] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} rounded-full transition-all duration-300`}
                      style={{ width: `${passwordStrength.percentage}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-medium">
                Xác nhận mật khẩu mới
              </label>
              <div
                className={`flex w-full items-stretch rounded-lg group focus-within:ring-2 ring-primary/50 transition-all ${
                  errors.confirmPassword ? "ring-2 ring-red-500/50" : ""
                }`}
              >
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }
                  }}
                  className="flex-1 rounded-l-lg text-white focus:outline-0 focus:ring-0 border border-[#67323b] bg-[#33191e] focus:border-primary h-12 placeholder:text-[#c9929b]/50 px-4 text-sm border-r-0"
                  placeholder="Nhập lại mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-[#c9929b] hover:text-white transition-colors flex border border-[#67323b] bg-[#33191e] items-center justify-center px-4 rounded-r-lg border-l-0 focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showConfirmPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-red-400 text-xs">
                  {errors.confirmPassword}
                </span>
              )}
              {confirmPassword &&
                newPassword &&
                confirmPassword === newPassword && (
                  <span className="text-green-400 text-[11px] flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-sm">
                      check_circle
                    </span>
                    Mật khẩu khớp
                  </span>
                )}
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-[#1a0e10] p-4 rounded-lg border border-[#482329]">
            <p className="text-[#c9929b] text-xs leading-relaxed">
              Yêu cầu: Ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và ít nhất
              một chữ số.
            </p>
          </div>

          <div className="h-px bg-[#482329] my-2"></div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 h-11 rounded-lg border border-[#482329] text-white font-medium hover:bg-white/5 transition-colors text-sm"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 h-11 rounded-lg bg-primary hover:bg-red-600 text-white font-bold shadow-lg shadow-primary/20 transition-all text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span>Đang xử lý...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    check
                  </span>
                  <span>Cập nhật mật khẩu</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AccountLayout>
  );
};

export default ChangePassword;
