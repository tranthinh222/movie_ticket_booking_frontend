import { useState, useEffect } from "react";
import addressApi from "../services/api-address";
import { useDebounce } from "../hooks/useDebounce";

interface IAddress {
  id: number;
  street_number: string;
  street_name: string;
  city: string;
}

interface ITheaterData {
  id: number;
  name: string;
  address: IAddress;
}

const Theater: React.FC = () => {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  // Theater state
  const [theaters, setTheaters] = useState<ITheaterData[]>([]);
  const [filteredTheaters, setFilteredTheaters] = useState<ITheaterData[]>([]);
  const [isLoadingTheaters, setIsLoadingTheaters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch all addresses on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoadingAddresses(true);
      try {
        const response = await addressApi.getAllAddresses(0, 100);
        if (response.statusCode === 200 && response.data) {
          const data = response.data?.data || response.data || [];
          setAddresses(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setAddresses([]);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []);

  // Fetch theaters when address is selected
  const handleAddressSelect = async (addressId: number) => {
    setSelectedAddressId(addressId);
    setTheaters([]);
    setIsLoadingTheaters(true);

    try {
      const response = await addressApi.getTheaterByAddress(addressId);
      const data = response.data || [];
      setTheaters(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching theaters:", error);
      setTheaters([]);
    } finally {
      setIsLoadingTheaters(false);
    }
  };

  // Filter theaters based on search
  useEffect(() => {
    let filtered = [...theaters];

    // Filter by search query
    if (debouncedSearch.trim()) {
      filtered = filtered.filter((theater) =>
        theater.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    setFilteredTheaters(filtered);
  }, [theaters, debouncedSearch]);

  // Get full address string
  const getFullAddress = (address: ITheaterData["address"]) => {
    if (!address) return "Chưa có địa chỉ";
    return `${address.street_number} ${address.street_name}, ${address.city}`;
  };

  // Get selected address display
  const getSelectedAddress = () => {
    const address = addresses.find((a) => a.id === selectedAddressId);
    if (!address) return null;
    return address;
  };

  return (
    <main className="flex-1 px-4 py-8 md:px-10 lg:px-40">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8">
        {/* Page Heading */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
              Hệ thống rạp chiếu
            </h1>
            <p className="text-[#c9929b] text-base font-normal">
              Chọn khu vực để xem danh sách rạp chiếu phim
            </p>
          </div>
        </section>

        {/* Address Selection Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary">
              location_on
            </span>
            <h2 className="text-white text-lg font-bold">Chọn khu vực</h2>
          </div>

          {/* Loading Addresses */}
          {isLoadingAddresses && (
            <div className="flex items-center gap-3 py-4">
              <svg
                className="animate-spin h-5 w-5 text-primary"
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
              <p className="text-[#c9929b] text-sm">
                Đang tải danh sách khu vực...
              </p>
            </div>
          )}

          {/* Address Chips */}
          {!isLoadingAddresses && (
            <div className="flex flex-wrap gap-3">
              {addresses.map((address) => (
                <button
                  key={address.id}
                  onClick={() => handleAddressSelect(address.id)}
                  className={`group flex items-center gap-2 rounded-xl px-4 py-3 ring-1 transition-all ${
                    selectedAddressId === address.id
                      ? "bg-primary text-white ring-primary/50 shadow-lg shadow-primary/20"
                      : "bg-[#482329] text-white ring-white/5 hover:bg-[#5a2d35] hover:ring-primary/30"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-lg ${
                      selectedAddressId === address.id
                        ? "text-white"
                        : "text-[#c9929b]"
                    }`}
                  >
                    location_city
                  </span>
                  <div className="flex flex-col items-start">
                    <span
                      className={`text-sm font-bold ${
                        selectedAddressId === address.id
                          ? "text-white"
                          : "text-white"
                      }`}
                    >
                      {address.city}
                    </span>
                    <span
                      className={`text-xs ${
                        selectedAddressId === address.id
                          ? "text-white/80"
                          : "text-[#c9929b]"
                      }`}
                    >
                      {address.street_number} {address.street_name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Empty Addresses */}
          {!isLoadingAddresses && addresses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <span className="material-symbols-outlined text-4xl text-[#c9929b]">
                wrong_location
              </span>
              <p className="text-[#c9929b] text-sm">Không có khu vực nào</p>
            </div>
          )}
        </section>

        {/* Divider */}
        {selectedAddressId && (
          <div className="h-px bg-gradient-to-r from-transparent via-[#482329] to-transparent"></div>
        )}

        {/* Theater Section - Only shown when address is selected */}
        {selectedAddressId && (
          <section className="flex flex-col gap-6">
            {/* Selected Address Info & Search */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">
                    pin_drop
                  </span>
                </div>
                <div>
                  <p className="text-white text-lg font-bold">
                    {getSelectedAddress()?.city}
                  </p>
                  <p className="text-[#c9929b] text-sm">
                    {getSelectedAddress()?.street_number}{" "}
                    {getSelectedAddress()?.street_name}
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <label className="flex h-12 w-full items-center overflow-hidden rounded-xl bg-[#482329] ring-1 ring-white/5 focus-within:ring-primary/50 transition-all">
                  <div className="flex h-full w-12 items-center justify-center text-[#c9929b]">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-full w-full border-none bg-transparent px-2 text-white placeholder-[#c9929b]/70 focus:ring-0 focus:outline-none text-base"
                    placeholder="Tìm kiếm rạp theo tên..."
                  />
                </label>
              </div>
            </div>

            {/* Loading Theaters */}
            {isLoadingTheaters && (
              <div className="flex items-center justify-center py-16">
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
                  <p className="text-[#c9929b] text-sm">
                    Đang tải danh sách rạp...
                  </p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoadingTheaters && filteredTheaters.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <span className="material-symbols-outlined text-5xl text-[#c9929b]">
                  theaters
                </span>
                <h3 className="text-white text-lg font-bold">
                  Không tìm thấy rạp chiếu phim
                </h3>
                <p className="text-[#c9929b] text-sm text-center">
                  {searchQuery
                    ? `Không có rạp nào phù hợp với "${searchQuery}"`
                    : "Khu vực này chưa có rạp chiếu phim"}
                </p>
              </div>
            )}

            {/* Cinema List Grid */}
            {!isLoadingTheaters && filteredTheaters.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-2">
                  {filteredTheaters.map((theater) => (
                    <article
                      key={theater.id}
                      className="group flex flex-col overflow-hidden rounded-2xl bg-[#2a171a] border border-[#482329] hover:border-primary/50 transition-all shadow-xl"
                    >
                      {/* Cinema Header */}
                      <div className="flex items-start justify-between gap-4 p-5">
                        <div className="flex gap-4">
                          <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-2xl">
                              movie
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <h3 className="text-lg font-bold text-white leading-tight group-hover:text-primary transition-colors">
                              {theater.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-[#c9929b]">
                              <span className="material-symbols-outlined text-[16px]">
                                location_on
                              </span>
                              <p className="text-sm font-medium line-clamp-1">
                                {getFullAddress(theater.address)}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="inline-flex items-center gap-1 rounded bg-[#3a1d21] px-2 py-0.5 text-xs font-medium text-primary">
                                <span className="material-symbols-outlined text-[12px]">
                                  near_me
                                </span>
                                {theater.address?.city || "N/A"}
                              </span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    className={`material-symbols-outlined text-[14px] ${
                                      star <= 4
                                        ? "text-yellow-500"
                                        : "text-[#482329]"
                                    }`}
                                  >
                                    star
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <button className="hidden sm:flex size-10 items-center justify-center rounded-full bg-[#482329] text-white hover:bg-primary transition-colors">
                          <span className="material-symbols-outlined">
                            favorite_border
                          </span>
                        </button>
                      </div>

                      <div className="h-px bg-[#482329] mx-5"></div>

                      {/* Theater Info Section */}
                      <div className="flex flex-col gap-3 p-5 pt-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-[#c9929b]">
                          Thông tin rạp
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-[#c9929b]">
                            <span className="material-symbols-outlined text-lg">
                              home
                            </span>
                            <span className="text-sm">
                              Địa chỉ:{" "}
                              <span className="text-white">
                                {theater.address?.street_number || "N/A"}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[#c9929b]">
                            <span className="material-symbols-outlined text-lg">
                              signpost
                            </span>
                            <span className="text-sm">
                              Đường:{" "}
                              <span className="text-white">
                                {theater.address?.street_name || "N/A"}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[#c9929b]">
                            <span className="material-symbols-outlined text-lg">
                              location_city
                            </span>
                            <span className="text-sm">
                              Thành phố:{" "}
                              <span className="text-white">
                                {theater.address?.city || "N/A"}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="mt-auto flex items-center justify-between border-t border-[#482329] bg-[#221114]/50 px-5 py-3">
                        {/* <a
                          className="text-sm font-medium text-[#c9929b] hover:text-white transition-colors"
                          href="#"
                        >
                          Xem bản đồ
                        </a> */}
                        {/* <Link
                          to={`/theater/${theater.id}`}
                          className="flex items-center gap-1 text-sm font-bold text-primary hover:text-red-400 transition-colors"
                        >
                          Xem chi tiết rạp{" "}
                          <span className="material-symbols-outlined text-[18px]">
                            arrow_forward
                          </span>
                        </Link> */}
                      </div>
                    </article>
                  ))}
                </div>

                {/* Theater Count */}
                <div className="flex justify-center py-4">
                  <p className="text-[#c9929b] text-sm">
                    Hiển thị{" "}
                    <span className="text-white font-bold">
                      {filteredTheaters.length}
                    </span>{" "}
                    rạp chiếu phim tại{" "}
                    <span className="text-white font-bold">
                      {getSelectedAddress()?.city}
                    </span>
                  </p>
                </div>
              </>
            )}
          </section>
        )}

        {/* Initial State - No address selected */}
        {!selectedAddressId && !isLoadingAddresses && addresses.length > 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="size-20 rounded-2xl bg-[#482329] flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-[#c9929b]">
                touch_app
              </span>
            </div>
            <h3 className="text-white text-xl font-bold">
              Chọn khu vực để xem rạp
            </h3>
            <p className="text-[#c9929b] text-sm text-center max-w-md">
              Vui lòng chọn một khu vực ở trên để hiển thị danh sách các rạp
              chiếu phim có sẵn
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Theater;
