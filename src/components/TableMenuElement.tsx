import { AddCircle, RemoveCircle } from "@mui/icons-material";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

function TableMenuElement({ menu, total }: { menu: any; total: number }) {
  return (
    <>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Yemek</TableCell>
            <TableCell align="right">Adet</TableCell>
            <TableCell align="right">Fiyat&nbsp;(TL)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {menu.map((v: any, i: number) => (
            <TableRow key={i}>
              <TableCell>{v.name}</TableCell>
              <TableCell align="right">
                <IconButton>
                  <RemoveCircle />
                </IconButton>
                {v.quantity}
                <IconButton>
                  <AddCircle />
                </IconButton>
              </TableCell>
              <TableCell align="right">{v.price}&nbsp;(TL)</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>TOPLAM</TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right">{total}&nbsp;(TL)</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}

export default TableMenuElement;
