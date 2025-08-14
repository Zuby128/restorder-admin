import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { ActionType } from "../../pages/AddRoom";

function EditSaloontable({
  card,
  type,
  handleEdit,
  closeDialog,
}: {
  card: { _id: string; name: string };
  type: string;
  handleEdit: (id: string, name: string) => void;
  closeDialog: () => void;
}) {
  const [name, setName] = useState("");

  const handleName = () => {
    if (type === ActionType.Create) return;
    setName(card.name);
  };
  useEffect(() => {
    handleName();
  }, [card]);
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <TextField
        name="xxx"
        required
        fullWidth
        id="xxx"
        onChange={(e) => setName(e.target.value)}
        type="text"
        value={name}
        size="small"
      />
      <Button
        variant="contained"
        sx={{ ml: 1 }}
        onClick={() => {
          handleEdit(card._id, name);
          closeDialog();
        }}
      >
        Ekle
      </Button>
    </Box>
  );
}

export default EditSaloontable;
