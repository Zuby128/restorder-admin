import { create } from "zustand";

interface AlertButton {
  text: string;
  role?: string;
  handler: (v: any) => void;
}

interface AlertState {
  isAlertOpen: boolean;
  title: string; // Bu eksikti
  content: string;
  alertButtons: AlertButton[]; // Array olarak düzeltildi
  openAlert: (
    title: string,
    content: string,
    alertButtons?: AlertButton[]
  ) => void;
  closeAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  isAlertOpen: false,
  title: "",
  content: "",
  alertButtons: [],
  openAlert: (title, content, alertButtons) =>
    set({ isAlertOpen: true, title, content, alertButtons }),
  closeAlert: () =>
    set({ isAlertOpen: false, title: "", content: "", alertButtons: [] }),
}));
