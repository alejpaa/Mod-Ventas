// fronted_venta/src/modules/producto/pages/PaginaCatalogoVendedor.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { TipoProducto, ProductoDTO } from '../types/product.types';


const API_BASE_URL = 'http://localhost:8080/api/productos'; // Asumiendo el puerto de Spring Boot

export const PaginaCatalogoVendedor: React.FC = () => {
  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [filtro, setFiltro] = useState<TipoProducto | 'TODOS'>('TODOS');
  
  // Nota: Esto es solo un placeholder, deberías usar imágenes reales en producción
  const getImageUrl = (tipo: TipoProducto): string => {
    switch (tipo) {
      case 'EQUIPO_MOVIL': return 'https://via.placeholder.com/150?text=Movil';
      case 'SERVICIO_HOGAR': return 'https://via.placeholder.com/150?text=Hogar';
      case 'SERVICIO_MOVIL': return 'https://via.placeholder.com/150?text=Servicio+Movil';
      case 'COMBO': return 'https://via.placeholder.com/150?text=Combo';
      default: return 'https://via.placeholder.com/150?text=Producto';
    }
  };

  const fetchProductos = async (tipo: TipoProducto | 'TODOS') => {
    try {
      const params = tipo !== 'TODOS' ? { tipo } : {};
      const response = await axios.get<ProductoDTO[]>(API_BASE_URL, { params });
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener productos para el catálogo:', error);
    }
  };

  useEffect(() => {
    fetchProductos(filtro);
  }, [filtro]);

  const opcionesFiltro: { label: string, value: TipoProducto | 'TODOS' }[] = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Combos', value: 'COMBO' },
    { label: 'Equipos Móviles', value: 'EQUIPO_MOVIL' },
    { label: 'Servicios Hogar', value: 'SERVICIO_HOGAR' },
    { label: 'Servicios Móviles', value: 'SERVICIO_MOVIL' },
  ];

  return (
    
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">🛒 Catálogo de Productos y Combos</h1>

        {/* Barra de Filtros */}
        <div className="mb-6 flex space-x-4">
          <label className="text-lg font-medium text-gray-700 self-center">Filtrar por:</label>
          <select
            className="p-2 border border-gray-300 rounded-md shadow-sm"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as TipoProducto | 'TODOS')}
          >
            {opcionesFiltro.map(opcion => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
        </div>

        {/* Vista tipo E-commerce */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map(producto => (
            <div key={producto.id} className="bg-white border rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden">
              {/* Imagen Referencial */}
              <img 
                src={getImageUrl(producto.tipo)} 
                alt={producto.nombre} 
                className="w-full h-40 object-cover"
              />

              <div className="p-4">
                {/* Nombre y Tipo */}
                <h2 className="text-xl font-bold text-gray-800 mb-2">{producto.nombre}</h2>
                <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${producto.tipo === 'COMBO' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                  {producto.tipo}
                </span>

                {/* Precio */}
                <div className="my-3">
                  {producto.tipo === 'COMBO' || producto.precioBase !== producto.precioFinal ? (
                    <>
                      <p className="text-sm text-red-500 line-through">Precio Regular: **${producto.precioBase.toFixed(2)}**</p>
                      <p className="text-2xl font-extrabold text-green-600">Oferta: **${producto.precioFinal.toFixed(2)}**</p>
                      {producto.tipo === 'COMBO' && <p className="text-xs text-indigo-500">Ahorro en combo: **${producto.descuentoTotal?.toFixed(2)}**</p>}
                    </>
                  ) : (
                    <p className="text-2xl font-extrabold text-gray-800">Precio: **${producto.precioFinal.toFixed(2)}**</p>
                  )}
                  {producto.tipo.includes('SERVICIO') && (
                    <p className="text-xs italic text-gray-500">Costo mensual</p>
                  )}
                </div>

                {/* Información Adicional */}
                <p className="text-sm text-gray-600 mt-2">{producto.informacionAdicional}</p>

                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  Añadir al Carrito
                </button>
              </div>
            </div>
          ))}
          {productos.length === 0 && (
            <p className="col-span-4 text-center text-gray-500 text-lg">No se encontraron productos o combos con este filtro.</p>
          )}
        </div>
      </div>
    
  );
};