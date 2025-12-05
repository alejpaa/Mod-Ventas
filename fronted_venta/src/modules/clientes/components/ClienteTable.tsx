import { type ClienteResponse } from '../types/cliente.types';
import { ModalEditarCliente } from './ModalEditarCliente';
import { useState } from 'react';

interface ClienteTableProps {
  clientes: ClienteResponse[];
  onRefresh?: () => void;
}

export function ClienteTable({ clientes, onRefresh }: ClienteTableProps) {
  const [clienteEditando, setClienteEditando] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (clienteId: number) => {
    setClienteEditando(clienteId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setClienteEditando(null);
    if (onRefresh) {
      onRefresh();
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'S/ 0.00';
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getEstadoClass = (estado: string) => {
    if (estado === 'ACTIVO' || estado === 'Activo') {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-orange-100 text-orange-800';
  };

  const getEstadoText = (estado: string) => {
    if (estado === 'ACTIVO' || estado === 'Activo') {
      return 'Activo';
    }
    return 'Inactivo';
  };

  if (clientes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500 text-lg">No se encontraron clientes</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                RUC
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gasto Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clientes.map((cliente) => (
              <tr key={cliente.clienteId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {cliente.fullName || `${cliente.firstName} ${cliente.lastName}`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{cliente.dni}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{cliente.email || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(cliente.gastoTotal)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoClass(
                      cliente.estado
                    )}`}
                  >
                    {getEstadoText(cliente.estado)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(cliente.clienteId)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && clienteEditando && (
        <ModalEditarCliente
          clienteId={clienteEditando}
          onClose={handleModalClose}
          onSaveSuccess={handleModalClose}
        />
      )}
    </>
  );
}

