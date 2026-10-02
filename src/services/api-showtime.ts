/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "../configs/axios.config";

const showtimeApi = {
  getAllShowTimes: (page?: number, size?: number) => {
    const payload = {
      page,
      size,
    };
    return axios.get(`/api/v1/showtimes`, {
      params: payload,
    });
  },

  create: (data: any) => {
    return axios.post(`/api/v1/showtimes`, data);
  },

  update: (id: number, data: any) => {
    return axios.put(`/api/v1/showtimes`, { id, ...data });
  },

  delete: (id: number) => {
    return axios.delete(`/api/v1/showtimes/${id}`);
  },

  getById: (id: number) => {
    return axios.get(`/api/v1/showtimes/${id}`);
  },

  getListShowtimeByFilmAndDate: async (date: string, filmId: number) => {
    console.log(date);
    const filter = `date='${date}' and film.id=${filmId}`;
    const response = await axios.get(`/api/v1/showtimes`, {
      params: {
        filter,
        page: 1,
        size: 200,
        sort: "startTime,asc",
      },
    });
    return response;
  },

  getSeatAvailable: (showtimeId: number) => {
    return axios.get(`/api/v1/showtimes/${showtimeId}/seats`);
  },
};

export default showtimeApi;
