import { Box, Typography } from "@mui/material";
import TableSvg from "../assets/images/table.svg";
import GlowActiveLight from "./GlowActiveLight";
import PassiveLight from "./PassiveLight";

interface ITable {
  _id: string;
  name: string;
  roomId: string;
  roomName: string;
  orders: any[];
  tableOpenTime?: string;
  tableCloseTime?: string;
  isOpen?: boolean;
  waiter?: string;
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
        background: "#fff",
        position: "relative",
        cursor: "pointer",
      }}
    >
      {table?.isOpen ? <GlowActiveLight /> : <PassiveLight />}
      <Box>
        <Typography
          variant="h6"
          sx={{
            color: "#0099FC",
            textAlign: "center",
            mb: 2,
            maxWidth: "90px",
          }}
          className="truncate"
        >
          {table.name}
        </Typography>
        <Box
          component="img"
          alt="table icon"
          src={TableSvg}
          sx={{ width: "60px", mx: "auto" }}
        ></Box>
      </Box>
    </Box>
  );
}

export default SingleTable;
