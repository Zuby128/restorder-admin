import React, { useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { AddCircle, Delete as DeleteIcon, Edit } from "@mui/icons-material";

interface Saloon {
  _id: string;
  name: string;
}

interface AddedSaloonsProps {
  saloons: Saloon[];
  handleSelect: (card: Saloon) => void;
  edit: (card: Saloon) => void;
  remove: (id: string) => void;
  addTable: (card: Saloon) => void;
}

const AddedSaloons: React.FC<AddedSaloonsProps> = React.memo(
  ({ saloons, handleSelect, edit, remove, addTable }) => {
    const [selectedCard, setSelectedCard] = useState<string>("");

    const handleCardClick = useCallback(
      (saloon: Saloon) => {
        setSelectedCard(saloon._id);
        handleSelect(saloon);
      },
      [handleSelect]
    );

    const handleEdit = useCallback(
      (e: React.MouseEvent, saloon: Saloon) => {
        e.stopPropagation(); // Prevent card selection when clicking edit
        edit(saloon);
      },
      [edit]
    );

    const handleRemove = useCallback(
      (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent card selection when clicking delete
        remove(id);
      },
      [remove]
    );

    const handleAddTable = useCallback(
      (e: React.MouseEvent, saloon: Saloon) => {
        e.stopPropagation(); // Prevent card selection when clicking add table
        addTable(saloon);
      },
      [addTable]
    );

    if (saloons.length === 0) {
      return (
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            py: 4,
            color: "text.secondary",
          }}
        >
          Henüz salon eklenmemiş
        </Box>
      );
    }

    return (
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(280px, 100%), 1fr))",
          gap: 2,
          mt: 4,
        }}
      >
        {saloons.map((saloon) => (
          <Card
            key={saloon._id}
            sx={{
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              transform:
                selectedCard === saloon._id ? "translateY(-2px)" : "none",
              boxShadow: selectedCard === saloon._id ? 3 : 1,
              backgroundColor:
                selectedCard === saloon._id
                  ? "action.selected"
                  : "background.paper",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: 2,
                backgroundColor:
                  selectedCard === saloon._id
                    ? "action.selectedHover"
                    : "action.hover",
              },
            }}
            onClick={() => handleCardClick(saloon)}
          >
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                "&:last-child": {
                  pb: 2,
                },
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "160px",
                  fontWeight: selectedCard === saloon._id ? "600" : "500",
                  color:
                    selectedCard === saloon._id
                      ? "primary.main"
                      : "text.primary",
                }}
                title={saloon.name} // Tooltip for long names
              >
                {saloon.name}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                  alignItems: "center",
                }}
              >
                <Tooltip title="Düzenle" arrow>
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={(e) => handleEdit(e, saloon)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "primary.light",
                        color: "primary.contrastText",
                      },
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Sil" arrow>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={(e) => handleRemove(e, saloon._id)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "error.light",
                        color: "error.contrastText",
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Masa Ekle" arrow>
                  <IconButton
                    color="warning"
                    size="small"
                    onClick={(e) => handleAddTable(e, saloon)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "warning.light",
                        color: "warning.contrastText",
                      },
                    }}
                  >
                    <AddCircle fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }
);

AddedSaloons.displayName = "AddedSaloons";

export default AddedSaloons;
