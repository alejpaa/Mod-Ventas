import { useState, useEffect } from 'react';
import { Search, Package, CheckSquare, Square, Tag, AlertCircle } from 'lucide-react';
import type { ProductoDTO, TipoProducto } from '../modules/producto/types/product.types';

interface ProductoSeleccionable extends ProductoDTO {
  seleccionado: boolean;
}

const API_BASE_URL = 'http://localhost:8080/api/productos';

export function PaginaCombos() {
  const [comboName, setComboName] = useState('');
  const [productosDisponibles, setProductosDisponibles] = useState<ProductoSeleccionable[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TipoProducto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProductosDisponibles();
  }, []);

  const fetchProductosDisponibles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/disponibles`);
      if (!response.ok) throw new Error('Error al cargar productos');
      const data: ProductoDTO[] = await response.json();

      const productosValidos = data.map(p => ({
        ...p,
        seleccionado: false,
        precioBase: p.precioBase ?? 0,
        precioFinal: p.precioFinal ?? 0
      }));

      setProductosDisponibles(productosValidos);

      const sinPrecio = productosValidos.filter(p => p.precioBase === 0);
      if (sinPrecio.length > 0) {
        console.warn('⚠️ Productos sin precio detectados:', sinPrecio.map(p => p.nombre));
      }
    } catch (error) {
      setError('No se pudieron cargar los productos disponibles');
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
      setProductosDisponibles(prev => prev.map(p => ({ ...p, seleccionado: false })));
      fetchProductosDisponibles(); // Recargar lista
    } catch (error) {
      setError('Error al crear el combo. Intente nuevamente.');
      console.error('Error al crear combo:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = productosDisponibles.filter(p => {
    const idString = String(p.id);
    const codigoString = p.codigo || '';
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      codigoString.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? p.tipo === selectedCategory : true;
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
    <div className="bg-white min-h-screen">
      <div className="h-full flex">
        {/* Panel Izquierdo - Configuración */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 p-6 flex flex-col">
          {/* Nombre del Combo */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Tag size={16} />
              NOMBRE DEL COMBO
            </label>
            <input
              type="text"
              value={comboName}
              onChange={(e) => setComboName(e.target.value)}
              placeholder="Ej: Súper Pack Hogar y Móvil"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Búsqueda */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
              Buscar Producto
            </label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ID o Nombre..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filtro por Tipo */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
              Tipo de Producto
            </label>
            <div className="space-y-2">
              {[
                { value: null, label: 'Todos', badge: '' },
                { value: 'EQUIPO_MOVIL', label: 'Equipo Móvil', badge: '15%' },
                { value: 'SERVICIO_HOGAR', label: 'Servicio Hogar', badge: '10%' },
                { value: 'SERVICIO_MOVIL', label: 'Servicio Móvil', badge: '10%' }
              ].map(({ value, label, badge }) => (
                <button
                  key={label}
                  onClick={() => setSelectedCategory(value as TipoProducto | null)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all ${selectedCategory === value
                      ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {selectedCategory === value ? <CheckSquare size={16} /> : <Square size={16} />}
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  {badge && (
                    <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold">
                      {badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Resumen de Productos Seleccionados */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Package size={16} className="text-blue-600" />
                <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide">
                  Productos Seleccionados
                </h3>
              </div>

              {productosSeleccionados.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Ningún producto seleccionado</p>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Productos:</span>
                    <span className="font-bold">{productosSeleccionados.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precio Base:</span>
                    <span className="font-semibold">S/ {precioTotalBase.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span className="font-medium">Con Descuento:</span>
                    <span className="font-bold">S/ {precioTotalConDescuento.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-orange-600 pt-2 border-t border-blue-200">
                    <span className="font-medium">Ahorro Total:</span>
                    <span className="font-bold">S/ {ahorroTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botón de Acción */}
          <div className="mt-4">
            <button
              onClick={handleCrearCombo}
              disabled={productosSeleccionados.length === 0 || !comboName.trim() || isSaving}
              className={`w-full py-3 rounded-md font-semibold transition-all ${productosSeleccionados.length === 0 || !comboName.trim() || isSaving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                }`}
            >
              {isSaving ? 'Creando...' : '+ Crear Combo'}
            </button>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 mt-0.5" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Panel Derecho - Lista de Productos */}
        <div className="flex-1 flex flex-col">
          {/* Header con contador */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Productos Disponibles</h2>
              <span className="text-sm text-gray-500">{filteredProducts.length} productos</span>
            </div>
          </div>

          {/* Grid de Productos */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {!isLoading && error && (
              <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="text-red-500" size={24} />
                  <h3 className="font-bold text-red-900">Error al cargar productos</h3>
                </div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {!isLoading && !error && filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No se encontraron productos</p>
              </div>
            )}

            {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((producto) => {
                  const descuento = producto.tipo === 'EQUIPO_MOVIL' ? 0.15 : 0.10;
                  const precioConDescuento = Number(producto.precioBase) * (1 - descuento);

                  return (
                    <div
                      key={producto.id}
                      onClick={() => handleToggleProduct(producto.id)}
                      className={`relative bg-white rounded-lg border-2 p-4 cursor-pointer transition-all ${producto.seleccionado
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                    >
                      {/* Checkbox y Badge de Descuento */}
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-1 rounded ${producto.seleccionado ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                          {producto.seleccionado ? <CheckSquare size={20} /> : <Square size={20} />}
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${producto.tipo === 'EQUIPO_MOVIL' ? 'bg-indigo-500' : 'bg-emerald-500'
                            } text-white`}>
                            {producto.tipo === 'EQUIPO_MOVIL' ? 'Equipo' : 'Servicio'}
                          </span>
                          <span className="text-xs font-bold px-2 py-1 rounded bg-orange-500 text-white">
                            -{(descuento * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      {/* Icono del producto */}
                      <div className="aspect-[4/3] w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                        <Package size={48} className="text-gray-400" />
                      </div>

                      {/* Info del producto */}
                      <div>
                        <p className="text-xs font-mono text-gray-400 uppercase mb-1">{producto.codigo || producto.id}</p>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{producto.nombre}</h3>

                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Precio:</span>
                            <span className="text-gray-700 line-through">S/ {Number(producto.precioBase).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-bold">
                            <span className="text-green-600">En combo:</span>
                            <span className="text-green-600">S/ {precioConDescuento.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm pt-1 border-t border-gray-200 mt-1">
                            <span className="text-gray-500">Stock:</span>
                            <span className={`font-semibold ${(producto.stock ?? 0) > 0 ? 'text-blue-600' : 'text-red-500'}`}>
                              {producto.stock ?? 0} unidades
                            </span>
                          </div>
                        </div>
                      </div>

                      {producto.seleccionado && (
                        <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
