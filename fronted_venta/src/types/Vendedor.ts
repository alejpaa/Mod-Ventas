// src/types/Vendedor.ts

export interface VendedorResponse {
    sellerId: number;
    fullName: string;
    sellerStatus: 'ACTIVE' | 'INACTIVE';
    // Mantenemos otros campos para el tipo, aunque no se usen en el display
    sellerBranchId: number;
    sellerBranchName: string; // <-- ¡Asegúrate de que esta línea exista!
    warehouseRefId: number | null;
}

export interface ErrorResponse {
    message: string;
}
