import { BoxIcon, QuoteIcon, UsersIcon } from '../../../components/Icons';
import type { Quotation } from '../types/quotation.types';
import { QuotationStatus } from '../types/quotation.types';

interface QuotationListProps {
  quotations: Quotation[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onFilterChange: (status: string) => void;
  onGeneratePDF: (id: string) => void;
  onSendEmail: (id: string) => void;
  onAccept: (id: string) => void;
  onConvertToSale: (id: string) => void;
}

export function QuotationList({
  quotations,
  searchTerm,
  onSearchChange,
  statusFilter,
  onFilterChange,
  onGeneratePDF,
  onSendEmail,
  onAccept,
  onConvertToSale,
}: QuotationListProps) {
  const getStatusColor = (status: QuotationStatus) => {
    switch (status) {
      case QuotationStatus.Draft:
        return 'bg-gray-100 text-gray-800';
      case QuotationStatus.Sent:
        return 'bg-blue-100 text-blue-800';
      case QuotationStatus.Accepted:
        return 'bg-green-100 text-green-800';
      case QuotationStatus.Expired:
        return 'bg-red-100 text-red-800';
      case QuotationStatus.Rejected:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Filters Bar */}
      <div className="p-6 border-b border-gray-200 flex flex-wrap gap-4 justify-between items-center bg-gray-50/50">
        <div className="flex gap-4 flex-1">
          <input
            type="text"
            placeholder="Buscar por cliente o N° cotización..."
            className="px-4 py-2 border border-gray-300 rounded-lg w-full max-w-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            value={statusFilter}
            onChange={(e) => onFilterChange(e.target.value)}
          >
            <option value="ALL">Todos los estados</option>
            {Object.values(QuotationStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium text-sm uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">N° Cotización</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {quotations.length > 0 ? (
              quotations.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{q.id}</td>
                  <td className="px-6 py-4 text-gray-700">{q.clientName}</td>
                  <td className="px-6 py-4 text-gray-500">{q.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">S/ {q.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        q.status
                      )}`}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => onGeneratePDF(q.id)}
                      className="text-gray-500 hover:text-primary-600 p-1"
                      title="Descargar PDF"
                    >
                      <BoxIcon size={18} />
                    </button>
                    <button
                      onClick={() => onSendEmail(q.id)}
                      className="text-gray-500 hover:text-primary-600 p-1"
                      title="Enviar por Correo"
                    >
                      <QuoteIcon size={18} />
                    </button>
                    {q.status !== QuotationStatus.Accepted && (
                      <button
                        onClick={() => onAccept(q.id)}
                        className="text-gray-500 hover:text-green-600 p-1"
                        title="Marcar como Aceptada"
                      >
                        <UsersIcon size={18} />
                      </button>
                    )}
                    {q.status === QuotationStatus.Accepted && (
                      <button
                        onClick={() => onConvertToSale(q.id)}
                        className="text-primary-600 hover:text-primary-800 font-medium text-sm ml-2"
                      >
                        Generar Venta
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No se encontraron cotizaciones
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
