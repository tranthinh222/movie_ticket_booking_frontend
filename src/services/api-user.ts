import axios from "../configs/axios.config";
const userApi = {
  getAllUsers: async (page?: number, size?: number) => {
    const response = await axios.get(`/api/v1/users?page=${page}&size=${size}`);
    return response;
  },
  getUserById: async (id: number) => {
    const response = await axios.get(`/api/v1/users/${id}`);
    return response;
  },

  updateUser: async (
    id: number,
    user: Partial<
      Pick<IFetchUserRes, "username" | "phone" | "role" | "gender" | "avatar">
    >,
  ) => {
    const payload = {
      id,
      ...user,
    };
    const response = await axios.put(`/api/v1/users`, payload);
    return response;
  },

  deleteUser: async (id: number) => {
    const response = await axios.delete(`/api/v1/users/${id}`);
    return response;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const payload = {
      currentPassword,
      newPassword,
    };
    const response = await axios.put(`/api/v1/users/me/password`, payload);
    return response;
  },
};
export default userApi;
