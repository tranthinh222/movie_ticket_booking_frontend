import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../store/useAuth";
import authApi from "../../services/api-auth";
import filmApi from "../../services/api-film";
import { useDebounce } from "../../hooks/useDebounce";

const Header: React.FC = () => {
  const { user, authenticated, clearUser } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IFilm[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce search query with 300ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      clearUser();
      setShowDropdown(false);
      navigate("/");
    }
  };

  // Perform search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchQuery.trim()) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await filmApi.getAllFilms(1, 4, debouncedSearchQuery);
        if (response.statusCode === 200) {
          const data = response.data?.data || response.data || [];
          setSearchResults(Array.isArray(data) ? data : []);
          setShowSearchResults(true);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearchQuery]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search result click
  const handleResultClick = (filmId: number) => {
    setShowSearchResults(false);
    setSearchQuery("");
    navigate(`/movie/${filmId}`);
  };

  // Handle search submit (Enter key)
  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setShowSearchResults(false);
      navigate(`/movie?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-[#482329] bg-white dark:bg-[#221114]/90 backdrop-blur-md px-6 lg:px-10 py-3">
      <div className="flex items-center gap-8">
        <Link
          className="flex items-center gap-3 text-gray-900 dark:text-white group"
          to="/"
        >
          <div className="size-8 text-primary">
            <svg
              className="w-full h-full"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"
                fill="currentColor"
              ></path>
              <path
                clipRule="evenodd"
                d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
            CineMovie
          </h2>
        </Link>
        <nav className="hidden md:flex items-center gap-9">
          <Link
            className="text-gray-600 dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors"
            to="/movie"
          >
            Phim
          </Link>
          <Link
            className="text-gray-600 dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors"
            to="/theater"
          >
            Rạp chiếu
          </Link>
          <Link
            className="text-gray-600 dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors"
            to="/news"
          >
            Tin tức
          </Link>
          <Link
            className="text-gray-600 dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors"
            to="/promotion"
          >
            Khuyến mãi
          </Link>
        </nav>
      </div>
      <div className="flex flex-1 justify-end gap-4 lg:gap-8">
        {/* Search Box */}
        <div
          ref={searchRef}
          className="hidden sm:block relative min-w-40 max-w-64"
        >
          <div className="flex w-full flex-1 items-stretch rounded-lg h-10 relative">
            <div className="text-[#c9929b] flex border-none absolute left-0 top-0 bottom-0 items-center justify-center pl-3 z-10">
              {isSearching ? (
                <svg
                  className="animate-spin h-5 w-5"
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
              ) : (
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
              )}
            </div>
            <input
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchSubmit}
              onFocus={() => searchQuery && setShowSearchResults(true)}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border-none bg-gray-100 dark:bg-[#482329] focus:border-none h-full placeholder:text-gray-400 dark:placeholder:text-[#c9929b] pl-10 pr-4 text-sm font-normal leading-normal transition-all"
              placeholder="Tìm tên phim..."
            />
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowSearchResults(false)}
              />
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#2d1519] rounded-lg shadow-xl border border-gray-200 dark:border-[#482329] overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-[#c9929b]">
                    {isSearching ? (
                      "Đang tìm kiếm..."
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-2xl mb-2 block">
                          search_off
                        </span>
                        Không tìm thấy phim "{searchQuery}"
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-[#c9929b] uppercase tracking-wider border-b border-gray-200 dark:border-[#482329]">
                      Kết quả tìm kiếm ({searchResults.length})
                    </div>
                    {searchResults.map((film) => (
                      <button
                        key={film.id}
                        onClick={() => handleResultClick(film.id)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-[#482329] transition-colors text-left"
                      >
                        <div className="size-12 rounded-lg bg-gray-200 dark:bg-[#482329] flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <span className="material-symbols-outlined text-gray-400 dark:text-[#c9929b]">
                            movie
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {film.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-[#c9929b] truncate">
                            {film.genre} • {film.duration} phút
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 dark:text-[#c9929b] text-lg">
                          arrow_forward
                        </span>
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setShowSearchResults(false);
                        navigate(
                          `/movie?search=${encodeURIComponent(searchQuery)}`
                        );
                      }}
                      className="w-full p-3 text-center text-sm text-primary hover:bg-gray-100 dark:hover:bg-[#482329] transition-colors border-t border-gray-200 dark:border-[#482329]"
                    >
                      Xem tất cả kết quả →
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {authenticated && user ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="size-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary font-bold overflow-hidden">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user.username?.charAt(0).toUpperCase() || "U"}</span>
                )}
              </div>
              <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">
                {user.username}
              </span>
              <span className="material-symbols-outlined text-[18px] text-gray-500 dark:text-gray-400">
                expand_more
              </span>
            </button>

            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#2d1519] rounded-lg shadow-lg border border-gray-200 dark:border-[#482329] py-2 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#482329] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      person
                    </span>
                    Tài khoản
                  </Link>
                  <Link
                    to="/booking-history"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#482329] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      confirmation_number
                    </span>
                    Vé của tôi
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link
                      to="/admin"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-primary font-bold hover:bg-gray-100 dark:hover:bg-[#482329] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        admin_panel_settings
                      </span>
                      Quản trị viên
                    </Link>
                  )}
                  <hr className="my-2 border-gray-200 dark:border-[#482329]" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-[#482329] transition-colors w-full"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      logout
                    </span>
                    Đăng xuất
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="flex shrink-0 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-red-700 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]"
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
