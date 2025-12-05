import { BellIcon } from './Icons';
import { UserAvatar } from './UserAvatar';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <span className="text-xl font-semibold text-gray-900">Frame</span>
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Q Buscar cotización, cliente, producto..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
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
