import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Asegúrate de que la importación sea correcta

// Definición de tipos para películas, series y usuarios
export type MovieType = {
  id: number;
  title: string;
  description: string;
  isFavorite: boolean;
};

export type SeriesType = {
  id: number;
  name: string;
  description: string;
  isFavorite: boolean;
};

export type UserType = {
  id: number;
  username: string;
  email: string;
  role: string;
};

// Tipo para el estado global
export type StateType = {
  user: UserType | null;
  token: string | null;
  isAuthenticated: boolean;
  movies: MovieType[];
  series: SeriesType[];
  users: UserType[];
};

// Tipo para las acciones en el reducer
type ActionType =
  | { type: "SET_USER"; payload: UserType }
  | { type: "SET_TOKEN"; payload: string }
  | { type: "SET_MOVIES"; payload: MovieType[] }
  | { type: "SET_SERIES"; payload: SeriesType[] }
  | { type: "SET_USERS"; payload: UserType[] }
  | { type: "LOGOUT" };

// Estado inicial
const initialState: StateType = {
  user: null,
  token: null,
  isAuthenticated: false,
  movies: [],
  series: [],
  users: [],
};

// Creación del contexto
const Store = createContext<{
  state: StateType;
  dispatch: React.Dispatch<ActionType>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Reducer para manejar el estado global
const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "SET_TOKEN":
      return { ...state, token: action.payload, isAuthenticated: true };
    case "SET_MOVIES":
      return { ...state, movies: action.payload };
    case "SET_SERIES":
      return { ...state, series: action.payload };
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        movies: [],
        series: [],
        users: [],
      };
    default:
      return state;
  }
};

// Proveedor de contexto para envolver la aplicación
export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Lógica para verificar el token JWT en el almacenamiento local (localStorage)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken: any = jwtDecode(token); // Decodificar el token JWT
      dispatch({ type: "SET_TOKEN", payload: token });
      dispatch({
        type: "SET_USER",
        payload: {
          id: decodedToken.id,
          username: decodedToken.username,
          email: decodedToken.email,
          role: decodedToken.role,
        },
      });
    }
  }, []);

  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
};

export default Store;
