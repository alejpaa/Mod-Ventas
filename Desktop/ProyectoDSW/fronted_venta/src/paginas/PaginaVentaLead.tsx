import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Iconos SVG ---
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
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
  </svg>
);

// --- Datos del Lead (Simulando lo que llega de Marketing) ---
const leadData = {
  idLeadMarketing: 12345,
  nombres: "Juan",
  apellidos: "Pérez López",
  correo: "juan.perez@example.com",
  telefono: "+51 987 654 321",
  dni: "00000001",
  canalOrigen: "CAMPANIA_TELEFONICA",
  idCampaniaMarketing: 1001,
  nombreCampania: "Renovación iPhone 16 VIP",
  tematica: "Oferta exclusiva por antigüedad",
  descripcion: "Cliente con más de 5 años, elegible para renovación con 50% dscto en plan Max.",
  notas_llamada: "El cliente está muy interesado en el iPhone 16 Pro Max color titanio. Mencionó que puede pagar al contado si le damos los audífonos de regalo. Quedamos en llamarlo para confirmar stock.",
  fecha_envio: "20/11/2025"
};

// --- Tipos de datos Producto ---
interface ProductoVenta {
  id: string;
  codigo: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
}

export function PaginaVentaLead() {
  const navigate = useNavigate();

  // Estado productos (Podrías precargar algo basado en la campaña del lead)
  const [productos, setProductos] = useState<ProductoVenta[]>([
    // Ejemplo: Si la campaña es iPhone 16, tal vez ya sugerimos el producto
    { id: '1', codigo: 'PROD-IP16', nombre: 'iPhone 16 Pro Max - Titanio', precioUnitario: 5200.00, cantidad: 1 },
  ]);

  const [descuento] = useState(0.00);

  const subtotal = productos.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
  const total = subtotal - descuento;

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

  return (
    <div className="bg-gray-100 min-h-screen p-6 pt-4">
      
      {/* Encabezado */}
      <div className="mb-6 flex items-center relative justify-center">
        <button 
          onClick={() => navigate(-1)}
          className="absolute left-0 flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors"
        >
          <ArrowLeftIcon />
          Regresar
        </button>
        {/* Título cambiado */}
        <h1 className="text-2xl font-bold text-gray-800">Registrar Venta por Lead</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* === COLUMNA IZQUIERDA (2/3) === */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. TARJETA CLIENTE (Datos Fijos / Solo Lectura) */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                Cliente
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-normal">Verificado</span>
              </h2>
              {/* Sin botón de registrar ni buscador */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                <span className="block text-gray-500 mb-1">Nombre Completo</span>
                <span className="block font-medium text-gray-900 text-base">{leadData.nombres} {leadData.apellidos}</span>
              </div>
              <div>
                <span className="block text-gray-500 mb-1">DNI</span>
                <span className="block font-medium text-gray-900 text-base">{leadData.dni}</span>
              </div>
              <div>
                <span className="block text-gray-500 mb-1">Teléfono</span>
                <span className="block font-medium text-gray-900 text-base">{leadData.telefono}</span>
              </div>
              <div>
                <span className="block text-gray-500 mb-1">Correo Electrónico</span>
                <span className="block font-medium text-gray-900 text-base">{leadData.correo}</span>
              </div>
            </div>
          </div>

          {/* 2. TARJETA CONTEXTO DEL LEAD (Nueva Sección) */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <InfoIcon />
              <h2 className="text-lg font-bold text-gray-800">Información de Marketing</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Campaña</span>
                <p className="text-gray-900 font-medium">{leadData.nombreCampania}</p>
                <p className="text-xs text-gray-500 mt-1">Canal: {leadData.canalOrigen}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Temática</span>
                <p className="text-gray-900">{leadData.tematica}</p>
              </div>
            </div>

            {/* Notas de Llamada (Destacado) */}
            <div className="bg-white p-4 rounded-md border border-blue-200">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1 block">Notas de la Llamada / Acuerdos</span>
              <p className="text-gray-700 text-sm leading-relaxed">
                "{leadData.notas_llamada}"
              </p>
            </div>
          </div>

          {/* 3. TARJETA PRODUCTOS (Igual a Venta Directa) */}
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
                          <button onClick={() => updateCantidad(prod.id, -1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100 border-r border-gray-300"><MinusIcon /></button>
                          <span className="px-3 py-1 font-medium text-gray-900 w-8 text-center">{prod.cantidad}</span>
                          <button onClick={() => updateCantidad(prod.id, 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100 border-l border-gray-300"><PlusIcon /></button>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-gray-900 font-medium">S/ {(prod.precioUnitario * prod.cantidad).toFixed(2)}</td>
                      <td className="py-4 px-2 text-center">
                        <button onClick={() => eliminarProducto(prod.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"><TrashIcon /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* === COLUMNA DERECHA (Igual a Venta Directa) === */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4">Resumen de la Venta</h3>
            <div className="space-y-3 text-sm border-b border-gray-200 pb-4 mb-4">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium text-gray-900">S/ {subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-red-500"><span>Descuento</span><span>- S/ {descuento.toFixed(2)}</span></div>
            </div>
            <div className="flex justify-between items-center"><span className="font-bold text-gray-900 text-lg">Total a Pagar</span><span className="font-bold text-gray-900 text-xl">S/ {total.toFixed(2)}</span></div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3">Descuentos y Cupones</h3>
            <div className="flex gap-2">
              <input type="text" placeholder="Ingresar código de cupón" className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
              <button className="px-4 py-2 border border-gray-300 text-blue-600 rounded hover:bg-gray-50 text-sm font-medium transition-colors">Aplicar</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3">
            <button className="w-full py-3 bg-[#3C83F6] hover:bg-blue-600 text-white font-medium rounded shadow-sm flex justify-center items-center gap-2 transition-colors">Confirmar Venta</button>
            <button onClick={() => navigate(-1)} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded shadow-sm flex justify-center items-center transition-colors">Cancelar Venta</button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Asignar Vendedor</label>
              <button className="text-xs bg-[#3C83F6] text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors">Buscar vendedor</button>
            </div>
            <input type="text" placeholder="Codigo de Vendedor" className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">Nombre del Vendedor: <span className="font-medium text-gray-800">Fardito Leon Chacon</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}