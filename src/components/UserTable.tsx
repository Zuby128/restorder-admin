import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Checkbox,
  Toolbar,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface User {
  name: string;
  surname: string;
  password: string;
  bod: string;
  tck: string;
  phone: string;
  address: string;
  price: string;
  startDate: string; // ✅ Yeni alan: İşe Başlama Tarihi
}

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Arama çubuğu state

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSelect = (tck: string) => {
    setSelectedUsers((prev) =>
      prev.includes(tck) ? prev.filter((id) => id !== tck) : [...prev, tck]
    );
  };

  const handleActionClick = () => {
    console.log("Seçilen kullanıcılar:", selectedUsers);
    alert(`İşlem yapılıyor! Seçilen kullanıcılar: ${selectedUsers.join(", ")}`);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.tck.includes(searchQuery)
  );

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      {/* ✅ Toolbar: Arama ve İşlem Butonu */}
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Personel Listesi</Typography>
        <TextField
          label="Ara..."
          variant="outlined"
          size="small"
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 250 }}
        />
        <Button
          variant="contained"
          color="secondary"
          disabled={selectedUsers.length === 0}
          onClick={handleActionClick}
        >
          Seçilenleri İşle
        </Button>
      </Toolbar>

      <TableContainer>
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Seç</strong>
              </TableCell>
              <TableCell>
                <strong>Ad</strong>
              </TableCell>
              <TableCell>
                <strong>Soyad</strong>
              </TableCell>
              <TableCell>
                <strong>Doğum Tarihi</strong>
              </TableCell>
              <TableCell>
                <strong>TCK</strong>
              </TableCell>
              <TableCell>
                <strong>Telefon</strong>
              </TableCell>
              <TableCell>
                <strong>Adres</strong>
              </TableCell>
              <TableCell>
                <strong>Haftalık</strong>
              </TableCell>
              <TableCell>
                <strong>İşe Başlama Tarihi</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.tck}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.tck)}
                      onChange={() => handleSelect(user.tck)}
                    />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.surname}</TableCell>
                  <TableCell>{user.bod}</TableCell>
                  <TableCell>{user.tck}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>{user.price}</TableCell>
                  <TableCell>{user.startDate}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ Pagination */}
      <TablePagination
        rowsPerPageOptions={[10]} // Sadece 15 kişi olacak
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </Paper>
  );
};

export default UserTable;
