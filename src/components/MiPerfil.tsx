// MiPerfil.tsx
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

const MiPerfil: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Obtener los datos del perfil desde el backend al cargar el componente
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No estás autenticado.");
          return;
        }

        const response = await fetch("http://127.0.0.1:5000/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Enviar token JWT
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los datos del perfil");
        }

        const data = await response.json();
        setUsername(data.username);
        setEmail(data.email);
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        setError("No se pudieron cargar los datos del perfil.");
      }
    };

    fetchProfile();
  }, []);

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No estás autenticado.");
        return;
      }

      const response = await fetch("http://127.0.0.1:5000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar token JWT
        },
        body: JSON.stringify({
          username,
          email,
          ...(password && { password }), // Solo incluir la contraseña si se cambió
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil");
      }

      setSuccess("Perfil actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      setError("No se pudo actualizar el perfil.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
      <div className="relative w-full max-w-md px-6">
        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 tracking-wider">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Mi
            </span>
            <span className="text-white">Perfil</span>
          </h1>
          <p className="text-gray-300">Gestiona tu información personal</p>
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
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Nombre de Usuario
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size="sm"
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="Nombre de Usuario"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size="sm"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="Correo electrónico"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Cambiar Contraseña
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size="sm"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="Deja vacío para no cambiar"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MiPerfil;
