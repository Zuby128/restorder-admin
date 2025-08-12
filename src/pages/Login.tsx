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
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

interface Values {
  name: string;
  password: string;
}

const initialValues: Values = {
  name: "",
  password: "",
};

const warning = "doldurulması zorunlu alan";

const AUTH: string = import.meta.env.VITE_COOKIE_AUTH as string;

function Login() {
  const [cookies, setCookie] = useCookies([AUTH]);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().max(255).required(warning),
    password: Yup.string().max(255).required(warning),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (): Promise<void> => {
      console.log("------", formik.isValid, formik.values);
      if (formik.isValid) {
        setCookie(AUTH, true);
        navigate("/");
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
              YÖNETİM PANELİ
            </Typography>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
              className="w-full flex flex-col gap-2"
            >
              <FormControl>
                <FormLabel htmlFor="name" color="success">
                  Kullanıcı Adı <span className="text-red-500">*</span>
                </FormLabel>
                <TextField
                  autoComplete="name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  error={!!(formik.touched.name && formik.errors.name)}
                  color={formik.errors.name ? "error" : "primary"}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.name}
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
    </Box>
  );
}

export default Login;
