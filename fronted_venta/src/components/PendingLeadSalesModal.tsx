import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarVentasLeadPendientes, type VentaLeadPendiente } from '../services/ventaLead.service';
import { ModalVisualizarVenta } from './ModalVisualizarVenta';

// --- Tipos para el Ordenamiento ---
type SortKey = keyof Omit<VentaLeadPendiente, 'ventaId'>;
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: SortKey | null;
  direction: SortDirection;
}

// --- Función para formatear fecha ---
const formatearFecha = (fechaISO: string): string => {
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
};

// --- Iconos Locales ---
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
    />
  </svg>
);

const ViewIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

// Icono de Ordenamiento (Chevron)
const SortIcon = ({ direction, active }: { direction: SortDirection; active: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`w-4 h-4 ml-1 transition-transform duration-200 ${active ? 'text-blue-600' : 'text-gray-300'
        } ${active && direction === 'desc' ? 'rotate-180' : ''}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
};

// --- Props del Modal ---
interface PendingLeadSalesModalProps {
  onClose: () => void;
}

export function PendingLeadSalesModal({ onClose }: PendingLeadSalesModalProps) {
  const navigate = useNavigate();

  const [leads, setLeads] = useState<VentaLeadPendiente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisualizarOpen, setModalVisualizarOpen] = useState(false);

  // Estado para filtros
  const [filters, setFilters] = useState({
    cliente: '',
    campana: '',
    fecha: '',
  });

  // Estado para ordenamiento
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'asc',
  });

  // Cargar leads al montar el componente
  useEffect(() => {
    const cargarLeads = async () => {
      try {
        setIsLoading(true);
        const data = await listarVentasLeadPendientes();
        setLeads(data);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error al cargar leads pendientes';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    cargarLeads();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => {
      if (current.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  // Lógica combinada: Filtrado + Ordenamiento
  const processedLeads = useMemo(() => {
    const result = leads.filter((lead) => {
      const fechaFormateada = formatearFecha(lead.fechaEnvio);

      if (
        filters.cliente &&
        !lead.nombreCliente.toLowerCase().includes(filters.cliente.toLowerCase())
      )
        return false;
      if (
        filters.campana &&
        !lead.nombreCampania.toLowerCase().includes(filters.campana.toLowerCase())
      )
        return false;
      if (filters.fecha) {
        const [year, month, day] = filters.fecha.split('-');
        const formattedInputDate = `${day}/${month}/${year}`;
        if (fechaFormateada !== formattedInputDate) return false;
      }
      return true;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (sortConfig.key === 'fechaEnvio') {
          const dateA = new Date(aValue).getTime();
          const dateB = new Date(bValue).getTime();
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [leads, filters, sortConfig]);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl min-w-[600px] overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Leads Pendientes de Atender</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <span className="text-3xl leading-none">&times;</span>
          </button>
        </div>

        {/* Filtros */}
        <div className="p-6 pb-2 border-b border-gray-100 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="cliente"
              placeholder="Filtrar por Cliente..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={handleFilterChange}
              value={filters.cliente}
            />
            <input
              type="text"
              name="campana"
              placeholder="Filtrar por Campaña..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={handleFilterChange}
              value={filters.campana}
            />
            <input
              type="date"
              name="fecha"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-500"
              onChange={handleFilterChange}
              value={filters.fecha}
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Cargando leads pendientes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                      onClick={() => handleSort('nombreCliente')}
                    >
                      <div className="flex items-center">
                        Cliente
                        <SortIcon
                          active={sortConfig.key === 'nombreCliente'}
                          direction={sortConfig.direction}
                        />
                      </div>
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                      onClick={() => handleSort('nombreCampania')}
                    >
                      <div className="flex items-center">
                        Nombre Campaña
                        <SortIcon
                          active={sortConfig.key === 'nombreCampania'}
                          direction={sortConfig.direction}
                        />
                      </div>
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                      onClick={() => handleSort('fechaEnvio')}
                    >
                      <div className="flex items-center">
                        Fecha Envío
                        <SortIcon
                          active={sortConfig.key === 'fechaEnvio'}
                          direction={sortConfig.direction}
                        />
                      </div>
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {processedLeads.length > 0 ? (
                    processedLeads.map((lead) => (
                      <tr key={lead.ventaId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {lead.nombreCliente}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.nombreCampania}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatearFecha(lead.fechaEnvio)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                          <div className="flex items-center justify-center space-x-3">
                            <button
                              onClick={() =>
                                navigate(`/registrar-venta-lead?ventaId=${lead.ventaId}`)
                              }
                              className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                              title="Atender"
                            >
                              <EditIcon />
                            </button>
                            <button
                              onClick={() => setModalVisualizarOpen(true)}
                              className="text-gray-600 hover:text-gray-800 transition-colors p-1"
                              title="Ver Detalle"
                            >
                              <ViewIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-gray-500 text-sm italic"
                      >
                        No se encontraron leads con esos filtros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="h-4 bg-gray-50 border-t border-gray-100"></div>
      </div>

      {/* Modal de Visualización */}
      <ModalVisualizarVenta
        isOpen={modalVisualizarOpen}
        onClose={() => setModalVisualizarOpen(false)}
        tipoVenta="LEAD"
      />
    </div>
  );
}
