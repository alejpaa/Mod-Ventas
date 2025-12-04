import { useRole } from '../contexts/RoleContext';

export function Login() {
  const { setRole } = useRole();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Selecciona cómo entrar</h2>

        <div className="space-y-3">
          <button
            onClick={() => setRole('administrador')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:opacity-95"
          >
            Administrador
          </button>

          <button
            onClick={() => setRole('vendedor')}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:opacity-95"
          >
            Vendedor
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
