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

