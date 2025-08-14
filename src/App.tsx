import { Outlet } from "react-router-dom";
import Dashboard from "./layouts.tsx/Dashboard";
import { Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import GlobalDialog from "./components/GlobalDialog";
import GlobalSnackbar from "./components/GlobalSnackbar";

function App() {
  const AUTH = import.meta.env.VITE_COOKIE_AUTH;

  const [cookies] = useCookies([AUTH]);
  const auth = cookies[AUTH] || false;

  return auth ? (
    <Dashboard>
      <Outlet />
      <GlobalDialog />
      <GlobalSnackbar />
    </Dashboard>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default App;
