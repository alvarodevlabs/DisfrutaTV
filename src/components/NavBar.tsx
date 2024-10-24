import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUser,
  faSignOutAlt,
  faCog,
  faChartLine,
  faUsers,
  faFilm,
  faTv,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

const NavBar: React.FC = () => {
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const adminDropdownRef = useRef<HTMLLIElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleAdminDropdown = () =>
    setIsAdminDropdownOpen(!isAdminDropdownOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        adminDropdownRef.current &&
        !adminDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAdminDropdownOpen(false);
      }

      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="relative z-50 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 shadow-lg backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-white font-bold text-2xl flex items-center">
          <FontAwesomeIcon
            icon={faFilm}
            className="mr-2 text-purple-400 hover:text-purple-300 transition-colors duration-300"
          />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-300 hover:to-purple-400 transition-colors duration-300">
            Disfruta
          </span>
          <span className="text-white">TV</span>
        </div>

        {/* Menú Desktop */}
        <ul className="hidden md:flex space-x-6 items-center text-white">
          <li>
            <Link
              to="/"
              className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 hover:text-purple-300 transition duration-300"
            >
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/peliculas"
              className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 hover:text-purple-300 transition duration-300"
            >
              <FontAwesomeIcon icon={faFilm} className="mr-2" />
              Películas
            </Link>
          </li>
          <li>
            <Link
              to="/series"
              className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 hover:text-purple-300 transition duration-300"
            >
              <FontAwesomeIcon icon={faTv} className="mr-2" />
              Series
            </Link>
          </li>
          <li>
            <Link
              to="/mi-contenido"
              className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 hover:text-purple-300 transition duration-300"
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Mi Contenido
            </Link>
          </li>

          {/* Dropdown para Admin */}
          <li className="relative" ref={adminDropdownRef}>
            <button
              onClick={toggleAdminDropdown}
              className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 hover:text-purple-300 transition duration-300"
            >
              <FontAwesomeIcon icon={faCog} className="mr-2" />
              Admin
            </button>
            {isAdminDropdownOpen && (
              <ul className="absolute left-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-purple-500/20 text-white overflow-hidden">
                <li>
                  <Link
                    to="/admin/estadisticas"
                    className="flex items-center px-4 py-3 hover:bg-purple-500/20 transition duration-300"
                  >
                    <FontAwesomeIcon
                      icon={faChartLine}
                      className="mr-3 text-purple-400"
                    />
                    Estadísticas
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/usuarios"
                    className="flex items-center px-4 py-3 hover:bg-purple-500/20 transition duration-300"
                  >
                    <FontAwesomeIcon
                      icon={faUsers}
                      className="mr-3 text-purple-400"
                    />
                    Usuarios
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/configuracion"
                    className="flex items-center px-4 py-3 hover:bg-purple-500/20 transition duration-300"
                  >
                    <FontAwesomeIcon
                      icon={faCog}
                      className="mr-3 text-purple-400"
                    />
                    Configuración
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>

        {/* Opciones de Usuario */}
        <div className="hidden md:flex items-center">
          {isAuthenticated && username ? (
            <div className="relative flex items-center" ref={userDropdownRef}>
              <button
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 transition duration-300"
                onClick={toggleUserDropdown}
              >
                <div className="relative">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Avatar"
                    className="rounded-full w-10 h-10 border-2 border-purple-400 hover:border-purple-300 transition-colors duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                </div>
                <span className="text-white font-medium">{username}</span>
              </button>
              {isUserDropdownOpen && (
                <div className="absolute  mt-60 w-64 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-purple-500/20 text-white overflow-hidden">
                  <div className="p-4 border-b border-white/10">
                    <p className="text-sm text-gray-400">Conectado como</p>
                    <p className="font-medium">{username}</p>
                  </div>
                  <ul>
                    <li>
                      <Link
                        to="/mi-perfil"
                        className="flex items-center px-4 py-3 hover:bg-purple-500/20 transition duration-300"
                      >
                        <FontAwesomeIcon
                          icon={faUser}
                          className="mr-3 text-purple-400"
                        />
                        Mi Perfil
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 hover:bg-purple-500/20 transition duration-300 text-left"
                      >
                        <FontAwesomeIcon
                          icon={faSignOutAlt}
                          className="mr-3 text-purple-400"
                        />
                        Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition duration-300 text-white"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg border border-purple-500 hover:bg-purple-500/10 transition duration-300 text-white"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>

        {/* Botón Menú Responsive */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg hover:bg-white/10 text-white transition duration-300"
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
        </div>
      </div>

      {/* Menú responsive desplegable */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-white/10">
          <div className="divide-y divide-white/10">
            <Link
              to="/"
              className="flex items-center px-4 py-3 text-white hover:bg-white/10 transition duration-300"
            >
              <FontAwesomeIcon icon={faHome} className="mr-3 text-purple-400" />
              Inicio
            </Link>
            <Link
              to="/peliculas"
              className="flex items-center px-4 py-3 text-white hover:bg-white/10 transition duration-300"
            >
              <FontAwesomeIcon icon={faFilm} className="mr-3 text-purple-400" />
              Películas
            </Link>
            <Link
              to="/series"
              className="flex items-center px-4 py-3 text-white hover:bg-white/10 transition duration-300"
            >
              <FontAwesomeIcon icon={faTv} className="mr-3 text-purple-400" />
              Series
            </Link>
            <Link
              to="/mi-contenido"
              className="flex items-center px-4 py-3 text-white hover:bg-white/10 transition duration-300"
            >
              Mi Contenido
            </Link>
            {isAuthenticated && username ? (
              <>
                <Link
                  to="/mi-perfil"
                  className="flex items-center px-4 py-3 text-white hover:bg-white/10 transition duration-300"
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    className="mr-3 text-purple-400"
                  />
                  Mi Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-white hover:bg-white/10 transition duration-300"
                >
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className="mr-3 text-purple-400"
                  />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <div className="p-4 space-y-2">
                <Link
                  to="/login"
                  className="block w-full px-4 py-2 text-center rounded-lg bg-purple-600 hover:bg-purple-500 transition duration-300 text-white"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="block w-full px-4 py-2 text-center rounded-lg border border-purple-500 hover:bg-purple-500/10 transition duration-300 text-white"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
