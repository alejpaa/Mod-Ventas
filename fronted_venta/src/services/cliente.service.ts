const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mod-ventas.onrender.com/api';

export interface Cliente {
    clienteId: number;
    dni: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    telefonoFijo: string | null;
    address: string;
    fechaNacimiento: string | null;
    registrationDate: string;
    estado: string;
    categoria: string | null;
}

export interface PageClienteResponse {
    clientes: Cliente[];        // ← Cambiado de "content" a "clientes"
    currentPage: number;        // ← Cambiado de "pageNumber" a "currentPage"
    pageSize: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
}

export const buscarClientes = async (
    filtro: string = '',
    page: number = 0,
    size: number = 10
): Promise<PageClienteResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });

    if (filtro) {
        params.append('filtro', filtro);
    }

    const url = `${API_BASE_URL}/clientes/filtroClientes?${params}`;
    console.log('📡 URL completa:', url);
    console.log('🔑 API_BASE_URL:', API_BASE_URL);

    const response = await fetch(url);

    console.log('📊 Status:', response.status);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error('Error al buscar clientes');
    }

    const data = await response.json();
    console.log('📦 Datos recibidos:', data);
    return data;
};

export const asignarClienteAVenta = async (ventaId: number, clienteId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/venta/${ventaId}/cliente/${clienteId}`, {
        method: 'PUT',
    });

    if (!response.ok) {
        throw new Error('Error al asignar cliente a la venta');
    }
};

export interface RegistroClienteRequest {
    dni: string;
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber: string;
    telefonoFijo?: string;
    address?: string;
    fechaNacimiento?: string;
}

export const registrarCliente = async (request: RegistroClienteRequest): Promise<Cliente> => {
    const response = await fetch(`${API_BASE_URL}/clientes/registroClientes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al registrar cliente');
    }

    return response.json();
};

