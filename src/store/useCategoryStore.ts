import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  getCategoriesByRestaurant,
  deleteCategory,
  createCategory,
  patchCategory,
} from "../services/category.service";

export interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CategoryState {
  // Data
  categories: Category[];
  categoriesByRestaurant: { [restaurantNo: string]: Category[] };

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Cache control
  lastFetch: number | null;
  restaurantLastFetch: { [restaurantNo: string]: number };
  cacheTimeout: number; // minutes

  // Error handling
  error: string | null;

  // Actions
  fetchCategories: (
    restaurantNo: string,
    forceRefresh?: boolean
  ) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  editCategory: (id: string, name: string) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;

  // Cache management
  clearCache: () => void;
  clearRestaurantCache: (restaurantNo: string) => void;
  shouldRefresh: (restaurantNo: string) => boolean;

  // Error management
  clearError: () => void;

  // Utility methods
  getCategoriesForRestaurant: (restaurantNo: string) => Category[];
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      // Initial state
      categories: [],
      categoriesByRestaurant: {},
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      lastFetch: null,
      restaurantLastFetch: {},
      cacheTimeout: 20, // 20 dakika (orijinal cache süresini koruyorum)
      error: null,

      // Fetch categories by restaurant with cache logic
      fetchCategories: async (restaurantNo: string, forceRefresh = false) => {
        const state = get();

        // Cache kontrolü
        if (!forceRefresh && !state.shouldRefresh(restaurantNo)) {
          return; // Cache'ten kullan
        }

        set({ isLoading: true, error: null });

        try {
          const categories = await getCategoriesByRestaurant(restaurantNo);
          set({
            categories,
            categoriesByRestaurant: {
              ...state.categoriesByRestaurant,
              [restaurantNo]: categories,
            },
            restaurantLastFetch: {
              ...state.restaurantLastFetch,
              [restaurantNo]: Date.now(),
            },
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error:
              error?.response?.data?.message ||
              (error instanceof Error
                ? error.message
                : "Kategoriler yüklenirken hata oluştu"),
          });
        }
      },

      // Add new category
      addCategory: async (name: string) => {
        set({ isCreating: true, error: null });

        try {
          let newCategory: Category;

          newCategory = await createCategory(name);

          const currentCategories = get().categories;
          set({
            categories: [...currentCategories, newCategory],
            isCreating: false,
            error: null,
          });

          // Update restaurant cache if it exists
          const state = get();
          Object.keys(state.categoriesByRestaurant).forEach((restaurantNo) => {
            const restaurantCategories =
              state.categoriesByRestaurant[restaurantNo];
            set({
              categoriesByRestaurant: {
                ...state.categoriesByRestaurant,
                [restaurantNo]: [...restaurantCategories, newCategory],
              },
            });
          });
        } catch (error: any) {
          set({
            isCreating: false,
            error:
              error?.response?.data?.message ||
              (error instanceof Error
                ? error.message
                : "Kategori eklenirken hata oluştu"),
          });
          throw error;
        }
      },

      // Update category
      editCategory: async (id: string, name: string) => {
        set({ isUpdating: true, error: null });

        try {
          let updatedCategory: Category;

          updatedCategory = await patchCategory(id, { name });

          const currentCategories = get().categories;
          const updatedCategories = currentCategories.map((category) =>
            category._id === id ? updatedCategory : category
          );

          set({
            categories: updatedCategories,
            isUpdating: false,
            error: null,
          });

          // Update restaurant caches
          const state = get();
          Object.keys(state.categoriesByRestaurant).forEach((restaurantNo) => {
            const restaurantCategories =
              state.categoriesByRestaurant[restaurantNo];
            const updatedRestaurantCategories = restaurantCategories.map(
              (category) => (category._id === id ? updatedCategory : category)
            );

            if (
              JSON.stringify(restaurantCategories) !==
              JSON.stringify(updatedRestaurantCategories)
            ) {
              set({
                categoriesByRestaurant: {
                  ...state.categoriesByRestaurant,
                  [restaurantNo]: updatedRestaurantCategories,
                },
              });
            }
          });
        } catch (error: any) {
          set({
            isUpdating: false,
            error:
              error?.response?.data?.message ||
              (error instanceof Error
                ? error.message
                : "Kategori güncellenirken hata oluştu"),
          });
          throw error;
        }
      },

      // Delete category
      removeCategory: async (id: string) => {
        set({ isDeleting: true, error: null });

        try {
          await deleteCategory(id);
          const currentCategories = get().categories;

          const filteredCategories = currentCategories.filter(
            (category) => category._id !== id
          );

          set({
            categories: filteredCategories,
            isDeleting: false,
            error: null,
          });

          // Remove from restaurant caches
          const state = get();
          const updatedRestaurantCache = { ...state.categoriesByRestaurant };
          Object.keys(updatedRestaurantCache).forEach((restaurantNo) => {
            updatedRestaurantCache[restaurantNo] = updatedRestaurantCache[
              restaurantNo
            ].filter((category) => category._id !== id);
          });

          set({
            categoriesByRestaurant: updatedRestaurantCache,
          });
        } catch (error: any) {
          set({
            isDeleting: false,
            error:
              error?.response?.data?.message ||
              (error instanceof Error
                ? error.message
                : "Kategori silinirken hata oluştu"),
          });
          throw error;
        }
      },

      // Cache management
      shouldRefresh: (restaurantNo: string) => {
        const state = get();
        const lastFetch = state.restaurantLastFetch[restaurantNo];
        if (!lastFetch) return true;

        const now = Date.now();
        const timeDiff = now - lastFetch;
        const timeoutMs = state.cacheTimeout * 60 * 1000; // Convert to milliseconds

        return timeDiff > timeoutMs;
      },

      clearCache: () => {
        set({
          categories: [],
          categoriesByRestaurant: {},
          lastFetch: null,
          restaurantLastFetch: {},
          error: null,
        });
      },

      clearRestaurantCache: (restaurantNo: string) => {
        const state = get();
        const { [restaurantNo]: removed, ...remainingRestaurants } =
          state.categoriesByRestaurant;
        const { [restaurantNo]: removedFetch, ...remainingFetch } =
          state.restaurantLastFetch;

        set({
          categoriesByRestaurant: remainingRestaurants,
          restaurantLastFetch: remainingFetch,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      // Utility methods
      getCategoriesForRestaurant: (restaurantNo: string) => {
        const state = get();
        return state.categoriesByRestaurant[restaurantNo] || [];
      },
    }),
    {
      name: "category-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Sadece belirli alanları persist et
      partialize: (state) => ({
        categories: state.categories,
        categoriesByRestaurant: state.categoriesByRestaurant,
        restaurantLastFetch: state.restaurantLastFetch,
        lastFetch: state.lastFetch,
        cacheTimeout: state.cacheTimeout,
      }),
    }
  )
);
