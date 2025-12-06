import React, { useState, useEffect } from 'react';
import { X, Search, Package, CheckSquare, Square, Plus, Trash2, Tag } from 'lucide-react';
import type { ProductoDTO, TipoProducto } from '../modules/producto/types/product.types';

interface CreateComboModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  apiBaseUrl: string;
}

interface ProductoSeleccionable extends ProductoDTO {
  seleccionado: boolean;
}

const API_BASE_URL = 'http://localhost:8080/api/productos';

// Función para obtener imagen según el tipo de producto
const getProductImage = (producto: ProductoDTO): string => {
  // Si el producto tiene imagen propia desde el backend, úsala
  if (producto.imagenUrl) {
    // Si la URL es completa (http/https), úsala directamente
    if (producto.imagenUrl.startsWith('http')) {
      return producto.imagenUrl;
    }
    // Si es ruta relativa, asume que está en public/
    return producto.imagenUrl;
  }

  // Caso contrario, usa imagen por defecto según tipo
  switch (producto.tipo) {
    case 'EQUIPO_MOVIL':
      return 'https://via.placeholder.com/300x200/4F46E5/ffffff?text=Smartphone';
    case 'SERVICIO_HOGAR':
      return 'https://via.placeholder.com/300x200/10B981/ffffff?text=Internet+Hogar';
    case 'SERVICIO_MOVIL':
      return 'https://via.placeholder.com/300x200/10B981/ffffff?text=Plan+Movil';
    default:
      return 'https://via.placeholder.com/300x200/6B7280/ffffff?text=Producto';
  }
};

export const CreateComboModal: React.FC<CreateComboModalProps> = ({
  isOpen,
  onClose,
  onSaveSuccess
}) => {
  const [comboName, setComboName] = useState('');
  const [productosDisponibles, setProductosDisponibles] = useState<ProductoSeleccionable[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TipoProducto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos disponibles desde la base de datos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      fetchProductosDisponibles();
    }
  }, [isOpen]);

  const fetchProductosDisponibles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // GET /api/productos/disponibles - Retorna solo productos individuales (no combos)
      const response = await fetch(`${API_BASE_URL}/disponibles`);
      if (!response.ok) throw new Error('Error al cargar productos');
      const data: ProductoDTO[] = await response.json();

      // Validar que los productos tengan los campos necesarios
      const productosValidos = data.map(p => ({
        ...p,
        seleccionado: false,
        precioBase: p.precioBase ?? 0,
        precioFinal: p.precioFinal ?? 0
      }));

      setProductosDisponibles(productosValidos);

      // Advertencia en consola si hay productos sin precio
      const sinPrecio = productosValidos.filter(p => p.precioBase === 0);
      if (sinPrecio.length > 0) {
        console.warn('⚠️ Productos sin precio detectados:', sinPrecio.map(p => p.nombre));
      }
    } catch (error) {
      setError('No se pudieron cargar los productos disponibles desde la base de datos');
      console.error('Error al obtener productos disponibles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleProduct = (id: string | number) => {
    setProductosDisponibles(prev =>
      prev.map(p => (p.id === id ? { ...p, seleccionado: !p.seleccionado } : p))
    );
  };

  const handleCrearCombo = async () => {
    const productosSeleccionados = productosDisponibles.filter(p => p.seleccionado);

    if (productosSeleccionados.length === 0) {
      alert('Debe seleccionar al menos un producto para el combo.');
      return;
    }

    if (!comboName.trim()) {
      alert('Debe asignar un nombre al combo.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/combos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: comboName,
          productosIds: productosSeleccionados.map(p => p.id),
        }),
      });

      if (!response.ok) throw new Error('Error al crear el combo');

      alert('Combo creado exitosamente con descuentos aplicados.');
      setComboName('');
      setProductosDisponibles([]);
      onSaveSuccess();
      onClose();
    } catch (error) {
      setError('Error al crear el combo. Intente nuevamente.');
      console.error('Error al crear combo:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  // Filtrado de productos
  const filteredProducts = productosDisponibles.filter(p => {
    const idString = String(p.id);
    const codigoString = p.codigo || '';
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      codigoString.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? p.tipo === selectedCategory : true;
    // Solo mostrar productos individuales (no combos) - esto ya lo filtra el endpoint /disponibles
    const isNotCombo = p.tipo !== 'COMBO';

    return matchesSearch && matchesCategory && isNotCombo;
  });

  const productosSeleccionados = productosDisponibles.filter(p => p.seleccionado);

  const precioTotalBase = productosSeleccionados.reduce((sum, p) => {
    const precio = Number(p.precioBase ?? 0);
    return sum + precio;
  }, 0);

  const precioTotalConDescuento = productosSeleccionados.reduce((sum, p) => {
    const precio = Number(p.precioBase ?? 0);
    const descuento = p.tipo === 'EQUIPO_MOVIL' ? 0.15 : 0.10;
    return sum + (precio * (1 - descuento));
  }, 0);

  const ahorroTotal = precioTotalBase - precioTotalConDescuento;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-7xl h-[90vh] bg-white flex flex-col rounded-lg shadow-2xl overflow-hidden border border-gray-200">

        {/* Header */}
        <div className="h-16 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-md">
              <Package size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Crear Nuevo Combo
              </h2>
              <p className="text-xs text-blue-100">Configure productos y descuentos automáticos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* SIDEBAR IZQUIERDO - Filtros y Productos Seleccionados */}
          <div className="w-80 bg-gray-50 p-5 overflow-y-auto border-r border-gray-200 shrink-0">

            {/* Nombre del Combo */}
            <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <label className="text-xs font-bold text-gray-700 uppercase mb-2 block tracking-wider flex items-center gap-2">
                <Tag size={14} /> Nombre del Combo
              </label>
              <input
                type="text"
                placeholder="Ej: Súper Pack Hogar y Móvil"
                className="w-full bg-gray-50 text-gray-900 text-sm px-3 py-2.5 rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder-gray-400 transition-all"
                value={comboName}
                onChange={(e) => setComboName(e.target.value)}
              />
            </div>

            {/* Búsqueda */}
            <div className="mb-6">
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wider">
                Buscar Producto
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="ID o Nombre..."
                  className="w-full bg-white text-gray-900 text-sm px-3 py-2.5 rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder-gray-400 transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
              </div>
            </div>

            {/* Filtro por Tipo */}
            <div className="mb-6">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">
                Tipo de Producto
              </span>
              <div className="space-y-2">
                {(['EQUIPO_MOVIL', 'SERVICIO_HOGAR', 'SERVICIO_MOVIL'] as TipoProducto[]).map((tipo) => (
                  <div
                    key={tipo}
                    onClick={() => setSelectedCategory(selectedCategory === tipo ? null : tipo)}
                    className={`flex items-center gap-3 cursor-pointer group p-2 rounded-md transition-all ${selectedCategory === tipo ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-100 border border-transparent'}`}
                  >
                    {selectedCategory === tipo ? (
                      <CheckSquare size={18} className="text-blue-600" />
                    ) : (
                      <Square size={18} className="text-gray-300 group-hover:text-gray-400" />
                    )}
                    <span className={`text-sm font-medium ${selectedCategory === tipo ? 'text-blue-700' : 'text-gray-600 group-hover:text-gray-900'}`}>
                      {tipo === 'EQUIPO_MOVIL' ? 'Equipo Móvil (15%)' :
                        tipo === 'SERVICIO_HOGAR' ? 'Servicio Hogar (10%)' :
                          'Servicio Móvil (10%)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen de Selección */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Package size={16} className="text-blue-600" />
                Productos Seleccionados
              </h3>

              {productosSeleccionados.length === 0 ? (
                <p className="text-xs text-gray-500 italic">Ningún producto seleccionado</p>
              ) : (
                <>
                  <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                    {productosSeleccionados.map(p => (
                      <div key={p.id} className="flex items-center justify-between text-xs bg-white p-2 rounded border border-gray-200">
                        <span className="font-medium text-gray-700 truncate flex-1">{p.nombre}</span>
                        <button
                          onClick={() => handleToggleProduct(p.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-blue-200 pt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Total Base:</span>
                      <span className="font-semibold text-gray-700">S/ {precioTotalBase.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Con Descuento:</span>
                      <span className="font-bold text-green-600">S/ {precioTotalConDescuento.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Ahorro:</span>
                      <span className="font-bold text-red-500">- S/ {ahorroTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* CONTENIDO PRINCIPAL - Grid de Productos */}
          <div className="flex-1 bg-gray-50/50 p-6 overflow-y-auto">

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-gray-800 font-semibold text-lg">Productos Disponibles</h3>
              <span className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                {filteredProducts.length} productos
              </span>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Cargando productos...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((producto) => {
                  const descuento = producto.tipo === 'EQUIPO_MOVIL' ? 15 : 10;

                  return (
                    <div
                      key={producto.id}
                      onClick={() => handleToggleProduct(producto.id)}
                      className={`group bg-white rounded-lg border-2 cursor-pointer transition-all duration-200 overflow-hidden ${producto.seleccionado
                          ? 'border-blue-500 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                        }`}
                    >
                      {/* Imagen del Producto */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        <img
                          src={getProductImage(producto)}
                          alt={producto.nombre}
                          onError={(e) => {
                            // Fallback a imagen por defecto si falla la carga
                            e.currentTarget.src = 'https://via.placeholder.com/300x200/6B7280/ffffff?text=Sin+Imagen';
                          }}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Overlay con checkbox */}
                        <div className={`absolute top-3 left-3 ${producto.seleccionado ? 'bg-blue-600' : 'bg-white'} p-1.5 rounded-md shadow-md transition-colors`}>
                          {producto.seleccionado ? (
                            <CheckSquare size={18} className="text-white" />
                          ) : (
                            <Square size={18} className="text-gray-400 group-hover:text-gray-600" />
                          )}
                        </div>

                        {/* Badges en la imagen */}
                        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded shadow-md text-white ${producto.tipo === 'EQUIPO_MOVIL' ? 'bg-indigo-600' : 'bg-emerald-600'
                            }`}>
                            {producto.tipo === 'EQUIPO_MOVIL' ? 'Equipo' : 'Servicio'}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-1 rounded shadow-md bg-orange-500 text-white">
                            -{descuento}%
                          </span>
                        </div>

                        {/* Indicador de selección */}
                        {producto.seleccionado && (
                          <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-[1px]"></div>
                        )}
                      </div>

                      {/* Info del Producto */}
                      <div className={`p-4 ${producto.seleccionado ? 'bg-blue-50' : ''}`}>
                        <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem]">
                          {producto.nombre}
                        </h3>

                        <p className="text-[10px] font-mono text-gray-400 mb-3">
                          {producto.codigo || `ID: ${producto.id}`}
                        </p>

                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="text-xs text-gray-500">Precio:</span>
                            <span className="text-sm font-semibold text-gray-700">
                              S/ {(producto.precioBase ?? 0).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="text-xs text-gray-500">En combo:</span>
                            <span className="text-sm font-bold text-green-600">
                              S/ {((producto.precioBase ?? 0) * (1 - descuento / 100)).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs text-gray-500">Stock:</span>
                            <span className={`text-sm font-semibold ${(producto.stock ?? 0) > 0 ? 'text-blue-600' : 'text-red-500'}`}>
                              {producto.stock ?? 0} unidades
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {filteredProducts.length === 0 && !isLoading && (
              <div className="mt-10 py-10 text-center text-gray-400">
                <p>No se encontraron productos con estos filtros.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer con Botón de Crear */}
        <div className="h-20 bg-white border-t border-gray-200 px-6 flex items-center justify-between shrink-0">
          <div className="text-sm text-gray-600">
            {productosSeleccionados.length > 0 ? (
              <span><strong>{productosSeleccionados.length}</strong> producto(s) seleccionado(s)</span>
            ) : (
              <span>Seleccione productos para crear el combo</span>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCrearCombo}
              disabled={isSaving || productosSeleccionados.length === 0 || !comboName.trim()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>Creando...</>
              ) : (
                <>
                  <Plus size={18} />
                  Crear Combo
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
