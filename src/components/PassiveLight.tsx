import { Box } from "@mui/material";

function PassiveLight() {
  return (
    <Box
      sx={{
        position: "absolute",
        top: -6,
        right: -6,
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: "red",
      }}
    ></Box>
  );
}

export default PassiveLight;
