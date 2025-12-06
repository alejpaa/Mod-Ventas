export interface VentasPorCanalResponse {
    canal: 'FISICO_PRESENCIAL' | 'REMOTO_LLAMADA' | 'OTRO';
    cantidadVentas: number;
    ingresosTotales: number; // Usaremos number para la visualización en JS
}
