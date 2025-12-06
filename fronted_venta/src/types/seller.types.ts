export const SellerStatus = {
  Activo: 'Activo',
  Inactivo: 'Inactivo',
} as const
export type SellerStatus = typeof SellerStatus[keyof typeof SellerStatus]

export const SellerType = {
  Interno: 'Interno',
  Externo: 'Externo',
} as const
export type SellerType = typeof SellerType[keyof typeof SellerType]

// 🚀 NUEVA INTERFAZ: Definición del objeto Sede (basada en Sede.java)
export interface Sede {
    id: string; 
    name: string; // Este campo es el que contiene el nombre legible.
    branchType?: string; // Asumiendo que existe el tipo de sucursal.
    // ... otras propiedades si las hay
}

export interface Seller {
  id: string;
  name: string;
  dni: string;
  type: SellerType;
  // 🔑 CORRECCIÓN CLAVE: sede puede ser string o Sede object
  sede: string | Sede;
  status: SellerStatus;
}

export interface SellerTableProps {
  sellers: Seller[];
  onDeactivate: (id: number) => void;
  onActivate: (id: number) => void;
  onEdit: (id: number) => void;
}export interface TypePillProps {
  type: SellerType;
}

export interface StatusPillProps {
  status: SellerStatus;
}

export interface SellerToolbarProps {
  onNewSellerClick: () => void;
  onFilterChange: (name: string, value: string) => void;
  isAdmin?: boolean;
}
