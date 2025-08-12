import { StrictMode, forwardRef } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import { ThemeProvider, createTheme } from "@mui/material";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Login from "./pages/Login.tsx";
import MenuActions from "./pages/MenuActions.tsx";
import AccountManagement from "./pages/AccountManagement.tsx";
import UserList from "./pages/UserList.tsx";
import AddUser from "./pages/AddUser.tsx";
import Rooms from "./pages/Rooms.tsx";
import Statistics from "./pages/Statistics.tsx";
import App from "./App.tsx";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router";
import TodayOrders from "./pages/TodayOrders.tsx";
import TodayOrderTableDetails from "./pages/TodayOrderTableDetails.tsx";
import AddRoom from "./pages/AddRoom.tsx";

const LinkBehavior = forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, "to"> & { href: RouterLinkProps["to"] }
>((props, ref) => {
  const { href, ...other } = props;
  return <RouterLink ref={ref} to={href} {...other} />;
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#1a5d1a",
      light: "#316d31",
    },
    secondary: {
      main: "#ff6b35",
      light: "#ff7a49",
    },
    success: {
      main: "#2dd36f",
    },
    warning: {
      main: "#ffc409",
    },
    error: {
      main: "#eb445a",
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "dashboard",
    element: <App />,
    children: [
      { path: "today-orders", element: <TodayOrders /> },
      { path: "today-orders/:id", element: <TodayOrderTableDetails /> },
      { path: "add-user", element: <AddUser /> },
      { path: "users", element: <UserList /> },
      { path: "add-room", element: <AddRoom /> },
      { path: "rooms", element: <Rooms /> },
      { path: "menu", element: <MenuActions /> },
      { path: "statistics", element: <Statistics /> },
      { path: "account", element: <AccountManagement /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "*", element: <h1>Sayfa bulunamadı</h1> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
