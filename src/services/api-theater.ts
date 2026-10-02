/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "../configs/axios.config";

const theaterApi = {
  getAllTheaters: async (page?: number, size?: number) => {
    const params: any = {
      page,
    };

    if (size !== undefined) {
      params.size = size;
    }

    const response = await axios.get(`/api/v1/theaters`, {
      params,
    });

    return response;
  },

  getTheaterById: async (id: number) => {
    return axios.get(`/api/v1/theaters/${id}`);
  },

  createTheater: async (
    name: string,
    addressId: number,
  ): Promise<IBackendRes<any>> => {
    const response = await axios.post(`/api/v1/theaters`, {
      name,
      addressId,
    });
    return response;
  },
  getAuditoriumByTheaterId: async (id: number) => {
    const response = await axios.get(`/api/v1/auditoriums/theater/${id}`);
    return response;
  },
  removeTheater: async (id: number) => {
    const response = await axios.delete(`/api/v1/theaters/${id}`);
    return response;
  },
  updateTheater: async (id: number, name: string) => {
    return axios.put(`/api/v1/theaters`, { id, name });
  },
};

export default theaterApi;
