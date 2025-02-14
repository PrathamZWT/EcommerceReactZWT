import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import { jwtDecode } from "jwt-decode";

export const UserContext = createContext();
export default function Role() {
  const [role, setRole] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        return <Outlet />;
      } catch (error) {
        console.error("Invalid token:", error);
        setRole(null);
      }
    }
  }, [token]);
}
