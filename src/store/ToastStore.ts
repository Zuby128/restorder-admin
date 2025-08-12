import { create } from "zustand";

interface ToastState {
  isToastOpen: boolean;
  title: string; // Bu eksikti
  content: string;
  color: string;
  openToast: (title: string, content: string, color: string) => void;
  closeToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  isToastOpen: false,
  title: "",
  content: "",
  color: "primary",
  openToast: (title, content) => set({ isToastOpen: true, title, content }),
  closeToast: () => set({ isToastOpen: false, title: "", content: "" }),
}));
