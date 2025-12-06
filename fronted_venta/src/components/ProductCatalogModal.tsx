import React, { useState, useEffect } from 'react';
import { X, Search, ShoppingCart, Info, Filter, CheckSquare, Square, Package } from 'lucide-react';
import { ProductoService, type ProductoDisponible } from '../modules/producto/services/producto.service';

// Tipos para el catálogo
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'Equipo' | 'Servicio' | 'Combo';
  rating?: number;
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
  price: producto.precio,
  image: '', // Sin imagen
  category: mapearTipoACategoria(producto.tipo),
});

interface ProductCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

export const ProductCatalogModal: React.FC<ProductCatalogModalProps> = ({ isOpen, onClose, onAddProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
      const productosDisponibles = await ProductoService.obtenerProductosDisponibles();
      const productosConvertidos = productosDisponibles.map(convertirProductoDisponible);
      setProducts(productosConvertidos);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('No se pudieron cargar los productos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
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
                max="500"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                <span>S/ 0</span>
                <span>S/ 500+</span>
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

                  {/* Imagen - Placeholder sin cargar imágenes externas */}
                  <div className="aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative border-b border-gray-100 flex items-center justify-center">
                    <Package size={48} className="text-gray-400" />
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
                      <div className="flex items-center justify-between mb-3">
                          <div className="flex flex-col">
                            {/* Precio anterior eliminado */}
                            <span className="text-gray-900 font-bold text-lg">
                                S/ {product.price.toFixed(2)}
                            </span>
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
                        <button className="bg-white hover:bg-gray-50 text-gray-500 border border-gray-200 p-2 rounded transition-colors" title="Ver Detalles">
                          <Info size={16} />
                        </button>
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
    </div>
  );
};