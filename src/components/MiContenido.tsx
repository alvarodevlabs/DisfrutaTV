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

interface ContentItem {
  id: number;
  type: "movie" | "tv";
}

const MiContenido: React.FC = () => {
  const [favorites, setFavorites] = useState<ContentType[]>([]);
  const [pending, setPending] = useState<ContentType[]>([]);
  const [viewed, setViewed] = useState<ContentType[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserContent = async () => {
      try {
        // Obtener favoritos
        const favoritesResponse = await fetch(
          "http://127.0.0.1:5000/api/user/favorites",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const favoritesData = await favoritesResponse.json();
        const favoriteContent = await fetchContentDetails(favoritesData);

        // Obtener pendientes
        const pendingResponse = await fetch(
          "http://127.0.0.1:5000/api/user/pending",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const pendingData = await pendingResponse.json();
        const pendingContent = await fetchContentDetails(pendingData);

        // Obtener vistas
        const viewedResponse = await fetch(
          "http://127.0.0.1:5000/api/user/viewed",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const viewedData = await viewedResponse.json();
        const viewedContent = await fetchContentDetails(viewedData);

        setFavorites(favoriteContent);
        setPending(pendingContent);
        setViewed(viewedContent);
      } catch (err) {
        setError("Error al cargar el contenido del usuario");
      }
    };

    const fetchContentDetails = async (items: ContentItem[]) => {
      const apiKey = "05902896074695709d7763505bb88b4d";
      const promises = items.map(async (item) => {
        const { id, type } = item;
        const url =
          type === "movie"
            ? `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=es-ES`
            : `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=es-ES`;
        const response = await fetch(url);
        return await response.json();
      });
      return await Promise.all(promises);
    };

    fetchUserContent();
  }, []);

  // Funciones para eliminar contenido
  const removeFromFavorites = async (id: number, isMovie: boolean) => {
    const url = isMovie
      ? `http://127.0.0.1:5000/api/movies/${id}/remove-favorite`
      : `http://127.0.0.1:5000/api/series/${id}/remove-favorite`;

    await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    // Actualizar el estado
    setFavorites(favorites.filter((content) => content.id !== id));
  };

  const removeFromPending = async (id: number, isMovie: boolean) => {
    const url = isMovie
      ? `http://127.0.0.1:5000/api/movies/${id}/remove-pending`
      : `http://127.0.0.1:5000/api/series/${id}/remove-pending`;

    await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    // Actualizar el estado
    setPending(pending.filter((content) => content.id !== id));
  };

  const removeFromViewed = async (id: number, isMovie: boolean) => {
    const url = isMovie
      ? `http://127.0.0.1:5000/api/movies/${id}/remove-viewed`
      : `http://127.0.0.1:5000/api/series/${id}/remove-viewed`;

    await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    // Actualizar el estado
    setViewed(viewed.filter((content) => content.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900 pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Mi contenido
        </h1>
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6">
            <p className="text-red-200 text-center">{error}</p>
          </div>
        )}

        {/* Sección de Favoritos */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-white">Favoritos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favorites.map((content) => (
              <ContentCard
                key={content.id}
                content={content}
                listType="favorites"
                removeContent={removeFromFavorites}
              />
            ))}
          </div>
        </section>

        {/* Sección de Pendientes */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-white">Pendientes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {pending.map((content) => (
              <ContentCard
                key={content.id}
                content={content}
                listType="pending"
                removeContent={removeFromPending}
              />
            ))}
          </div>
        </section>

        {/* Sección de Vistas */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-white">Vistas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {viewed.map((content) => (
              <ContentCard
                key={content.id}
                content={content}
                listType="viewed"
                removeContent={removeFromViewed}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

interface ContentCardProps {
  content: ContentType;
  listType: "favorites" | "pending" | "viewed";
  removeContent: (id: number, isMovie: boolean) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({
  content,
  listType,
  removeContent,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const isMovie = "title" in content;
  const title = isMovie ? content.title : (content as SeriesType).name;
  const releaseDate = isMovie
    ? content.release_date
    : (content as SeriesType).first_air_date;

  // Calcula el año de forma segura
  let year = "N/A";
  if (releaseDate) {
    const date = new Date(releaseDate);
    if (!isNaN(date.getTime())) {
      year = date.getFullYear().toString();
    }
  }

  // Determina el texto del botón según el tipo de lista
  const removeText =
    listType === "favorites"
      ? "Eliminar de Favoritos"
      : listType === "pending"
      ? "Eliminar de Pendientes"
      : "Eliminar de Vistas";

  return (
    <div className="relative group transform transition-all duration-300 hover:scale-105">
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
              <p className="text-sm text-gray-300 mb-3">{year}</p>
              {/* Botón de eliminar */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeContent(content.id, isMovie);
                }}
                className="w-full bg-red-600/80 hover:bg-red-700 text-sm text-white py-2 px-4 rounded-md flex items-center justify-center mt-2"
              >
                <i className="fas fa-trash-alt mr-2"></i>
                {removeText}
              </button>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default MiContenido;
