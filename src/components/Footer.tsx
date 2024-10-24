// Footer.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilm,
  faHome,
  faEnvelope,
  faPhone,
  faTv,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 text-white py-24 mt-10">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between">
          {/* Sección de información */}
          <div className="mb-8 lg:mb-0 lg:w-1/3">
            <h3 className="text-3xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Disfruta
              </span>
              TV
            </h3>
            <p className="mb-4 max-w-xs">
              Tu plataforma favorita para disfrutar de películas y series en
              línea. Síguenos en nuestras redes sociales para estar al día con
              las últimas novedades.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="text-white hover:text-purple-300 transition duration-200"
              >
                <FontAwesomeIcon icon={faFacebookF} size="lg" />
              </a>
              <a
                href="#"
                className="text-white hover:text-purple-300 transition duration-200"
              >
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a
                href="#"
                className="text-white hover:text-purple-300 transition duration-200"
              >
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
              <a
                href="#"
                className="text-white hover:text-purple-300 transition duration-200"
              >
                <FontAwesomeIcon icon={faYoutube} size="lg" />
              </a>
            </div>
          </div>

          {/* Sección de navegación */}
          <div className="mb-8 lg:mb-0 lg:w-1/3">
            <h4 className="text-2xl font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-purple-300 transition duration-200"
                >
                  <FontAwesomeIcon icon={faHome} className="mr-2" />
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/peliculas"
                  className="hover:text-purple-300 transition duration-200"
                >
                  <FontAwesomeIcon icon={faFilm} className="mr-2" />
                  Películas
                </Link>
              </li>
              <li>
                <Link
                  to="/series"
                  className="hover:text-purple-300 transition duration-200"
                >
                  <FontAwesomeIcon icon={faTv} className="mr-2" />
                  Series
                </Link>
              </li>
              <li>
                <Link
                  to="/mi-contenido"
                  className="hover:text-purple-300 transition duration-200"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Mi Contenido
                </Link>
              </li>
              <li>
                <Link
                  to="/contacto"
                  className="hover:text-purple-300 transition duration-200"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  to="/sobre-nosotros"
                  className="hover:text-purple-300 transition duration-200"
                >
                  Sobre Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Sección de contacto */}
          <div className="lg:w-1/3">
            <h4 className="text-2xl font-semibold mb-4">Contáctanos</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:info@disfrutatv.com"
                  className="hover:text-purple-300 transition duration-200"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  info@disfrutatv.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+1234567890"
                  className="hover:text-purple-300 transition duration-200"
                >
                  <FontAwesomeIcon icon={faPhone} className="mr-2" />
                  +1 234 567 890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-white/20 my-8"></div>

        {/* Derechos de autor */}
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} DisfrutaTV. Todos los derechos
            reservados.
          </p>
          <div className="flex space-x-4 mt-4 lg:mt-0">
            <Link
              to="https://4geeks.com/"
              className="text-sm hover:text-purple-300 transition duration-200"
            >
              4Geeks
            </Link>
            <Link
              to="https://github.com/alvarodevlabs/DisfrutaTV"
              className="text-sm hover:text-purple-300 transition duration-200"
            >
              Github
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
