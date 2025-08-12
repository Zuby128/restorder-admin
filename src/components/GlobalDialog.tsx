import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useDialogStore } from "../store/DialogStore";

const GlobalDialog = () => {
  const { isOpen, title, content, extraButton, closeDialog } = useDialogStore();

  return (
    <Dialog open={isOpen} onClose={closeDialog} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        {/* Eğer extraButton varsa göster */}
        {extraButton && (
          <Button
            onClick={extraButton.onClick}
            color="primary"
            variant="contained"
          >
            {extraButton.text}
          </Button>
        )}
        <Button onClick={closeDialog} color="error" variant="outlined">
          İptal
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GlobalDialog;
