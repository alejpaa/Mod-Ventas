import { useState } from 'react';
import { Mail, X, Send } from 'lucide-react';

interface EmailDialogProps {
  isOpen: boolean;
  quotationNumber: string;
  onClose: () => void;
  onSend: (email: string) => void;
  isLoading?: boolean;
}

export function EmailDialog({
  isOpen,
  quotationNumber,
  onClose,
  onSend,
  isLoading = false,
}: EmailDialogProps) {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (email.trim()) {
      onSend(email);
      setEmail('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && email.trim() && !isLoading) {
      handleSend();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl"
        style={{ width: '100%', maxWidth: '42rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="bg-blue-600 px-6 py-5"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="bg-white/20 p-2 rounded-lg">
              <Mail className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Enviar Cotización por Email</h3>
              <p className="text-blue-100 text-sm">Cotización: {quotationNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5">
            <h4 className="font-semibold text-blue-900 mb-2 text-sm">¿Qué se enviará?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• PDF de la cotización con todos los detalles</li>
              <li>• Información del cliente y vendedor</li>
              <li>• Detalle de productos y precios</li>
              <li>• Enlace para aceptar la cotización</li>
            </ul>
          </div>

          {/* Email Input */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Correo Electrónico del Destinatario
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                className="text-gray-400"
                size={18}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
              <input
                type="email"
                className="w-full border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                style={{
                  paddingLeft: '2.75rem',
                  paddingRight: '1rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                }}
                placeholder="cliente@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                autoFocus
              />
            </div>
            {email && !email.includes('@') && (
              <p className="text-red-500 text-sm mt-2">
                Por favor ingrese un correo electrónico válido
              </p>
            )}
          </div>

          {/* Actions */}
          <div
            className="border-t border-gray-200 pt-4"
            style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}
          >
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSend}
              disabled={!email.trim() || !email.includes('@') || isLoading}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium disabled:opacity-50 shadow-lg"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin"
                    style={{ width: '1.25rem', height: '1.25rem' }}
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
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Enviar Cotización
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
