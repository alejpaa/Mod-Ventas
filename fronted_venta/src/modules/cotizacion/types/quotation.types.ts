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
  id: string;
  clientName: string;
  date: string;
  expirationDate: string;
  status: QuotationStatus;
  items: QuotationItem[];
  subtotal: number;
  tax: number;
  total: number;
}
