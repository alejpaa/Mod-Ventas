// Old mock types (for backward compatibility with QuotationList component)
export const QuotationStatus = {
  Draft: 'Borrador',
  Sent: 'Enviada',
  Accepted: 'Aceptada',
  Expired: 'Expirada',
  Rejected: 'Rechazada',
} as const;

export type QuotationStatus = (typeof QuotationStatus)[keyof typeof QuotationStatus];

export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: number;
  numCotizacion: string;
  clienteNombre: string;
  fechaCotizacion: string;
  totalCotizado: number;
  estado: 'BORRADOR' | 'ENVIADA' | 'ACEPTADA' | 'RECHAZADA';
}

// API Response types
export interface QuotationItemResponse {
  id: number;
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

// Form types
export interface QuotationItemFormData {
  tempId: string;
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface QuotationFormData {
  clienteId: number | null;
  vendedorId: number | null;
  validezDias: number;
  items: QuotationItemFormData[];
}

// API Request types
export interface CotizacionItemRequest {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface CotizacionRequest {
  clienteId: number;
  vendedorId: number;
  vigencia: string;
  items: CotizacionItemRequest[];
}

export interface EnviarCotizacionRequest {
  cotizacionId: number;
  email: string;
}
