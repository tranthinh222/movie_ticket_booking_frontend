import axios from "../configs/axios.config";
const bookingApi = {
  createBooking: async (paymentMethod: string) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.post(`${backendUrl}/api/v1/bookings`, {
      paymentMethod,
    });
    return response;
  },
  getAllBooking: async (page?: number, limit?: number) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.get(`${backendUrl}/api/v1/bookings`, {
      params: {
        page,
        limit,
      },
    });
    return response;
  },
  getBookingById: async (id: number) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.get(`${backendUrl}/api/v1/bookings/${id}`);
    return response;
  },

  getUserBooking: async (userId: number, page: number, size?: number) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.get(
      `${backendUrl}/api/v1/users/${userId}/bookings`,
      {
        params: {
          page,
          size,
        },
      }
    );
    return response;
  },
  getTotalRevenue: async (month: number, year: number) => {
    const params = {
      month,
      year,
    };
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.get(`${backendUrl}/api/v1/bookings/revenue`, {
      params,
    });
    return response;
  },

  updateBooking: async (id: number, status: string) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const data = {
      status,
    };
    const response = await axios.put(
      `${backendUrl}/api/v1/bookings/${id}/status`,
      data
    );
    return response;
  },
};

export default bookingApi;
