import React from "react";
import { useRouteError, Link } from "react-router";

const GeneralError: React.FC = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen bg-[#1a0b0d] text-white flex flex-col items-center justify-center p-4 text-center">
      <div className="size-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-5xl text-red-500 font-bold">
          warning
        </span>
      </div>
      <h1 className="text-3xl md:text-4xl font-black mb-4">
        Đã có lỗi xảy ra!
      </h1>
      <p className="text-[#c9929b] text-lg max-w-md mb-8">
        Rất tiếc, đã có một lỗi bất ngờ xảy ra. Vui lòng thử tải lại trang hoặc
        quay về trang chủ.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => window.location.reload()}
          className="px-8 h-12 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all"
        >
          Tải lại trang
        </button>
        <Link
          to="/"
          className="px-8 h-12 rounded-xl bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20 transition-all"
        >
          Về trang chủ
        </Link>
      </div>
      {import.meta.env.DEV && (
        <div className="mt-12 p-4 bg-black/40 rounded-lg text-left max-w-2xl overflow-auto text-xs font-mono text-red-400">
          <p className="font-bold mb-2 uppercase text-white/50 border-b border-white/10 pb-1">
            Developer Info (Dev Only):
          </p>
          {(error as any)?.message || JSON.stringify(error)}
        </div>
      )}
    </div>
  );
};

export default GeneralError;
