const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mod-ventas.onrender.com/api';

export interface VentaListado {
    id: number;
    numVenta: string | null;
    origenVenta: 'DIRECTA' | 'LEAD' | 'COTIZACION';
    estado: 'BORRADOR' | 'CONFIRMADA' | 'CANCELADA';
    fechaVentaCreada: string | null;
    nombreCliente: string | null;
}

export interface VentaPaginada {
    content: VentaListado[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
}

export const listarVentasPaginadas = async (
    page: number = 0,
    size: number = 20,
    sortBy: string = 'id',
    sortDir: string = 'desc'
): Promise<VentaPaginada> => {
    const response = await fetch(
        `${API_BASE_URL}/venta/paginadas?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    );

    if (!response.ok) {
        throw new Error('Error al cargar ventas paginadas');
    }

    return response.json();
};

export const listarTodasVentas = async (): Promise<VentaListado[]> => {
    const response = await fetch(`${API_BASE_URL}/venta`);

    if (!response.ok) {
        throw new Error('Error al cargar ventas');
    }

    return response.json();
};
