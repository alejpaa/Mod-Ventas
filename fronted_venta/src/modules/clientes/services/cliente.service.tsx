import { type ClienteResponse, type ModificacionClienteRequest, type PageClienteResponse, type EstadoClienteFilter } from '../types/cliente.types';

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
 * Filtra y obtiene clientes con paginación
 */
export async function filtrarClientes(
  filtro?: string,
  estado?: EstadoClienteFilter,
  page: number = 0,
  size: number = 10
): Promise<PageClienteResponse> {
  const params = new URLSearchParams();
  if (filtro) params.append('filtro', filtro);
  if (estado && estado !== 'TODOS') params.append('estado', estado);
  params.append('page', page.toString());
  params.append('size', size.toString());

  const response = await fetch(`${API_BASE_URL}/clientes/filtroClientes?${params.toString()}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Error ${response.status}: No se pudo obtener la lista de clientes`);
  }
  
  return await response.json();
}

/**
 * Obtiene el historial de compras de un cliente para calcular el gasto total
 */
export async function obtenerGastoTotalCliente(idCliente: number): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/clientes/HistorialCompras/${idCliente}`);
    
    if (!response.ok) {
      return 0; // Si no hay historial, retornar 0
    }
    
    const data = await response.json();
    // El HistorialComprasResponse tiene un campo totalCompras (BigDecimal)
    return data.totalCompras ? Number(data.totalCompras) : 0;
  } catch {
    return 0;
  }
}

