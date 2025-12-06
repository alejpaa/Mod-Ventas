import { ArrowLeft, Download, Mail, CheckCircle, ShoppingCart } from 'lucide-react';
import type { QuotationResponse } from '../types/quotation.types';

interface QuotationDetailProps {
  quotation: QuotationResponse;
  clienteNombre: string;
  vendedorNombre: string;
  fechaExpiracion: string;
  onBack: () => void;
  onDownloadPdf: (id: number) => void;
  onSendEmail: () => void;
  onAccept: () => void;
  onConvertToSale: (id: number) => void;
  isLoading?: boolean;
  isConverting?: boolean;
}

export function QuotationDetail({
  quotation,
  clienteNombre,
  vendedorNombre,
  fechaExpiracion,
  onBack,
  onDownloadPdf,
  onSendEmail,
  onAccept,
  onConvertToSale,
  isLoading = false,
  isConverting = false,
}: QuotationDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BORRADOR':
        return 'bg-gray-100 text-gray-700';
      case 'ENVIADA':
        return 'bg-blue-100 text-blue-700';
      case 'ACEPTADA':
        return 'bg-green-100 text-green-700';
      case 'RECHAZADA':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const calculateSubtotal = () => {
    return quotation.items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18; // 18% IGV
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500">Cargando detalle de cotización...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header with Actions */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 rounded-md transition-all font-medium text-sm inline-flex items-center gap-2 border border-gray-300"
        >
          <ArrowLeft size={18} />
          Volver
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onDownloadPdf(quotation.id)}
            className="px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 rounded-md transition-all font-medium text-sm inline-flex items-center gap-2 border border-gray-300"
          >
            <Download size={16} />
            PDF
          </button>
          <button
            onClick={onSendEmail}
            className="px-4 py-2 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-all font-medium text-sm inline-flex items-center gap-2 border border-blue-200"
          >
            <Mail size={16} />
            Enviar
          </button>
          {quotation.estado !== 'ACEPTADA' ? (
            <button
              onClick={onAccept}
              className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md transition-all font-medium text-sm inline-flex items-center gap-2"
            >
              <CheckCircle size={16} />
              Aceptar
            </button>
          ) : (
            <button
              onClick={() => onConvertToSale(quotation.id)}
              disabled={isConverting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all font-medium text-sm inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={16} />
              {isConverting ? 'Generando...' : 'Generar Venta'}
            </button>
          )}
        </div>
      </div>

      {/* Quotation Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{quotation.numCotizacion}</h1>
            <p className="text-sm text-gray-500 mt-1">Cotización</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              quotation.estado
            )}`}
          >
            {quotation.estado}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Cliente</p>
            <p className="text-sm font-semibold text-gray-900">{clienteNombre}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Vendedor</p>
            <p className="text-sm font-semibold text-gray-900">{vendedorNombre}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Fecha de Creación</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(quotation.fechaCotizacion).toLocaleDateString('es-PE')}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Válida Hasta</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(fechaExpiracion).toLocaleDateString('es-PE')}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">({quotation.validezDias} días)</p>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Productos</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  P. Unitario
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {quotation.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    Producto ID: {item.productoId}
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-700">{item.cantidad}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">
                    S/ {item.precioUnitario.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                    S/ {item.subtotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals Section */}
      <div className="p-6 bg-gray-50">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between w-full text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium text-gray-900">S/ {calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-full text-sm">
            <span className="text-gray-600">IGV (18%):</span>
            <span className="font-medium text-gray-900">S/ {calculateTax().toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-full text-lg font-bold border-t border-gray-300 pt-2 mt-2">
            <span className="text-gray-800">Total:</span>
            <span className="text-blue-600">S/ {quotation.totalCotizado.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
