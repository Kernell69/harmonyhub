import { useEffect, useState } from "react";
import { useAuth } from "../hooks/authContext";
import useAxios from "../hooks/useAxios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { data, error, callApi } = useAxios('/api-auth/', 'POST', []);
  const { login } = useAuth("actions");
  const { isAuthenticated } = useAuth("state");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (data && data.token) {
      login(data.token);
    }
  }, [data, login]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await callApi({ username, password });
  };
  
  if (error) {
    console.error('Error during login:', error);
  }


  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center m-2">
      <div className="bg-gray-800 text-textPrimary p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium">Nombre de usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Nombre de usuario"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 p-2 w-full rounded border border-gray-300 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full rounded border border-gray-300 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="w-full font-semibold bg-primary text-white py-2 rounded hover:bg-green-800 transition-colors"
            >Iniciar sesión
            </button>
          </div>

          {error && (
            <div className="text-red-500 text-center">
              {Array.isArray(error.non_field_errors) ? (
                <ul className="list-disc list-inside">
                  {error.non_field_errors.map((msg, index) => (
                    <li key={index}>{msg}</li>
                  ))}
                </ul>
              ) : (
                <p>{error.detail || error.error}</p>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;