import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PendingLeadSalesModal } from '../components/PendingLeadSalesModal';
import { listarVentasPaginadas, cancelarVenta, type VentaListado } from '../../../services/venta.service';
import { ModalVisualizarVenta } from '../components/ModalVisualizarVenta';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mod-ventas.onrender.com/api';

// --- Tipos para Ventas ---
type EstadoVenta = 'Aprobada' | 'Cancelada' | 'En Borrador';

interface Venta {
  ventaId: number;
  id: string;
  cliente: string;
  estado: EstadoVenta;
  origen: string;
  fecha: string;
}

type SortField = 'id' | 'cliente' | 'estado' | 'origen' | 'fecha';

// --- Componentes Auxiliares ---
const VentaStatusPill = ({ estado }: { estado: EstadoVenta }) => {
  let classes = '';
  switch (estado) {
    case 'Aprobada': classes = 'bg-green-100 text-green-800'; break;
    case 'Cancelada': classes = 'bg-red-100 text-red-800'; break;
    default: classes = 'bg-gray-100 text-gray-800';
  }
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${classes}`}>{estado}</span>;
};

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

const SortIcon = ({ active, direction }: { active: boolean; direction: 'asc' | 'desc' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
    className={`w-4 h-4 inline ml-1 ${active ? 'text-blue-600' : 'text-gray-400'}`}>
    {direction === 'asc' ? (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    )}
  </svg>
);

// --- COMPONENTE PRINCIPAL ---
export function PaginaVenta() {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  const [modalVisualizarOpen, setModalVisualizarOpen] = useState(false);
  const [selectedVentaId, setSelectedVentaId] = useState<number | undefined>(undefined);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [filtros, setFiltros] = useState({
    cliente: '',
    estado: '',
    fecha: '',
    id: '',
    origen: ''
  });

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState<SortField>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const [showLeadsModal, setShowLeadsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchVentas = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await listarVentasPaginadas(currentPage, 20, sortBy, sortDir);

      const mapped: Venta[] = data.content.map((v: VentaListado) => {
        let estado: EstadoVenta;
        switch (v.estado) {
          case 'CONFIRMADA':
            estado = 'Aprobada';
            break;
          case 'CANCELADA':
            estado = 'Cancelada';
            break;
          default:
            estado = 'En Borrador';
        }

        const fecha = v.fechaVentaCreada
          ? new Date(v.fechaVentaCreada).toLocaleDateString('es-PE')
          : '';

        return {
          ventaId: v.id,
          id: v.numVenta ?? `VENTA-${v.id}`,
          cliente: v.nombreCliente ?? 'Sin cliente',
          estado,
          origen: v.origenVenta,
          fecha,
        };
      });

      setVentas(mapped);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al cargar las ventas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, [currentPage, sortBy, sortDir]);

  const handleCrearOrdenVenta = async () => {
    try {
      setCreating(true);
      const response = await fetch(`${API_BASE_URL}/venta/directa/borrador`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuarioCreador: 'frontend' }),
      });

      if (!response.ok) {
        throw new Error('No se pudo crear la orden de venta');
      }

      const data: { ventaId: number } = await response.json();
      navigate(`/registrar-venta?ventaId=${data.ventaId}`);
    } catch (e) {
      console.error(e);
      showToast('Ocurrió un error al crear la orden de venta', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
    setCurrentPage(0); // Reset a primera página al ordenar
  };

  const filteredVentas = useMemo(() => {
    return ventas.filter(venta => {
      if (filtros.cliente && !venta.cliente.toLowerCase().includes(filtros.cliente.toLowerCase())) return false;
      if (filtros.estado && venta.estado !== filtros.estado) return false;
      if (filtros.id && !venta.id.toLowerCase().includes(filtros.id.toLowerCase())) return false;
      if (filtros.origen && !venta.origen.toLowerCase().includes(filtros.origen.toLowerCase())) return false;
      if (filtros.fecha) {
        const [year, month, day] = filtros.fecha.split('-');
        if (venta.fecha !== `${day}/${month}/${year}`) return false;
      }

      // Filtrado automático por estado:
      // Si es "En Borrador", solo mostrar ventas DIRECTA
      if (venta.estado === 'En Borrador' && venta.origen !== 'DIRECTA') {
        return false;
      }

      return true;
    });
  }, [filtros, ventas]);

  const handleEditarVenta = (venta: Venta) => {
    if (venta.estado !== 'En Borrador') return;
    navigate(`/registrar-venta?ventaId=${venta.ventaId}`);
  };

  const handleCancelarVenta = async (venta: Venta) => {
    if (window.confirm(`¿Estás seguro de que deseas cancelar la venta ${venta.id}?`)) {
      try {
        await cancelarVenta(venta.ventaId);
        fetchVentas();
      } catch (error) {
        console.error('Error al cancelar venta:', error);
        showToast('Error al cancelar la venta', 'error');
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">

      {/* --- SECCIÓN DE FILTROS --- */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">

          {/* Fila 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Cliente</label>
            <input
              type="text"
              name="cliente"
              placeholder="Buscar cliente..."
              className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={handleChange}
              value={filtros.cliente}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Estado</label>
            <select
              name="estado"
              className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={handleChange}
              value={filtros.estado}
            >
              <option value="">Todos</option>
              <option value="Aprobada">Aprobada</option>
              <option value="En Borrador">En Borrador</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Fecha de venta</label>
            <input
              type="date"
              name="fecha"
              className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={handleChange}
              value={filtros.fecha}
            />
          </div>

          {/* Fila 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">ID Venta</label>
            <input
              type="text"
              name="id"
              placeholder="ID Venta..."
              className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={handleChange}
              value={filtros.id}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Origen</label>
            <input
              type="text"
              name="origen"
              placeholder="Origen..."
              className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={handleChange}
              value={filtros.origen}
            />
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex items-end justify-end gap-3">

            {/* Botón Naranja */}
            <button
              onClick={() => setShowLeadsModal(true)}
              className="h-10 px-2 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm font-medium shadow-sm whitespace-nowrap cursor-pointer flex items-center justify-center"
            >
              Ventas por Leads
            </button>

            {/* Botón Azul */}
            <button
              onClick={handleCrearOrdenVenta}
              className="h-10 px-3 py-2 bg-[#3C83F6] text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm whitespace-nowrap cursor-pointer flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={creating}
            >
              <span className="mr-2 text-lg">+</span> Crear orden de venta
            </button>
          </div>

        </div>
      </div>

      <hr className="border-gray-200 mb-6" />

      {/* --- TABLA DE VENTAS --- */}
      <div className="overflow-x-auto border border-gray-100 rounded-lg">
        {loading && (
          <div className="p-4 text-sm text-gray-500">Cargando ventas...</div>
        )}
        {error && !loading && (
          <div className="p-4 text-sm text-red-600">{error}</div>
        )}
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort('cliente')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
              >
                Cliente
                <SortIcon active={sortBy === 'cliente'} direction={sortDir} />
              </th>
              <th
                onClick={() => handleSort('estado')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
              >
                Estado
                <SortIcon active={sortBy === 'estado'} direction={sortDir} />
              </th>
              <th
                onClick={() => handleSort('origen')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
              >
                Origen
                <SortIcon active={sortBy === 'origen'} direction={sortDir} />
              </th>
              <th
                onClick={() => handleSort('id')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
              >
                ID
                <SortIcon active={sortBy === 'id'} direction={sortDir} />
              </th>
              <th
                onClick={() => handleSort('fecha')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
              >
                Fecha de venta
                <SortIcon active={sortBy === 'fecha'} direction={sortDir} />
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredVentas.length > 0 ? (
              filteredVentas.map((venta) => (
                <tr key={venta.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{venta.cliente}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><VentaStatusPill estado={venta.estado} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">{venta.origen}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venta.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venta.fecha}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => handleEditarVenta(venta)}
                        disabled={venta.estado !== 'En Borrador'}
                        className={`p-1 transition-colors ${venta.estado === 'En Borrador'
                          ? 'text-blue-600 hover:text-blue-800 cursor-pointer'
                          : 'text-gray-300 cursor-not-allowed'}`}
                        title={venta.estado === 'En Borrador' ? 'Modificar' : 'Solo se pueden modificar borradores'}
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedVentaId(venta.ventaId);
                          setModalVisualizarOpen(true);
                        }}
                        className="text-gray-600 hover:text-gray-800 transition-colors p-1"
                        title="Visualizar"
                      >
                        <ViewIcon />
                      </button>
                      <button
                        onClick={() => handleCancelarVenta(venta)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1"
                        title="Cancelar venta"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm italic">
                  No se encontraron ventas con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- PAGINACIÓN --- */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Mostrando {currentPage * 20 + 1} - {Math.min((currentPage + 1) * 20, totalElements)} de {totalElements} ventas
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              Página {currentPage + 1} de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {showLeadsModal && <PendingLeadSalesModal onClose={() => setShowLeadsModal(false)} />}
      {/* Modal de Visualización */}
      <ModalVisualizarVenta
        isOpen={modalVisualizarOpen}
        onClose={() => setModalVisualizarOpen(false)}
        tipoVenta="DIRECTA"
        ventaId={selectedVentaId}
      />

      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}