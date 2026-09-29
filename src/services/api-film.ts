/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "../configs/axios.config";

const filmApi = {
  getAllFilms: async (
    page = 1,
    size?: number,
    name?: string,
    genre?: string
  ) => {

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

    return axios.get(`/api/v1/films`, { params });
  },

  createFilm: async (film: ReqFilm) => {
    const response = await axios.post(`/api/v1/films`, film);
    return response;
  },

  uploadImg: async (file: any) => {

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`/upload`, {
      formData,
    });

    return response;
  },

  updateFilm: async (payload: any) => {
    const response = await axios.put(`/api/v1/films`, payload);
    return response;
  },

  deleteFilm: async (id: number) => {
    const response = await axios.delete(`/api/v1/films/${id}`);
    return response;
  },

  getFilmById: async (id: number) => {
    const response = await axios.get(`/api/v1/films/${id}`);
    return response;
  },

  getFilmByStatus: async (status: string, page: number, size?: number) => {
    const filter = `status='${status}'`;
    const params: any = {
      page,
      sort: "releaseDate,desc",
      filter,
    };
    if (size !== undefined) {
      params.size = size;
    }
    const response = await axios.get(`/api/v1/films`, {
      params: params,
    });
    return response;
  },
};

export default filmApi;
