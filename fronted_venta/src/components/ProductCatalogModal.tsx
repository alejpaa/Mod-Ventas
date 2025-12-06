import React, { useState, useEffect } from 'react';
import { X, Search, ShoppingCart, Info, Filter, CheckSquare, Square, Package } from 'lucide-react';
import { ProductoService, type ProductoDisponible } from '../modules/producto/services/producto.service';
import type { ProductoDTO } from '../modules/producto/types/product.types';

export interface Product {
  id: string;
  name: string;
  price: number;
  priceOriginal?: number;
  stock?: number;
  image: string;
  category: 'Equipo' | 'Servicio' | 'Combo';
  isCombo?: boolean;
  rating?: number;
  // Campos adicionales para compatibilidad
  codigo: string;
  nombre: string;
  precio: number;
}

// Función para mapear el tipo del backend a la categoría del frontend
const mapearTipoACategoria = (tipo: string): 'Equipo' | 'Servicio' | 'Combo' => {
  if (tipo === 'EQUIPO_MOVIL') return 'Equipo';
  if (tipo === 'SERVICIO_HOGAR' || tipo === 'SERVICIO_MOVIL') return 'Servicio';
  if (tipo === 'COMBO') return 'Combo';
  return 'Equipo'; // Por defecto
};

// Función para convertir ProductoDisponible a Product
const convertirProductoDisponible = (producto: ProductoDisponible): Product => ({
  id: producto.id.toString(),
  name: producto.nombre,
  price: producto.precioBase,
  stock: producto.stock,
  image: producto.imagenUrl || '',
  category: mapearTipoACategoria(producto.tipo),
  isCombo: false,
  // Campos adicionales
  codigo: producto.codigo || producto.id.toString(),
  nombre: producto.nombre,
  precio: producto.precioBase,
});

// Función para convertir ProductoDTO (combos) a Product
const convertirComboAProduct = (combo: any): Product => ({
  id: combo.id.toString(),
  name: combo.nombre,
  price: combo.precioFinal,
  priceOriginal: combo.precioBase,
  stock: combo.stock ?? 1,
  image: combo.imagenUrl || '',
  category: 'Combo',
  isCombo: true,
  // Campos adicionales
  codigo: combo.codigo || combo.id.toString(),
  nombre: combo.nombre,
  precio: combo.precioFinal,
});

interface ProductCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

export const ProductCatalogModal: React.FC<ProductCatalogModalProps> = ({ isOpen, onClose, onAddProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para el modal de detalles del combo
  const [selectedCombo, setSelectedCombo] = useState<ProductoDTO | null>(null);
  const [loadingComboDetails, setLoadingComboDetails] = useState<boolean>(false);

  // Cargar productos cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      cargarProductos();
    }
  }, [isOpen]);

  const cargarProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Cargar productos individuales y combos en paralelo
      const [productosDisponibles, combos] = await Promise.all([
        ProductoService.obtenerProductosDisponibles(),
        ProductoService.obtenerListaCombos()
      ]);

      const productosConvertidos = productosDisponibles.map(convertirProductoDisponible);
      const combosConvertidos = combos.map(convertirComboAProduct);

      // Combinar ambos arrays
      setProducts([...productosConvertidos, ...combosConvertidos]);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('No se pudieron cargar los productos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar detalles del combo
  const handleViewComboDetails = async (comboId: string) => {
    setLoadingComboDetails(true);
    try {
      const detalles = await ProductoService.obtenerDetalleCombo(Number(comboId));
      setSelectedCombo(detalles);
    } catch (err) {
      console.error('Error al cargar detalles del combo:', err);
      alert('No se pudieron cargar los detalles del combo');
    } finally {
      setLoadingComboDetails(false);
    }
  };

  // Función para cerrar el modal de detalles
  const handleCloseComboDetails = () => {
    setSelectedCombo(null);
  };

  if (!isOpen) return null;

  // Lógica de Filtrado Actualizada
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchesPrice = p.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* Contenedor Principal: Fondo Blanco, Bordes sutiles */}
      <div className="w-full max-w-6xl h-[85vh] bg-white flex flex-col rounded-lg shadow-2xl overflow-hidden font-sans border border-gray-200">

        {/* Header del Modal */}
        <div className="h-16 bg-white flex items-center justify-between px-6 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-md">
              <Package size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Catálogo de Productos
              </h2>
              <p className="text-xs text-gray-500">Seleccione los ítems para la venta</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* SIDEBAR IZQUIERDO (Filtros) */}
          <div className="w-64 bg-gray-50 p-5 overflow-y-auto border-r border-gray-200 shrink-0 hidden md:block">

            {/* Input de Búsqueda */}
            <div className="mb-8">
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wider">
                Buscar
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

            {/* Filtro: Tipo de Producto */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo Producto</span>
                <Filter size={14} className="text-gray-400" />
              </div>
              <div className="space-y-2">
                {['Equipo', 'Servicio', 'Combo'].map((cat) => (
                  <div
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    className={`flex items-center gap-3 cursor-pointer group p-2 rounded-md transition-all ${selectedCategory === cat ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-100 border border-transparent'}`}
                  >
                    {selectedCategory === cat ? (
                      <CheckSquare size={18} className="text-blue-600" />
                    ) : (
                      <Square size={18} className="text-gray-300 group-hover:text-gray-400" />
                    )}
                    <span className={`text-sm font-medium ${selectedCategory === cat ? 'text-blue-700' : 'text-gray-600 group-hover:text-gray-900'}`}>
                      {cat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtro: Precio (Funcional) */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Precio Máximo</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">S/ {maxPrice}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                <span>S/ 0</span>
                <span>S/ 10,000+</span>
              </div>
            </div>

          </div>

          {/* CONTENIDO PRINCIPAL (Grid de Productos) */}
          <div className="flex-1 bg-gray-50/50 p-6 overflow-y-auto custom-scrollbar">

            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-gray-800 font-semibold text-lg">Resultados</h3>
              <span className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                {loading ? 'Cargando...' : `${filteredProducts.length} productos encontrados`}
              </span>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
                <button
                  onClick={cargarProductos}
                  className="ml-2 underline hover:text-red-900"
                >
                  Reintentar
                </button>
              </div>
            )}

            {/* Indicador de Carga */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Grid de Cards */}
            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-lg border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden relative"
                  >
                    {/* Badge de Categoría */}
                    <span className={`absolute top-3 left-3 z-10 text-[10px] font-bold px-2 py-1 rounded shadow-sm text-white
                    ${product.category === 'Equipo' ? 'bg-indigo-500' :
                        product.category === 'Servicio' ? 'bg-emerald-500' : 'bg-orange-500'}`}>
                      {product.category}
                    </span>


                    {/* Imagen del Producto */}
                    <div className="aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative border-b border-gray-100 flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image.startsWith('http') ? product.image : `http://localhost:8080${product.image}`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : null}
                    </div>

                    {/* Info del Producto */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono text-gray-400 uppercase">{product.id}</span>
                      </div>

                      <h3 className="text-gray-800 text-sm font-semibold leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>

                      <div className="mt-auto pt-3 border-t border-gray-50">
                        {/* Mostrar stock */}
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-gray-500">Stock:</span>
                          <span className={`font-semibold ${(product.stock ?? 0) > 0 ? 'text-blue-600' : 'text-red-500'}`}>
                            {product.stock ?? 0} unidades
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex flex-col">
                            {product.isCombo && product.priceOriginal ? (
                              <>
                                <span className="text-gray-500 text-xs line-through">
                                  S/ {product.priceOriginal.toFixed(2)}
                                </span>
                                <span className="text-green-600 font-bold text-lg">
                                  S/ {product.price.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-900 font-bold text-lg">
                                S/ {product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-2">
                          <button
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                            onClick={() => onAddProduct(product)}
                          >
                            <ShoppingCart size={14} /> <span>Añadir</span>
                          </button>
                          {product.isCombo && (
                            <button
                              className="bg-white hover:bg-gray-50 text-gray-500 border border-gray-200 p-2 rounded transition-colors"
                              title="Ver Detalles del Combo"
                              onClick={() => handleViewComboDetails(product.id)}
                            >
                              <Info size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mensaje cuando no hay productos */}
            {!loading && filteredProducts.length === 0 && !error && (
              <div className="mt-10 py-10 text-center text-gray-400">
                <p>No se encontraron productos con estos filtros.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalles del Combo */}
      {selectedCombo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl min-w-[600px] bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="h-16 bg-gradient-to-r from-orange-600 to-orange-700 flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-md">
                  <Package size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Detalles del Combo
                  </h2>
                  <p className="text-xs text-orange-100">{selectedCombo.nombre}</p>
                </div>
              </div>
              <button
                onClick={handleCloseComboDetails}
                className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {loadingComboDetails ? (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
              ) : (
                <>
                  {/* Precio Total */}
                  <div className="mb-6 p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Precio sin descuento:</p>
                        <p className="text-lg text-gray-500 line-through">S/ {selectedCombo.precioBase.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 mb-1">Precio con descuento:</p>
                        <p className="text-2xl font-bold text-green-600">S/ {selectedCombo.precioFinal.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-orange-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-orange-700">Ahorro total:</span>
                        <span className="text-xl font-bold text-orange-600">
                          S/ {(selectedCombo.precioBase - selectedCombo.precioFinal).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Lista de Productos Incluidos */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Package size={18} className="text-orange-600" />
                      Productos Incluidos
                    </h3>
                    <div className="space-y-3">
                      {selectedCombo.componentes && selectedCombo.componentes.length > 0 ? (
                        selectedCombo.componentes.map((componente, index) => {
                          const descuento = componente.tipo === 'EQUIPO_MOVIL' ? 0.15 : 0.10;
                          const precioConDescuento = componente.precioBase * (1 - descuento);

                          return (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                              <div className="flex-1">
                                <p className="font-medium text-gray-800 mb-1">{componente.nombre}</p>
                                <span className={`inline-block text-xs px-2 py-0.5 rounded ${componente.tipo === 'EQUIPO_MOVIL' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                                  }`}>
                                  {componente.tipo === 'EQUIPO_MOVIL' ? 'Equipo' : 'Servicio'}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500 line-through">S/ {componente.precioBase.toFixed(2)}</p>
                                <p className="text-sm font-semibold text-green-600">
                                  S/ {precioConDescuento.toFixed(2)}
                                  <span className="text-xs text-orange-600 ml-1">(-{(descuento * 100).toFixed(0)}%)</span>
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-gray-500 text-center py-4">No hay productos en este combo</p>
                      )}
                    </div>
                  </div>

                  {/* Botón de Añadir */}
                  <button
                    onClick={() => {
                      onAddProduct({
                        id: selectedCombo.id.toString(),
                        name: selectedCombo.nombre,
                        price: selectedCombo.precioFinal,
                        priceOriginal: selectedCombo.precioBase,
                        stock: selectedCombo.stock ?? 1,
                        image: '',
                        category: 'Combo',
                        isCombo: true,
                        codigo: '',
                        nombre: '',
                        precio: 0
                      });
                      handleCloseComboDetails();
                    }}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg"
                  >
                    <ShoppingCart size={18} />
                    Añadir Combo al Carrito
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};