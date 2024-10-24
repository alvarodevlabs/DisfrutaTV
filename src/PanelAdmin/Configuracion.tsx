// src/components/Configuracion.tsx

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";

const Configuracion: React.FC = () => {
  const [themdbApiKey, setThemdbApiKey] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Obtener la configuración actual al cargar la página
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No autenticado. Por favor, inicia sesión.");
          return;
        }

        const response = await fetch(
          "https://flask-backend-rx79.onrender.com/api/config",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Enviar token JWT
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "Error al cargar la configuración");
          return;
        }

        const data = await response.json();
        setThemdbApiKey(data.themdb_api_key || "");
      } catch (error) {
        console.error("Error al cargar la configuración", error);
        setError("Error al cargar la configuración");
      }
    };

    fetchConfig();
  }, []);

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No autenticado. Por favor, inicia sesión.");
        return;
      }

      const response = await fetch(
        "https://flask-backend-rx79.onrender.com/api/config",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Enviar token JWT
          },
          body: JSON.stringify({
            themdb_api_key: themdbApiKey,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Error al guardar la configuración");
      } else {
        setSuccess("Configuración guardada correctamente");
      }
    } catch (error) {
      console.error("Error al guardar la configuración", error);
      setError("Error al guardar la configuración");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
      <div className="relative w-full max-w-md px-6">
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 tracking-wider">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Configuración
            </span>
          </h1>
          <p className="text-gray-300">Configura tu sistema</p>
        </div>

        {/* Formulario */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-white/20">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6">
              <p className="text-red-200 text-center text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 mb-6">
              <p className="text-green-200 text-center text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="themdbApiKey"
                className="block text-gray-200 text-sm font-medium mb-2"
              >
                API Key de TheMovieDB
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faKey}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size="sm"
                />
                <input
                  type="text"
                  id="themdbApiKey"
                  value={themdbApiKey}
                  onChange={(e) => setThemdbApiKey(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="Ingresa tu API Key"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Guardar Configuración
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
