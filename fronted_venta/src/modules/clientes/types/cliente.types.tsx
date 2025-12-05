export interface ClienteResponse {
  clienteId: number;
  dni: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  telefonoFijo?: string;
  address?: string;
  fechaNacimiento?: string;
  registrationDate: string;
  estado: string;
  categoria?: string;
  gastoTotal?: number;
  ultimaCompra?: string;
  totalTransacciones?: number;
}

export interface ModificacionClienteRequest {
  dni?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  telefonoFijo?: string;
  address?: string;
  fechaNacimiento?: string;
  estado?: string;
}

export interface RegistroClienteRequest {
  dni: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  address?: string;
}

export interface PageClienteResponse {
  clientes: ClienteResponse[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}
