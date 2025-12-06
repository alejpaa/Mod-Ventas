// fronted_venta/src/modules/producto/pages/PaginaGestionProductos.tsx

import React, { useState, useEffect } from 'react';
import type { ProductoDTO, ComboRequest } from '../types/product.types';
import ProductoService from '../services/producto.service';


// Interfaz que extiende ProductoDTO para agregar el estado local de selección
interface ProductoSeleccionable extends ProductoDTO {
  seleccionado: boolean;
}

// Función auxiliar para restar precios con precisión (debe estar fuera del componente)
const subtractPrices = (base: number, final: number): number => {
    return (Math.round(base * 100) - Math.round(final * 100)) / 100;
};


export const PaginaGestionProductos: React.FC = () => {
  const [productosDisponibles, setProductosDisponibles] = useState<ProductoSeleccionable[]>([]);
  const [listaCombos, setListaCombos] = useState<ProductoDTO[]>([]);
  const [comboName, setComboName] = useState('');
  const [detalleCombo, setDetalleCombo] = useState<ProductoDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductosDisponibles = async () => {
    try {
      setLoading(true);
      const response = await ProductoService.obtenerProductosDisponiblesAdmin();
      setProductosDisponibles(response.map(p => ({ ...p, seleccionado: false })));
      setError(null);
    } catch (error) {
      console.error('Error al obtener productos disponibles:', error);
      setError('Error al cargar productos disponibles');
    } finally {
      setLoading(false);
    }
  };

  const fetchListaCombos = async () => {
    try {
      const response = await ProductoService.obtenerListaCombos();
      setListaCombos(response);
    } catch (error) {
      console.error('Error al obtener la lista de combos:', error);
    }
  };

  useEffect(() => {
    fetchProductosDisponibles();
    fetchListaCombos();
  }, []);

  const handleToggleProduct = (id: number) => {
    setProductosDisponibles(prev =>
      prev.map(p => (p.id === id ? { ...p, seleccionado: !p.seleccionado } : p))
    );
  };

  const handleCrearCombo = async () => {
    const productosSeleccionadosIds = productosDisponibles
      .filter(p => p.seleccionado)
      .map(p => p.id);

    if (productosSeleccionadosIds.length === 0 || !comboName) {
      alert('Debe seleccionar al menos un producto y asignar un nombre al combo.');
      return;
    }

    const request: ComboRequest = {
      nombre: comboName,
      productosIds: productosSeleccionadosIds,
    };

    try {
      await ProductoService.crearCombo(request);
      alert('Combo creado exitosamente.');
      setComboName('');
      setDetalleCombo(null);
      fetchProductosDisponibles(); 
      fetchListaCombos();
    } catch (error) {
      console.error('Error al crear combo:', error);
      alert('Error al crear combo.');
    }
  };

  const handleVerDetalleCombo = async (id: number) => {
    try {
      const combo = await ProductoService.obtenerDetalleCombo(id);
      setDetalleCombo(combo);
    } catch (error) {
      console.error('Error al obtener detalle del combo:', error);
      alert('Error al cargar el detalle del combo');
    }
  };

  return (
    
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Administración de Combos y Productos</h1>
        
        {/* Mensaje de Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Indicador de Carga */}
        {loading && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
            Cargando productos...
          </div>
        )}
        
        {/* Sección de Creación de Combos */}
        <div className="mb-8 p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Creación de Combos</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre del Combo</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={comboName}
              onChange={(e) => setComboName(e.target.value)}
              placeholder="Ej: Súper Pack Hogar y Móvil"
            />
          </div>
          
          <h3 className="text-xl font-medium mb-3">Productos Disponibles</h3>
          <p className="text-sm text-gray-600 mb-4">Seleccione los productos para el combo. Se aplicarán descuentos del 15% a equipos móviles y 10% a servicios.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-64 overflow-y-auto border p-3 rounded-md">
            {productosDisponibles.map(producto => (
              <div
                key={producto.id}
                className={`p-3 border rounded-lg cursor-pointer transition duration-150 ${
                  producto.seleccionado ? 'bg-indigo-100 border-indigo-500 shadow-md' : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => handleToggleProduct(producto.id)}
              >
                <p className="font-semibold">{producto.nombre}</p>
                <p className="text-sm text-gray-600">Tipo: **{producto.tipo}**</p>
                <p className="text-sm text-gray-600">Precio Base: **${producto.precioBase.toFixed(2)}**</p>
                {/* Usando producto.tipo directamente */}
                {producto.tipo !== 'EQUIPO_MOVIL' && (
                  <p className="text-xs italic text-red-500">Mínimo 6 meses, costo mensual</p>
                )}
                {producto.seleccionado && (
                  <span className="text-xs text-green-600 font-bold mt-1 block">SELECCIONADO</span>
                )}
              </div>
            ))}
          </div>
          
          <button
            onClick={handleCrearCombo}
            className="mt-6 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
          >
            Crear Combo
          </button>
        </div>

        {/* Sección de Lista de Combos Creados */}
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Combos Creados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listaCombos.map(combo => (
              <div
                key={combo.id}
                className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition duration-150 ${detalleCombo?.id === combo.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => handleVerDetalleCombo(combo.id)}
              >
                <p className="text-lg font-bold text-indigo-700">{combo.nombre}</p>
                <p className="text-sm text-gray-600">Precio Total Base: **${combo.precioBase.toFixed(2)}**</p>
                <p className="text-sm text-green-600 font-bold">Precio Total Final: **${combo.precioFinal.toFixed(2)}**</p>
                <p className="text-sm text-red-500">Descuento Total: **${combo.descuentoTotal?.toFixed(2) || '0.00'}**</p>
                <p className="text-xs mt-2 text-blue-500">Click para ver detalle</p>
              </div>
            ))}
          </div>

          {detalleCombo && (
            <div className="mt-6 p-4 border-t border-gray-200">
              <h3 className="text-xl font-bold mb-3">Detalle del Combo: {detalleCombo.nombre}</h3>
              <p className="mb-3">Descuento Total Aplicado: **${detalleCombo.descuentoTotal?.toFixed(2) || '0.00'}**</p>
              <ul className="list-disc list-inside space-y-2">
                {detalleCombo.componentes?.map((item: ProductoDTO) => (
                  <li key={item.id} className="p-2 border-l-4 border-green-500 bg-green-50 rounded-r-md">
                    <p className="font-medium">{item.nombre} (Tipo: {item.tipo})</p>
                    <p className="text-sm">Precio Base: **${item.precioBase.toFixed(2)}**</p>
                    <p className="text-sm font-semibold text-green-700">Precio con Descuento: **${item.precioFinal.toFixed(2)}**</p>
                    {item.precioBase > item.precioFinal && (
                        <p className="text-xs text-red-600">Ahorro: **${subtractPrices(item.precioBase, item.precioFinal).toFixed(2)}**</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    
  );
};