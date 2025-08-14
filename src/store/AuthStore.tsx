import { create } from "zustand";
import { config } from "../config/config";
import { IAuth } from "../types/auth";

const authKey = config.AUTH;

interface AuthState {
  isAuthenticated: boolean;
  userAuth: IAuth | null;
  isLoading: boolean;
  login: (body: IAuth) => Promise<void>;
  logout: () => Promise<void>;
  userUpdate: (body: Partial<IAuth>) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userAuth: null,
  isLoading: true,

  login: async (body: IAuth) => {
    const value = JSON.stringify(body);
    await localStorage.setItem(authKey, value);
    set({ userAuth: body, isAuthenticated: true });
  },

  logout: async () => {
    await localStorage.removeItem(authKey);
    set({ userAuth: null, isAuthenticated: false });
  },

  userUpdate: async (body: Partial<IAuth>) => {
    const res = await localStorage.getItem(authKey);
    if (!res) return;
    const { token } = JSON.parse(res);
    const updatedAuth: IAuth = {
      token,
      user: body.user ? { ...body.user } : null,
    };
    const value = JSON.stringify(updatedAuth);
    await localStorage.setItem(authKey, value);
    set((state) => ({
      userAuth: state.userAuth
        ? {
            ...state.userAuth,
            user:
              state.userAuth.user && body.user
                ? { ...state.userAuth.user, ...body.user }
                : body.user || state.userAuth.user,
          }
        : { token, user: body.user || null },
    }));
  },

  initialize: async () => {
    const value = await localStorage.getItem(authKey);
    if (value) {
      const parsed = JSON.parse(value);
      set({ userAuth: parsed, isAuthenticated: true });
    }
    set({ isLoading: false });
  },
}));
