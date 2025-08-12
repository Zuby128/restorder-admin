import { AddBox, AddCircle, RemoveCircle } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid2 as Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalDialog } from "../hooks/useGlobalDialog";

const MENU = [
  { id: "1", name: "Kahvaltı", price: 3 * 150, quantity: 3 },
  { id: "2", name: "Sıkma Portakal Suyu", price: 3 * 50, quantity: 3 },
  { id: "3", name: "Kahve", price: 2 * 40, quantity: 2 },
];

const MENU_LIST = [
  { id: "1", name: "Kahvaltı", price: 150 },
  { id: "2", name: "Sıkma Portakal Suyu", price: 50 },
  { id: "4", name: "Hazır Portakal Suyu", price: 30 },
  { id: "3", name: "Kahve", price: 40 },
];

function TodayOrderTableDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openDialog } = useGlobalDialog();
  const [total, setTotal] = useState<number>(0);
  const [menu, setMenu] = useState<any[]>(MENU);
  const [text, setText] = useState<{ name: string; price: number }>({
    name: "",
    price: 0,
  });

  useEffect(() => {
    setOrderPrice();
  }, [id]);

  const sumTotal = (arr: any[]) => {
    const t = arr.reduce(
      (sum, { price, quantity }) => sum + price * quantity,
      0
    );
    return t;
  };
  const setOrderPrice = () => {
    setTotal(sumTotal(menu));
  };

  const addElement = (i: number) => {
    const arr = [...menu];
    const el = {
      ...arr[i],
      quantity: arr[i].quantity + 1,
      price: (arr[i].price / arr[i].quantity) * (arr[i].quantity + 1),
    };
    arr[i] = el;
    setMenu(arr);
    setTotal(sumTotal(arr));
  };

  const removeElement = (i: number) => {
    const arr = [...menu];
    let el;
    if (menu[i].quantity === 1) {
      const newArr = arr.filter((v, s) => s !== i);
      setMenu(newArr);
      setTotal(sumTotal(newArr));
    } else if (menu[i].quantity > 1) {
      el = {
        ...arr[i],
        quantity: arr[i].quantity - 1,
        price: (arr[i].price / arr[i].quantity) * (arr[i].quantity - 1),
      };
      arr[i] = el;
      setMenu(arr);
      setTotal(sumTotal(arr));
    }
  };

  const addMenuElement = (v: any) => {
    const arr = [...menu];
    const index = arr.findIndex((s) => s.name === v.name);
    if (index >= 0) {
      const el = {
        ...arr[index],
        quantity: arr[index].quantity + 1,
        price:
          (arr[index].price / arr[index].quantity) * (arr[index].quantity + 1),
      };
      arr[index] = el;
      setMenu(arr);
    } else {
      arr.push({ ...v, quantity: 1, price: v.price });
      setMenu(arr);
    }
    const t = total + v.price;
    setTotal(t);
  };

  const addOutMenuElement = () => {
    const arr = [...menu];
    const id = new Date().getTime().toString();
    arr[arr.length] = {
      id,
      name: text.name,
      price: Number(text.price),
      quantity: 1,
    };
    setMenu(arr);
    const t = total + Number(text.price);
    setTotal(t);
    setText({ name: "", price: 0 });
  };

  const setTextValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText({ ...text, [e.target.id]: e.target.value });
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ background: "#fff" }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                px: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Personel:
              </Typography>
              <Typography variant="h6">Ramazan Yetişir</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Yemek</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>
                    Adet
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>
                    Fiyat&nbsp;(TL)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menu.map((v: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell>{v.name}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => removeElement(i)}>
                        <RemoveCircle />
                      </IconButton>
                      {v.quantity}
                      <IconButton onClick={() => addElement(i)}>
                        <AddCircle />
                      </IconButton>
                    </TableCell>
                    <TableCell align="right">{v.price}&nbsp;(TL)</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>TOPLAM</TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right">{total}&nbsp;(TL)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 4,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/dashboard/today-orders")}
              >
                Önceki Sayfa
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() =>
                  openDialog(
                    "Masa Kapat",
                    <p>
                      Masayı kapatmayı ve hesabı sıfırlamayı onaylıyor musunuz?
                    </p>,
                    {
                      text: "Onayla",
                      onClick: () => {
                        console.log("masa kapatıldı");
                      },
                    }
                  )
                }
              >
                Masayı Kapat
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ background: "#fff" }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{ textAlign: "center", fontWeight: 800 }}
            >
              Menu Listesi
            </Typography>
            <List
              sx={{ width: "100%", maxWidth: 600, bgcolor: "background.paper" }}
            >
              {MENU_LIST.map((v) => (
                <ListItem
                  key={v.id}
                  secondaryAction={<ListItemText primary={`${v.price} TL`} />}
                >
                  <ListItemIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => addMenuElement(v)}
                  >
                    <AddBox />
                  </ListItemIcon>
                  <ListItemText primary={v.name} />
                </ListItem>
              ))}
            </List>
            <Divider />
            <Box sx={{ display: "flex", mt: 2 }}>
              <TextField
                name="name"
                required
                fullWidth
                id="name"
                onChange={setTextValue}
                type="text"
                value={text.name}
                size="small"
              />
              <TextField
                name="price"
                required
                fullWidth
                id="price"
                onChange={setTextValue}
                type="number"
                value={text.price}
                size="small"
              />
            </Box>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 1 }}
              onClick={addOutMenuElement}
            >
              Menu Dışı Ücret Ekle
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default TodayOrderTableDetails;
