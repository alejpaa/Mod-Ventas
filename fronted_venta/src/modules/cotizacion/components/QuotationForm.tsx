import { ShoppingCartIcon, UsersIcon } from '../../../components/Icons';
import { UserPlus } from 'lucide-react';
import type { QuotationFormData } from '../types/quotation.types';
import type { Cliente } from '../../cliente/services/clienteService';
import type { VendedorResponse } from '../../vendedor/services/vendedorService';
import type { Producto } from '../../producto/services/productoService';
import { ProductCatalogModal, type Product } from '../../../components/ProductCatalogModal';
import { SearchableSelect } from '../../../components/SearchableSelect';

interface QuotationFormProps {
  formData: QuotationFormData;
  onFormDataChange: (data: QuotationFormData) => void;
  clientes: Cliente[];
  vendedores: VendedorResponse[];
  productos: Producto[];
  selectedProduct: number | null;
  onSelectedProductChange: (productId: number | null) => void;
  onAddItem: () => void;
  onRemoveItem: (tempId: string) => void;
  onUpdateQuantity: (tempId: string, quantity: number) => void;
  totals: { subtotal: number; tax: number; total: number };
  onSave: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  error?: string | null;
  catalogModalOpen: boolean;
  onOpenCatalog: () => void;
  onCloseCatalog: () => void;
  onAddProductFromCatalog: (product: Product) => void;
  onOpenCreateClient: () => void;
}

export function QuotationForm({
  formData,
  onFormDataChange,
  clientes,
  vendedores,
  productos,
  selectedProduct,
  onSelectedProductChange,
  onAddItem,
  onRemoveItem,
  onUpdateQuantity,
  totals,
  onSave,
  onCancel,
  isSubmitting = false,
  error = null,
  catalogModalOpen,
  onOpenCatalog,
  onCloseCatalog,
  onAddProductFromCatalog,
  onOpenCreateClient,
}: QuotationFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Nueva Cotización</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 font-medium">
          Cancelar
        </button>
      </div>

      {error && (
        <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Client, Seller & Items */}
        <div className="lg:col-span-2 space-y-8">
          {/* Client Selection */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <UsersIcon size={20} className="text-primary-500" />
              Información del Cliente
            </h3>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex gap-2">
                <div className="flex-1">
                  <SearchableSelect
                    options={clientes}
                    value={formData.clienteId}
                    onChange={(value) => onFormDataChange({ ...formData, clienteId: value })}
                    getOptionLabel={(cliente) =>
                      `${cliente.nombre}${cliente.documento ? ` - ${cliente.documento}` : ''}`
                    }
                    getOptionValue={(cliente) => cliente.id}
                    label="Seleccionar Cliente"
                    placeholder="Buscar cliente..."
                    required
                  />
                </div>
                <button
                  onClick={onOpenCreateClient}
                  className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shrink-0"
                  title="Crear nuevo cliente"
                >
                  <UserPlus size={18} />
                  Nuevo
                </button>
              </div>
            </div>
          </section>

          {/* Seller Selection */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <UsersIcon size={20} className="text-primary-500" />
              Vendedor Asignado
            </h3>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <SearchableSelect
                options={vendedores}
                value={formData.vendedorId}
                onChange={(value) => onFormDataChange({ ...formData, vendedorId: value })}
                getOptionLabel={(vendedor) => `${vendedor.fullName} - ${vendedor.sellerBranchName}`}
                getOptionValue={(vendedor) => vendedor.sellerId}
                label="Seleccionar Vendedor"
                placeholder="Buscar vendedor..."
                required
              />
            </div>
          </section>

          {/* Validity Days */}
          <section>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días de Validez
              </label>
              <input
                type="number"
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                value={formData.validezDias}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    validezDias: parseInt(e.target.value) || 15,
                  })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                La cotización será válida por {formData.validezDias} días desde la fecha de creación
              </p>
            </div>
          </section>

          {/* Items Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ShoppingCartIcon size={20} className="text-primary-500" />
              Productos y Servicios
            </h3>

            {/* Add Item Form */}
            <div className="flex gap-3 mb-6">
              <select
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                value={selectedProduct || ''}
                onChange={(e) =>
                  onSelectedProductChange(e.target.value ? Number(e.target.value) : null)
                }
              >
                <option value="">Seleccionar producto o servicio...</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} - S/ {p.precio.toFixed(2)}
                  </option>
                ))}
              </select>
              <button
                onClick={onAddItem}
                disabled={!selectedProduct}
                className="bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Agregar
              </button>
              <button
                onClick={onOpenCatalog}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                title="Abrir catálogo de productos"
              >
                <ShoppingCartIcon size={18} />
                Catálogo
              </button>
            </div>

            {/* Items Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Descripción</th>
                    <th className="px-4 py-3 w-24">Cant.</th>
                    <th className="px-4 py-3 w-32">P. Unit</th>
                    <th className="px-4 py-3 w-32">Total</th>
                    <th className="px-4 py-3 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formData.items.length > 0 ? (
                    formData.items.map((item) => (
                      <tr key={item.tempId}>
                        <td className="px-4 py-3 text-gray-800">{item.productoNombre}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                            value={item.cantidad}
                            onChange={(e) =>
                              onUpdateQuantity(item.tempId, parseInt(e.target.value) || 1)
                            }
                          />
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          S/ {item.precioUnitario.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          S/ {item.subtotal.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => onRemoveItem(item.tempId)}
                            className="text-red-400 hover:text-red-600 text-xl"
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400 italic">
                        Agregue productos a la cotización
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Resumen</h3>

            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>S/ {totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>IGV (18%)</span>
                <span>S/ {totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                <span>Total</span>
                <span>S/ {totals.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={onSave}
                disabled={isSubmitting}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-bold shadow-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  'Guardar Cotización'
                )}
              </button>
              <button
                onClick={onCancel}
                disabled={isSubmitting}
                className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Catalog Modal */}
      <ProductCatalogModal
        isOpen={catalogModalOpen}
        onClose={onCloseCatalog}
        onAddProduct={onAddProductFromCatalog}
      />
    </div>
  );
}
