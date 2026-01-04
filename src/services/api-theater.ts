/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "../configs/axios.config";

const theaterApi = {
  getAllTheaters: async (page?: number, size?: number) => {
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

  createTheater: async (
    name: string,
    addressId: number
  ): Promise<IBackendRes<any>> => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.post(`${backendUrl}/api/v1/theaters`, {
      name,
      addressId,
    });
    return response;
  },
  getAuditoriumByTheaterId: async (id: number) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.get(
      `${backendUrl}/api/v1/auditoriums/theater/${id}`
    );
    return response;
  },
  removeTheater: async (id: number) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.delete(`${backendUrl}/api/v1/theaters/${id}`);
    return response;
  },
};

export default theaterApi;
