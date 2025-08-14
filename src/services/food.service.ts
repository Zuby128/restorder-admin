import axios from "axios";

import { config } from "../config/config";
import { secureApi } from "../lib/axiosInstance";

// POST /foods/with-image
export const createFoodWithImage = async (formData: any) => {
  const api = await secureApi();
  const res = await api.post("/foods/with-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// POST /foods/with-link
export const createFoodWithLink = async (data: any) => {
  const api = await secureApi();
  const res = await api.post("/foods/with-link", data);
  return res.data;
};

// PATCH /foods/:id
export const updateFood = async (id: string, formData: any) => {
  const api = await secureApi();
  const res = await api.patch(`/foods/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// DELETE /foods/:id
export const deleteFood = async (id: string) => {
  const api = await secureApi();
  const res = await api.delete(`/foods/${id}`);
  return res.data;
};

// GET /foods/:id
export const getFoodById = async (id: string) => {
  const api = await secureApi();
  const res = await api.get(`/foods/${id}`);

  return res.data;
};

// GET /foods/category/:categoryId
export const getFoodsByCategory = async (categoryId: string) => {
  const api = await secureApi();
  const res = await api.get(`/foods/category/${categoryId}`);
  return res.data;
};

// GET /foods/restaurant/:restaurantNo
export const getFoodsByRestaurant = async (restaurantNo: string) => {
  const res = await axios.get(
    `${config.API_URL}/foods/restaurant/${restaurantNo}`
  );
  return res.data;
};
