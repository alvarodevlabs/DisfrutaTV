import { MovieType, SeriesType } from "./store"; // Correcto si son exportaciones nombradas

export const fetchMovies = async (dispatch: React.Dispatch<any>) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/movies");
    const data: MovieType[] = await response.json();
    dispatch({ type: "SET_MOVIES", payload: data });
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

export const fetchSeries = async (dispatch: React.Dispatch<any>) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/series");
    const data: SeriesType[] = await response.json();
    dispatch({ type: "SET_SERIES", payload: data });
  } catch (error) {
    console.error("Error fetching series:", error);
  }
};
