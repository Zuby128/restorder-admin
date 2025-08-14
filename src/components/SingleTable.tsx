import { Box, Icon, Typography } from "@mui/material";
import { Flatware } from "@mui/icons-material";

interface ITable {
  _id: string;
  name: string;
  isOpen?: boolean;
}

function SingleTable({ table }: { table: ITable }) {
  return (
    <Box
      sx={{
        border: "2px solid #A9A9A9",
        width: "100px",
        height: "100px",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        cursor: "pointer",
        bgcolor: table?.isOpen ? "primary.light" : "secondary.light",
      }}
    >
      {/* {table?.isOpen ? <GlowActiveLight /> : <PassiveLight />} */}
      <Box>
        <Typography
          variant="h6"
          color="primary"
          sx={{
            textAlign: "center",
            maxWidth: "90px",
          }}
          className="truncate"
        >
          {table.name}
        </Typography>
        <Icon sx={{ mx: "auto", width: "100%", height: "100%" }}>
          <Flatware color="primary" fontSize="large" />
        </Icon>
      </Box>
    </Box>
  );
}

export default SingleTable;
