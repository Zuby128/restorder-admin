import axios from "axios";
import { config } from "../config/config";
import { secureApi } from "../lib/axiosInstance";

// create category
export const createCategory = async (name: string) => {
  const api = await secureApi();
  const res = await api.post("/categories", { name });
  return res.data;
};

// GET /saloons
export const getCategories = async () => {
  const res = await axios.get("/categories");
  return res.data;
};

export const getCategoriesByRestaurant = async (id: string) => {
  const res = await axios.get(`${config.API_URL}/categories/restaurant/${id}`);

  return res.data;
};

// GET /saloons/:id
export const patchCategory = async (id: string, value: any) => {
  const api = await secureApi();
  const res = await api.patch(`/categories/${id}`, value);
  return res.data;
};

// DELETE /categories/:id
export const deleteCategory = async (id: string) => {
  const api = await secureApi();
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};
