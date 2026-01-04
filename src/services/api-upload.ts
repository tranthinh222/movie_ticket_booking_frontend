import axios from "../configs/axios.config";
const uploadApi = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.post(`${backendUrl}/api/v1/upload`, formData);
    return response;
  },
};
export default uploadApi;
