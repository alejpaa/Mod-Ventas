import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ConfirmCancelModal } from '../components/ConfirmCancelModal'; // <--- IMPORTAR MODAL

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
// --- Iconos SVG ---
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);
const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
  </svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

// --- Tipos de datos ---
interface ProductoVenta {
  id: string;
  codigo: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
}

interface LineaCarritoApi {
  detalleId: number;
  itemProductoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface VentaResumenApi {
  ventaId: number;
  origen: 'DIRECTA' | 'LEAD' | 'COTIZACION';
  estado: 'BORRADOR' | 'CONFIRMADA' | 'CANCELADA';
  subtotal: number;
  descuentoTotal: number;
  total: number;
  items: LineaCarritoApi[];
}

export function PaginaVentaDirecta() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ventaId = searchParams.get('ventaId');

  // Estado para controlar el modal de confirmación
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const [productos, setProductos] = useState<ProductoVenta[]>([]);
  const [subtotalApi, setSubtotalApi] = useState(0);
  const [descuentoApi, setDescuentoApi] = useState(0);
  const [totalApi, setTotalApi] = useState(0);
  
  // Estado para cliente
  const [clienteSeleccionado, setClienteSeleccionado] = useState<{
    id: number;
    nombre: string;
    dni: string;
    telefono: string;
    direccion: string;
  } | null>(null);
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [metodoPago, setMetodoPago] = useState<'EFECTIVO' | 'TARJETA'>('EFECTIVO');

  useEffect(() => {
    if (!ventaId) return;

    const fetchResumen = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/venta/${ventaId}/carrito`);
        if (!response.ok) {
          throw new Error('No se pudo cargar el resumen de la venta');
        }
        const data: VentaResumenApi = await response.json();

        const mappedProductos: ProductoVenta[] = data.items.map((item) => ({
          id: String(item.detalleId ?? item.itemProductoId),
          codigo: String(item.itemProductoId),
          nombre: item.nombreProducto,
          precioUnitario: item.precioUnitario,
          cantidad: item.cantidad,
        }));

        setProductos(mappedProductos);
        setSubtotalApi(data.subtotal);
        setDescuentoApi(data.descuentoTotal);
        setTotalApi(data.total);
      } catch (e) {
        console.error(e);
      }
    };

    fetchResumen();
  }, [ventaId]);

  // Usar valores del backend directamente
  const subtotal = subtotalApi;
  const descuento = descuentoApi;
  const total = totalApi;

  const updateCantidad = (id: string, delta: number) => {
    setProductos(prev => prev.map(prod => {
      if (prod.id === id) {
        const nuevaCantidad = Math.max(1, prod.cantidad + delta);
        return { ...prod, cantidad: nuevaCantidad };
      }
      return prod;
    }));
  };

  const eliminarProducto = (id: string) => {
    setProductos(prev => prev.filter(p => p.id !== id));
  };

  const handleAsignarCliente = () => {
    // TODO: Aquí irá la lógica de búsqueda real cuando tengas el endpoint
    // Por ahora simulamos con datos mock
    if (busquedaCliente.trim()) {
      setClienteSeleccionado({
        id: 1,
        nombre: 'Juan Pérez',
        dni: '12345678',
        telefono: '+51 987 654 321',
        direccion: 'Av. Principal 123, Lima',
      });
      setBusquedaCliente('');
    }
  };

  const handleEliminarCliente = () => {
    setClienteSeleccionado(null);
    setBusquedaCliente('');
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 pt-4">
      
      {/* Encabezado con Botón Regresar y Título Centrado */}
      <div className="mb-6 flex items-center relative justify-center">
        <button 
          onClick={() => navigate(-1)}
          className="absolute left-0 flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors"
        >
          <ArrowLeftIcon />
          Regresar
        </button>

        <h1 className="text-2xl font-bold text-gray-800">Registrar Venta Directa</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* === COLUMNA IZQUIERDA === */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tarjeta Cliente */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Cliente</h2>
              <div className="flex gap-2">
                <button className="bg-[#3C83F6] hover:bg-blue-600 text-white px-4 py-2 rounded text-sm flex items-center font-medium transition-colors">
                  <span className="mr-1 text-lg leading-none">+</span> Registrar cliente
                </button>
                {clienteSeleccionado ? (
                  <button 
                    onClick={handleEliminarCliente}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm flex items-center font-medium transition-colors"
                  >
                    Eliminar Cliente
                  </button>
                ) : (
                  <button 
                    onClick={handleAsignarCliente}
                    disabled={!busquedaCliente.trim()}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm flex items-center font-medium transition-colors"
                  >
                    Asignar Cliente
                  </button>
                )}
              </div>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input 
                type="text" 
                placeholder="Buscar por Nombre, DNI, RUC..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={busquedaCliente}
                onChange={(e) => setBusquedaCliente(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && busquedaCliente.trim() && !clienteSeleccionado) {
                    handleAsignarCliente();
                  }
                }}
              />
            </div>

            {clienteSeleccionado ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div>
                  <span className="block text-gray-500 mb-1">Nombre del Cliente</span>
                  <span className="block font-medium text-gray-900 text-base">{clienteSeleccionado.nombre}</span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-1">DNI/RUC</span>
                  <span className="block font-medium text-gray-900 text-base">{clienteSeleccionado.dni}</span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-1">Teléfono</span>
                  <span className="block font-medium text-gray-900 text-base">{clienteSeleccionado.telefono}</span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-1">Dirección</span>
                  <span className="block font-medium text-gray-900 text-base">{clienteSeleccionado.direccion}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm italic">
                No hay cliente asignado. Busque y asigne un cliente para continuar.
              </div>
            )}
          </div>

          {/* Tarjeta Productos */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-lg font-bold text-gray-800">Selección de Productos</h2>
              
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-blue-200 text-blue-600 rounded hover:bg-blue-50 text-sm font-medium flex items-center whitespace-nowrap">
                  <span className="mr-2"><PlusIcon/></span> Agregar producto
                </button>
                <button className="px-4 py-2 border border-blue-200 text-blue-600 rounded hover:bg-blue-50 text-sm font-medium flex items-center whitespace-nowrap">
                  <span className="mr-2"><CheckIcon/></span> Validar stock
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider text-xs text-left">
                    <th className="py-3 px-2 font-medium">CÓDIGO</th>
                    <th className="py-3 px-2 font-medium">PRODUCTO</th>
                    <th className="py-3 px-2 font-medium">P. UNITARIO</th>
                    <th className="py-3 px-2 font-medium text-center">CANTIDAD</th>
                    <th className="py-3 px-2 font-medium">SUBTOTAL</th>
                    <th className="py-3 px-2 font-medium text-center">ACC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {productos.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50">
                      <td className="py-4 px-2 text-gray-900 font-medium">{prod.codigo}</td>
                      <td className="py-4 px-2 text-gray-900">{prod.nombre}</td>
                      <td className="py-4 px-2 text-gray-900">S/ {prod.precioUnitario.toFixed(2)}</td>
                      <td className="py-4 px-2">
                        <div className="flex items-center justify-center border border-gray-300 rounded w-fit mx-auto bg-white">
                          <button 
                            onClick={() => updateCantidad(prod.id, -1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 border-r border-gray-300"
                          >
                            <MinusIcon />
                          </button>
                          <span className="px-3 py-1 font-medium text-gray-900 w-8 text-center">{prod.cantidad}</span>
                          <button 
                            onClick={() => updateCantidad(prod.id, 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 border-l border-gray-300"
                          >
                            <PlusIcon />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-gray-900 font-medium">
                        S/ {(prod.precioUnitario * prod.cantidad).toFixed(2)}
                      </td>
                      <td className="py-4 px-2 text-center">
                        <button 
                          onClick={() => eliminarProducto(prod.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* === COLUMNA DERECHA === */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4">Resumen de la Venta</h3>
            <div className="space-y-3 text-sm border-b border-gray-200 pb-4 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Descuento</span>
                <span>- S/ {descuento.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-gray-900 text-lg">Total a Pagar</span>
              <span className="font-bold text-gray-900 text-xl">S/ {total.toFixed(2)}</span>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value as 'EFECTIVO' | 'TARJETA')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="EFECTIVO">Efectivo</option>
                <option value="TARJETA">Tarjeta</option>
              </select>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3">Descuentos y Cupones</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ingresar código de cupón" 
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button className="px-4 py-2 border border-gray-300 text-blue-600 rounded hover:bg-gray-50 text-sm font-medium transition-colors">
                Aplicar
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3">
            <button className="w-full py-3 bg-[#3C83F6] hover:bg-blue-600 text-white font-medium rounded shadow-sm flex justify-center items-center gap-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>
              Confirmar Venta
            </button>
            
            {/* Botón Cancelar con Fondo Rojo */}
            <button 
              onClick={() => setIsCancelModalOpen(true)} // Abrir modal al hacer clic
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded shadow-sm flex justify-center items-center transition-colors"
            >
              Cancelar Venta
            </button>
          </div>

          {/* Tarjeta Vendedor Actualizada */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Asignar Vendedor</label>
              <button className="text-xs bg-[#3C83F6] text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors">
                Buscar vendedor
              </button>
            </div>
            <input 
              type="text" 
              placeholder="Codigo de Vendedor"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">Nombre del Vendedor: <span className="font-medium text-gray-800">Fardito Leon Chacon</span></p>
            </div>
          </div>

        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      <ConfirmCancelModal 
        isOpen={isCancelModalOpen} 
        onClose={() => setIsCancelModalOpen(false)} 
        onConfirm={() => navigate(-1)} // Al confirmar, regresa a la página anterior
      />

    </div>
  );
}