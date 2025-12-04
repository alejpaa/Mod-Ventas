import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PendingLeadSalesModal } from '../components/PendingLeadSalesModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
// --- Tipos para Ventas ---
type EstadoVenta = 'Aprobada' | 'Cancelada' | 'En Borrador';

interface VentaListadoApi {
  id: number;
  numVenta: string | null;
  origenVenta: 'DIRECTA' | 'LEAD' | 'COTIZACION';
  estado: 'BORRADOR' | 'CONFIRMADA' | 'CANCELADA';
  fechaVentaCreada: string | null;
  nombreCliente: string | null;
}

interface Venta {
  ventaId: number;   // id numérico de la BD
  id: string;        // código visible (numVenta)
  cliente: string;
  estado: EstadoVenta;
  origen: string;
  fecha: string;
}

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

// --- COMPONENTE PRINCIPAL ---
export function PaginaVenta() {
  const navigate = useNavigate();
  
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [filtros, setFiltros] = useState({
    cliente: '',
    estado: '',
    fecha: '',
    id: '',
    origen: ''
  });

  const [showLeadsModal, setShowLeadsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/venta`);
        if (!response.ok) {
          throw new Error('No se pudo obtener la lista de ventas');
        }
        const data: VentaListadoApi[] = await response.json();

        const mapped: Venta[] = data.map(v => {
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
      } catch (err) {
        console.error(err);
        setError('Ocurrió un error al cargar las ventas.');
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);

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
    alert('Ocurrió un error al crear la orden de venta.');
  } finally {
    setCreating(false);
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
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
      return true;
    });
  }, [filtros, ventas]);

  const handleEditarVenta = (venta: Venta) => {
    if (venta.estado !== 'En Borrador') return;
    navigate(`/registrar-venta?ventaId=${venta.ventaId}`);
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
                // Usamos h-10 y px-4 py-2 para igualar dimensiones
                className="h-10 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm font-medium shadow-sm whitespace-nowrap cursor-pointer flex items-center justify-center"
              >
                Ventas por Leads
              </button>

              {/* Botón Azul */}
              <button 
                onClick={handleCrearOrdenVenta}
                // Usamos h-10 y px-4 py-2 para igualar dimensiones
                className="h-10 px-4 py-2 bg-[#3C83F6] text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm whitespace-nowrap cursor-pointer flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origen</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de venta</th>
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
                      <button className="text-gray-600 hover:text-gray-800 transition-colors p-1" title="Visualizar"><ViewIcon /></button>
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

      {showLeadsModal && <PendingLeadSalesModal onClose={() => setShowLeadsModal(false)} />}

    </div>
  );
}