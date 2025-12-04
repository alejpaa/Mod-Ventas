import { BellIcon, CalendarIcon } from './Icons';
import { UserAvatar } from './UserAvatar';
import { useRole } from '../contexts/RoleContext';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { role } = useRole();

  // Capitalize role for display
  const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Usuario';

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
      <div className="flex-1">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">Administra tus casos asignados</p>
      </div>

      <div className="flex items-center gap-6">
        {/* Calendar Icon */}
        <button
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          aria-label="Calendario"
        >
          <CalendarIcon size={20} color="#6b7280" />
        </button>

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
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Agente</p>
            <p className="text-xs text-gray-500">{displayRole}</p>
          </div>
          <UserAvatar name="Agente" />
        </div>
      </div>
    </header>
  );
}
