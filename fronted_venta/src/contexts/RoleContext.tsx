/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// Definimos los únicos roles permitidos
type Role = 'administrador' | 'vendedor' | null;

interface RoleContextValue {
  role: Role;
  setRole: (r: Role) => void;
  logout: () => void;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

// Para proporcionar el contexto de rol a todos los que engloba
export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>(() => {
    try {
      const stored = localStorage.getItem('role');
      if (stored === 'administrador' || stored === 'vendedor') return stored;
    } catch {
      // localStorage puede fallar en entornos especiales; ignoramos
    }
    return null;
  });

  useEffect(() => {
    try {
      if (role) {
        localStorage.setItem('role', role);
      } else {
        localStorage.removeItem('role');
      }
    } catch {
      // ignore
    }
  }, [role]);

  const logout = () => setRole(null);

  return <RoleContext.Provider value={{ role, setRole, logout }}>{children}</RoleContext.Provider>;
};

export const useRole = () => {
  const contexto = useContext(RoleContext);
  if (!contexto) throw new Error('El useRole debe usarse dentro de un RoleProvider');
  return contexto;
};

// Re-export Role type for external use
export type { Role };

export default RoleContext;
