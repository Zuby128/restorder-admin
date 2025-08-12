import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  Grid2 as Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Toolbar,
  Typography,
} from "@mui/material";
import DivisionHeader from "../components/DivisionHeader";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

interface Payment {
  date: string;
  recipient: string;
  amount: string;
}

const initialValues: Payment = {
  date: new Date().toISOString().split("T")[0], // ✅ Bugünün tarihini YYYY-MM-DD formatında al
  recipient: "",
  amount: "",
};

const validationSchema = Yup.object({
  date: Yup.string().required("Tarih gereklidir"),
  recipient: Yup.string()
    .max(255, "En fazla 255 karakter")
    .required("Ödeme yapılan kişi/kurum gereklidir"),
  amount: Yup.number()
    .typeError("Ödeme miktarı rakam olmalıdır")
    .positive("Ödeme miktarı pozitif olmalıdır")
    .required("Ödeme miktarı gereklidir"),
});

interface PaymentListProps {
  payments: Payment[];
}

const PAYMENTS = [
  { date: "2024-02-10", recipient: "Ahmet Yılmaz", amount: "500" },
  { date: "2024-02-15", recipient: "Mehmet Kaya", amount: "300" },
  { date: "2024-02-18", recipient: "Ayşe Demir", amount: "700" },
  { date: "2024-03-05", recipient: "Fatma Aydın", amount: "200" },
];

function AccountManagement() {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setPayments([...payments, values]);
      formik.resetForm();
    },
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [payments, setPayments] = useState<Payment[]>(PAYMENTS);
  const [searchText, setSearchText] = useState("");

  const handleFilter = () => {
    setStartDate(startDate);
    setEndDate(endDate);
    setSearchText(searchText);
  };

  const filteredPayments = payments.filter((payment) => {
    const paymentDate = new Date(payment.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const textMatch = payment.recipient
      .toLowerCase()
      .includes(searchText.toLowerCase());

    // ✅ Tarih filtreleme
    const dateInRange =
      (!start || paymentDate >= start) && (!end || paymentDate <= end);

    return dateInRange && textMatch;
  });

  const getTotalAmount = () => {
    return filteredPayments.reduce(
      (total, payment) => total + Number(payment.amount),
      0
    );
  };

  return (
    <>
      <DivisionHeader header="Ödemeler" />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }} spacing={4}>
          <Card sx={{ background: "#fff", p: 3, mx: "auto" }}>
            <CardContent>
              <form
                onSubmit={formik.handleSubmit}
                className="w-full flex flex-col gap-3"
              >
                {/* Tarih Alanı */}
                <FormControl fullWidth>
                  <FormLabel>Tarih</FormLabel>
                  <TextField
                    name="date"
                    type="date" // ✅ Sadece MUI kullanarak tarih seçme
                    fullWidth
                    required
                    error={!!(formik.touched.date && formik.errors.date)}
                    helperText={formik.touched.date && formik.errors.date}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.date}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </FormControl>

                {/* Ödeme Yapılan */}
                <FormControl fullWidth>
                  <FormLabel>Ödeme Yapılan Kişi/Kurum</FormLabel>
                  <TextField
                    name="recipient"
                    fullWidth
                    required
                    error={
                      !!(formik.touched.recipient && formik.errors.recipient)
                    }
                    helperText={
                      formik.touched.recipient && formik.errors.recipient
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.recipient}
                    size="small"
                  />
                </FormControl>

                {/* Ödeme Miktarı */}
                <FormControl fullWidth>
                  <FormLabel>Ödeme Miktarı (TL)</FormLabel>
                  <TextField
                    name="amount"
                    type="number"
                    fullWidth
                    required
                    error={!!(formik.touched.amount && formik.errors.amount)}
                    helperText={formik.touched.amount && formik.errors.amount}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.amount}
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
                  Ödeme Yap
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }} spacing={4}>
          <Card sx={{ background: "#fff", px: 3, py: 1, mx: "auto" }}>
            <CardContent>
              {/* ✅ Toolbar: Tarih Filtreleme */}
              <Typography variant="h6" className="roboto-condensed mb-2">
                Ödeme Geçmişi
              </Typography>
              <Toolbar sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <TextField
                  label="Başlangıç Tarihi"
                  type="date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <TextField
                  label="Bitiş Tarihi"
                  type="date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <TextField
                  label="Ödeme Yapılan Kişi/Kurum"
                  type="text"
                  size="small"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Button variant="contained" onClick={handleFilter}>
                  Filtrele
                </Button>
              </Toolbar>

              {/* ✅ Ödeme Listesi Tablosu */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Tarih</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Ödeme Yapılan</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Tutar (TL)</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPayments.length > 0 ? (
                      filteredPayments.map((payment, index) => (
                        <TableRow key={index}>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell>{payment.recipient}</TableCell>
                          <TableCell>{payment.amount}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          Filtreye uygun ödeme bulunamadı.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>

                  {/* ✅ Toplam Ödeme Alanı */}
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={2} align="right">
                        <strong>Toplam:</strong>
                      </TableCell>
                      <TableCell>
                        <strong>{getTotalAmount()} TL</strong>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default AccountManagement;
