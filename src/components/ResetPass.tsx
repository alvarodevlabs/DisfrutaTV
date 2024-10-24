import React, { useState } from "react";
import { useParams } from "react-router-dom";

const ResetPass: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/auth/reset-password/${token}`,
        {
          method: "POST",
          body: JSON.stringify({ password }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error al cambiar la contraseña");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
      <div className="relative w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 tracking-wider">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Disfruta
            </span>
            <span className="text-white">TV</span>
          </h1>
          <p className="text-gray-300">Restablece tu contraseña</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Nueva contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Restablecer contraseña
            </button>
          </form>

          {message && (
            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 mt-4">
              <p className="text-green-200 text-center text-sm">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPass;
