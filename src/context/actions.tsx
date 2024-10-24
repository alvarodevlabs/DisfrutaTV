import { MovieType, SeriesType } from "./store"; // Correcto si son exportaciones nombradas

export const fetchMovies = async (dispatch: React.Dispatch<any>) => {
  try {
    const response = await fetch(
      "https://flask-backend-rx79.onrender.com/api/movies"
    );
    const data: MovieType[] = await response.json();
    dispatch({ type: "SET_MOVIES", payload: data });
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

export const fetchSeries = async (dispatch: React.Dispatch<any>) => {
  try {
    const response = await fetch(
      "https://flask-backend-rx79.onrender.com/api/series"
    );
    const data: SeriesType[] = await response.json();
    dispatch({ type: "SET_SERIES", payload: data });
  } catch (error) {
    console.error("Error fetching series:", error);
  }
};
