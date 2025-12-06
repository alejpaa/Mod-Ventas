import { Link } from 'react-router-dom';

export function PaginaNoEncontrada() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-9xl font-bold text-gray-800">404</h1>
      <h2 className="text-3xl font-semibold text-gray-700 mt-4">
        Página No Encontrada
      </h2>
      <p className="text-gray-500 mt-2">
        Lo sentimos, la página que buscas no existe.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
      >
        Volver al Inicio
      </Link>
    </div>
  );
}
