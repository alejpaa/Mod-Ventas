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
  fechaCotizacion: string; // Fecha de creación
  fechaExpiracion: string; // Fecha de expiración
  validezDias: number; // Días de validez
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
  validezDias: number; // Días de validez
  items: CotizacionItemRequest[];
}

export interface EnviarCotizacionRequest {
  cotizacionId: number;
  email: string;
}

// Complete quotation response with items
export interface QuotationResponse {
  id: number;
  numCotizacion: string;
  fechaCotizacion: string;
  idCliente: number;
  sellerCode: string;
  idSede: number | null;
  estado: 'BORRADOR' | 'ENVIADA' | 'ACEPTADA' | 'RECHAZADA';
  validezDias: number;
  totalCotizado: number;
  items: QuotationItemResponse[];
}
