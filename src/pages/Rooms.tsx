import { Grid2 as Grid } from "@mui/material";
import SingleTable from "../components/SingleTable";
import SingleRoom from "../components/SingleRoom";
import { ROOM_TABLES } from "../db/tables";

const ROOMS = [
  { _id: "1", name: "Yaz Bahçesi" },
  { _id: "2", name: "Kış Bahçesi" },
  { _id: "3", name: "Bahar Bahçesi" },
];

const roomTable = ROOM_TABLES;

function Rooms() {
  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }} spacing={4}>
          {/* {ROOMS.map((v) => (
            // <RoomCard name={v.name} id={v._id} key={v._id} />
          ))} */}
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <SingleRoom>
            {roomTable.map((v: any) => (
              <SingleTable table={v} />
            ))}
          </SingleRoom>
        </Grid>
      </Grid>
    </>
  );
}

export default Rooms;
