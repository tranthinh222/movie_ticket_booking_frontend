import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../store/useAuth";
import authApi from "../../services/api-auth";
import bookingApi from "../../services/api-booking";

interface AccountLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const menuItems = [
  {
    id: "profile",
    icon: "person",
    label: "Thông tin cá nhân",
    path: "/profile",
  },
  {
    id: "password",
    icon: "lock",
    label: "Đổi mật khẩu",
    path: "/change-password",
  },
  {
    id: "history",
    icon: "confirmation_number",
    label: "Lịch sử đặt vé",
    path: "/booking-history",
  },
];

const AccountLayout: React.FC<AccountLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  const { user, authenticated, isLoading, clearUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [bookedCount, setBookedCount] = useState(0);

  useEffect(() => {
    const fetchBookedCount = async () => {
      if (user?.id) {
        try {
          const res = await bookingApi.getUserBooking(user.id, 1, 1);
          const meta = (res as any).data?.meta || (res as any).meta;
          if (meta?.totalItems !== undefined) {
            setBookedCount(meta.totalItems);
          }
        } catch (error) {
          console.error("Error fetching booked count:", error);
        }
      }
    };
    fetchBookedCount();
  }, [user?.id]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      clearUser();
      navigate("/");
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-64px)] bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-12 w-12 text-primary"
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
          <p className="text-[#c9929b] text-sm">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!authenticated || !user) {
    return null;
  }

  return (
    <div className="flex-1 w-full max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 shrink-0 flex flex-col gap-6">
        {/* Mobile User Card */}
        <div className="bg-[#2f161a] rounded-xl p-6 border border-[#482329] flex items-center gap-4 md:hidden">
          <div className="size-14 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary font-bold overflow-hidden">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-white font-bold">{user.username}</h3>
            <span className="text-[#c9929b] text-sm">{user.email}</span>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-[#2f161a] rounded-xl p-4 border border-[#482329] shadow-sm">
          <div className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-[#c9929b] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}

            <div className="h-px bg-[#482329] my-2"></div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all w-full text-left"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="text-sm font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* Info Area (Stats/Tags) */}
        <div className="hidden md:flex flex-col gap-4 bg-[#2f161a] rounded-xl p-5 border border-[#482329]">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary font-bold overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" />
              ) : (
                user.username?.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <p className="text-white font-bold text-sm truncate max-w-[140px]">
                {user.username}
              </p>
              <p className="text-[#c9929b] text-xs">Thành viên</p>
            </div>
          </div>
          <div className="pt-2 border-t border-[#482329]">
            <div>
              <p className="text-white font-black text-2xl">{bookedCount}</p>
              <p className="text-[10px] text-[#c9929b] uppercase tracking-tighter">
                Vé đã đặt
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
            {title}
          </h1>
          {subtitle && <p className="text-[#c9929b]">{subtitle}</p>}
        </div>

        {children}
      </main>
    </div>
  );
};

export default AccountLayout;
