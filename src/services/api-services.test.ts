import { beforeEach, describe, expect, it, vi } from "vitest";
import axios from "../configs/axios.config";
import authApi from "./api-auth";
import bookingApi from "./api-booking";
import discountApi from "./api-discount";
import filmApi from "./api-film";
import showtimeApi from "./api-showtime";
import uploadApi from "./api-upload";

vi.mock("../configs/axios.config", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

const getMock = vi.mocked(axios.get);
const postMock = vi.mocked(axios.post);

describe("API service integration contracts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sends authentication payloads to their expected endpoints", async () => {
    postMock.mockResolvedValue({ ok: true } as never);
    await authApi.login("a@b.vn", "secret");
    await authApi.resetPassword("token", "new-secret");
    expect(postMock).toHaveBeenNthCalledWith(1, "/api/v1/auth/login", { email: "a@b.vn", password: "secret" });
    expect(postMock).toHaveBeenNthCalledWith(2, "/api/v1/auth/reset-password", { resetToken: "token", newPassword: "new-secret" });
  });

  it("builds film search and showtime query parameters", async () => {
    getMock.mockResolvedValue({} as never);
    await filmApi.getAllFilms(2, 12, "  Dune  ", "Sci-Fi");
    await showtimeApi.getListShowtimeByFilmAndDate("2026-10-07", 9);
    expect(getMock).toHaveBeenNthCalledWith(1, "/api/v1/films", { params: {
      page: 2, size: 12, sort: "releaseDate,desc", search: "Dune", filter: "genre='Sci-Fi'",
    }});
    expect(getMock).toHaveBeenNthCalledWith(2, "/api/v1/showtimes", { params: {
      filter: "date='2026-10-07' and film.id=9", page: 1, size: 200, sort: "startTime,asc",
    }});
  });

  it("sends booking, discount and upload requests without reshaping data", async () => {
    postMock.mockResolvedValue({} as never);
    await bookingApi.createBooking("VNPAY", "SALE10");
    await discountApi.quote("SALE10");
    const file = new File(["image"], "poster.png", { type: "image/png" });
    await uploadApi.uploadFile(file);
    expect(postMock).toHaveBeenNthCalledWith(1, "/api/v1/bookings", { paymentMethod: "VNPAY", discountCode: "SALE10" });
    expect(postMock).toHaveBeenNthCalledWith(2, "/api/v1/discounts/quote", { code: "SALE10" });
    const body = postMock.mock.calls[2][1] as FormData;
    expect(postMock.mock.calls[2][0]).toBe("/api/v1/upload");
    expect(body.get("file")).toBe(file);
  });
});
