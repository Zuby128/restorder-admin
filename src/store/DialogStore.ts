import { create } from "zustand";

interface DialogState {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  extraButton?: {
    text: string;
    onClick: (v: any) => void;
  } | null;
  openDialog: (
    title: string,
    content: React.ReactNode,
    extraButton?: { text: string; onClick: () => void } | null
  ) => void;
  closeDialog: () => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  title: "",
  content: null,
  extraButton: null,
  openDialog: (title, content, extraButton = null) =>
    set({ isOpen: true, title, content, extraButton }),
  closeDialog: () => set({ isOpen: false }),
}));
