import { Download, Mail, CheckCircle, ShoppingCart } from 'lucide-react';
import type { Quotation } from '../types/quotation.types';

interface QuotationListProps {
  quotations: Quotation[];
  onDownloadPdf: (id: number) => void;
  onSendEmail: (quotation: Quotation) => void;
  onOpenAcceptDialog: (quotation: Quotation) => void;
  onConvertToSale: (id: number) => void;
  onViewDetail: (id: number) => void;
  isLoading?: boolean;
  isConverting?: boolean;
}

export function QuotationList({
  quotations,
  onDownloadPdf,
  onSendEmail,
  onOpenAcceptDialog,
  onConvertToSale,
  onViewDetail,
  isLoading = false,
  isConverting = false,
}: QuotationListProps) {
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                N° Cotización
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Creación
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Expiración
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  Cargando cotizaciones...
                </td>
              </tr>
            ) : quotations.length > 0 ? (
              quotations.map((q) => (
                <tr
                  key={q.id}
                  onClick={() => onViewDetail(q.id)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">{q.numCotizacion}</td>
                  <td className="px-6 py-4 text-gray-700">{q.clienteNombre}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(q.fechaCotizacion).toLocaleDateString('es-PE')}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {q.fechaExpiracion
                      ? new Date(q.fechaExpiracion).toLocaleDateString('es-PE')
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    S/ {q.totalCotizado.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        q.estado
                      )}`}
                    >
                      {q.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="flex items-center justify-end gap-2"
                      style={{ minWidth: '320px' }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownloadPdf(q.id);
                        }}
                        className="px-3 py-1.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all font-medium text-sm inline-flex items-center gap-1.5"
                        title="Descargar PDF"
                      >
                        <Download size={16} />
                        PDF
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSendEmail(q);
                        }}
                        className="px-3 py-1.5 text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-all font-medium text-sm inline-flex items-center gap-1.5"
                        title="Enviar por Correo"
                      >
                        <Mail size={16} />
                        Enviar
                      </button>
                      {q.estado !== 'ACEPTADA' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenAcceptDialog(q);
                          }}
                          className="px-3 py-1.5 text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-all font-medium text-sm inline-flex items-center gap-1.5"
                          style={{ minWidth: '110px' }}
                          title="Marcar como Aceptada"
                        >
                          <CheckCircle size={16} />
                          Aceptar
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onConvertToSale(q.id);
                          }}
                          disabled={isConverting}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ minWidth: '110px' }}
                          title="Generar Venta"
                        >
                          <ShoppingCart size={16} />
                          {isConverting ? 'Generando...' : 'Venta'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No hay cotizaciones que mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
