import axios from "../configs/axios.config";
const userApi = {
  getAllUsers: async (page?: number, size?: number) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.get(
      `${backendUrl}/api/v1/users?page=${page}&size=${size}`
    );
    return response;
  },
  getUserById: async (id: number) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.get(`${backendUrl}/api/v1/users/${id}`);
    return response;
  },

  updateUser: async (id: number, user: any) => {
    const payload = {
      id,
      ...user,
    };
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.put(`${backendUrl}/api/v1/users`, payload);
    return response;
  },

  deleteUser: async (id: number) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.delete(`${backendUrl}/api/v1/users/${id}`);
    return response;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const payload = {
      currentPassword,
      newPassword,
    };
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.put(
      `${backendUrl}/api/v1/users/me/password`,
      payload
    );
    return response;
  },
};
export default userApi;
