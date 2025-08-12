import { Card, CardContent, Typography } from "@mui/material";
function RoomCard({
  name,
  id,
  action,
  room,
}: {
  name: string;
  id: string;
  action: (id: string) => void;
  room: string;
}) {
  return (
    <Card
      sx={{
        background: "#fff",
        width: "100%",
        height: "70px",
        cursor: "pointer",
      }}
      onClick={() => action(id)}
    >
      <CardContent className="">
        <Typography
          sx={{ textAlign: "center", fontWeight: 800, pt: 0.5 }}
          color={room === id ? "secondary.main" : "secondary.light"}
          variant="h5"
        >
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default RoomCard;
