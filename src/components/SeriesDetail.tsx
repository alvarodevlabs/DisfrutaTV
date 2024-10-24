import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faClock,
  faEye,
  faPlay,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

interface StreamingProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface StreamingData {
  flatrate?: StreamingProvider[];
  free?: StreamingProvider[];
  ads?: StreamingProvider[];
  rent?: StreamingProvider[];
  buy?: StreamingProvider[];
}

interface WatchProviders {
  results: {
    ES?: {
      link: string;
      flatrate?: StreamingProvider[];
      free?: StreamingProvider[];
      ads?: StreamingProvider[];
      rent?: StreamingProvider[];
      buy?: StreamingProvider[];
    };
  };
}

const SeriesDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [series, setSeries] = useState<any>(null);
  const [actors, setActors] = useState<any[]>([]);
  const [relatedSeries, setRelatedSeries] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isViewed, setIsViewed] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [watchProviders, setWatchProviders] = useState<StreamingData | null>(
    null
  );
  const [watchProvidersLink, setWatchProvidersLink] = useState<string>("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const seriesId = id ? parseInt(id) : null;

    const fetchSeriesDetails = async () => {
      if (!seriesId) return;
      try {
        const [seriesResponse, creditsResponse, videoResponse, watchResponse] =
          await Promise.all([
            fetch(
              `https://api.themoviedb.org/3/tv/${seriesId}?api_key=05902896074695709d7763505bb88b4d&language=es-ES`
            ),
            fetch(
              `https://api.themoviedb.org/3/tv/${seriesId}/credits?api_key=05902896074695709d7763505bb88b4d&language=es-ES`
            ),
            fetch(
              `https://api.themoviedb.org/3/tv/${seriesId}/videos?api_key=05902896074695709d7763505bb88b4d&language=es-ES`
            ),
            fetch(
              `https://api.themoviedb.org/3/tv/${seriesId}/watch/providers?api_key=05902896074695709d7763505bb88b4d`
            ),
          ]);

        const [seriesData, creditsData, videoData, watchData] =
          await Promise.all([
            seriesResponse.json(),
            creditsResponse.json(),
            videoResponse.json(),
            watchResponse.json(),
          ]);

        setSeries(seriesData);
        setActors(creditsData.cast.slice(0, 10));

        if (videoData.results.length > 0) {
          setTrailerUrl(videoData.results[0].key);
        }

        const watchProvidersData = watchData as WatchProviders;
        if (watchProvidersData.results.ES) {
          const { link, ...providers } = watchProvidersData.results.ES;
          setWatchProviders(providers);
          setWatchProvidersLink(link);
        }

        checkSeriesStatus(seriesId);
        fetchRelatedSeries(seriesId);

        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los detalles de la serie", error);
        setLoading(false);
      }
    };

    const checkSeriesStatus = async (seriesId: number) => {
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

        const [favorites, pending, viewed] = await Promise.all([
          favoritesResponse.json(),
          pendingResponse.json(),
          viewedResponse.json(),
        ]);

        setIsFavorite(
          favorites.some((fav: any) => fav.id === seriesId && fav.type === "tv")
        );
        setIsPending(
          pending.some(
            (pend: any) => pend.id === seriesId && pend.type === "tv"
          )
        );
        setIsViewed(
          viewed.some((view: any) => view.id === seriesId && view.type === "tv")
        );
      } catch (error) {
        console.error("Error al comprobar el estado de la serie", error);
      }
    };

    const fetchRelatedSeries = async (seriesId: number) => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${seriesId}/similar?api_key=05902896074695709d7763505bb88b4d&language=es-ES&page=1`
        );
        const data = await response.json();
        setRelatedSeries(data.results.slice(0, 5));
      } catch (error) {
        console.error("Error al cargar las series relacionadas", error);
      }
    };

    fetchSeriesDetails();
  }, [id]);

  useEffect(() => {
    // Cambia el título de la página al nombre de la serie
    if (series) {
      document.title = series.name; // Cambia esto según tus preferencias
    }
  }, [series]);

  const handleAddToFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Debes iniciar sesión para realizar esta acción.");
        return;
      }

      await fetch(
        `https://flask-backend-rx79.onrender.com/api/series/${id}/add-favorite`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsFavorite(true);
    } catch (error) {
      console.error("Error al agregar a favoritos", error);
    }
  };

  const handleRemoveFromFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Debes iniciar sesión para realizar esta acción.");
        return;
      }

      await fetch(
        `https://flask-backend-rx79.onrender.com/api/series/${id}/remove-favorite`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsFavorite(false);
    } catch (error) {
      console.error("Error al eliminar de favoritos", error);
    }
  };

  const handleAddToPending = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Debes iniciar sesión para realizar esta acción.");
        return;
      }

      await fetch(
        `https://flask-backend-rx79.onrender.com/api/series/${id}/add-pending`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsPending(true);
    } catch (error) {
      console.error("Error al agregar a pendientes", error);
    }
  };

  const handleRemoveFromPending = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Debes iniciar sesión para realizar esta acción.");
        return;
      }

      await fetch(
        `https://flask-backend-rx79.onrender.com/api/series/${id}/remove-pending`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsPending(false);
    } catch (error) {
      console.error("Error al eliminar de pendientes", error);
    }
  };

  const handleAddToViewed = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Debes iniciar sesión para realizar esta acción.");
        return;
      }

      await fetch(
        `https://flask-backend-rx79.onrender.com/api/series/${id}/add-viewed`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsViewed(true);
    } catch (error) {
      console.error("Error al agregar a vistas", error);
    }
  };

  const handleRemoveFromViewed = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Debes iniciar sesión para realizar esta acción.");
        return;
      }

      await fetch(
        `https://flask-backend-rx79.onrender.com/api/series/${id}/remove-viewed`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsViewed(false);
    } catch (error) {
      console.error("Error al eliminar de vistas", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderProviderSection = (
    providers: StreamingProvider[] | undefined,
    title: string
  ) => {
    if (!providers || providers.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <div className="flex flex-wrap gap-4">
          {providers.map((provider) => (
            <div
              key={provider.provider_id}
              className="flex flex-col items-center group"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden transition-transform transform group-hover:scale-110">
                <img
                  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                  alt={provider.provider_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs text-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {provider.provider_name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (!series)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white">No se encontró la serie.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero section con backdrop */}
      <div className="relative">
        {series.backdrop_path && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original/${series.backdrop_path})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
          </>
        )}

        <div className="relative container mx-auto px-4 py-16 md:py-60">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Carátula */}
            <div className="w-full md:w-auto md:flex-shrink-0">
              {series.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500/${series.poster_path}`}
                  alt={series.name}
                  className="w-full md:w-64 md:h-96 rounded-lg shadow-2xl transform transition hover:scale-105"
                />
              ) : (
                <div className="w-full md:w-64 md:h-96 bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Imagen no disponible</p>
                </div>
              )}
            </div>

            {/* Información y botones */}
            <div className="flex flex-col space-y-4 md:space-y-6 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                {series.name}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center space-x-2 md:space-x-4 text-sm text-gray-300">
                {series.first_air_date && (
                  <>
                    <span>{series.first_air_date.split("-")[0]}</span>
                    <span>•</span>
                  </>
                )}
                {series.number_of_seasons && (
                  <>
                    <span>
                      {series.number_of_seasons}{" "}
                      {series.number_of_seasons === 1
                        ? "temporada"
                        : "temporadas"}
                    </span>
                    <span>•</span>
                  </>
                )}
                {series.genres && series.genres.length > 0 && (
                  <span>
                    {series.genres.map((genre: any) => genre.name).join(", ")}
                  </span>
                )}
              </div>

              {series.overview && (
                <p className="text-base md:text-lg text-gray-300">
                  {series.overview}
                </p>
              )}

              {/* Watch Providers */}
              {watchProviders && (
                <div className="mt-6">
                  <h2 className="text-2xl font-bold mb-4">Ver en</h2>
                  {renderProviderSection(watchProviders.flatrate, "Streaming")}
                  {renderProviderSection(watchProviders.free, "Gratis")}
                  {renderProviderSection(watchProviders.ads, "Con Anuncios")}
                  {renderProviderSection(watchProviders.rent, "Alquiler")}
                  {renderProviderSection(watchProviders.buy, "Compra")}
                  <a
                    href={watchProvidersLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition-all"
                  >
                    Más información en TMDB
                  </a>
                </div>
              )}

              {/* Botones */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <button
                  onClick={
                    isFavorite
                      ? handleRemoveFromFavorites
                      : handleAddToFavorites
                  }
                  className={`flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
                    isFavorite
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <FontAwesomeIcon icon={faHeart} />
                  {isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                </button>

                <button
                  onClick={
                    isPending ? handleRemoveFromPending : handleAddToPending
                  }
                  className={`flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
                    isPending
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <FontAwesomeIcon icon={faClock} />
                  {isPending ? "Quitar de pendientes" : "Añadir a pendientes"}
                </button>

                <button
                  onClick={
                    isViewed ? handleRemoveFromViewed : handleAddToViewed
                  }
                  className={`flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
                    isViewed
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <FontAwesomeIcon icon={faEye} />
                  {isViewed ? "Quitar de vistos" : "Marcar como visto"}
                </button>

                {trailerUrl && (
                  <button
                    onClick={openModal}
                    className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full font-medium bg-green-600 hover:bg-green-700 transition-all transform hover:scale-105"
                  >
                    <FontAwesomeIcon icon={faPlay} />
                    Ver Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal del Trailer */}
      {isModalOpen && trailerUrl && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="relative bg-gray-800 rounded-xl overflow-hidden max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>

            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${trailerUrl}`}
                title="Trailer"
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Sección de actores */}
      {actors && actors.length > 0 && (
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center md:text-left">
            Reparto principal
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {actors.map((actor: any) => (
              <div
                key={actor.id}
                className="group flex flex-col items-center text-center transform transition hover:scale-105"
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 mb-4">
                  {actor.profile_path ? (
                    <img
                      className="rounded-full w-full h-full object-cover"
                      src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      alt={actor.name}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 rounded-full flex items-center justify-center">
                      <p className="text-gray-500 text-xs md:text-sm">
                        Sin foto
                      </p>
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-semibold text-sm md:text-lg">
                  {actor.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-400">
                  {actor.character}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección de series relacionadas */}
      {relatedSeries.length > 0 && (
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center md:text-left">
            Series Relacionadas
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {relatedSeries.map((relatedSerie: any) => (
              <div
                key={relatedSerie.id}
                className="group transform transition-all hover:scale-105"
              >
                <Link to={`/series/${relatedSerie.id}`}>
                  <div className="rounded-lg shadow-lg w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] object-cover">
                    <img
                      className="rounded-lg shadow-lg w-full h-full object-cover"
                      src={`https://image.tmdb.org/t/p/w500/${relatedSerie.poster_path}`}
                      alt={relatedSerie.name}
                    />
                  </div>
                  <h3 className="text-lg font-semibold mt-2 text-white text-center">
                    {relatedSerie.name}
                  </h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeriesDetail;
