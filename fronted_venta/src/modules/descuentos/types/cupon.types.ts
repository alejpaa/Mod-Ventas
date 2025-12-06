// src/modules/descuentos/types/cupon.types.ts

// Mapea el enum de Java
export type TipoDescuento = 'PORCENTAJE' | 'MONTO_FIJO';

// DTO para la solicitud de creación (CrearCuponRequest)
export interface CrearCuponRequest {
  codigo: string;
  tipoDescuento: TipoDescuento;
  valor: number; // Usamos number, el backend lo mapeará a BigDecimal
  fechaExpiracion: string; // Formato YYYY-MM-DD
  usosMaximos: number | null; // null si es ilimitado
  montoMinimoRequerido: number;
}

// DTO para la respuesta (CuponResponse)
export interface CuponResponse {
  id: number;
  codigo: string;
  tipoDescuento: TipoDescuento;
  valor: number;
  fechaExpiracion: string;
  usosMaximos: number | null;
  usosActuales: number;
  montoMinimoRequerido: number;
  estado: 'ACTIVO' | 'EXPIRADO' | 'AGOTADO';
}

// Estructura inicial para el formulario
export const initialCuponRequest: CrearCuponRequest = {
  codigo: '',
  tipoDescuento: 'PORCENTAJE',
  valor: 0,
  fechaExpiracion: '',
  usosMaximos: null,
  montoMinimoRequerido: 0,
};