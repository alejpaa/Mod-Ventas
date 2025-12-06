import type { VentaResumenApi } from '../paginas/PaginaVentaDirecta';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Guarda los productos de la venta y recalcula totales
 */
export const guardarProductosVenta = async (ventaId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/venta/${ventaId}/guardar-productos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Error al guardar productos');
    }
};

/**
 * Obtiene los totales calculados de la venta
 */
export const obtenerTotalesVenta = async (ventaId: number): Promise<VentaResumenApi> => {
    const response = await fetch(`${API_BASE_URL}/venta/${ventaId}/totales`);

    if (!response.ok) {
        throw new Error('Error al obtener totales');
    }

    return response.json();
};

/**
 * Actualiza el método de pago de la venta
 */
export const actualizarMetodoPago = async (ventaId: number, metodoPago: 'EFECTIVO' | 'TARJETA'): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/venta/${ventaId}/metodo-pago?metodoPago=${metodoPago}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Error al actualizar método de pago');
    }
};
