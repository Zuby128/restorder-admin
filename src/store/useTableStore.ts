import { create } from "zustand";

// Table API functions
import { apiWithToken } from "../lib/axiosInstance";

// GET /tables
export const getTables = async () => {
  const api = await apiWithToken();
  const res = await api.get("/tables");
  return res.data;
};

// GET /tables/:id
export const getTable = async (id: string) => {
  const api = await apiWithToken();
  const res = await api.get(`/tables/${id}`);
  return res.data;
};

// POST /tables
export const createTable = async (name: string, saloonId: string) => {
  const api = await apiWithToken();
  const res = await api.post("/tables/", { name, saloonId });
  return res.data;
};

// PUT /tables/:id
export const updateTable = async (
  id: string,
  name: string,
  saloonId: string
) => {
  const api = await apiWithToken();
  const res = await api.patch(`/tables/${id}`, { name, saloonId });
  return res.data;
};

// DELETE /tables/:id
export const deleteTable = async (id: string) => {
  const api = await apiWithToken();
  await api.delete(`/tables/${id}`);
};

// Table interface
interface Table {
  _id: string;
  name: string;
  saloonId: {
    _id: string;
    name: string;
  };
  isOpen: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface TableStore {
  tables: Table[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  lastFetch: number | null;

  // Actions
  fetchTables: (forceRefresh?: boolean) => Promise<void>;
  addTable: (name: string, saloonId: string) => Promise<void>;
  editTable: (id: string, name: string, saloonId: string) => Promise<void>;
  removeTable: (id: string) => Promise<void>;
  clearError: () => void;
  shouldRefresh: () => boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useTableStore = create<TableStore>((set, get) => ({
  tables: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  lastFetch: null,

  fetchTables: async (forceRefresh = false) => {
    const { lastFetch, isLoading } = get();
    const now = Date.now();

    // Check if we need to refresh
    if (!forceRefresh && lastFetch && now - lastFetch < CACHE_DURATION) {
      return;
    }

    // Prevent multiple simultaneous requests
    if (isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const tables = await getTables();
      set({
        tables,
        isLoading: false,
        lastFetch: now,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error?.response?.data?.message || "Masalar yüklenirken hata oluştu",
      });
    }
  },

  addTable: async (name: string, saloonId: string) => {
    set({ isCreating: true, error: null });

    try {
      const newTable = await createTable(name, saloonId);
      set((state) => ({
        tables: [...state.tables, newTable],
        isCreating: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isCreating: false,
        error: error?.response?.data?.message || "Masa eklenirken hata oluştu",
      });
      throw error;
    }
  },

  editTable: async (id: string, name: string, saloonId: string) => {
    set({ isUpdating: true, error: null });

    try {
      const updatedTable = await updateTable(id, name, saloonId);
      set((state) => ({
        tables: state.tables.map((table) =>
          table._id === id ? updatedTable : table
        ),
        isUpdating: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isUpdating: false,
        error:
          error?.response?.data?.message || "Masa güncellenirken hata oluştu",
      });
      throw error;
    }
  },

  removeTable: async (id: string) => {
    set({ isDeleting: true, error: null });

    try {
      await deleteTable(id);
      set((state) => ({
        tables: state.tables.filter((table) => table._id !== id),
        isDeleting: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isDeleting: false,
        error: error?.response?.data?.message || "Masa silinirken hata oluştu",
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  shouldRefresh: () => {
    const { lastFetch } = get();
    if (!lastFetch) return false;
    return Date.now() - lastFetch > CACHE_DURATION;
  },
}));
