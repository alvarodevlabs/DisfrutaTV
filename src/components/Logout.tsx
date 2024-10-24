import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await fetch("https://flask-backend-rx79.onrender.com/auth/logout", {
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

      localStorage.removeItem("token");
      navigate("/login");
    };

    performLogout();
  }, [navigate]);

  return null;
};

export default Logout;
