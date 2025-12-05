import type {
  ClienteResponse,
  ModificacionClienteRequest,
  PageClienteResponse,
  RegistroClienteRequest,
} from '../types/cliente.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Obtiene un cliente por su ID
 */
export async function obtenerClientePorId(idCliente: number): Promise<ClienteResponse> {
  const response = await fetch(`${API_BASE_URL}/clientes/integracion/atencion-cliente/${idCliente}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Error ${response.status}: No se pudo obtener el cliente`);
  }
  
  return await response.json();
}

/**
 * Actualiza un cliente usando PATCH
 */
export async function actualizarCliente(
  idCliente: number,
  datos: ModificacionClienteRequest
): Promise<ClienteResponse> {
  const response = await fetch(`${API_BASE_URL}/clientes/integracion/atencion-cliente/${idCliente}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Error ${response.status}: No se pudo actualizar el cliente`);
  }
  
  return await response.json();
}

/**
 * Lista clientes con filtros y paginación básica
 */
export async function filtrarClientes(
  filtro?: string,
  estado?: string,
  page = 0,
  size = 20
): Promise<PageClienteResponse> {
  const params = new URLSearchParams();
  if (filtro) params.append('filtro', filtro);
  if (estado) params.append('estado', estado);
  params.append('page', page.toString());
  params.append('size', size.toString());

  const response = await fetch(`${API_BASE_URL}/clientes/filtroClientes?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: No se pudo obtener la lista`);
  }

  return await response.json();
}

/**
 * Registra un nuevo cliente
 */
export async function registrarCliente(datos: RegistroClienteRequest): Promise<ClienteResponse> {
  const payload: RegistroClienteRequest = {
    dni: datos.dni,
    firstName: datos.firstName,
    lastName: datos.lastName,
    email: datos.email,
    phoneNumber: datos.phoneNumber,
    address: datos.address,
  };

  const response = await fetch(`${API_BASE_URL}/clientes/registroClientes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: No se pudo registrar el cliente`);
  }

  return await response.json();
}

