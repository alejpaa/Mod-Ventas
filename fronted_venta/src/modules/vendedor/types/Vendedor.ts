// src/types/Vendedor.ts

export interface VendedorResponse {
    sellerId: number; // Nuevo nombre: id -> sellerId
    dni: string;
    firstName: string;
    lastName: string;
    fullName: string; // Nuevo campo
    email: string;
    phoneNumber: string;
    address: string;
    sellerType: 'INTERNAL' | 'EXTERNAL'; // Nuevo nombre: type -> sellerType
    sellerStatus: 'ACTIVE' | 'INACTIVE'; // Nuevo nombre: status -> sellerStatus
    registrationDate: string;
    sellerBranchId: number;
    sellerBranchName: string; // Nuevo nombre: sede -> sellerBranchName
    employeeRrhhId: number | null;
    ruc: string | null;
    bankAccount: string | null;
    bankName: string | null;
    documentType: 'DNI' | 'CE' | 'PASSPORT' | 'RUC';
    warehouseRefId: number | null;
}

// También actualiza los enums para usar los nombres del backend (e.g., SellerType a 'INTERNAL' | 'EXTERNAL')
export type SellerType = 'INTERNAL' | 'EXTERNAL';
export type SellerStatus = 'ACTIVE' | 'INACTIVE';

export interface ErrorResponse {
    message: string;
}

export type BranchType = 'MODULE' | 'AUTHORIZED_DEALER' | 'CALL_CENTER' | 'CENTRO_DE_ATENCION';

export interface SedeResponse {
    branchId: number;
    name: string;
    address: string;
    branchType: BranchType;
    maxCapacity: number | null;
    active: boolean; // true o false
    warehouseRefId: number | null; // Referencia a Inventario
}
