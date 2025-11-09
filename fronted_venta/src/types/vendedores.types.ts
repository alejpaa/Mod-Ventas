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


export interface Vendedor {
  id: string;
  name: string;
  dni: string;
  type: SellerType;
  sede: string;
  status: SellerStatus;
}

export interface VendedorTableProps {
  sellers: Vendedor[];
}

export interface TypePillProps {
  type: SellerType;
}

export interface StatusPillProps {
  status: SellerStatus;
}
