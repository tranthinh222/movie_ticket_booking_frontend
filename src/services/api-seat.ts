import axios from "../configs/axios.config";

const seatApi = {
  holdSeat: async (showtimeId: number, seatIds: number[]) => {
    const response = await axios.post(`/api/v1/seat-holds`, {
      showtimeId,
      seatIds,
    });
    return response;
  },
  removeHoldSeat: async () => {
    const response = await axios.delete(`/api/v1/seat-holds`);
    return response;
  },
};

export default seatApi;
