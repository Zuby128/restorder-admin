import { Snackbar } from "@mui/material";
import { useSnackbarStore } from "../store/SnackbarStore";

function GlobalSnackbar() {
  const { isOpen, content, closeSnackbar } = useSnackbarStore();
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={isOpen}
        onClose={closeSnackbar}
        message={content}
      />
    </>
  );
}

export default GlobalSnackbar;
