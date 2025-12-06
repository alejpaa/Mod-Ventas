import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { obtenerDetalleVentaLead, type VentaLeadDetalle } from '../services/ventaLead.service';
import { ProductCatalogModal } from '../components/ProductCatalogModal';
import type { Product } from '../components/ProductCatalogModal';
import SellerDisplayWidget from '../modules/vendedor/components/SellerDisplayWidget';
import { aplicarMejorDescuento } from '../services/descuento.service';
import { guardarProductosVenta, confirmarVenta, obtenerTotalesVenta } from '../services/venta-productos.service';

// --- Tipos de datos Producto ---
interface ProductoVenta {
  id: string;
  codigo: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
}

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

export function PaginaVentaLead() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ventaId = searchParams.get('ventaId');

  // Estado para datos del lead
  const [leadData, setLeadData] = useState<VentaLeadDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado productos
  const [productos, setProductos] = useState<ProductoVenta[]>([]);
  const [descuento, setDescuento] = useState(0.00);
  // Modal de catálogo
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // Vendedor
  const [sellerIdInput, setSellerIdInput] = useState<number | null>(null);
  const [vendedorAsignado, setVendedorAsignado] = useState<{ id: number, nombre: string } | null>(null);

  // Descuentos
  const [codigoCupon, setCodigoCupon] = useState('');
  const [mensajeDescuento, setMensajeDescuento] = useState<string | null>(null);
  const subtotal = productos.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
  const total = subtotal - descuento;

  // Cargar datos del lead al montar el componente
  useEffect(() => {
    const cargarDatosLead = async () => {
      if (!ventaId) {
        setError('No se proporcionó ID de venta');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await obtenerDetalleVentaLead(Number(ventaId));
        setLeadData(data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar datos del lead';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatosLead();
  }, [ventaId]);

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
  const handleAddProductFromModal = async (product: Product) => {
    const nuevoProducto: ProductoVenta = {
      id: product.id.toString(),
      codigo: product.codigo,
      nombre: product.nombre,
      precioUnitario: product.precio,
      cantidad: 1
    };

    setProductos(prev => {
      const existe = prev.find(p => p.id === nuevoProducto.id);
      if (existe) {
        return prev.map(p =>
          p.id === nuevoProducto.id
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      }
      return [...prev, nuevoProducto];
    });

    if (ventaId) {
      try {
        await guardarProductosVenta(Number(ventaId), [{
          idProducto: Number(nuevoProducto.id),
          nombreProducto: nuevoProducto.nombre,
          precioUnitario: nuevoProducto.precioUnitario,
          cantidad: nuevoProducto.cantidad
        }]);
      } catch (error) {
        console.error('Error al guardar producto:', error);
      }
    }
  };

  const handleAplicarDescuento = async () => {
    if (!ventaId) {
      alert('No hay venta activa');
      return;
    }

    if (!leadData) {
      alert('No hay cliente asignado');
      return;
    }

    try {
      const response = await aplicarMejorDescuento({
        ventaId: ventaId,
        dniCliente: leadData.dni,
        codigoCupon: codigoCupon || undefined
      });

      setMensajeDescuento(`✓ ${response.mensaje} - Descuento: S/ ${response.montoDescontado.toFixed(2)}`);
      setTimeout(() => setMensajeDescuento(null), 5000);
    } catch (error) {
      console.error('Error al aplicar descuento:', error);
      alert('Error al aplicar descuento');
    }
  };

  const handleGuardarProductos = async () => {
    if (!ventaId) return;

    try {
      // Convertir productos del estado local al formato esperado por el backend
      const productosParaGuardar = productos.map(prod => ({
        idProducto: Number(prod.codigo),
        nombreProducto: prod.nombre,
        precioUnitario: prod.precioUnitario,
        cantidad: prod.cantidad
      }));

      await guardarProductosVenta(Number(ventaId), productosParaGuardar);
      alert('Productos guardados exitosamente');

      // Recargar totales y productos desde el backend
      const totales = await obtenerTotalesVenta(Number(ventaId));
      setDescuento(totales.descuentoTotal);

      // Actualizar productos desde el backend para sincronizar IDs
      const mappedProductos: ProductoVenta[] = totales.items.map((item) => ({
        id: String(item.detalleId ?? item.itemProductoId),
        codigo: String(item.itemProductoId),
        nombre: item.nombreProducto,
        precioUnitario: item.precioUnitario,
        cantidad: item.cantidad,
      }));
      setProductos(mappedProductos);
    } catch (error) {
      console.error('Error al guardar productos:', error);
      alert('Error al guardar productos');
    }
  };

  const handleConfirmarVenta = async () => {
    if (!vendedorAsignado) {
      alert('Debe asignar un vendedor antes de confirmar la venta');
      return;
    }

    if (productos.length === 0) {
      alert('Debe agregar al menos un producto');
      return;
    }

    if (!ventaId) return;

    try {
      await confirmarVenta(Number(ventaId));
      alert('Venta confirmada exitosamente');
      navigate('/ventas');
    } catch (error) {
      console.error('Error al confirmar venta:', error);
      alert('Error al confirmar la venta');
    }
  };
  // Mostrar loading
  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen p-6 pt-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Cargando datos del lead...</p>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error || !leadData) {
    return (
      <div className="bg-gray-100 min-h-screen p-6 pt-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'No se encontraron datos del lead'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

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

          {/* 2. TARJETA CONTEXTO DEL LEAD */}
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

            {/* Notas de Llamada */}
            <div className="bg-white p-4 rounded-md border border-blue-200">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1 block">Notas de la Llamada / Acuerdos</span>
              <p className="text-gray-700 text-sm leading-relaxed">
                "{leadData.notasLlamada}"
              </p>
            </div>
          </div>

          {/* 3. TARJETA PRODUCTOS */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-lg font-bold text-gray-800">Selección de Productos</h2>
              <div className="flex gap-3">
                <button onClick={() => setIsCatalogOpen(true)} className="px-4 py-2 border border-blue-200 text-blue-600 rounded hover:bg-blue-50 text-sm font-medium flex items-center whitespace-nowrap">
                  <span className="mr-2"><PlusIcon /></span> Agregar producto
                </button>
                <button className="px-4 py-2 border border-blue-200 text-blue-600 rounded hover:bg-blue-50 text-sm font-medium flex items-center whitespace-nowrap">
                  <span className="mr-2"><CheckIcon /></span> Validar stock
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

        {/* === COLUMNA DERECHA === */}
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

            {mensajeDescuento && (
              <div className="mb-3 p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm">
                {mensajeDescuento}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={codigoCupon}
                onChange={(e) => setCodigoCupon(e.target.value)}
                placeholder="Ingresar código de cupón (opcional)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleAplicarDescuento}
                className="px-4 py-2 border border-gray-300 text-blue-600 rounded hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3">
            <button
              onClick={handleGuardarProductos}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded shadow-sm flex justify-center items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
              Guardar Productos
            </button>
            <button onClick={handleConfirmarVenta} className="w-full py-3 bg-[#3C83F6] hover:bg-blue-600 text-white font-medium rounded shadow-sm flex justify-center items-center gap-2 transition-colors">Confirmar Venta</button>
            <button onClick={() => navigate(-1)} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded shadow-sm flex justify-center items-center transition-colors">Cancelar Venta</button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3">Vendedor Asignado</h3>
            <input
              type="text"
              placeholder="Codigo de Vendedor"
              value={sellerIdInput || ''}
              onChange={(e) => setSellerIdInput(parseInt(e.target.value) || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <SellerDisplayWidget
              sellerId={sellerIdInput}
              onSellerDataLoaded={(seller) => {
                if (seller) {
                  setVendedorAsignado({ id: seller.sellerId, nombre: seller.fullName });
                } else {
                  setVendedorAsignado(null);
                }
              }}
            />
          </div>
        </div>
      </div>
      <ProductCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onAddProduct={handleAddProductFromModal}
      />
    </div>
  );
}