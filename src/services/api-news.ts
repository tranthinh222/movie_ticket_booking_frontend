import axios from "../configs/axios.config";

export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
export type NewsInput = Omit<NewsArticle, "id" | "createdAt" | "updatedAt">;
interface ApiResult<T> { statusCode: number; data: T; }
interface NewsPage {
  meta: { currentPage: number; totalItems: number; totalPages: number; pageSize: number };
  data: NewsArticle[];
}
const newsApi = {
  list: async (page = 1, size = 100, admin = false, search?: string) =>
    await axios.get(admin ? "/api/v1/admin/news" : "/api/v1/news", { params: { page, size, search } }) as unknown as ApiResult<NewsPage>,
  get: async (id: number) => await axios.get(`/api/v1/news/${id}`) as unknown as ApiResult<NewsArticle>,
  create: async (input: NewsInput) => await axios.post("/api/v1/news", input) as unknown as ApiResult<NewsArticle>,
  update: async (id: number, input: NewsInput) => await axios.put(`/api/v1/news/${id}`, input) as unknown as ApiResult<NewsArticle>,
  remove: async (id: number) => axios.delete(`/api/v1/news/${id}`),
};
export default newsApi;
