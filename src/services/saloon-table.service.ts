import { secureApi } from "../lib/axiosInstance";

// GET /saloons
export const getSaloons = async () => {
  const api = await secureApi();
  const res = await api.get("/saloons");
  return res.data;
};

// GET /saloons/:id
export const getSaloon = async (id: number) => {
  const api = await secureApi();
  const res = await api.get(`/saloons/${id}`);
  return res.data;
};

// POST /saloons
export const createSaloon = async (name: string) => {
  const api = await secureApi();
  const res = await api.post("/saloons/", { name });
  return res.data;
};

// PUT /saloons/:id
export const updateSaloon = async (id: string, name: string) => {
  const api = await secureApi();
  const res = await api.patch(`/saloons/${id}`, { name });
  return res.data;
};

// DELETE /saloons/:id
export const deleteSaloon = async (id: string) => {
  const api = await secureApi();
  await api.delete(`/saloons/${id}`);
};

// GET /tables
export const getTables = async () => {
  const api = await secureApi();
  const res = await api.get("/tables");
  return res.data;
};

// GET /tables/:id
export const getTable = async (id: string) => {
  const api = await secureApi();
  const res = await api.get(`/tables/single/${id}`);
  return res.data;
};

// POST /tables
export const createTable = async (name: string, saloonId: string) => {
  const api = await secureApi();
  const res = await api.post("/tables/", { name, saloonId });
  return res.data;
};

// PUT /tables/:id
export const updateTable = async (
  id: string,
  name: string,
  saloonId: string
) => {
  const api = await secureApi();
  const res = await api.patch(`/tables/${id}`, { name, saloonId });
  return res.data;
};

// DELETE /tables/:id
export const deleteTable = async (id: string) => {
  const api = await secureApi();
  await api.delete(`/tables/${id}`);
};

export const openTable = async (id: string) => {
  const api = await secureApi();
  const res = await api.post(`/tables/open-table/${id}`);
  return res.data;
};

export const myTables = async () => {
  const api = await secureApi();
  const res = await api.get(`/tables/my-tables`);
  return res.data;
};

export const closeTable = async (id: string) => {
  const api = await secureApi();
  const res = await api.get(`/tables/close-table/${id}`);
  return res;
};
