import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface MovieType {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
}

interface SeriesType {
  id: number;
  name: string;
  first_air_date: string;
  poster_path: string;
}

type ContentType = MovieType | SeriesType;

const Inicio: React.FC = () => {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [series, setSeries] = useState<SeriesType[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentMoviePage, setCurrentMoviePage] = useState(1);
  const [currentSeriesPage, setCurrentSeriesPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch peliculas
        const moviesResponse = await fetch(
          `http://127.0.0.1:5000/api/movies?page=${currentMoviePage}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!moviesResponse.ok) {
          throw new Error("Error al obtener las películas");
        }

        const moviesData = await moviesResponse.json();
        setMovies(moviesData);

        // Fetch series
        const seriesResponse = await fetch(
          `http://127.0.0.1:5000/api/series?page=${currentSeriesPage}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!seriesResponse.ok) {
          throw new Error("Error al obtener las series");
        }

        const seriesData = await seriesResponse.json();
        setSeries(seriesData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentMoviePage, currentSeriesPage]);

  const addToFavorites = async (id: number, isMovie: boolean) => {
    const url = isMovie
      ? `http://127.0.0.1:5000/api/movies/${id}/add-favorite`
      : `http://127.0.0.1:5000/api/series/${id}/add-favorite`;

    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
  };

  const addToPending = async (id: number, isMovie: boolean) => {
    const url = isMovie
      ? `http://127.0.0.1:5000/api/movies/${id}/add-pending`
      : `http://127.0.0.1:5000/api/series/${id}/add-pending`;

    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
  };

  const addToViewed = async (id: number, isMovie: boolean) => {
    const url = isMovie
      ? `http://127.0.0.1:5000/api/movies/${id}/add-viewed`
      : `http://127.0.0.1:5000/api/series/${id}/add-viewed`;

    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
  };

  const handleNextMoviePage = () => {
    setCurrentMoviePage((prevPage) => prevPage + 1);
  };

  const handlePreviousMoviePage = () => {
    if (currentMoviePage > 1) {
      setCurrentMoviePage((prevPage) => prevPage - 1);
    }
  };

  const handleNextSeriesPage = () => {
    setCurrentSeriesPage((prevPage) => prevPage + 1);
  };

  const handlePreviousSeriesPage = () => {
    if (currentSeriesPage > 1) {
      setCurrentSeriesPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
      {/* Sección Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <img
            src="https://cdn.neowin.com/news/images/uploaded/2023/05/1683747988_background-size1920x1080-4e1694a6-75aa-4c36-9d4d-7fb6a3102005-bc5318781aad7f5c8520.jpg"
            alt="Cine"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-4xl font-bold text-white mb-6">
            Disfruta del cine como nunca
          </h1>
          <p className="text-xl md:text-lg lg:text-lg text-gray-200">
            En DisfrutaTV podrás descubrir nuevas Películas y Series TV con el
            fin de mejorar tus conocimientos cinéfilos, donde también podrás
            guardar tu contenido en Favoritos, Pendiente o incluso las que ya
            hayas visto, todo para tener una biblioteca de contenido
            personalizado al que puedas acceder desde donde quieras
            completamente gratis.
          </p>
        </div>
      </section>

      {/* Contenido Principal */}
      <div className="pt-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6">
              <p className="text-red-200 text-center">{error}</p>
            </div>
          )}

          {/* Sección de Películas Populares */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Películas Populares
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <ContentCard
                  key={movie.id}
                  content={movie}
                  isMovie={true}
                  addToFavorites={addToFavorites}
                  addToPending={addToPending}
                  addToViewed={addToViewed}
                />
              ))}
            </div>
            {/* Botones de paginación para películas */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePreviousMoviePage}
                className="bg-white/20 backdrop-blur-lg text-white py-2 px-4 rounded transition duration-200 hover:bg-white/30"
                disabled={currentMoviePage === 1}
              >
                Anterior
              </button>
              <button
                onClick={handleNextMoviePage}
                className="bg-white/20 backdrop-blur-lg text-white py-2 px-4 rounded transition duration-200 hover:bg-white/30"
              >
                Siguiente
              </button>
            </div>
            <div className="flex justify-center mt-6">
              <Link
                to="/peliculas"
                className="bg-white/20 backdrop-blur-lg text-white py-3 px-6 rounded-full shadow-lg hover:bg-white/30 transition-all duration-300"
              >
                Ver todas las películas
              </Link>
            </div>
          </section>

          {/* Sección de Series Populares */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Series Populares
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {series.map((serie) => (
                <ContentCard
                  key={serie.id}
                  content={serie}
                  isMovie={false}
                  addToFavorites={addToFavorites}
                  addToPending={addToPending}
                  addToViewed={addToViewed}
                />
              ))}
            </div>
            {/* Botones de paginación para series */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePreviousSeriesPage}
                className="bg-white/20 backdrop-blur-lg text-white py-2 px-4 rounded transition duration-200 hover:bg-white/30"
                disabled={currentSeriesPage === 1}
              >
                Anterior
              </button>
              <button
                onClick={handleNextSeriesPage}
                className="bg-white/20 backdrop-blur-lg text-white py-2 px-4 rounded transition duration-200 hover:bg-white/30"
              >
                Siguiente
              </button>
            </div>
            <div className="flex justify-center mt-6">
              <Link
                to="/series"
                className="bg-white/20 backdrop-blur-lg text-white py-3 px-6 rounded-full shadow-lg hover:bg-white/30 transition-all duration-300"
              >
                Ver todas las series
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const ContentCard: React.FC<{
  content: ContentType;
  isMovie: boolean;
  addToFavorites: (id: number, isMovie: boolean) => void;
  addToPending: (id: number, isMovie: boolean) => void;
  addToViewed: (id: number, isMovie: boolean) => void;
}> = ({ content, isMovie, addToFavorites, addToPending, addToViewed }) => {
  const [hovered, setHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const title = isMovie
    ? (content as MovieType).title
    : (content as SeriesType).name;
  const releaseDate = isMovie
    ? (content as MovieType).release_date
    : (content as SeriesType).first_air_date;

  return (
    <div
      className="relative group transform transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative rounded-xl overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
        <Link to={`/${isMovie ? "peliculas" : "series"}/${content.id}`}>
          {isLoading && (
            <div className="h-[400px] bg-gray-700 animate-pulse rounded-xl" />
          )}
          <img
            className={`w-full h-[300px] md:h-[400px] object-cover transition-transform duration-300 group-hover:scale-110 ${
              isLoading ? "invisible" : "visible"
            }`}
            src={`https://image.tmdb.org/t/p/w500/${content.poster_path}`}
            alt={title}
            onLoad={() => setIsLoading(false)}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
              <p className="text-sm text-gray-300 mb-3">
                {new Date(releaseDate).getFullYear()}
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToFavorites(content.id, isMovie);
                  }}
                  className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/40 backdrop-blur-sm border border-white/20 transition-colors duration-200"
                  title="Agregar a Favoritos"
                >
                  <i className="fas fa-heart text-white"></i>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToPending(content.id, isMovie);
                  }}
                  className="p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/40 backdrop-blur-sm border border-white/20 transition-colors duration-200"
                  title="Agregar a Pendientes"
                >
                  <i className="fas fa-clock text-white"></i>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToViewed(content.id, isMovie);
                  }}
                  className="p-2 rounded-full bg-green-500/20 hover:bg-green-500/40 backdrop-blur-sm border border-white/20 transition-colors duration-200"
                  title="Marcar como Vista"
                >
                  <i className="fas fa-eye text-white"></i>
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Inicio;
