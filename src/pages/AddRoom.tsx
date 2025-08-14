import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid2 as Grid,
  IconButton,
  TextField,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

import DivisionHeader from "../components/DivisionHeader";
import AddedSaloons from "../components/Saloon/AddedSaloons";
import EditSaloontable from "../components/Saloon/EditSaloontable";
import SingleTable from "../components/SingleTable";

import { useDialogStore } from "../store/DialogStore";
import { useSaloonStore } from "../store/useSaloonStore";
import { useSnackbarStore } from "../store/SnackbarStore";
import { useTableStore } from "../store/useTableStore";

export enum ActionType {
  Edit = "edit",
  Create = "create",
}

interface SelectedSaloon {
  _id: string;
  name: string;
}

const AddRoom: React.FC = () => {
  // Local state
  const [saloonName, setSaloonName] = useState("");
  const [selectedSaloon, setSelectedSaloon] = useState<SelectedSaloon | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store hooks
  const { openDialog, closeDialog } = useDialogStore();
  const {
    addSaloon,
    saloons,
    removeSaloon,
    editSaloon,
    fetchSaloons,
    isLoading: saloonsLoading,
    error: saloonsError,
    clearError: clearSaloonsError,
  } = useSaloonStore();

  const {
    tables,
    addTable,
    fetchTables,
    removeTable,
    editTable,
    isLoading: tablesLoading,
    error: tablesError,
    clearError: clearTablesError,
  } = useTableStore();

  const { openSnackbar } = useSnackbarStore();

  // Filter tables for selected saloon
  const filteredTables = useMemo(() => {
    if (!selectedSaloon) return tables;
    return tables.filter((table) =>
      typeof table.saloonId === "object"
        ? table.saloonId._id === selectedSaloon._id
        : table.saloonId === selectedSaloon._id
    );
  }, [tables, selectedSaloon]);

  // Initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([fetchSaloons(), fetchTables()]);
      } catch (error) {
        console.error("Failed to initialize data:", error);
      }
    };

    initializeData();
  }, [fetchSaloons, fetchTables]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearSaloonsError();
      clearTablesError();
    };
  }, [clearSaloonsError, clearTablesError]);

  // Handlers
  const handleAddSaloon = useCallback(async () => {
    const trimmedName = saloonName.trim();

    if (!trimmedName) {
      openSnackbar("Salon adı boş olamaz");
      return;
    }

    // Check for duplicate names
    const isDuplicate = saloons.some(
      (saloon) => saloon.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      openSnackbar("Bu isimde bir salon zaten mevcut");
      return;
    }

    setIsSubmitting(true);

    try {
      await addSaloon(trimmedName);
      openSnackbar("Salon başarıyla eklendi");
      setSaloonName("");
    } catch (error) {
      console.error("Error adding saloon:", error);
      openSnackbar("Salon eklenirken hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  }, [saloonName, saloons, addSaloon, openSnackbar]);

  const handleDeleteSaloon = useCallback(
    (id: string) => {
      // Check if saloon has tables
      const saloonTables = tables.filter((table) =>
        typeof table.saloonId === "object"
          ? table.saloonId._id === id
          : table.saloonId === id
      );

      if (saloonTables.length > 0) {
        openSnackbar("Bu salona ait masalar var. Önce masaları silmelisiniz.");
        return;
      }

      openDialog("Salonu Sil", "Salonu silmek istediğinize emin misiniz?", {
        text: "Sil",
        onClick: async () => {
          try {
            await removeSaloon(id);
            openSnackbar("Salon başarıyla silindi");

            // Clear selection if deleted saloon was selected
            if (selectedSaloon?._id === id) {
              setSelectedSaloon(null);
            }
          } catch (error) {
            console.error("Error deleting saloon:", error);
            openSnackbar("Salon silinirken hata oluştu");
          } finally {
            closeDialog();
          }
        },
      });
    },
    [
      tables,
      selectedSaloon,
      openDialog,
      closeDialog,
      removeSaloon,
      openSnackbar,
    ]
  );

  const handleEditSaloon = useCallback(
    (card: SelectedSaloon) => {
      openDialog(
        "Salonu Düzenle",
        <EditSaloontable
          card={card}
          type={ActionType.Edit}
          handleEdit={async (id: string, name: string) => {
            try {
              await editSaloon(id, name);
              openSnackbar("Salon başarıyla güncellendi");

              // Update selected saloon if it was the edited one
              if (selectedSaloon?._id === id) {
                setSelectedSaloon({ ...selectedSaloon, name });
              }
            } catch (error) {
              console.error("Error editing saloon:", error);
              openSnackbar("Salon güncellenirken hata oluştu");
            }
          }}
          closeDialog={closeDialog}
        />
      );
    },
    [selectedSaloon, openDialog, closeDialog, editSaloon, openSnackbar]
  );

  const handleAddTable = useCallback(
    (card: SelectedSaloon) => {
      openDialog(
        "Masa Ekle",
        <EditSaloontable
          card={card}
          type={ActionType.Create}
          handleEdit={async (saloonId: string, tableName: string) => {
            try {
              await addTable(saloonId, tableName);
              openSnackbar("Masa başarıyla eklendi");
            } catch (error) {
              console.error("Error adding table:", error);
              openSnackbar("Masa eklenirken hata oluştu");
            }
          }}
          closeDialog={closeDialog}
        />
      );
    },
    [openDialog, closeDialog, addTable, openSnackbar]
  );

  const handleDeleteTable = useCallback(
    (tableId: string) => {
      openDialog("Masayı Sil", "Masayı silmek istediğinize emin misiniz?", {
        text: "Sil",
        onClick: async () => {
          try {
            await removeTable(tableId);
            openSnackbar("Masa başarıyla silindi");
          } catch (error) {
            console.error("Error deleting table:", error);
            openSnackbar("Masa silinirken hata oluştu");
          } finally {
            closeDialog();
          }
        },
      });
    },
    [openDialog, closeDialog, removeTable, openSnackbar]
  );

  const handleEditTable = useCallback(
    (table: any) => {
      openDialog(
        "Masayı Düzenle",
        <EditSaloontable
          card={{ _id: table._id, name: table.name }}
          type={ActionType.Edit}
          handleEdit={async (id: string, name: string) => {
            try {
              const saloonId =
                typeof table.saloonId === "object"
                  ? table.saloonId._id
                  : table.saloonId;
              await editTable(id, name, saloonId);
              openSnackbar("Masa başarıyla güncellendi");
            } catch (error) {
              console.error("Error editing table:", error);
              openSnackbar("Masa güncellenirken hata oluştu");
            }
          }}
          closeDialog={closeDialog}
        />
      );
    },
    [openDialog, closeDialog, editTable, openSnackbar]
  );

  const handleSelectSaloon = useCallback((saloon: SelectedSaloon) => {
    setSelectedSaloon(saloon);
  }, []);

  const handleSaloonNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSaloonName(event.target.value);
    },
    []
  );

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && !isSubmitting) {
        handleAddSaloon();
      }
    },
    [handleAddSaloon, isSubmitting]
  );

  // Loading state
  const isLoading = saloonsLoading || tablesLoading;

  return (
    <>
      <DivisionHeader header="Salon Yönetimi" />

      {/* Error Alerts */}
      {saloonsError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearSaloonsError}>
          {saloonsError}
        </Alert>
      )}

      {tablesError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearTablesError}>
          {tablesError}
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* Saloon Management Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ background: "#fff", p: 3, mx: "auto" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextField
                  autoComplete="off"
                  name="saloon"
                  required
                  fullWidth
                  placeholder="Salon/Oda İsmi"
                  value={saloonName}
                  onChange={handleSaloonNameChange}
                  onKeyPress={handleKeyPress}
                  size="small"
                  disabled={isSubmitting}
                  error={!saloonName.trim() && saloonName.length > 0}
                  helperText={
                    !saloonName.trim() && saloonName.length > 0
                      ? "Salon adı gerekli"
                      : ""
                  }
                />
                <Button
                  variant="contained"
                  onClick={handleAddSaloon}
                  disabled={!saloonName.trim() || isSubmitting}
                  startIcon={
                    isSubmitting ? <CircularProgress size={16} /> : null
                  }
                  sx={{ minWidth: "auto", whiteSpace: "nowrap" }}
                >
                  {isSubmitting ? "Ekleniyor..." : "Ekle"}
                </Button>
              </Box>

              {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <AddedSaloons
                  handleSelect={handleSelectSaloon}
                  saloons={saloons}
                  edit={handleEditSaloon}
                  remove={handleDeleteSaloon}
                  addTable={handleAddTable}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Tables Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              {!selectedSaloon ? (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 4,
                    color: "text.secondary",
                  }}
                >
                  Masa görüntülemek için bir salon seçin
                </Box>
              ) : (
                <>
                  <Box sx={{ mb: 2, fontWeight: "bold" }}>
                    {selectedSaloon.name} - Masalar
                  </Box>

                  {filteredTables.length === 0 ? (
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 4,
                        color: "text.secondary",
                      }}
                    >
                      Bu salonda henüz masa bulunmuyor
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        flexWrap: "wrap",
                        gap: 2,
                      }}
                    >
                      {filteredTables.map((table) => (
                        <Box
                          key={table._id}
                          sx={{
                            borderRadius: "4px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            background: "#fff",
                            position: "relative",
                            cursor: "pointer",
                          }}
                        >
                          <SingleTable table={table} />
                          <Box sx={{ mt: 1 }}>
                            <Tooltip title="Masayı Düzenle">
                              <IconButton
                                size="small"
                                onClick={() => handleEditTable(table)}
                              >
                                <Edit fontSize="small" color="primary" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Masayı Sil">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteTable(table._id)}
                              >
                                <Delete fontSize="small" color="error" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default AddRoom;
