import { describe, expect, it } from "vitest";
import { getApiErrorMessage } from "./api-error";

describe("getApiErrorMessage", () => {
  it.each([
    [{ code: "ECONNABORTED" }, "Máy chủ phản hồi quá lâu. Vui lòng thử lại."],
    [{ code: "ETIMEDOUT" }, "Máy chủ phản hồi quá lâu. Vui lòng thử lại."],
    [{ code: "ERR_NETWORK" }, "Không kết nối được máy chủ. Kiểm tra kết nối mạng hoặc thử lại sau."],
    [{ response: { status: 503 } }, "Máy chủ đang gặp lỗi. Vui lòng thử lại sau."],
  ])("maps transport errors", (error, expected) => {
    expect(getApiErrorMessage(error, "fallback")).toBe(expected);
  });

  it("deduplicates validation messages", () => {
    expect(getApiErrorMessage({ message: ["Email sai", "Email sai", "Mật khẩu sai"] }, "fallback"))
      .toBe("Email sai Mật khẩu sai");
  });

  it("prefers an API error and falls back for malformed values", () => {
    expect(getApiErrorMessage({ response: { data: { error: "Không hợp lệ", message: "ignored" } } }, "fallback"))
      .toBe("Không hợp lệ");
    expect(getApiErrorMessage(null, "fallback")).toBe("fallback");
    expect(getApiErrorMessage({ message: "   " }, "fallback")).toBe("fallback");
  });
});
