import { Card, CardContent } from "@mui/material";
import { ReactNode } from "react";

function SingleRoom({ children }: { children: ReactNode }) {
  return (
    <Card
      sx={{
        background: "#fff",
        height: "100%",
        width: "100%",
        maxHeight: "80vh",
        maxWidth: "1000px",
        borderRadius: "8px",
      }}
    >
      <CardContent
        sx={{
          background: "#fff",
          height: "100%",
          width: "100%",
          // maxHeight: "80vh",
          // maxWidth: "600px",
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
}

export default SingleRoom;
