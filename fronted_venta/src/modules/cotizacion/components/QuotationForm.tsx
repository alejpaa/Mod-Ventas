import { ShoppingCartIcon, UsersIcon } from '../../../components/Icons';
import type { QuotationItem } from '../types/quotation.types';
import { mockProducts } from '../hooks/useQuotation';

interface QuotationFormProps {
  newClientName: string;
  onClientNameChange: (name: string) => void;
  newItems: QuotationItem[];
  selectedProduct: string;
  onSelectedProductChange: (productId: string) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  totals: { subtotal: number; tax: number; total: number };
  onSave: () => void;
  onCancel: () => void;
}

export function QuotationForm({
  newClientName,
  onClientNameChange,
  newItems,
  selectedProduct,
  onSelectedProductChange,
  onAddItem,
  onRemoveItem,
  onUpdateQuantity,
  totals,
  onSave,
  onCancel,
}: QuotationFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Nueva Cotización</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 font-medium">
          Cancelar
        </button>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Client & Items */}
        <div className="lg:col-span-2 space-y-8">
          {/* Client Selection */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <UsersIcon size={20} className="text-primary-500" />
              Información del Cliente
            </h3>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar o Crear Cliente
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Nombre del cliente..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  value={newClientName}
                  onChange={(e) => onClientNameChange(e.target.value)}
                />
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium">
                  Buscar
                </button>
              </div>
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
                value={selectedProduct}
                onChange={(e) => onSelectedProductChange(e.target.value)}
              >
                <option value="">Seleccionar producto o servicio...</option>
                {mockProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - S/ {p.price}
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
                  {newItems.length > 0 ? (
                    newItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-gray-800">{item.description}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                            value={item.quantity}
                            onChange={(e) =>
                              onUpdateQuantity(item.id, parseInt(e.target.value) || 1)
                            }
                          />
                        </td>
                        <td className="px-4 py-3 text-gray-600">S/ {item.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          S/ {item.total.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-red-400 hover:text-red-600"
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
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-bold shadow-lg transition-all"
              >
                Guardar Cotización
              </button>
              <button
                onClick={onCancel}
                className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
