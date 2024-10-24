import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await fetch("http://127.0.0.1:5000/auth/logout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.error("Error al hacer logout:", error);
        }
      }
      // Eliminar el token del localStorage
      localStorage.removeItem("token");
      navigate("/login");
    };

    performLogout();
  }, [navigate]);

  return null;
};

export default Logout;
