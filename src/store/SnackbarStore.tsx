import { create } from "zustand";

interface SnackbarStore {
  isOpen: boolean;
  content: React.ReactNode;
  openSnackbar: (content: React.ReactNode) => void;
  closeSnackbar: () => void;
}

export const useSnackbarStore = create<SnackbarStore>((set) => ({
  isOpen: false,
  content: null,
  openSnackbar: (content) => set({ isOpen: true, content }),
  closeSnackbar: () => set({ isOpen: false }),
}));
