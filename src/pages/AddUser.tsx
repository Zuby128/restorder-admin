import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  TextField,
  Grid2 as Grid,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import UserTable from "../components/UserTable";
import DivisionHeader from "../components/DivisionHeader";

const users = Array.from({ length: 100 }, (_, i) => ({
  name: `User ${i + 1}`,
  surname: `Surname ${i + 1}`,
  password: "******",
  bod: "1990-01-01",
  tck: `${10000000000 + i}`, // ✅ Benzersiz TCK
  phone: "5554443322",
  address: "Örnek Adres",
  price: "100",
  startDate: `20${10 + (i % 10)}-05-01`, // ✅ İşe başlama tarihi dinamik
}));

interface Values {
  name: string;
  surname: string;
  password: string;
  bod: string;
  tck: string;
  phone: string;
  address: string;
  price: string;
  startDate?: string;
}

const initialValues: Values = {
  name: "",
  surname: "",
  password: "",
  bod: "",
  tck: "",
  phone: "",
  address: "",
  price: "",
};

function AddUser() {
  const validationSchema = Yup.object({
    name: Yup.string()
      .max(255, "En fazla 255 karakter olmalıdır")
      .required("Ad gereklidir"),
    surname: Yup.string()
      .max(255, "En fazla 255 karakter olmalıdır")
      .required("Soyad gereklidir"),
    password: Yup.string()
      .min(6, "Şifre en az 6 karakter olmalıdır")
      .required("Şifre gereklidir"),
    bod: Yup.string()
      .max(30, "Tarih formatı hatalı")
      .required("Doğum tarihi gereklidir"),
    tck: Yup.string()
      .length(11, "TCK 11 karakter olmalıdır")
      .required("TCK gereklidir"),
    phone: Yup.string()
      .matches(/^\d{10,12}$/, "Geçersiz telefon numarası")
      .required("Telefon numarası gereklidir"),
    address: Yup.string()
      .max(255, "Adres en fazla 255 karakter olabilir")
      .required("Adres gereklidir"),
    price: Yup.string()
      .matches(/^\d+$/, "Ücret sadece rakam olmalıdır")
      .required("Ücret gereklidir"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      console.log("Form Gönderildi:", values);
      formik.resetForm();
    },
  });

  return (
    <>
      <DivisionHeader header="Personel Yönetimi" />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }} spacing={4}>
          <Card sx={{ background: "#fff", p: 3, maxWidth: 500, mx: "auto" }}>
            <CardContent>
              <Button variant="contained" component="label" sx={{ mb: 2 }}>
                Fotoğraf Yükle
                <input type="file" hidden />
              </Button>
              <form
                noValidate
                onSubmit={formik.handleSubmit}
                className="w-full flex flex-col gap-3"
              >
                {/* Kullanıcı Adı */}
                <FormControl fullWidth>
                  <FormLabel htmlFor="name">Ad</FormLabel>
                  <TextField
                    name="name"
                    id="name"
                    fullWidth
                    required
                    error={!!(formik.touched.name && formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    size="small"
                  />
                </FormControl>

                {/* Soyad */}
                <FormControl fullWidth>
                  <FormLabel htmlFor="surname">Soyad</FormLabel>
                  <TextField
                    name="surname"
                    id="surname"
                    fullWidth
                    required
                    error={!!(formik.touched.surname && formik.errors.surname)}
                    helperText={formik.touched.surname && formik.errors.surname}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.surname}
                    size="small"
                  />
                </FormControl>

                {/* Şifre */}
                <FormControl fullWidth>
                  <FormLabel htmlFor="password">Şifre</FormLabel>
                  <TextField
                    name="password"
                    id="password"
                    type="password"
                    fullWidth
                    required
                    error={
                      !!(formik.touched.password && formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    size="small"
                  />
                </FormControl>

                {/* Doğum Tarihi */}
                <FormControl fullWidth>
                  <FormLabel htmlFor="bod">Doğum Tarihi</FormLabel>
                  <TextField
                    name="bod"
                    id="bod"
                    type="date"
                    fullWidth
                    required
                    error={!!(formik.touched.bod && formik.errors.bod)}
                    helperText={formik.touched.bod && formik.errors.bod}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.bod}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>

                {/* TCK */}
                <FormControl fullWidth>
                  <FormLabel htmlFor="tck">TCK</FormLabel>
                  <TextField
                    name="tck"
                    id="tck"
                    fullWidth
                    required
                    error={!!(formik.touched.tck && formik.errors.tck)}
                    helperText={formik.touched.tck && formik.errors.tck}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.tck}
                    size="small"
                  />
                </FormControl>

                {/* Telefon */}
                <FormControl fullWidth>
                  <FormLabel htmlFor="phone">Telefon</FormLabel>
                  <TextField
                    name="phone"
                    id="phone"
                    fullWidth
                    required
                    error={!!(formik.touched.phone && formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                    size="small"
                  />
                </FormControl>

                {/* Adres */}
                <FormControl fullWidth>
                  <FormLabel htmlFor="address">Adres</FormLabel>
                  <TextField
                    name="address"
                    id="address"
                    fullWidth
                    required
                    multiline
                    rows={3}
                    error={!!(formik.touched.address && formik.errors.address)}
                    helperText={formik.touched.address && formik.errors.address}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.address}
                    size="small"
                  />
                </FormControl>

                {/* Fiyat */}
                <FormControl fullWidth>
                  <FormLabel htmlFor="price">Ücret</FormLabel>
                  <TextField
                    name="price"
                    id="price"
                    fullWidth
                    required
                    error={!!(formik.touched.price && formik.errors.price)}
                    helperText={formik.touched.price && formik.errors.price}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.price}
                    size="small"
                  />
                </FormControl>

                {/* Kaydet Butonu */}
                <Button
                  disabled={!formik.isValid}
                  fullWidth
                  size="medium"
                  sx={{ mt: 2 }}
                  type="submit"
                  variant="contained"
                >
                  Kaydet
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }} spacing={4}>
          <UserTable users={users} />
        </Grid>
      </Grid>
    </>
  );
}

export default AddUser;
