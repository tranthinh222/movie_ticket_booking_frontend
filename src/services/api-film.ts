/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "../configs/axios.config";

const filmApi = {
  getAllFilms: async (
    page = 1,
    size?: number,
    name?: string,
    genre?: string
  ) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const params: any = {
      page,
      sort: "releaseDate,desc",
    };

    if (size !== undefined) {
      params.size = size;
    }

    const filters: string[] = [];

    if (name && name.trim() !== "") {
      filters.push(`name~'${name}'`);
    }

    if (genre && genre !== "all") {
      filters.push(`genre='${genre}'`);
    }

    if (filters.length > 0) {
      params.filter = filters.join(";");
    }

    return axios.get(`${backendUrl}/api/v1/films`, { params });
  },

  createFilm: async (film: ReqFilm) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.post(`${backendUrl}/api/v1/films`, film);
    return response;
  },

  uploadImg: async (file: any) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${backendUrl}/upload`, {
      formData,
    });

    return response;
  },

  updateFilm: async (payload: any) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.put(`${backendUrl}/api/v1/films`, payload);
    return response;
  },

  deleteFilm: async (id: number) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.delete(`${backendUrl}/api/v1/films/${id}`);
    return response;
  },

  getFilmById: async (id: number) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.get(`${backendUrl}/api/v1/films/${id}`);
    return response;
  },

  getFilmByStatus: async (status: string, page: number, size?: number) => {
    const filter = `status='${status}'`;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const params: any = {
      page,
      sort: "releaseDate,desc",
      filter,
    };
    if (size !== undefined) {
      params.size = size;
    }
    const response = await axios.get(`${backendUrl}/api/v1/films`, {
      params: params,
    });
    return response;
  },
};

export default filmApi;
