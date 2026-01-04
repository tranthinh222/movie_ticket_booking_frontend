import axios from "../configs/axios.config";

const authApi = {
  login: async (
    email: string,
    password: string
  ): Promise<IBackendRes<ILoginRes>> => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.post(`${backendUrl}/api/v1/auth/login`, {
      email,
      password,
    });
    return response;
  },
  register: async (
    username: string,
    email: string,
    password: string,
    phone?: string,
    role?: string
  ): Promise<IBackendRes<IRegisterRes>> => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.post(`${backendUrl}/api/v1/auth/register`, {
      username,
      email,
      password,
      phone,
      role,
    });
    return response;
  },
  logout: async (): Promise<IBackendRes<void>> => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.post(`${backendUrl}/api/v1/auth/logout`);
    return response;
  },
  fetchAccount: async (): Promise<IBackendRes<IFetchUserRes>> => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.get(`${backendUrl}/api/v1/auth/account`);
    return response;
  },
  refreshToken: async (): Promise<IBackendRes<string>> => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.post(
      `${backendUrl}/api/v1/auth/refresh_token`
    );
    return response;
  },

  forgotPassword: async (email: string): Promise<IBackendRes<void>> => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.post(
      `${backendUrl}/api/v1/auth/forgot-password`,
      {
        email,
      }
    );
    return response;
  },

  verifyOtp: async (
    email: string,
    otp: string
  ): Promise<IBackendRes<IVerifyOtpRes>> => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.post(`${backendUrl}/api/v1/auth/verify-otp`, {
      email,
      otp,
    });
    return response;
  },

  resetPassword: async (
    resetToken: string,
    newPassword: string
  ): Promise<IBackendRes<void>> => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.post(
      `${backendUrl}/api/v1/auth/reset-password`,
      {
        resetToken,
        newPassword,
      }
    );
    return response;
  },
};
export default authApi;
