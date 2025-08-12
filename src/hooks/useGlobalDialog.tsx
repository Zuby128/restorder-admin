import { useDialogStore } from "../store/DialogStore";

export const useGlobalDialog = () => {
  const { openDialog, closeDialog } = useDialogStore();
  return { openDialog, closeDialog };
};
