import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Asegúrate de que tu CSS de Tailwind esté aquí
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Agrega la clase "dark" para el modo oscuro por defecto
document.documentElement.classList.add("dark");

reportWebVitals();
