import { type ClienteResponse, type ModificacionClienteRequest } from '../types/cliente.types';

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

