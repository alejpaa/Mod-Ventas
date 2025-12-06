import { X, CheckCircle } from 'lucide-react';

interface AcceptQuotationDialogProps {
  isOpen: boolean;
  quotationNumber: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AcceptQuotationDialog({
  isOpen,
  quotationNumber,
  onConfirm,
  onCancel,
  isLoading = false,
}: AcceptQuotationDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm"
      style={{ zIndex: 9999, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl shadow-2xl overflow-hidden"
        style={{ width: '500px', maxWidth: '90vw' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#3C83F6] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-white" size={24} />
            <h3 className="text-xl font-bold text-white">Aceptar Cotización</h3>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-2">
            ¿Está seguro de marcar la cotización{' '}
            <span className="font-bold text-gray-900">{quotationNumber}</span> como{' '}
            <span className="font-bold text-blue-600">ACEPTADA</span>?
          </p>
          <p className="text-sm text-gray-500">
            Esta acción cambiará el estado de la cotización y permitirá generar una venta a partir
            de ella.
          </p>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Aceptando...
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                Aceptar Cotización
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
