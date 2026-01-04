import axios from "../configs/axios.config";
const addressApi = {
  getAllAddresses: async (
    page?: number,
    size?: number
  ): Promise<IBackendRes<any>> => {
    const params: any = {
      page,
      size,
    };
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.get(`${backendUrl}/api/v1/addresses`, {
      params,
    });
    return response;
  },
  createAddress: async (data: {
    street_number: string;
    street_name: string;
    city: string;
  }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.post(`${backendUrl}/api/v1/addresses`, data);
    return response;
  },
  deleteAddress: async (id: number) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.delete(`${backendUrl}/api/v1/addresses/${id}`);
    return response;
  },

  getTheaterByAddress: async (id: number) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.get(
      `${backendUrl}/api/v1/theaters/address/${id}`
    );
    return response;
  },

  updateAddress: async (id: number, data: any) => {
    const payload = {
      id,
      ...data,
    };
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.put(`${backendUrl}/api/v1/addresses`, payload);
    return response;
  },
};
export default addressApi;
