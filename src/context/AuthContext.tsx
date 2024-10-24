import React, { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (token: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  username: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchProfile(token);
    }
  }, []);

  const fetchProfile = async (token: string) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/user/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Si el token es inválido o ha expirado, eliminarlo
        if (response.status === 401) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUsername(null);
          return;
        }
        throw new Error("Error al obtener los datos del perfil");
      }

      const data = await response.json();
      setIsAuthenticated(true);
      setUsername(data.username);
    } catch (error) {
      console.error("Error al cargar el perfil:", error);
      setIsAuthenticated(false);
      setUsername(null);
    }
  };

  const login = (token: string) => {
    localStorage.setItem("token", token);
    fetchProfile(token);
  };

  const logout = async () => {
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
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
