import { apiWithToken } from "../lib/axiosInstance";

// Waiter interface
export interface Waiter {
  _id: string;
  userName: string;
  password?: string;
  name: string;
  surname: string;
  role: string;
  restaurantNo: string;
  isActive: boolean;
  canCloseTable: boolean;
  notes: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

// Create waiter request interface
export interface CreateWaiterRequest {
  userName: string;
  password: string;
  name?: string;
  surname?: string;
  isActive?: boolean;
  canCloseTable?: boolean;
  notes?: Array<{ key: string; value: any }>;
}

// Update waiter request interface
export interface UpdateWaiterRequest {
  userName?: string;
  password?: string;
  name?: string;
  surname?: string;
  isActive?: boolean;
  canCloseTable?: boolean;
  notes?: Array<{ key: string; value: any }>;
}

// Login request interface
export interface WaiterLoginRequest {
  userName: string;
  password: string;
}

// Login response interface
export interface WaiterLoginResponse {
  id: string;
  userName: string;
  name: string;
  surname: string;
  role: string;
  restaurantNo: string;
  canCloseTable: boolean;
  notes: Record<string, any>;
}

// GET /staffs - Tüm garsonları getir
export const getAllWaiters = async () => {
  const api = await apiWithToken();
  const res = await api.get("/staffs");
  return res.data;
};

// GET /staffs/:id - Tek garson getir
export const getWaiterById = async (id: string) => {
  const api = await apiWithToken();
  const res = await api.get(`/staffs/${id}`);
  return res.data;
};

// POST /staffs - Yeni garson ekle
export const createWaiter = async (waiterData: CreateWaiterRequest) => {
  const api = await apiWithToken();
  const res = await api.post("/staffs", waiterData);
  return res.data;
};

// PUT /staffs/:id - Garson güncelle
export const updateWaiter = async (
  id: string,
  waiterData: UpdateWaiterRequest
) => {
  const api = await apiWithToken();
  const res = await api.put(`/staffs/${id}`, waiterData);
  return res.data;
};

// DELETE /staffs/:id - Garson sil
export const deleteWaiter = async (id: string) => {
  const api = await apiWithToken();
  const res = await api.delete(`/staffs/${id}`);
  return res.data;
};

// PATCH /staffs/:id/toggle-status - Garson durumunu değiştir (aktif/pasif)
export const toggleWaiterStatus = async (id: string) => {
  const api = await apiWithToken();
  const res = await api.patch(`/staffs/${id}/toggle-status`);
  return res.data;
};

// PATCH /staffs/:id/toggle-close-table - Masa kapatma yetkisini değiştir
export const toggleWaiterCloseTablePermission = async (id: string) => {
  const api = await apiWithToken();
  const res = await api.patch(`/staffs/${id}/toggle-close-table`);
  return res.data;
};

// POST /staffs/login - Garson girişi (token gerektirmez)
export const waiterLogin = async (loginData: WaiterLoginRequest) => {
  const api = await apiWithToken(); // Bu endpoint token gerektirmese de consistency için kullanıyoruz
  const res = await api.post("/staffs/login", loginData);
  return res.data;
};

// GET /staffs/list/basic - Garson listesi (sadece temel bilgiler)
export const getWaitersBasicList = async () => {
  const api = await apiWithToken();
  const res = await api.get("/staffs/list/basic");
  return res.data;
};
