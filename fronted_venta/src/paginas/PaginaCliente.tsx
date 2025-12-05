import { useState, useEffect, useCallback } from 'react';
import { ClienteTable } from '../modules/clientes/components/ClienteTable';
import { ModalAgregarCliente } from '../modules/clientes/components/ModalAgregarCliente';
import type { ClienteResponse, EstadoClienteFilter } from '../modules/clientes/types/cliente.types';
import { filtrarClientes, obtenerGastoTotalCliente } from '../modules/clientes/services/cliente.service';

export function PaginaCliente() {
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<EstadoClienteFilter>('TODOS');
  const [isModalAgregarOpen, setIsModalAgregarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const fetchClientes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await filtrarClientes(
        searchTerm || undefined,
        estadoFilter,
        currentPage,
        pageSize
      );

      // Obtener el gasto total para cada cliente
      const clientesConGasto = await Promise.all(
        response.clientes.map(async (cliente) => {
          const gastoTotal = await obtenerGastoTotalCliente(cliente.clienteId);
          return { ...cliente, gastoTotal };
        })
      );

      setClientes(clientesConGasto);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los clientes');
      setClientes([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, estadoFilter, currentPage]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Resetear a la primera página al buscar
  };

  const handleFilterChange = (filter: EstadoClienteFilter) => {
    setEstadoFilter(filter);
    setCurrentPage(0); // Resetear a la primera página al cambiar filtro
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCloseModal = () => {
    setIsModalAgregarOpen(false);
  };

  const handleSaveSuccess = () => {
    setIsModalAgregarOpen(false);
    fetchClientes(); // Refrescar la lista
  };

  return (
    <div className="w-full">
      {/* Título y Subtítulo */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Clientes</h1>
        <p className="text-gray-600">Busca, filtra y administra tus clientes.</p>
      </div>

      {/* Barra de búsqueda y Botón Agregar */}
      <div className="mb-6 flex gap-4 items-center">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar por nombre o RUC..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setIsModalAgregarOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <span className="text-xl">+</span>
          Agregar Cliente
        </button>
      </div>

      {/* Tabs de Filtro */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleFilterChange('TODOS')}
            className={`${
              estadoFilter === 'TODOS'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Todos
          </button>
          <button
            onClick={() => handleFilterChange('ACTIVO')}
            className={`${
              estadoFilter === 'ACTIVO'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Activos
          </button>
          <button
            onClick={() => handleFilterChange('INACTIVO')}
            className={`${
              estadoFilter === 'INACTIVO'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Inactivos
          </button>
        </nav>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Tabla de Clientes */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-lg">Cargando clientes...</p>
        </div>
      ) : (
        <>
          <ClienteTable clientes={clientes} onRefresh={fetchClientes} />

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {currentPage * pageSize + 1} a{' '}
                {Math.min((currentPage + 1) * pageSize, totalElements)} de {totalElements} clientes
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Página {currentPage + 1} de {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal Agregar Cliente */}
      {isModalAgregarOpen && (
        <ModalAgregarCliente onClose={handleCloseModal} onSaveSuccess={handleSaveSuccess} />
      )}
    </div>
  );
}