import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { StoreProvider } from "./context/store";
import Inicio from "./components/Inicio";
import Peliculas from "./components/Peliculas";
import Series from "./components/Series";
import MiContenido from "./components/MiContenido";
import MiPerfil from "./components/MiPerfil";
import Estadisticas from "./PanelAdmin/Estadisticas";
import Usuarios from "./PanelAdmin/Usuarios";
import Configuracion from "./PanelAdmin/Configuracion";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import PeliculasDetail from "./components/PeliculasDetail";
import Login from "./components/Login";
import Register from "./components/Register";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import SeriesDetail from "./components/SeriesDetail";
import RecuperarPass from "./components/RecuperarPass";
import ResetPass from "./components/ResetPass";

// Componente para actualizar el título de la página
const TitleUpdater: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Cambiar el título basado en la ruta actual
    const path = location.pathname;
    let title = "DisfrutaTV"; // Título por defecto

    if (path === "/") title = "Inicio";
    else if (path.startsWith("/peliculas/")) title = "Detalles de la Película";
    else if (path === "/peliculas") title = "Películas";
    else if (path.startsWith("/series/")) title = "Detalles de la Serie";
    else if (path === "/series") title = "Series";
    else if (path === "/mi-contenido") title = "Mi Contenido";
    else if (path === "/mi-perfil") title = "Mi Perfil";
    else if (path === "/login") title = "Iniciar Sesión";
    else if (path === "/register") title = "Registrarse";
    else if (path === "/recuperar-contraseña") title = "Recuperar Contraseña";
    else if (path.startsWith("/resetear-contraseña/"))
      title = "Resetear Contraseña";
    else if (path === "/admin/estadisticas") title = "Estadísticas";
    else if (path === "/admin/usuarios") title = "Usuarios";
    else if (path === "/admin/configuracion") title = "Configuración";

    document.title = title; // Establecer el título de la página
  }, [location]);

  return null; // Este componente no necesita renderizar nada
};

const App: React.FC = () => {
  // Asegurarse de que el modo oscuro esté habilitado al montar el componente
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <StoreProvider>
      <AuthProvider>
        <Router>
          <TitleUpdater /> {/* Añadido aquí */}
          <NavBar />
          <div className="bg-gray-900 text-white min-h-screen">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/peliculas" element={<Peliculas />} />
              <Route path="/peliculas/:id" element={<PeliculasDetail />} />
              <Route path="/series/:id" element={<SeriesDetail />} />
              <Route path="/series" element={<Series />} />
              <Route path="/mi-contenido" element={<MiContenido />} />
              <Route path="/mi-perfil" element={<MiPerfil />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/recuperar-contraseña" element={<RecuperarPass />} />
              <Route
                path="/resetear-contraseña/:token"
                element={<ResetPass />}
              />
              <Route
                path="/admin/estadisticas"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Estadisticas />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/usuarios"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Usuarios />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/configuracion"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Configuracion />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </StoreProvider>
  );
};

export default App;
