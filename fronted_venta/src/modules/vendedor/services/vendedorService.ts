export interface VendedorResponse {
  sellerId: number;
  fullName: string;
  sellerBranchName: string;
}

// Datos simulados de vendedores
const MOCK_VENDEDORES: VendedorResponse[] = [
  {
    sellerId: 1,
    fullName: 'Fardito Leon Chacon',
    sellerBranchName: 'Lima Centro',
  },
  {
    sellerId: 2,
    fullName: 'Ana Torres Ramírez',
    sellerBranchName: 'Lima Norte',
  },
  {
    sellerId: 3,
    fullName: 'Pedro Ramírez González',
    sellerBranchName: 'Lima Sur',
  },
  {
    sellerId: 4,
    fullName: 'Lucía Fernández Castro',
    sellerBranchName: 'Lima Este',
  },
  {
    sellerId: 5,
    fullName: 'Miguel Ángel Castro Díaz',
    sellerBranchName: 'Callao',
  },
  {
    sellerId: 6,
    fullName: 'Carmen Rosa Vega',
    sellerBranchName: 'San Isidro',
  },
];

export const vendedorService = {
  /**
   * Listar vendedores activos (datos simulados)
   */
  async listarVendedoresActivos(): Promise<VendedorResponse[]> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_VENDEDORES;
  },

  /**
   * Obtener vendedor por ID (datos simulados)
   */
  async obtenerVendedor(id: number): Promise<VendedorResponse | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_VENDEDORES.find((v) => v.sellerId === id);
  },
};
