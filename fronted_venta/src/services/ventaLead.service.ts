const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mod-ventas.onrender.com/api';

export interface VentaLeadPendiente {
    ventaId: number;
    numVenta: string;
    nombreCliente: string;
    nombreCampania: string;
    fechaEnvio: string;
    canalOrigen: string;
}

export interface VentaLeadDetalle {
    ventaId: number;
    numVenta: string;
    clienteId: number;
    dni: string;
    nombres: string;
    apellidos: string;
    correo: string;
    telefono: string;
    idLeadMarketing: number;
    canalOrigen: string;
    idCampaniaMarketing: number;
    nombreCampania: string;
    tematica: string;
    descripcion: string;
    notasLlamada: string;
    fechaEnvio: string;
}

export const listarVentasLeadPendientes = async (): Promise<VentaLeadPendiente[]> => {
    const response = await fetch(`${API_BASE_URL}/venta/leads/pendientes`);
    if (!response.ok) {
        throw new Error('Error al cargar ventas lead pendientes');
    }
    return response.json();
};

export const obtenerDetalleVentaLead = async (ventaId: number): Promise<VentaLeadDetalle> => {
    const response = await fetch(`${API_BASE_URL}/venta/leads/${ventaId}`);
    if (!response.ok) {
        throw new Error('Error al cargar detalle de venta lead');
    }
    return response.json();
};
