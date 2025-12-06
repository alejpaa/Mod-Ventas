// src/components/LayoutPrincipal.tsx

import { Outlet, NavLink } from 'react-router-dom';
import { useRole } from '../../contexts/RoleContext';
import { Header } from '../Header';
import { QuoteIcon, UsersIcon, UserIcon, ShoppingCartIcon, LogOutIcon, BoxIcon } from '../Icons';

export function LayoutPrincipal() {
  const { role, logout } = useRole();
  const normalizedRole = role ? role.toLowerCase() : '';

  // Navigation configuration with icons
  const adminNav = [
    { to: '/pagina-cliente', label: 'Clientes', icon: UsersIcon },
    { to: '/pagina-vendedor', label: 'Vendedor', icon: UserIcon },
    { to: '/admin/cupones', label: 'Gestión Cupones', icon: BoxIcon },
  ];

  const vendedorNav = [
    { to: '/', label: 'Venta', icon: ShoppingCartIcon },
    { to: '/pagina-cotizacion', label: 'Cotización', icon: QuoteIcon },
    { to: '/pagina-cliente', label: 'Clientes', icon: UsersIcon },
  ];

  const defaultNav = [{ to: '/', label: 'Venta', icon: ShoppingCartIcon }];

  const nav = normalizedRole === 'administrador' ? adminNav : normalizedRole === 'vendedor' ? vendedorNav : defaultNav;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-primary-600 text-white flex flex-col shadow-xl">
        {/* Logo Section */}
        <div className="p-6 border-b border-primary-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <BoxIcon size={24} color="#3c83f6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">MODULO VENTAS</h1>
              <p className="text-xs text-primary-100">CRM</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'text-primary-100 hover:bg-primary-500 hover:text-white'
                      }`
                    }
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-primary-500">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 hover:bg-white/10 hover:text-red-100 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            <LogOutIcon size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
