import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import Store from "../context/store";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { state } = useContext(Store);

  // Si no está autenticado, redirigir al inicio
  if (!state.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si el rol del usuario no es el requerido, redirigir al inicio
  if (state.user?.role !== requiredRole) {
    return children;
  }

  // Si todo es correcto, renderizar el componente hijo
  return children;
};

export default ProtectedRoute;
