import { useState, useEffect, useRef } from "react";
import { useAuth } from "../store/useAuth";
import userApi from "../services/api-user";
import uploadApi from "../services/api-upload";
import AccountLayout from "../components/layout/AccountLayout";

const Profile: React.FC = () => {
  const { user, authenticated, setUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    gender: "MEN",
  });

  // Avatar states
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "MEN",
      });
      // Reset avatar preview when user changes
      setAvatarPreview(null);
      setAvatarFile(null);
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle avatar file selection
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setMessage({ type: "error", text: "Vui lòng chọn file ảnh hợp lệ!" });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "Kích thước ảnh tối đa là 5MB!" });
        return;
      }

      setAvatarFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (!user?.id) {
        throw new Error("User ID not found");
      }

      // Prepare update payload
      const updatePayload: any = {
        username: formData.username,
        phone: formData.phone,
        gender: formData.gender,
      };

      // If there's a new avatar file, upload it first
      if (avatarFile) {
        const response = await uploadApi.uploadFile(avatarFile);
        updatePayload.avatar = response.data.url;
      }

      // Call updateUser API
      await userApi.updateUser(user.id, updatePayload);

      // Update local user state
      setUser({
        ...user,
        username: formData.username,
        phone: formData.phone,
        gender: formData.gender,
        avatar: avatarPreview || user.avatar,
      });

      // Clear avatar file after successful save
      setAvatarFile(null);

      setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
    } catch (error) {
      console.error("Update profile error:", error);
      setMessage({
        type: "error",
        text: "Có lỗi xảy ra khi cập nhật thông tin.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original user data
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "MEN",
      });
      // Reset avatar preview
      setAvatarPreview(null);
      setAvatarFile(null);
    }
    setMessage(null);
  };

  // Get display avatar (preview or current)
  const getDisplayAvatar = () => {
    if (avatarPreview) return avatarPreview;
    if (user?.avatar) return user.avatar;
    return null;
  };

  if (!authenticated || !user) {
    return null;
  }

  const displayAvatar = getDisplayAvatar();

  return (
    <AccountLayout
      title="Hồ sơ của tôi"
      subtitle="Quản lý thông tin tài khoản và bảo mật"
    >
      {/* Hidden file input for avatar */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        className="hidden"
      />

      <div className="bg-[#2f161a] rounded-xl border border-[#482329] overflow-hidden shadow-sm">
        {/* Profile Header Section */}
        <div className="p-6 md:p-8 border-b border-[#482329] bg-gradient-to-r from-[#2f161a] to-[#3a2026]">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative group">
              <div
                className="size-28 md:size-32 rounded-full bg-primary/20 border-4 border-[#2f161a] shadow-xl flex items-center justify-center text-primary font-bold overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleAvatarClick}
              >
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl">
                    {user.username?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleAvatarClick}
                className="absolute flex items-center justify-center bottom-1 right-1 bg-primary text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                title="Đổi ảnh đại diện"
              >
                <span className="material-symbols-outlined text-[20px] block">
                  photo_camera
                </span>
              </button>
              {/* Preview indicator */}
              {avatarPreview && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Preview
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left pt-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
                <h2 className="text-2xl font-bold text-white">
                  {user.username}
                </h2>
                <span className="bg-primary/20 text-primary border border-primary/30 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider self-center md:self-auto">
                  {user.role || "USER"}
                </span>
              </div>
              <p className="text-[#c9929b] mb-1">{user.email}</p>
              {user.phone && (
                <p className="text-[#c9929b] text-sm">
                  <span className="material-symbols-outlined text-[14px] align-middle mr-1">
                    phone
                  </span>
                  {user.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6 md:p-8">
          {/* Success/Error Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
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

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <label className="flex flex-col gap-2">
                <span className="text-white text-sm font-medium">
                  Tên người dùng
                </span>
                <div className="relative">
                  <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full bg-[#33191e] border border-[#67323b] text-white text-sm rounded-lg h-12 px-4 focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-[#c9929b]/50"
                  />
                </div>
              </label>

              {/* Email (Read-only) */}
              <label className="flex flex-col gap-2">
                <span className="text-white text-sm font-medium">Email</span>
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    readOnly
                    className="w-full bg-[#33191e]/50 border border-[#67323b]/50 text-[#c9929b] text-sm rounded-lg h-12 px-4 cursor-not-allowed"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c9929b]/50 material-symbols-outlined text-lg">
                    lock
                  </span>
                </div>
              </label>

              {/* Phone Number */}
              <label className="flex flex-col gap-2">
                <span className="text-white text-sm font-medium">
                  Số điện thoại
                </span>
                <div className="relative">
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                    className="w-full bg-[#33191e] border border-[#67323b] text-white text-sm rounded-lg h-12 px-4 focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-[#c9929b]/50"
                  />
                </div>
              </label>

              {/* Gender */}
              <label className="flex flex-col gap-2">
                <span className="text-white text-sm font-medium">
                  Giới tính
                </span>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full bg-[#33191e] border border-[#67323b] text-white text-sm rounded-lg h-12 px-4 focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23c9929b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.5rem",
                  }}
                >
                  <option value="MEN">Nam</option>
                  <option value="WOMEN">Nữ</option>
                </select>
              </label>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#482329] my-2"></div>

            {/* Action Buttons */}
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
                className="px-6 h-11 rounded-lg bg-primary text-white font-bold hover:bg-red-600 transition-all shadow-lg shadow-primary/25 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
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
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">
                      save
                    </span>
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AccountLayout>
  );
};

export default Profile;
