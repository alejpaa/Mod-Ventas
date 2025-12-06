export interface Cliente {
  id: number;
  nombre: string;
  documento?: string;
  telefono?: string;
  direccion?: string;
  email?: string;
}

// Interfaz del backend
interface ClienteResponse {
  clienteId: number;
  dni: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  telefonoFijo: string;
  address: string;
  fechaNacimiento: string;
  registrationDate: string;
  estado: string;
  categoria: string;
}

interface PageClienteResponse {
  clientes: ClienteResponse[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const clienteService = {
  /**
   * Listar todos los clientes activos desde el API
   */
  async listarClientes(): Promise<Cliente[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/clientes/filtroClientes?page=0&size=100&estado=ACTIVO`
      );

      if (!response.ok) {
        throw new Error('Error al cargar los clientes');
      }

      const data: PageClienteResponse = await response.json();

      // Mapear ClienteResponse a Cliente
      return data.clientes.map((cliente) => ({
        id: cliente.clienteId,
        nombre: cliente.fullName,
        documento: cliente.dni,
        telefono: cliente.phoneNumber,
        direccion: cliente.address,
        email: cliente.email,
      }));
    } catch (error) {
      console.error('Error loading clients:', error);
      // Retornar array vacío en caso de error
      return [];
    }
  },

  /**
   * Buscar cliente por ID
   */
  async obtenerCliente(id: number): Promise<Cliente | undefined> {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/integracion/atencion-cliente/${id}`);

      if (!response.ok) {
        return undefined;
      }

      const cliente: ClienteResponse = await response.json();

      return {
        id: cliente.clienteId,
        nombre: cliente.fullName,
        documento: cliente.dni,
        telefono: cliente.phoneNumber,
        direccion: cliente.address,
        email: cliente.email,
      };
    } catch (error) {
      console.error('Error loading client:', error);
      return undefined;
    }
  },
};
