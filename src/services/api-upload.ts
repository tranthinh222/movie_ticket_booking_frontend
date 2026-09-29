import axios from "../configs/axios.config";
const uploadApi = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`/api/v1/upload`, formData);
    return response;
  },
};
export default uploadApi;
