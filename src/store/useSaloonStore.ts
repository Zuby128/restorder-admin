import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  getSaloons,
  createSaloon,
  updateSaloon,
  deleteSaloon,
} from "../services/saloon-table.service";

export interface Saloon {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SaloonState {
  // Data
  saloons: Saloon[];

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Cache control
  lastFetch: number | null;
  cacheTimeout: number; // minutes

  // Error handling
  error: string | null;

  // Actions
  fetchSaloons: (forceRefresh?: boolean) => Promise<void>;
  addSaloon: (name: string) => Promise<void>;
  editSaloon: (id: string, name: string) => Promise<void>;
  removeSaloon: (id: string) => Promise<void>;

  // Cache management
  clearCache: () => void;
  shouldRefresh: () => boolean;

  // Error management
  clearError: () => void;
}

export const useSaloonStore = create<SaloonState>()(
  persist(
    (set, get) => ({
      // Initial state
      saloons: [],
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      lastFetch: null,
      cacheTimeout: 5, // 5 dakika
      error: null,

      // Fetch saloons with cache logic
      fetchSaloons: async (forceRefresh = false) => {
        const state = get();

        // Cache kontrolü
        if (!forceRefresh && !state.shouldRefresh()) {
          return; // Cache'ten kullan
        }

        set({ isLoading: true, error: null });

        try {
          const saloons = await getSaloons();
          set({
            saloons,
            isLoading: false,
            lastFetch: Date.now(),
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Veri çekilirken hata oluştu",
          });
        }
      },

      // Add new saloon
      addSaloon: async (name: string) => {
        set({ isCreating: true, error: null });

        try {
          const newSaloon = await createSaloon(name);
          const currentSaloons = get().saloons;

          set({
            saloons: [...currentSaloons, newSaloon],
            isCreating: false,
            error: null,
          });
        } catch (error) {
          set({
            isCreating: false,
            error:
              error instanceof Error
                ? error.message
                : "Salon eklenirken hata oluştu",
          });
          throw error;
        }
      },

      // Update saloon
      editSaloon: async (id: string, name: string) => {
        set({ isUpdating: true, error: null });

        try {
          const updatedSaloon = await updateSaloon(id, name);
          const currentSaloons = get().saloons;

          const updatedSaloons = currentSaloons.map((saloon) =>
            saloon._id === id ? { ...saloon, name, ...updatedSaloon } : saloon
          );

          set({
            saloons: updatedSaloons,
            isUpdating: false,
            error: null,
          });
        } catch (error) {
          set({
            isUpdating: false,
            error:
              error instanceof Error
                ? error.message
                : "Salon güncellenirken hata oluştu",
          });
          throw error;
        }
      },

      // Delete saloon
      removeSaloon: async (id: string) => {
        set({ isDeleting: true, error: null });

        try {
          await deleteSaloon(id);
          const currentSaloons = get().saloons;

          const filteredSaloons = currentSaloons.filter(
            (saloon) => saloon._id !== id
          );

          set({
            saloons: filteredSaloons,
            isDeleting: false,
            error: null,
          });
        } catch (error) {
          set({
            isDeleting: false,
            error:
              error instanceof Error
                ? error.message
                : "Salon silinirken hata oluştu",
          });
          throw error;
        }
      },

      // Cache management
      shouldRefresh: () => {
        const state = get();
        if (!state.lastFetch) return true;

        const now = Date.now();
        const timeDiff = now - state.lastFetch;
        const timeoutMs = state.cacheTimeout * 60 * 1000; // Convert to milliseconds

        return timeDiff > timeoutMs;
      },

      clearCache: () => {
        set({
          saloons: [],
          lastFetch: null,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "saloon-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Sadece belirli alanları persist et
      partialize: (state) => ({
        saloons: state.saloons,
        lastFetch: state.lastFetch,
        cacheTimeout: state.cacheTimeout,
      }),
    }
  )
);
