import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";

function AddTable({
  card,
  addTable,
  closeDialog,
}: {
  card: { _id: string; name: string };
  addTable: (id: string, name: string) => void;
  closeDialog: () => void;
}) {
  const [name, setName] = useState("");

  const handleName = () => {
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
          addTable(card._id, name);
          closeDialog();
        }}
      >
        Ekle
      </Button>
    </Box>
  );
}

export default AddTable;
