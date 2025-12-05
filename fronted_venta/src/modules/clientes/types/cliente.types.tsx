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
  gastoTotal?: number; // Total de gastos del cliente
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
  // Datos Personales
  dni: string;
  estado: string;
  firstName: string;
  lastName: string;
  fechaNacimiento?: string;
  genero?: string;
  edad?: number;
  nivelEducativo?: string;
  ocupacion?: string;
  // Datos de Contacto
  email?: string;
  phoneNumber: string;
  telefonoFijo?: string;
  direccionCompleta?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  referencia?: string;
  // Preferencias
  idiomaPreferido?: string;
  canalContactoFavorito?: string;
  intereses?: string;
  aceptaPublicidad?: boolean;
}

export interface PageClienteResponse {
  clientes: ClienteResponse[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

export type EstadoClienteFilter = 'ACTIVO' | 'INACTIVO' | 'TODOS';

