import {
  Box,
  Button,
  Card,
  CardContent,
  Grid2 as Grid,
  TextField,
  Toolbar,
} from "@mui/material";
import DivisionHeader from "../components/DivisionHeader";
import { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";

const STATISTICS = [
  "Kazanç",
  "Personel",
  "Masa",
  "Oda/Salon",
  "Menu",
  "Kategori",
];

// ✅ Tarih bazlı satış verileri
const salesData: any = {
  "2024-02-01": { Kazanç: 5000, Personel: 20, Masa: 40 },
  "2024-02-05": { Kazanç: 6000, Personel: 22, Masa: 42 },
  "2024-02-10": { Kazanç: 7000, Personel: 25, Masa: 45 },
  "2024-02-15": { Kazanç: 8000, Personel: 27, Masa: 47 },
  "2024-02-20": { Kazanç: 9000, Personel: 30, Masa: 50 },
};

// ✅ X ekseni (Tarihler)
const xLabels = Object.keys(salesData);

// ✅ Kategori isimleri
const CATEGORIES = ["Kazanç", "Personel", "Masa"];

function Statistics() {
  const [selected, setSelected] = useState<string>("");
  const [stats, setStats] = useState<string[]>(STATISTICS);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<string>("Kazanç"); // Varsayılan Kazanç

  // ✅ Seçilen kategoriye göre veriyi getir
  const selectedData = {
    label: selectedCategory,
    data: xLabels.map((date) => salesData[date][selectedCategory]),
  };

  return (
    <>
      <DivisionHeader header="Oda Yönetimi" />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }} spacing={4}>
          {stats.map((v, i) => (
            <Button
              key={i}
              fullWidth
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: 20,
                background: selected === v ? "primary.main" : "#fff",
                color: selected === v ? "#fff" : "primary.main",
              }}
              className="roboto-condensed"
              variant={selected === v ? "contained" : "outlined"}
              onClick={() => {
                setSelected(v);
                setSelectedCategory(v);
              }}
            >
              {v}
            </Button>
          ))}
        </Grid>
        <Grid size={{ xs: 12, md: 8 }} spacing={4}>
          <Card
            sx={{
              background: "#fff",
              p: 3,
              mx: "auto",
            }}
          >
            <CardContent>
              <Toolbar
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mx: "auto",
                  width: "100%",
                }}
              >
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
                <Button variant="contained">Filtrele</Button>
              </Toolbar>
              <Box sx={{ width: "100%" }}>
                <BarChart
                  sx={{ width: "100%" }}
                  height={400}
                  xAxis={[{ scaleType: "band", data: xLabels }]} // ✅ Dates on X-axis
                  series={[{ ...selectedData }]} // ✅ Enable labels on bars
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default Statistics;
