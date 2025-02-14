import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function PrivateRouteAdmin() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/sign-in" />;
  }

  try {
    const decoded = jwtDecode(token);
    const role = decoded.role;
    if (role === "admin") {
      return <Outlet />;
    } else {
      return <Navigate to="/" />;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/sign-in" />;
  }
}
