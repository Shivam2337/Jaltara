import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {

  const token = localStorage.getItem("adminToken");

  console.log("Protected Route Token:", token);
  console.log("Children Component:", children);

  if (!token) {
    console.log("No token → redirecting");
    return <Navigate to="/AdminLogin" replace />;
  }

  console.log("Token exists → rendering page");

  return children;
}