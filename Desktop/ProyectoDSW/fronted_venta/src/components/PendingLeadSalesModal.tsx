import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- Importamos el Hook de navegación

// --- Tipos para Leads ---
interface Lead {
  id: string;
  cliente: string;
  campana: string;
  fechaEnvio: string; // Formato DD/MM/YYYY
}

// --- Tipos para el Ordenamiento ---
type SortKey = keyof Omit<Lead, 'id'>; 
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: SortKey | null;
  direction: SortDirection;
}

// --- Mock Data: Leads ---
const mockLeads: Lead[] = [
  { id: 'L-001', cliente: 'Constructora S.A.', campana: 'Campaña Facebook Nov', fechaEnvio: '20/11/2025' },
  { id: 'L-002', cliente: 'Jorge Luis Vega', campana: 'Mailing Base 2024', fechaEnvio: '19/11/2025' },
  { id: 'L-003', cliente: 'Maria Fernanda', campana: 'Referidos Web', fechaEnvio: '19/11/2025' },
  { id: 'L-004', cliente: 'Grupo Logístico', campana: 'Evento Presencial', fechaEnvio: '18/11/2025' },
  { id: 'L-005', cliente: 'Tech Solutions', campana: 'Campaña LinkedIn', fechaEnvio: '15/11/2025' },
  { id: 'L-006', cliente: 'Ana María Polo', campana: 'Mailing Base 2024', fechaEnvio: '15/11/2025' },
  { id: 'L-007', cliente: 'Carlos Ruiz', campana: 'Evento Presencial', fechaEnvio: '05/11/2025' },
];

// --- Iconos Locales ---
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
);

const ViewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
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
      className={`w-4 h-4 ml-1 transition-transform duration-200 ${
        active 
          ? 'text-blue-600' // Color activo
          : 'text-gray-300' // Color inactivo
      } ${
        active && direction === 'desc' ? 'rotate-180' : ''
      }`}
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
  const navigate = useNavigate(); // <--- Inicializamos el hook
  
  // Estado para filtros
  const [filters, setFilters] = useState({
    cliente: '',
    campana: '',
    fecha: ''
  });

  // Estado para ordenamiento
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'asc'
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Función para cambiar el orden al hacer clic en cabecera
  const handleSort = (key: SortKey) => {
    setSortConfig(current => {
      if (current.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  // Lógica combinada: Filtrado + Ordenamiento
  const processedLeads = useMemo(() => {
    // 1. Filtrar
    let result = mockLeads.filter(lead => {
      if (filters.cliente && !lead.cliente.toLowerCase().includes(filters.cliente.toLowerCase())) return false;
      if (filters.campana && !lead.campana.toLowerCase().includes(filters.campana.toLowerCase())) return false;
      if (filters.fecha) {
        const [year, month, day] = filters.fecha.split('-');
        const formattedInputDate = `${day}/${month}/${year}`;
        if (lead.fechaEnvio !== formattedInputDate) return false;
      }
      return true;
    });

    // 2. Ordenar
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        // Lógica especial para fechas (DD/MM/YYYY)
        if (sortConfig.key === 'fechaEnvio') {
          const [dayA, monthA, yearA] = aValue.split('/').map(Number);
          const [dayB, monthB, yearB] = bValue.split('/').map(Number);
          const dateA = new Date(yearA, monthA - 1, dayA).getTime();
          const dateB = new Date(yearB, monthB - 1, dayB).getTime();
          
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }

        // Lógica estándar para strings
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [filters, sortConfig]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]"
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
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {/* Cabecera CLIENTE Sortable */}
                  <th 
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                    onClick={() => handleSort('cliente')}
                  >
                    <div className="flex items-center">
                      Cliente
                      <SortIcon active={sortConfig.key === 'cliente'} direction={sortConfig.direction} />
                    </div>
                  </th>

                  {/* Cabecera CAMPAÑA Sortable */}
                  <th 
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                    onClick={() => handleSort('campana')}
                  >
                    <div className="flex items-center">
                      Nombre Campaña
                      <SortIcon active={sortConfig.key === 'campana'} direction={sortConfig.direction} />
                    </div>
                  </th>

                  {/* Cabecera FECHA Sortable */}
                  <th 
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                    onClick={() => handleSort('fechaEnvio')}
                  >
                    <div className="flex items-center">
                      Fecha Envío
                      <SortIcon active={sortConfig.key === 'fechaEnvio'} direction={sortConfig.direction} />
                    </div>
                  </th>

                  {/* Cabecera ACCIÓN (No sortable) */}
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processedLeads.length > 0 ? (
                  processedLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.cliente}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.campana}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.fechaEnvio}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        <div className="flex items-center justify-center space-x-3">
                          <button 
                            // ACCIÓN: Navegar a registrar venta por lead al hacer click en el lápiz
                            onClick={() => navigate('/registrar-venta-lead')}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-1" 
                            title="Atender"
                          >
                            <EditIcon />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800 transition-colors p-1" title="Ver Detalle">
                            <ViewIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm italic">
                      No se encontraron leads con esos filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Espaciador inferior */}
        <div className="h-4 bg-gray-50 border-t border-gray-100"></div> 
      </div>
    </div>
  );
}