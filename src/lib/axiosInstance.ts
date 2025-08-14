import axios from "axios";
import { config } from "../config/config";

const baseURL = config.API_URL;

export const secureApi = async () => {
  const res = await window.localStorage.getItem(config.AUTH);
  const { token } = JSON.parse(res || "");

  return axios.create({
    baseURL,
    headers: {
      "x-auth": `${token}`,
    },
  });
};

export const api = async () => {
  return axios.create({ baseURL });
};
