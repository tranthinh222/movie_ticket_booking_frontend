/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "../configs/axios.config";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const showtimeApi = {
  getAllShowTimes: (page?: number, size?: number) => {
    const payload = {
      page,
      size,
    };
    return axios.get(`${backendUrl}/api/v1/showtimes`, {
      params: payload,
    });
  },

  create: (data: any) => {
    return axios.post(`${backendUrl}/api/v1/showtimes`, data);
  },

  update: (id: number, data: any) => {
    return axios.put(`${backendUrl}/api/v1/showtimes/${id}`, data);
  },

  delete: (id: number) => {
    return axios.delete(`${backendUrl}/api/v1/showtimes/${id}`);
  },

  getById: (id: number) => {
    return axios.get(`${backendUrl}/api/v1/showtimes/${id}`);
  },

  getListShowtimeByFilmAndDate: async (date: string, filmId: number) => {
    console.log(date);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const filter = `date='${date}' and film.id=${filmId}`;
    const response = await axios.get(`${backendUrl}/api/v1/showtimes`, {
      params: {
        filter,
      },
    });
    return response;
  },

  getSeatAvailable: (showtimeId: number) => {
    return axios.get(`${backendUrl}/api/v1/showtimes/${showtimeId}/seats`);
  },
};

export default showtimeApi;
