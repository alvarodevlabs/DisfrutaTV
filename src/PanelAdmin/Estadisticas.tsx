import React, { useEffect, useContext, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Store from "../context/store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Estadisticas: React.FC = () => {
  const { state, dispatch } = useContext(Store);
  const [statistics, setStatistics] = useState({
    favoriteMoviesCount: 0,
    favoriteSeriesCount: 0,
    pendingMoviesCount: 0,
    pendingSeriesCount: 0,
    viewedMoviesCount: 0,
    viewedSeriesCount: 0,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch(
          "https://flask-backend-rx79.onrender.com/api/statistics",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Asegurarse de enviar el token JWT
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener estadísticas");
        }

        const data = await response.json();
        setStatistics({
          favoriteMoviesCount: data.favoriteMoviesCount,
          favoriteSeriesCount: data.favoriteSeriesCount,
          pendingMoviesCount: data.pendingMoviesCount,
          pendingSeriesCount: data.pendingSeriesCount,
          viewedMoviesCount: data.viewedMoviesCount,
          viewedSeriesCount: data.viewedSeriesCount,
        });
      } catch (err) {
        console.error("Error al cargar estadísticas:", err);
      }
    };

    fetchStatistics();
  }, [dispatch]);

  // Configuración del gráfico de barras
  const data = {
    labels: ["Favoritas", "Pendientes", "Vistas"],
    datasets: [
      {
        label: "Películas",
        data: [
          statistics.favoriteMoviesCount,
          statistics.pendingMoviesCount,
          statistics.viewedMoviesCount,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Series",
        data: [
          statistics.favoriteSeriesCount,
          statistics.pendingSeriesCount,
          statistics.viewedSeriesCount,
        ],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Esto permite cambiar el tamaño manualmente
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Estadísticas de Contenido (Películas y Series)",
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">
        Estadísticas del Sistema
      </h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {/* Aquí ajustamos el tamaño del gráfico */}
        <div className="relative" style={{ width: "auto", height: "450px" }}>
          <Bar data={data} options={options} />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Películas en Favoritos
          </h2>
          <p className="text-4xl font-bold mt-4 text-blue-500">
            {statistics.favoriteMoviesCount}
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Series en Favoritos
          </h2>
          <p className="text-4xl font-bold mt-4 text-blue-500">
            {statistics.favoriteSeriesCount}
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Películas Pendientes
          </h2>
          <p className="text-4xl font-bold mt-4 text-yellow-500">
            {statistics.pendingMoviesCount}
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Series Pendientes
          </h2>
          <p className="text-4xl font-bold mt-4 text-yellow-500">
            {statistics.pendingSeriesCount}
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Películas Vistas
          </h2>
          <p className="text-4xl font-bold mt-4 text-green-500">
            {statistics.viewedMoviesCount}
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Series Vistas
          </h2>
          <p className="text-4xl font-bold mt-4 text-green-500">
            {statistics.viewedSeriesCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
