import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface SeriesType {
  id: number;
  name: string;
  first_air_date: string;
  poster_path: string;
}

const Series: React.FC = () => {
  const [series, setSeries] = useState<SeriesType[]>([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchSeries = async (page: number) => {
      try {
        const response = await fetch(
          `https://flask-backend-rx79.onrender.com/api/series?page=${page}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener las series");
        }

        const data = await response.json();
        setSeries(data);
      } catch (err) {
        setError("Error al cargar las series");
      }
    };

    fetchSeries(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    window.scrollTo(0, 0); // Desplaza al inicio de la página
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      window.scrollTo(0, 0); // Desplaza al inicio de la página
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900 pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Series Populares
        </h1>
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6">
            <p className="text-red-200 text-center">{error}</p>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {series.map((serie) => (
            <SeriesCard
              key={serie.id}
              series={serie}
              addToFavorites={(id) => {
                /* Lógica para agregar a favoritos */
              }}
              addToPending={(id) => {
                /* Lógica para agregar a pendientes */
              }}
              addToViewed={(id) => {
                /* Lógica para marcar como vista */
              }}
            />
          ))}
        </div>

        {/* Botones de paginación */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePreviousPage}
            className="bg-white/20 backdrop-blur-lg text-white py-2 px-4 rounded transition duration-200 hover:bg-white/30"
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <button
            onClick={handleNextPage}
            className="bg-white/20 backdrop-blur-lg text-white py-2 px-4 rounded transition duration-200 hover:bg-white/30"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

const SeriesCard: React.FC<{
  series: SeriesType;
  addToFavorites: (id: number) => void;
  addToPending: (id: number) => void;
  addToViewed: (id: number) => void;
}> = ({ series, addToFavorites, addToPending, addToViewed }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative group transform transition-all duration-300 hover:scale-105">
      <div className="relative rounded-xl overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
        <Link to={`/series/${series.id}`}>
          {isLoading && (
            <div className="h-[400px] bg-gray-700 animate-pulse rounded-xl" />
          )}
          <img
            className={`w-full h-[300px] md:h-[400px] object-cover transition-transform duration-300 group-hover:scale-110 ${
              isLoading ? "invisible" : "visible"
            }`}
            src={`https://image.tmdb.org/t/p/w500/${series.poster_path}`}
            alt={series.name}
            onLoad={() => setIsLoading(false)}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-bold text-white mb-1">
                {series.name}
              </h3>
              <p className="text-sm text-gray-300 mb-3">
                {new Date(series.first_air_date).getFullYear()}
              </p>
              <div className="flex gap-4 justify-center">
                {/* Botones de interacción */}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Series;
