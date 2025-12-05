export interface Cliente {
  id: number;
  nombre: string;
  documento?: string;
  telefono?: string;
  direccion?: string;
}

// Datos simulados de clientes
const MOCK_CLIENTES: Cliente[] = [
  {
    id: 1,
    nombre: 'Juan Pérez García',
    documento: '12345678',
    telefono: '+51 987 654 321',
    direccion: 'Av. Principal 123, Lima',
  },
  {
    id: 2,
    nombre: 'María García López',
    documento: '87654321',
    telefono: '+51 912 345 678',
    direccion: 'Jr. Los Olivos 456, Lima',
  },
  {
    id: 3,
    nombre: 'Carlos López Mendoza',
    documento: '11223344',
    telefono: '+51 998 765 432',
    direccion: 'Calle Las Flores 789, Lima',
  },
  {
    id: 4,
    nombre: 'Ana Torres Mendoza',
    documento: '22334455',
    telefono: '+51 955 123 456',
    direccion: 'Av. Arequipa 1010, Lima',
  },
  {
    id: 5,
    nombre: 'Roberto Silva Chávez',
    documento: '33445566',
    telefono: '+51 944 567 890',
    direccion: 'Jr. Independencia 234, Lima',
  },
  {
    id: 6,
    nombre: 'Empresa ABC S.A.C.',
    documento: '20123456789',
    telefono: '+51 987 111 222',
    direccion: 'Av. Javier Prado 2500, San Isidro',
  },
  {
    id: 7,
    nombre: 'Tech Solutions EIRL',
    documento: '20987654321',
    telefono: '+51 912 333 444',
    direccion: 'Calle Los Negocios 100, Miraflores',
  },
];

export const clienteService = {
  /**
   * Listar todos los clientes (datos simulados)
   */
  async listarClientes(): Promise<Cliente[]> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_CLIENTES;
  },

  /**
   * Buscar cliente por ID (datos simulados)
   */
  async obtenerCliente(id: number): Promise<Cliente | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_CLIENTES.find((c) => c.id === id);
  },
};
