/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "../configs/axios.config";

const seatApi = {
  holdSeat: async (showtimeId: number, seatIds: number[]) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.post(`${backendUrl}/api/v1/seat-holds`, {
      showtimeId,
      seatIds,
    });
    return response;
  },
  removeHoldSeat: async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.delete(`${backendUrl}/api/v1/seat-holds`);
    return response;
  },
};

export default seatApi;
