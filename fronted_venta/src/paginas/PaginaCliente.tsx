import { useState } from 'react';
import { ModalEditarCliente } from '../modules/clientes/components/ModalEditarCliente';
import type { ClienteResponse } from '../modules/clientes/types/cliente.types';
import { obtenerClientePorId } from '../modules/clientes/services/cliente.service';

export function PaginaCliente() {
  const [clienteId, setClienteId] = useState<string>('');
  const [cliente, setCliente] = useState<ClienteResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBuscar = async () => {
    if (!clienteId.trim()) {
      setError('Por favor, ingrese un ID de cliente');
      return;
    }

    const id = parseInt(clienteId);
    if (isNaN(id) || id <= 0) {
      setError('Por favor, ingrese un ID válido');
      return;
    }

    setIsLoading(true);
    setError(null);
    setCliente(null);

    try {
      const data = await obtenerClientePorId(id);
      setCliente(data);
    } catch (err: any) {
      setError(err.message || 'Error al buscar el cliente');
      setCliente(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModificar = () => {
    if (cliente) {
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Recargar datos después de modificar
    if (cliente) {
      handleBuscar();
    }
  };

  const handleSaveSuccess = () => {
    // Los datos se recargarán en handleModalClose
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Gestión de Clientes</h2>

      {/* Barra de búsqueda */}
      <div className="mb-6 flex gap-3">
        <input
          type="text"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          placeholder="Ingrese ID del cliente"
          className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleBuscar();
            }
          }}
        />
        <button
          onClick={handleBuscar}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⏳</span>
              Buscando...
            </>
          ) : (
            <>
              <span>🔍</span>
              Buscar
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Tarjeta con información del cliente */}
      {cliente && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Sección: Datos personales */}
          <div className="border-b border-gray-200">
            <div className="bg-gray-100 px-4 py-3 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">Datos personales</h3>
              <span className="text-gray-500">▼</span>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">ID</label>
                <input
                  type="text"
                  value={cliente.clienteId}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">DNI</label>
                <input
                  type="text"
                  value={cliente.dni}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
                <input
                  type="text"
                  value={cliente.firstName}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Apellido</label>
                <input
                  type="text"
                  value={cliente.lastName}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Fecha nacimiento</label>
                <input
                  type="text"
                  value={formatDate(cliente.fechaNacimiento)}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Sección: Datos de contacto */}
          <div>
            <div className="bg-gray-100 px-4 py-3 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">Datos de contacto</h3>
              <span className="text-gray-500">▼</span>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Correo</label>
                <input
                  type="text"
                  value={cliente.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={cliente.phoneNumber || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Teléfono fijo</label>
                <input
                  type="text"
                  value={cliente.telefonoFijo || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Botón de modificar */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleModificar}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium transition-colors"
            >
              Modificar información
            </button>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {isModalOpen && cliente && (
        <ModalEditarCliente
          clienteId={cliente.clienteId}
          onClose={handleModalClose}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
}