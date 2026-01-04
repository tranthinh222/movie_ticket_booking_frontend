/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "../configs/axios.config";

const auditoriumApi = {
  getAllAuditorium: async (page: number, size?: number) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const params: any = {
      page,
    };

    if (size !== undefined) {
      params.size = size;
    }

    const response = await axios.get(`${backendUrl}/api/v1/theaters`, {
      params,
    });

    return response;
  },
  getAllByOfAuditorium: async (id: number) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.get(
      `${backendUrl}/api/v1/seats/auditorium/${id}`
    );
    return response;
  },
  createAuditorium: async (data: { number: number; theaterId: number }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.post(`${backendUrl}/api/v1/auditoriums`, data);
    return response;
  },

  getAuditoriumsByTheater: async (theaterId: number) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.get(
      `${backendUrl}/api/v1/auditoriums/theater/${theaterId}`
    );
    return response;
  },
  deleteAuditorium: async (id: number) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.delete(
      `${backendUrl}/api/v1/auditoriums/${id}`
    );
    return response;
  },
};

export default auditoriumApi;
