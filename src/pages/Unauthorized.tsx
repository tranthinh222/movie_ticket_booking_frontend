import React from "react";
import { Link, useNavigate } from "react-router";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1a0b0d] text-white flex flex-col items-center justify-center p-4 text-center">
      <div className="size-24 rounded-full bg-primary/20 flex items-center justify-center mb-8 animate-pulse">
        <span className="material-symbols-outlined text-6xl text-primary font-bold">
          lock
        </span>
      </div>

      <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
        Dừng lại một chút!
      </h1>

      <p className="text-[#c9929b] text-lg max-w-lg mb-10 leading-relaxed">
        Trang này chỉ dành cho thành viên của CineJoy. Vui lòng đăng nhập để
        tiếp tục trải nghiệm những bộ phim tuyệt vời nhất.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link
          to="/login"
          className="flex-1 px-8 h-14 rounded-xl bg-primary text-white font-bold flex items-center justify-center hover:bg-red-600 transition-all shadow-lg shadow-primary/25"
        >
          <span className="material-symbols-outlined mr-2">login</span>
          Đăng nhập ngay
        </Link>
        <button
          onClick={() => navigate(-1)}
          className="flex-1 px-8 h-14 rounded-xl bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20 transition-all border border-white/5"
        >
          Quay lại
        </button>
      </div>

      <Link
        to="/"
        className="mt-8 text-[#c9929b] hover:text-white transition-colors flex items-center gap-1 text-sm font-medium"
      >
        <span className="material-symbols-outlined text-base">home</span>
        Về trang chủ
      </Link>

      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
};

export default Unauthorized;
