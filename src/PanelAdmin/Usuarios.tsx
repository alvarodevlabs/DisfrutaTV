import React, { useEffect, useContext, useState } from "react";
import Store, { UserType } from "../context/store"; // Importa UserType desde el contexto

const Usuarios: React.FC = () => {
  const { state, dispatch } = useContext(Store);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Nuevo estado para contraseña
  const [isCreatingUser, setIsCreatingUser] = useState(false); // Nuevo estado para crear usuario

  // Función para obtener la lista de usuarios desde el backend
  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://flask-backend-rx79.onrender.com/api/users",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener la lista de usuarios");
      }

      const data = await response.json();
      dispatch({ type: "SET_USERS", payload: data });
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  // Función para eliminar un usuario
  const deleteUser = async (userId: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://flask-backend-rx79.onrender.com/api/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        dispatch({
          type: "SET_USERS",
          payload: state.users.filter((user) => user.id !== userId),
        });
      } else {
        throw new Error("Error al eliminar el usuario");
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  // Función para editar un usuario
  const handleEditUser = (user: UserType) => {
    setEditingUser(user);
    setUsername(user.username);
    setEmail(user.email);
    setPassword(""); // Deja la contraseña vacía para no mostrarla en el formulario de edición
  };

  // Función para actualizar el usuario
  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const userData: Partial<UserType> = {
      username,
      email,
      ...(password && { password }), // Solo incluye la contraseña si se cambió
    };

    try {
      const response = await fetch(
        `https://flask-backend-rx79.onrender.com/api/users/${editingUser.id}`,
        {
          method: "PUT",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const updatedUser: UserType = { ...editingUser, username, email };
        dispatch({
          type: "SET_USERS",
          payload: state.users.map((user: UserType) =>
            user.id === editingUser.id ? updatedUser : user
          ),
        });
        setEditingUser(null);
        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        throw new Error("Error al actualizar el usuario");
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  // Función para crear un nuevo usuario
  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://flask-backend-rx79.onrender.com/api/users",
        {
          method: "POST",
          body: JSON.stringify({ username, email, password }), // Incluir contraseña al crear usuario
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const newUser = await response.json();
        dispatch({
          type: "SET_USERS",
          payload: [...state.users, newUser],
        });
        setIsCreatingUser(false);
        setUsername("");
        setEmail("");
        setPassword(""); // Limpiar la contraseña después de crear el usuario
      } else {
        throw new Error("Error al crear el usuario");
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-white dark:text-white">
        Gestión de Usuarios
      </h1>

      {/* Botón para abrir el formulario de crear usuario */}
      <button
        onClick={() => setIsCreatingUser(true)}
        className="mb-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Crear Usuario
      </button>

      {/* Formulario para crear usuario */}
      {isCreatingUser && (
        <form onSubmit={createUser} className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-white dark:text-white">
            Crear Nuevo Usuario
          </h2>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nombre
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-md shadow-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-md shadow-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-md shadow-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Crear
          </button>
          <button
            type="button"
            onClick={() => setIsCreatingUser(false)}
            className="ml-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        </form>
      )}

      {/* Formulario para editar usuario */}
      {editingUser && (
        <form onSubmit={updateUser} className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-white dark:text-white">
            Editar Usuario
          </h2>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nombre
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-md shadow-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-md shadow-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Cambiar Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-md shadow-sm"
              placeholder="Deja vacío para no cambiar"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setEditingUser(null)}
            className="ml-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        </form>
      )}

      <table className="min-w-full table-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="px-4 py-2 text-black dark:text-white">ID</th>
            <th className="px-4 py-2 text-black dark:text-white">Nombre</th>
            <th className="px-4 py-2 text-black dark:text-white">Email</th>
            <th className="px-4 py-2 text-black dark:text-white">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {state.users.map((user: UserType) => (
            <tr key={user.id} className="border-b dark:border-gray-700">
              <td className="px-4 py-2 text-black dark:text-white">
                {user.id}
              </td>
              <td className="px-4 py-2 text-black dark:text-white">
                {user.username}
              </td>
              <td className="px-4 py-2 text-black dark:text-white">
                {user.email}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleEditUser(user)}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Usuarios;
