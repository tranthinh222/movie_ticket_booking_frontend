export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (!error || typeof error !== "object") return fallback;
  const value = error as { response?: { data?: unknown; status?: number }; statusCode?: number; message?: unknown; error?: unknown; code?: string };
  const payload = (value.response?.data || value) as typeof value;
  const status = payload.statusCode || value.response?.status;
  if (value.code === "ECONNABORTED" || value.code === "ETIMEDOUT") return "Máy chủ phản hồi quá lâu. Vui lòng thử lại.";
  if (value.code === "ERR_NETWORK") return "Không kết nối được máy chủ. Kiểm tra kết nối mạng hoặc thử lại sau.";
  if (status && status >= 500) return "Máy chủ đang gặp lỗi. Vui lòng thử lại sau.";
  if (Array.isArray(payload.message)) {
    const messages = payload.message.filter((item): item is string => typeof item === "string");
    if (messages.length) return [...new Set(messages)].join(" ");
  }
  if (typeof payload.error === "string" && payload.error.trim()) return payload.error;
  if (typeof payload.message === "string" && payload.message.trim()) return payload.message;
  return fallback;
};
