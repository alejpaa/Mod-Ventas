export interface VendedorResponse {
  sellerId: number;
  dni?: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  sellerType?: string;
  sellerStatus?: string;
  sellerBranchId?: number;
  sellerBranchName: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const vendedorService = {
  /**
   * Listar vendedores activos desde el API
   */
  async listarVendedoresActivos(): Promise<VendedorResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/vendedores/activos`);

      if (!response.ok) {
        throw new Error('Error al cargar los vendedores');
      }

      const data: VendedorResponse[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error loading sellers:', error);
      // Retornar array vacío en caso de error
      return [];
    }
  },

  /**
   * Obtener vendedor por ID
   */
  async obtenerVendedor(id: number): Promise<VendedorResponse | undefined> {
    try {
      const response = await fetch(`${API_BASE_URL}/vendedores/${id}`);

      if (!response.ok) {
        return undefined;
      }

      const data: VendedorResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error loading seller:', error);
      return undefined;
    }
  },
};
