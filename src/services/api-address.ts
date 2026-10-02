import axios from "../configs/axios.config";
const addressApi = {
  getAllAddresses: async (
    page?: number,
    size?: number,
  ): Promise<IBackendRes<IPaginatedResponse<IAddress>>> => {
    const params: { page?: number; size?: number } = {
      page,
      size,
    };
    const response = await axios.get(`/api/v1/addresses`, {
      params,
    });
    return response;
  },
  createAddress: async (data: {
    street_number: string;
    street_name: string;
    city: string;
  }) => {
    const response = await axios.post(`/api/v1/addresses`, data);
    return response;
  },
  deleteAddress: async (id: number) => {
    const response = await axios.delete(`/api/v1/addresses/${id}`);
    return response;
  },

  getTheaterByAddress: async (id: number) => {
    const response = await axios.get(`/api/v1/theaters/address/${id}`);
    return response;
  },

  updateAddress: async (
    id: number,
    data: Pick<IAddress, "street_number" | "street_name" | "city">,
  ) => {
    const payload = {
      id,
      ...data,
    };
    const response = await axios.put(`/api/v1/addresses`, payload);
    return response;
  },
};
export default addressApi;
