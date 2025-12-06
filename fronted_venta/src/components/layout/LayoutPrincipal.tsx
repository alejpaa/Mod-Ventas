// src/components/LayoutPrincipal.tsx

import { Outlet, NavLink } from 'react-router-dom';
import { useRole } from '../../contexts/RoleContext';
import { Header } from '../Header';
import { QuoteIcon, UsersIcon, UserIcon, ShoppingCartIcon, LogOutIcon, BoxIcon } from '../Icons';
import { useState } from 'react';

export function LayoutPrincipal() {
  const { role, logout } = useRole();
  const normalizedRole = role ? role.toLowerCase() : '';
  const [isCollapsed, setIsCollapsed] = useState(false);

  const adminNav = [
    { to: '/dashboard', label: 'Dashboard', icon: BoxIcon },
    { to: '/pagina-vendedor', label: 'Vendedor', icon: UserIcon },
    { to: '/pagina-combos', label: 'Combos', icon: BoxIcon },
    { to: '/admin/cupones', label: 'Gestión Cupones', icon: BoxIcon },
  ];

  const vendedorNav = [
    { to: '/', label: 'Venta', icon: ShoppingCartIcon },
    { to: '/pagina-cotizacion', label: 'Cotización', icon: QuoteIcon },
    { to: '/pagina-cliente', label: 'Clientes', icon: UsersIcon },
  ];

  const defaultNav = [{ to: '/', label: 'Venta', icon: ShoppingCartIcon }];

  const nav =
    normalizedRole === 'administrador'
      ? adminNav
      : normalizedRole === 'vendedor'
        ? vendedorNav
        : defaultNav;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside
        className={`${
          isCollapsed ? 'w-20' : 'w-64'
        } bg-primary-600 text-white flex flex-col shadow-xl transition-all duration-300`}
      >
        {/* Logo Section with Toggle */}
        <div className="p-4 border-b border-primary-500">
          {isCollapsed ? (
            /* Collapsed State - Only Icon and Toggle */
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <BoxIcon size={24} color="#3c83f6" />
              </div>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 hover:bg-primary-500 rounded-lg transition-all duration-200"
                title="Expandir menú"
              >
                <svg
                  className="w-5 h-5 rotate-180 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
          ) : (
            /* Expanded State - Logo, Text and Toggle */
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0">
                  <BoxIcon size={24} color="#3c83f6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-base font-bold truncate">MÓDULO</h1>
                  <p className="text-sm font-medium text-primary-100">Ventas</p>
                </div>
              </div>

              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="shrink-0 p-2 hover:bg-primary-500 rounded-lg transition-all duration-200"
                title="Compactar menú"
              >
                <svg
                  className="w-5 h-5 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'text-primary-100 hover:bg-primary-500 hover:text-white'
                      }`
                    }
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon size={20} />
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
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
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} hover:bg-white/10 hover:text-red-100 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg`}
            title={isCollapsed ? 'Cerrar Sesión' : undefined}
          >
            <LogOutIcon size={20} />
            {!isCollapsed && <span>Cerrar Sesión</span>}
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
