import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2 as Grid,
  TextField,
  Typography,
} from "@mui/material";
import DivisionHeader from "../components/DivisionHeader";
import { BorderColor, DeleteForever } from "@mui/icons-material";
import { useState } from "react";
import TableSvg from "../assets/images/table.svg";
import { ROOM_TABLES } from "../db/tables";
import SingleRoom from "../components/SingleRoom";
import { useGlobalDialog } from "../hooks/useGlobalDialog";

const roomNames = ["Yaz", "Kış", "Bahar"];
function AddRoom() {
  const [selected, setSelected] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [rooms, setRooms] = useState<string[]>(roomNames);
  const [table, setTable] = useState<string>("");
  const [editDialog, setEditDialog] = useState<boolean>(false);
  const [editType, setEditType] = useState<string>("");

  const { openDialog, closeDialog } = useGlobalDialog();

  const onAddRoom = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoom(event.target.value);
  };

  const addRoom = () => {
    if (room.trim()) {
      const arr = [...rooms, room];
      setRooms(arr);
      setRoom("");
    }
  };

  const onAddTable = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTable(event.target.value);
  };

  const addTable = () => {
    if (table.trim()) {
      setTable("");
    }
  };

  const onSelect = (v: string) => {
    setSelected(v);
  };

  const roomTable = ROOM_TABLES.slice(0, 5);

  return (
    <>
      <DivisionHeader header="Oda Yönetimi" />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }} spacing={4}>
          <Card sx={{ background: "#fff", p: 3, mx: "auto" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  autoComplete="room"
                  name="room"
                  required
                  fullWidth
                  placeholder="Salon/Oda İsmi"
                  id="room"
                  onChange={onAddRoom}
                  type="text"
                  value={room}
                  size="small"
                />
                <Button variant="contained" sx={{ ml: 1 }} onClick={addRoom}>
                  Ekle
                </Button>
              </Box>
              <Box
                sx={{
                  mt: 2,
                  width: "100%",
                  overflowX: "auto",
                  overflowY: "hidden",
                  height: 100,
                  display: "flex",
                  flexWrap: "nowrap",
                  gap: 1,
                  borderRadius: "8px",
                  border: "2px solid #f7f7f7",
                  alignItems: "center",
                  px: 1,
                }}
              >
                {rooms.map((v) => (
                  <Box
                    key={v}
                    onClick={() => onSelect(v)}
                    sx={{
                      minWidth: 150,
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "8px",
                      border: "2px solid gray",
                      cursor: "pointer",
                      pb: 1,
                      backgroundColor: v === selected ? "#f1f1f1" : "",
                    }}
                  >
                    <Typography
                      variant="h6"
                      className="roboto-condensed"
                      sx={{
                        textAlign: "center",
                        color: v === selected ? "secondary.main" : "",
                      }}
                    >
                      {v}
                    </Typography>
                    <div className="flex justify-center w-full">
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() =>
                          openDialog(
                            "Odayı sil",
                            <p>{v} odasını silmeyi onaylıyor musunuz?</p>,
                            {
                              text: "Onayla",
                              onClick: () => {
                                console.log("masa silindi");
                                closeDialog();
                              },
                            }
                          )
                        }
                      >
                        <DeleteForever
                          sx={{ fontSize: "20px", color: "secondary.light" }}
                        />
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={() => {
                          setEditType("room");
                          setEditDialog(true);
                        }}
                      >
                        <BorderColor
                          sx={{ fontSize: "20px", color: "secondary.main" }}
                        />
                      </Button>
                    </div>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
          {selected && (
            <Card sx={{ background: "#fff", p: 3, mx: "auto", mt: 2 }}>
              <CardContent>
                <Box>
                  <Typography variant="h6">{selected} Odası Seçildi</Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      autoComplete="table"
                      name="table"
                      required
                      fullWidth
                      placeholder="Masa İsmi"
                      id="table"
                      onChange={onAddTable}
                      type="text"
                      value={table}
                      size="small"
                    />
                    <Button
                      variant="contained"
                      sx={{ ml: 1 }}
                      onClick={addTable}
                    >
                      Ekle
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SingleRoom>
            {selected &&
              roomTable.map((v) => (
                <Box
                  sx={{
                    border: "2px solid #A9A9A9",
                    width: "150px",
                    height: "150px",
                    borderRadius: "4px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#fff",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <Box sx={{ width: "100%" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#0099FC",
                        textAlign: "center",
                        mb: 2,
                        maxWidth: "90px",
                        mx: "auto",
                      }}
                      className="truncate"
                    >
                      {v.name}
                    </Typography>
                    <Box
                      component="img"
                      alt="table icon"
                      src={TableSvg}
                      sx={{ width: "60px", mx: "auto" }}
                    ></Box>
                    <div className="flex flex-nowrap justify-center pt-3 mx-auto w-full">
                      <Button
                        color="error"
                        variant="outlined"
                        onClick={() =>
                          openDialog(
                            "Masayı sil",
                            <p>
                              {selected} Odasından {v.name} masasını silmeyi
                              onaylıyor musunuz?
                            </p>,
                            {
                              text: "Onayla",
                              onClick: () => {
                                console.log("masa silindi");
                              },
                            }
                          )
                        }
                      >
                        <DeleteForever
                          sx={{ fontSize: "20px", color: "secondary.light" }}
                        />
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setEditType("table");
                          setEditDialog(true);
                        }}
                        color="success"
                      >
                        <BorderColor
                          sx={{ fontSize: "20px", color: "secondary.main" }}
                        />
                      </Button>
                    </div>
                  </Box>
                </Box>
              ))}
          </SingleRoom>
        </Grid>
      </Grid>
      <Dialog open={editDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {editType === "room" ? "Oda" : "Masa"} İsmini Düzenle
        </DialogTitle>
        <DialogContent>
          <TextField
            autoComplete="room"
            name="room"
            required
            fullWidth
            placeholder={
              editType === "room" ? "Oda İsmi Düzenle" : "Masa İsmi Düzenle"
            }
            id="room"
            // onChange={onAddRoom}
            type="text"
            // value={room}
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant="contained">
            Onayla
          </Button>
          <Button
            onClick={() => setEditDialog(false)}
            color="error"
            variant="outlined"
          >
            İptal
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddRoom;
