import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { loginIn } from "../services/auth.service";
import { useAuthStore } from "../store/AuthStore";
import { useSnackbarStore } from "../store/SnackbarStore";
import GlobalSnackbar from "../components/GlobalSnackbar";

interface Values {
  email: string;
  password: string;
}

const initialValues: Values = {
  email: "",
  password: "",
};

const warning = "doldurulması zorunlu alan";

function Login() {
  const { login } = useAuthStore();
  const { openSnackbar } = useSnackbarStore();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().max(255).required(warning),
    password: Yup.string().max(255).required(warning),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values): Promise<void> => {
      if (formik.isValid) {
        try {
          const res = await loginIn(values);
          await login(res);
          openSnackbar("Giriş başarılı");
          navigate("/");
        } catch (error) {
          openSnackbar(
            "Email ve/veya şifre hatalı, lütfen daha sonra tekrar deneyiniz."
          );
        }
      }
    },
  });
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box>
        <Card sx={{ minWidth: "320px" }}>
          <CardMedia
            title="Restorder logo"
            image="/logo.png"
            sx={{
              width: 150,
              height: 150,
              mx: "auto",
              mt: 4,
            }}
          />
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontFamily: "'Roboto Condensed', serif",
                color: "dark",
                fontWeight: 700,
                textAlign: "center",
                mb: 4,
              }}
            >
              RESTORDER <br />
              YÖNETİM PANELİ
            </Typography>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
              className="w-full flex flex-col gap-2"
            >
              <FormControl>
                <FormLabel htmlFor="email" color="success">
                  Kullanıcı Adı <span className="text-red-500">*</span>
                </FormLabel>
                <TextField
                  autoComplete="email"
                  name="email"
                  required
                  fullWidth
                  id="email"
                  error={!!(formik.touched.email && formik.errors.email)}
                  color={formik.errors.email ? "error" : "primary"}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.email}
                  size="small"
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password" color="success">
                  Şifre <span className="text-red-500">*</span>
                </FormLabel>
                <TextField
                  autoComplete="password"
                  name="password"
                  required
                  fullWidth
                  id="password"
                  error={!!(formik.touched.password && formik.errors.password)}
                  color={formik.errors.password ? "error" : "primary"}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                  size="small"
                />
              </FormControl>
              <Button
                disabled={!formik.isValid}
                fullWidth
                size="medium"
                sx={{ mt: 2, mb: 2 }}
                type="submit"
                variant="contained"
              >
                Giriş
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
      <GlobalSnackbar />
    </Box>
  );
}

export default Login;
