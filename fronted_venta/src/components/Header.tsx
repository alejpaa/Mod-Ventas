import { BellIcon } from './Icons';
import { UserAvatar } from './UserAvatar';
import { useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/pagina-cotizacion':
        return 'Gestión de Cotización';
      case '/pagina-cliente':
        return 'Gestión de Clientes';
      case '/':
        return 'Gestión de Ventas';
      case '/pagina-vendedor':
        return 'Gestión de Vendedores';
      case '/pagina-combos':
        return 'Gestión de Combos';
      case '/admin/cupones':
        return 'Gestión de Cupones';
      default:
        return 'Módulo de Ventas';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <span className="text-xl font-semibold text-gray-900">{getPageTitle()}</span>
      </div>

      <div className="flex items-center gap-6">
        {/* Notification Bell with Badge */}
        <button
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative"
          aria-label="Notificaciones"
        >
          <BellIcon size={20} color="#6b7280" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3">
          <UserAvatar name="Admin" />
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">Admin</p>
          </div>
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </header>
  );
}
