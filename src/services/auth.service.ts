import axios from "axios";
import { config } from "../config/config";
import { secureApi } from "../lib/axiosInstance";

export const loginIn = async (body: any) => {
  const { data } = await axios.post(`${config.API_URL}/users/login`, body);
  return data;
};

export const register = async (body: any) => {
  const { data } = await axios.post(`${config.API_URL}/users/register`, body);
  return data;
};

export const updateUser = async (data: any) => {
  const api = await secureApi();
  const res = await api.patch("/users/update-owner", data);
  console.log(res.data);
  return res.data;
};
