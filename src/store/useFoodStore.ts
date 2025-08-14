import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  createFoodWithImage,
  createFoodWithLink,
  updateFood,
  deleteFood,
  getFoodById,
  getFoodsByCategory,
  getFoodsByRestaurant,
} from "../services/food.service";

export interface Food {
  _id: string;
  name: string;
  description?: string;
  ingredients?: string | string[]; // YENİ ALAN
  price: number;
  categoryId: string | { _id: string; name: string };
  restaurantNo: string;
  imageUrl?: string;
  isPopular?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
interface FoodState {
  foods: Food[];
  currentFood: Food | null;
  foodsByCategory: { [categoryId: string]: Food[] };
  foodsByRestaurant: { [restaurantNo: string]: Food[] };
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isFetchingById: boolean;
  lastFetch: number | null;
  categoryLastFetch: { [categoryId: string]: number };
  restaurantLastFetch: { [restaurantNo: string]: number };
  cacheTimeout: number;
  error: string | null;
  createFoodWithImage: (formData: FormData) => Promise<void>;
  createFoodWithLink: (data: any) => Promise<void>;
  editFood: (id: string, formData: FormData) => Promise<void>;
  removeFood: (id: string) => Promise<void>;
  getFoodById: (id: string) => Promise<Food>;
  fetchFoodById: (id: string) => Promise<void>;
  fetchFoodsByCategory: (
    categoryId: string,
    forceRefresh?: boolean
  ) => Promise<void>;
  fetchFoodsByRestaurant: (
    restaurantNo: string,
    forceRefresh?: boolean
  ) => Promise<void>;
  clearCache: () => void;
  clearCategoryCache: (categoryId: string) => void;
  clearRestaurantCache: (restaurantNo: string) => void;
  shouldRefreshCategory: (categoryId: string) => boolean;
  shouldRefreshRestaurant: (restaurantNo: string) => boolean;
  clearError: () => void;
}

export const useFoodStore = create<FoodState>()(
  persist(
    (set, get) => ({
      // Initial state
      foods: [],
      currentFood: null,
      foodsByCategory: {},
      foodsByRestaurant: {},
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      isFetchingById: false,
      lastFetch: null,
      categoryLastFetch: {},
      restaurantLastFetch: {},
      cacheTimeout: 5, // 5 dakika
      error: null,

      // Create food with image
      createFoodWithImage: async (formData: FormData) => {
        set({ isCreating: true, error: null });

        try {
          const newFood = await createFoodWithImage(formData);
          const currentFoods = get().foods;

          set({
            foods: [...currentFoods, newFood],
            isCreating: false,
            error: null,
          });

          // Add to category cache if exists
          const categoryId = newFood.categoryId;
          if (categoryId && get().foodsByCategory[categoryId]) {
            const categoryFoods = get().foodsByCategory[categoryId];
            set({
              foodsByCategory: {
                ...get().foodsByCategory,
                [categoryId]: [...categoryFoods, newFood],
              },
            });
          }

          // Add to restaurant cache if exists
          const restaurantNo = newFood.restaurantNo;
          if (restaurantNo && get().foodsByRestaurant[restaurantNo]) {
            const restaurantFoods = get().foodsByRestaurant[restaurantNo];
            set({
              foodsByRestaurant: {
                ...get().foodsByRestaurant,
                [restaurantNo]: [...restaurantFoods, newFood],
              },
            });
          }
        } catch (error) {
          set({
            isCreating: false,
            error:
              error instanceof Error
                ? error.message
                : "Yemek eklenirken hata oluştu",
          });
          throw error;
        }
      },

      // Create food with link
      createFoodWithLink: async (data: any) => {
        set({ isCreating: true, error: null });

        try {
          const newFood = await createFoodWithLink(data);
          const currentFoods = get().foods;

          set({
            foods: [...currentFoods, newFood],
            isCreating: false,
            error: null,
          });

          // Add to category cache if exists
          const categoryId = newFood.categoryId;
          if (categoryId && get().foodsByCategory[categoryId]) {
            const categoryFoods = get().foodsByCategory[categoryId];
            set({
              foodsByCategory: {
                ...get().foodsByCategory,
                [categoryId]: [...categoryFoods, newFood],
              },
            });
          }

          // Add to restaurant cache if exists
          const restaurantNo = newFood.restaurantNo;
          if (restaurantNo && get().foodsByRestaurant[restaurantNo]) {
            const restaurantFoods = get().foodsByRestaurant[restaurantNo];
            set({
              foodsByRestaurant: {
                ...get().foodsByRestaurant,
                [restaurantNo]: [...restaurantFoods, newFood],
              },
            });
          }
        } catch (error) {
          set({
            isCreating: false,
            error:
              error instanceof Error
                ? error.message
                : "Yemek eklenirken hata oluştu",
          });
          throw error;
        }
      },

      // Update food
      editFood: async (id: string, formData: FormData) => {
        set({ isUpdating: true, error: null });

        try {
          const updatedFood = await updateFood(id, formData);
          const currentFoods = get().foods;

          const updatedFoods = currentFoods.map((food) =>
            food._id === id ? { ...food, ...updatedFood } : food
          );

          set({
            foods: updatedFoods,
            isUpdating: false,
            error: null,
          });

          // Update in category caches
          const state = get();
          Object.keys(state.foodsByCategory).forEach((categoryId) => {
            const categoryFoods = state.foodsByCategory[categoryId];
            const updatedCategoryFoods = categoryFoods.map((food) =>
              food._id === id ? { ...food, ...updatedFood } : food
            );

            if (
              JSON.stringify(categoryFoods) !==
              JSON.stringify(updatedCategoryFoods)
            ) {
              set({
                foodsByCategory: {
                  ...state.foodsByCategory,
                  [categoryId]: updatedCategoryFoods,
                },
              });
            }
          });

          // Update in restaurant caches
          Object.keys(state.foodsByRestaurant).forEach((restaurantNo) => {
            const restaurantFoods = state.foodsByRestaurant[restaurantNo];
            const updatedRestaurantFoods = restaurantFoods.map((food) =>
              food._id === id ? { ...food, ...updatedFood } : food
            );

            if (
              JSON.stringify(restaurantFoods) !==
              JSON.stringify(updatedRestaurantFoods)
            ) {
              set({
                foodsByRestaurant: {
                  ...state.foodsByRestaurant,
                  [restaurantNo]: updatedRestaurantFoods,
                },
              });
            }
          });
        } catch (error) {
          set({
            isUpdating: false,
            error:
              error instanceof Error
                ? error.message
                : "Yemek güncellenirken hata oluştu",
          });
          throw error;
        }
      },

      // Delete food
      removeFood: async (id: string) => {
        set({ isDeleting: true, error: null });

        try {
          await deleteFood(id);
          const currentFoods = get().foods;

          const filteredFoods = currentFoods.filter((food) => food._id !== id);

          set({
            foods: filteredFoods,
            isDeleting: false,
            error: null,
          });

          // Remove from category caches
          const state = get();
          const updatedCategoryCache = { ...state.foodsByCategory };
          Object.keys(updatedCategoryCache).forEach((categoryId) => {
            updatedCategoryCache[categoryId] = updatedCategoryCache[
              categoryId
            ].filter((food) => food._id !== id);
          });

          // Remove from restaurant caches
          const updatedRestaurantCache = { ...state.foodsByRestaurant };
          Object.keys(updatedRestaurantCache).forEach((restaurantNo) => {
            updatedRestaurantCache[restaurantNo] = updatedRestaurantCache[
              restaurantNo
            ].filter((food) => food._id !== id);
          });

          set({
            foodsByCategory: updatedCategoryCache,
            foodsByRestaurant: updatedRestaurantCache,
          });
        } catch (error) {
          set({
            isDeleting: false,
            error:
              error instanceof Error
                ? error.message
                : "Yemek silinirken hata oluştu",
          });
          throw error;
        }
      },

      // get food by ID
      getFoodById: async (id: string) => {
        set({ isFetchingById: true, error: null });

        try {
          const food = await getFoodById(id);

          set({
            currentFood: food,
            isFetchingById: false,
            error: null,
          });
          return food;
        } catch (error) {
          set({
            isFetchingById: false,
            error:
              error instanceof Error
                ? error.message
                : "Yemek bilgisi çekilirken hata oluştu",
          });
          return null;
        }
      },

      // Fetch food by ID
      fetchFoodById: async (id: string) => {
        set({ isFetchingById: true, error: null });

        try {
          const food = await getFoodById(id);
          set({
            currentFood: food,
            isFetchingById: false,
            error: null,
          });
        } catch (error) {
          set({
            isFetchingById: false,
            error:
              error instanceof Error
                ? error.message
                : "Yemek bilgisi çekilirken hata oluştu",
          });
        }
      },

      // Fetch foods by category with cache logic
      fetchFoodsByCategory: async (
        categoryId: string,
        forceRefresh = false
      ) => {
        const state = get();

        // Cache kontrolü
        if (!forceRefresh && !state.shouldRefreshCategory(categoryId)) {
          return; // Cache'ten kullan
        }

        set({ isLoading: true, error: null });

        try {
          const foods = await getFoodsByCategory(categoryId);
          set({
            foodsByCategory: {
              ...state.foodsByCategory,
              [categoryId]: foods,
            },
            categoryLastFetch: {
              ...state.categoryLastFetch,
              [categoryId]: Date.now(),
            },
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Kategori yemekleri çekilirken hata oluştu",
          });
        }
      },

      // fetchFoodsByRestaurant fonksiyonunun düzeltilmiş versiyonu
      fetchFoodsByRestaurant: async (
        restaurantNo: string,
        forceRefresh = false
      ) => {
        const state = get();

        // Cache kontrolü
        if (!forceRefresh && !state.shouldRefreshRestaurant(restaurantNo)) {
          return; // Cache'ten kullan
        }

        set({ isLoading: true, error: null });

        try {
          const foods = await getFoodsByRestaurant(restaurantNo);
          set({
            foodsByRestaurant: {
              ...state.foodsByRestaurant,
              [restaurantNo]: foods,
            },
            restaurantLastFetch: {
              ...state.restaurantLastFetch,
              [restaurantNo]: Date.now(),
            },
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Restoran yemekleri çekilirken hata oluştu",
          });
          throw error; // Error'ı yeniden fırlat ki component'te yakalanabilsin
        }
      },

      // Cache management
      shouldRefreshCategory: (categoryId: string) => {
        const state = get();
        const lastFetch = state.categoryLastFetch[categoryId];
        if (!lastFetch) return true;

        const now = Date.now();
        const timeDiff = now - lastFetch;
        const timeoutMs = state.cacheTimeout * 60 * 1000; // Convert to milliseconds

        return timeDiff > timeoutMs;
      },

      shouldRefreshRestaurant: (restaurantNo: string) => {
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
          foods: [],
          currentFood: null,
          foodsByCategory: {},
          foodsByRestaurant: {},
          lastFetch: null,
          categoryLastFetch: {},
          restaurantLastFetch: {},
          error: null,
        });
      },

      clearCategoryCache: (categoryId: string) => {
        const state = get();
        const { [categoryId]: removed, ...remainingCategories } =
          state.foodsByCategory;
        const { [categoryId]: removedFetch, ...remainingFetch } =
          state.categoryLastFetch;

        set({
          foodsByCategory: remainingCategories,
          categoryLastFetch: remainingFetch,
        });
      },

      clearRestaurantCache: (restaurantNo: string) => {
        const state = get();
        const { [restaurantNo]: removed, ...remainingRestaurants } =
          state.foodsByRestaurant;
        const { [restaurantNo]: removedFetch, ...remainingFetch } =
          state.restaurantLastFetch;

        set({
          foodsByRestaurant: remainingRestaurants,
          restaurantLastFetch: remainingFetch,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "food-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Sadece belirli alanları persist et
      partialize: (state) => ({
        foods: state.foods,
        foodsByCategory: state.foodsByCategory,
        foodsByRestaurant: state.foodsByRestaurant,
        categoryLastFetch: state.categoryLastFetch,
        restaurantLastFetch: state.restaurantLastFetch,
        lastFetch: state.lastFetch,
        cacheTimeout: state.cacheTimeout,
      }),
    }
  )
);
