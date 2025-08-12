import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid2 as Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import SingleTable from "../components/SingleTable";
import SingleRoom from "../components/SingleRoom";
import RoomCard from "../components/RoomCard";
import { ROOM_TABLES } from "../db/tables";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DivisionHeader from "../components/DivisionHeader";

const ROOMS = [
  { _id: "1", name: "Yaz Bahçesi" },
  { _id: "2", name: "Kış Bahçesi" },
  { _id: "3", name: "Bahar Bahçesi" },
];

const roomTable = ROOM_TABLES;

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${date}/0${month}/${year}`;
}

function TodayOrders() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomId, setRoomId] = useState<string>("");
  const filterRoom = (room: string) => {
    const filtered = roomTable.filter((v) => v.roomId === room);
    setRooms(filtered);
    setRoomId(room);
  };
  const [currentDate, setCurrentDate] = useState(getDate());

  return (
    <>
      <DivisionHeader header="Anlık Durum" />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }} spacing={4}>
          <Card>
            <CardContent
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {ROOMS.map((v) => (
                <RoomCard
                  name={v.name}
                  id={v._id}
                  action={filterRoom}
                  key={v._id}
                  room={roomId}
                />
              ))}
            </CardContent>
          </Card>
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Bugünkü ({currentDate}) Siparişler
              </Typography>
              <List>
                <ListItem
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "full",
                  }}
                >
                  <ListItemText primary={`Anlık Açık Masa Sayısı`} />
                  <ListItemText sx={{ textAlign: "end" }} primary={23} />
                </ListItem>
                <ListItem
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "full",
                  }}
                >
                  <ListItemText primary={`Toplam Açılan Masa Sayısı`} />
                  <ListItemText sx={{ textAlign: "end" }} primary={65} />
                </ListItem>
                <Divider />
                <ListItem
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "full",
                  }}
                >
                  <ListItemText primary={`Kahvaltı`} />
                  <ListItemText sx={{ textAlign: "end" }} primary={120} />
                </ListItem>
                <ListItem
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "full",
                  }}
                >
                  <ListItemText primary={`Sıkma Portakal Suyu`} />
                  <ListItemText sx={{ textAlign: "end" }} primary={55} />
                </ListItem>
                <ListItem
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "full",
                  }}
                >
                  <ListItemText primary={`Hazır Portakal Suyu`} />
                  <ListItemText sx={{ textAlign: "end" }} primary={38} />
                </ListItem>
                <ListItem
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "full",
                  }}
                >
                  <ListItemText primary={`Kahve`} />
                  <ListItemText sx={{ textAlign: "end" }} primary={100} />
                </ListItem>
                <ListItem
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "full",
                  }}
                >
                  <ListItemText primary={`Teneke Tavuk`} />
                  <ListItemText sx={{ textAlign: "end" }} primary={23} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          {rooms.length === 0 ? (
            <Card>
              <CardContent>
                <Typography variant="h6">Henüz bir oda seçmediniz</Typography>
              </CardContent>
            </Card>
          ) : (
            <SingleRoom>
              {rooms.map((v: any) => (
                <Box
                  onClick={
                    v.isOpen
                      ? () => navigate(`/dashboard/today-orders/${v._id}`)
                      : () => {}
                  }
                >
                  <SingleTable table={v} />
                </Box>
              ))}
            </SingleRoom>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default TodayOrders;
