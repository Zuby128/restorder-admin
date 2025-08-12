import { Typography } from "@mui/material";
import React from "react";

function DivisionHeader({ header }: { header: string }) {
  return (
    <Typography
      variant="h5"
      className="roboto-condensed"
      sx={{ fontWeight: 800, mb: 2 }}
    >
      {header}
    </Typography>
  );
}

export default DivisionHeader;
