export {};

declare global {
  interface IBackendRes<T> {
    statusCode: number | string;
    error: string;
    message: object;
    data: T;
  }

  interface IFetchUserRes {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    gender?: string;
    phone: string;
    role?: string;
  }

  interface ILoginRes {
    accessToken: string;
    refreshToken: string;
    user: IFetchUserRes;
  }

  interface IVerifyOtpRes {
    resetToken: string;
  }

  interface IRegisterRes {
    id: number;
    username: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  }

  interface ReqFilm {
    name: string;
    duration: number;
    price: number;
    description: string;
    genre: string;
    language: string;
    releaseDate: string | Date;
    rating: number;
  }

  interface ReqShowtime {
    filmId: number;
    theaterId: number;
    date: string;
    startTime: string;
    endTime: string;
    status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  }

  interface ReqBooking {
    showtimeId: number;
    seatId: number;
    userId: number;
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
  }

  // Booking related types
  interface IAddress {
    id: number;
    street_number: string;
    street_name: string;
    city: string;
    createdAt?: string;
    updatedAt?: string | null;
    createdBy?: string;
    updatedBy?: string | null;
  }

  interface ITheater {
    id: number;
    name: string;
    address?: IAddress;
    createdAt?: string;
    updatedAt?: string | null;
    createdBy?: string;
    updatedBy?: string | null;
  }

  interface IAuditorium {
    id: number;
    theater: ITheater;
    number: number;
    totalSeats: number;
    createdAt?: string;
    updatedAt?: string | null;
    createdBy?: string;
    updatedBy?: string | null;
  }

  interface IFilm {
    id: number;
    name: string;
    duration: number;
    price: number;
    description: string;
    genre: string;
    language: string;
    releaseDate: string;
    rating: number;
    thumbnail?: string;
    createdAt?: string;
    updatedAt?: string | null;
    createdBy?: string;
    updatedBy?: string | null;
  }

  interface IShowtime {
    id: number;
    film: IFilm;
    auditorium: IAuditorium;
    date: string;
    startTime: string;
    endTime: string;
    status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
    createdAt?: string;
    updatedAt?: string | null;
    createdBy?: string;
    updatedBy?: string | null;
  }

  interface ISeat {
    id: number;
    seatRow: string;
    number: number;
    status: "AVAILABLE" | "BOOKED" | "HOLD";
    seatVariantName: "REG" | "VIP";
  }

  interface IShowtimeSeat {
    seatId: number;
    seatRow: string;
    number: number;
    status: "AVAILABLE" | "BOOKED" | "HOLD";
    seatVariantId: number;
    seatVariantName: "REG" | "VIP";
    basePrice: number;
    bonus: number;
    totalPrice: number;
  }

  interface IBooking {
    id: number;
    showtime: IShowtime;
    seats: IShowtimeSeat[];
    totalPrice?: number;
    total_price?: number;
    paymentMethod: string;
    status: string;
    qrCode?: string;
    createdAt: string;
  }

  interface IPaginatedResponse<T> {
    meta: {
      currentPage: number;
      pageSize: number;
      totalPages: number;
      totalItems: number;
    };
    data: T[];
  }
}
