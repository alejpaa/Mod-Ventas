// src/modules/descuentos/types/cupon.types.ts

// Mapea el enum de Java
export type TipoDescuento = 'PORCENTAJE' | 'MONTO_FIJO'; //

// DTO para la solicitud de edición individual (usado en el PUT del controlador)
export interface CrearCuponRequest { //
  codigo: string; //
  tipoDescuento: TipoDescuento; //
  valor: number; //
  fechaExpiracion: string; //
  usosMaximos: number | null; //
  montoMinimoRequerido: number; //
}

// --- NUEVO DTO PARA CREACIÓN POR LOTE (POST /api/admin/cupones) ---
export interface CrearCuponLoteRequest {
    nombreCampana: string; // Nuevo campo: Prefijo del código del cupón (ej: NAVIDAD25)
    cantidadCupones: number; // Nuevo campo: Cuántos cupones crear (ej: 100)
    tipoDescuento: TipoDescuento;
    valor: number;
    fechaExpiracion: string;
    montoMinimoRequerido: number;
}


// DTO para la respuesta (CuponResponse)
export interface CuponResponse { //
  id: number; //
  codigo: string; //
  tipoDescuento: TipoDescuento; //
  valor: number; //
  fechaExpiracion: string; //
  usosMaximos: number | null; //
  usosActuales: number; //
  montoMinimoRequerido: number; //
  estado: 'ACTIVO' | 'EXPIRADO' | 'AGOTADO'; //
}

// Estructura inicial para el formulario de EDICIÓN (mantenida por compatibilidad)
export const initialCuponRequest: CrearCuponRequest = { //
  codigo: '', //
  tipoDescuento: 'PORCENTAJE', //
  valor: 0, //
  fechaExpiracion: new Date().toISOString().split('T')[0], // Ajustado a formato de fecha YYYY-MM-DD
  usosMaximos: null, //
  montoMinimoRequerido: 0, //
};


// --- NUEVA ESTRUCTURA INICIAL para el formulario de CREACIÓN POR LOTE ---
export const initialCuponLoteRequest: CrearCuponLoteRequest = {
    nombreCampana: '',
    cantidadCupones: 1,
    tipoDescuento: 'PORCENTAJE',
    valor: 10, 
    fechaExpiracion: new Date().toISOString().split('T')[0],
    montoMinimoRequerido: 0,
};