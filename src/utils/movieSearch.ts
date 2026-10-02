export const normalizeMovieSearchText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLocaleLowerCase("vi-VN")
    .trim();

export const matchesMovieName = (movie: IFilm, keyword?: string) => {
  if (!keyword?.trim()) return true;
  return normalizeMovieSearchText(movie.name).includes(
    normalizeMovieSearchText(keyword),
  );
};
