import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Función para manejar el envío del formulario
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Resetear el estado de error
    setError("");

    // Hacer la solicitud al backend para registrar un nuevo usuario
    try {
      const response = await fetch("http://127.0.0.1:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Error en el registro");
      } else {
        setSuccess("Usuario registrado con éxito. Redirigiendo al login...");
        setTimeout(() => {
          navigate("/login"); // Redirigir al login después del registro
        }, 3000); // Esperar 3 segundos antes de redirigir
      }
    } catch (error) {
      setError("Error al registrar el usuario");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
      <div className="relative w-full max-w-md px-6">
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 tracking-wider">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Disfruta
            </span>
            <span className="text-white">TV</span>
          </h1>
          <p className="text-gray-300">Tu entretenimiento, sin límites</p>
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

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Nombre de usuario */}
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Nombre de usuario
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
                  placeholder="Nombre de usuario"
                  required
                />
              </div>
            </div>

            {/* Email */}
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
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Contraseña
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
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size="sm"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Registrarse
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/login"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              ¿Ya tienes una cuenta? Inicia sesión
            </a>
          </div>
        </div>

        {/* Footer con derechos de autor */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} DisfrutaTV. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
