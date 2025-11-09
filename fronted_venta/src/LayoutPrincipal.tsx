// src/components/LayoutPrincipal.tsx

import { Outlet, NavLink } from 'react-router-dom';
import { useRole } from './contexts/RoleContext';

export function LayoutPrincipal() {
  const { role, logout } = useRole()

  const adminNav = [
    { to: '/pagina-cliente', label: 'Cliente' },
    { to: '/pagina-vendedor', label: 'Vendedor' },
  ]

  const vendedorNav = [
    { to: '/', label: 'Venta' },
    { to: '/pagina-cotizacion', label: 'Cotización' },
  ]

  const defaultNav = [
    { to: '/', label: 'Venta' }
  ]

  const nav = role === 'administrador' ? adminNav : role === 'vendedor' ? vendedorNav : defaultNav

  return (
    <div className="flex h-screen bg-gray-100">

      {/* 1. BARRA LATERAL (SIEMPRE FIJA)  */}
      <aside className="w-64 bg-[#3C83F6] text-white p-6 shadow-xl flex flex-col">
        <h1 className="text-2xl font-bold mb-6 text-center">Venta</h1>
            {/* Navegación */}
        <nav>
          <ul className="space-y-3">
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    isActive
                      ? 'block py-2 px-3 rounded bg-[#1F2937]' // color azul oscuro para "activo"
                      : 'block py-2 px-3 rounded hover:bg-[#2e6ee0]' // color normal/inactivo
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto">
          <button
            onClick={logout}
            className="w-full bg-red-700 hover:bg-red-700 text-white py-2 px-3 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* 2. CONTENIDO PRINCIPAL (AQUÍ VA EL OUTLET) */}
      <main className="flex-1 p-10 overflow-auto">
        <Outlet />
      </main>

    </div>
  );
}
