import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface MovieType {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
}

const Peliculas: React.FC = () => {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [pending, setPending] = useState<number[]>([]);
  const [viewed, setViewed] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchMovies = async (page: number) => {
      try {
        const response = await fetch(
          `https://flask-backend-rx79.onrender.com/api/movies?page=${page}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener las películas");
        }

        const data = await response.json();
        setMovies(data);
      } catch (err) {
        setError("Error al cargar las películas");
      }
    };

    const fetchUserStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [favoritesResponse, pendingResponse, viewedResponse] =
          await Promise.all([
            fetch(
              "https://flask-backend-rx79.onrender.com/api/user/favorites",
              { headers }
            ),
            fetch("https://flask-backend-rx79.onrender.com/api/user/pending", {
              headers,
            }),
            fetch("https://flask-backend-rx79.onrender.com/api/user/viewed", {
              headers,
            }),
          ]);

        const [favoritesData, pendingData, viewedData] = await Promise.all([
          favoritesResponse.json(),
          pendingResponse.json(),
          viewedResponse.json(),
        ]);

        setFavorites(favoritesData.map((fav: any) => fav.movie_id));
        setPending(pendingData.map((pend: any) => pend.movie_id));
        setViewed(viewedData.map((view: any) => view.movie_id));
      } catch (err) {
        setError("Error al cargar el estado del usuario");
      }
    };

    fetchMovies(currentPage);
    fetchUserStatus();
  }, [currentPage]);

  const addToFavorites = async (movieId: number) => {
    await fetch(
      `https://flask-backend-rx79.onrender.com/api/movies/${movieId}/add-favorite`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    setFavorites([...favorites, movieId]);
  };

  const removeFromFavorites = async (movieId: number) => {
    await fetch(
      `https://flask-backend-rx79.onrender.com/api/movies/${movieId}/remove-favorite`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    setFavorites(favorites.filter((fav) => fav !== movieId));
  };

  const addToPending = async (movieId: number) => {
    await fetch(
      `https://flask-backend-rx79.onrender.com/api/movies/${movieId}/add-pending`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    setPending([...pending, movieId]);
  };

  const removeFromPending = async (movieId: number) => {
    await fetch(
      `https://flask-backend-rx79.onrender.com/api/movies/${movieId}/remove-pending`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    setPending(pending.filter((pend) => pend !== movieId));
  };

  const addToViewed = async (movieId: number) => {
    await fetch(
      `https://flask-backend-rx79.onrender.com/api/movies/${movieId}/add-viewed`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    setViewed([...viewed, movieId]);
  };

  const removeFromViewed = async (movieId: number) => {
    await fetch(
      `https://flask-backend-rx79.onrender.com/api/movies/${movieId}/remove-viewed`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    setViewed(viewed.filter((view) => view !== movieId));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    window.scrollTo(0, 0);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900 pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Películas Populares
        </h1>
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6">
            <p className="text-red-200 text-center">{error}</p>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={favorites.includes(movie.id)}
              isPending={pending.includes(movie.id)}
              isViewed={viewed.includes(movie.id)}
              addToFavorites={addToFavorites}
              removeFromFavorites={removeFromFavorites}
              addToPending={addToPending}
              removeFromPending={removeFromPending}
              addToViewed={addToViewed}
              removeFromViewed={removeFromViewed}
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

const MovieCard: React.FC<{
  movie: MovieType;
  isFavorite: boolean;
  isPending: boolean;
  isViewed: boolean;
  addToFavorites: (id: number) => void;
  removeFromFavorites: (id: number) => void;
  addToPending: (id: number) => void;
  removeFromPending: (id: number) => void;
  addToViewed: (id: number) => void;
  removeFromViewed: (id: number) => void;
}> = ({
  movie,
  isFavorite,
  isPending,
  isViewed,
  addToFavorites,
  removeFromFavorites,
  addToPending,
  removeFromPending,
  addToViewed,
  removeFromViewed,
}) => {
  const [hovered, setHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Para lazy loading

  return (
    <div
      className="relative group transform transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative rounded-xl overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
        <Link to={`/peliculas/${movie.id}`}>
          {isLoading && (
            <div className="h-[400px] bg-gray-700 animate-pulse rounded-xl" />
          )}
          <img
            className={`w-full h-[300px] md:h-[400px] object-cover transition-transform duration-300 group-hover:scale-110 ${
              isLoading ? "invisible" : "visible"
            }`}
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            alt={movie.title}
            onLoad={() => setIsLoading(false)} // Se quita la clase de loading una vez que la imagen carga
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-bold text-white mb-1">
                {movie.title}
              </h3>
              <p className="text-sm text-gray-300 mb-3">
                {new Date(movie.release_date).getFullYear()}
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    isFavorite
                      ? removeFromFavorites(movie.id)
                      : addToFavorites(movie.id);
                  }}
                  className={`p-2 rounded-full backdrop-blur-sm border border-white/20 transition-colors duration-200 ${
                    isFavorite
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-purple-500/20 hover:bg-purple-500/40"
                  }`}
                  title={
                    isFavorite ? "Quitar de Favoritos" : "Agregar a Favoritos"
                  }
                >
                  <i className="fas fa-heart text-white"></i>
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    isPending
                      ? removeFromPending(movie.id)
                      : addToPending(movie.id);
                  }}
                  className={`p-2 rounded-full backdrop-blur-sm border border-white/20 transition-colors duration-200 ${
                    isPending
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500/20 hover:bg-blue-500/40"
                  }`}
                  title={
                    isPending ? "Quitar de Pendientes" : "Agregar a Pendientes"
                  }
                >
                  <i className="fas fa-clock text-white"></i>
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    isViewed
                      ? removeFromViewed(movie.id)
                      : addToViewed(movie.id);
                  }}
                  className={`p-2 rounded-full backdrop-blur-sm border border-white/20 transition-colors duration-200 ${
                    isViewed
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500/20 hover:bg-green-500/40"
                  }`}
                  title={isViewed ? "Quitar de Vistas" : "Marcar como Vista"}
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

export default Peliculas;
