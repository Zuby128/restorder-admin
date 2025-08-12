import { Box } from "@mui/material";

function GlowActiveLight() {
  return (
    <Box
      sx={{
        position: "absolute",
        top: -6,
        right: -6,
        width: "20px",
        height: "20px",
        transition: "text-shadow 0.4s ease",
        boxShadow: "0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00",
        borderRadius: "50%",
        background: "#51ff0d",
      }}
    ></Box>
  );
}

export default GlowActiveLight;
