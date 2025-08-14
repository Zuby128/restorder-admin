import axios from "axios";
import { config } from "../config/config";

export const getProducts = async () => {
  const { data } = await axios.get(`${config.API_URL}/products`);
  return data;
};
