import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import AdminRoutes from "./routes/AdminRoutes";

import "./main.css";

function RouterSelector() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/Admin") || location.pathname.startsWith("/admin");

  return isAdminRoute ? <AdminRoutes /> : <AppRoutes />;
}

function App() {
  return (
    <BrowserRouter>
      <RouterSelector />
    </BrowserRouter>
  );
}

export default App;
