import { describe, expect, it } from "vitest";
import { matchesMovieName, normalizeMovieSearchText } from "./movieSearch";

describe("movie search", () => {
  it("normalizes Vietnamese accents, casing and whitespace", () => {
    expect(normalizeMovieSearchText("  Đường Đua Rực Lửa  ")).toBe("duong dua ruc lua");
  });

  it("matches partial, accent-insensitive names", () => {
    const movie = { name: "Mưa Đỏ" } as IFilm;
    expect(matchesMovieName(movie, "mua do")).toBe(true);
    expect(matchesMovieName(movie, "xanh")).toBe(false);
    expect(matchesMovieName(movie, "   ")).toBe(true);
  });
});
