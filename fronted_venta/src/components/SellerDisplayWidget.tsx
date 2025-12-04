import React, { useState, useEffect } from 'react';
import type { VendedorResponse, ErrorResponse } from '../types/Vendedor'; // Ajusta la ruta

interface SellerDisplayProps {
    /** El ID del vendedor a buscar, recibido como prop del componente padre. */
    sellerId: number | null;

    /** URL base de tu backend. */
    backendBaseUrl?: string;
}

const SellerDisplayWidget: React.FC<SellerDisplayProps> = ({
    sellerId,
    backendBaseUrl = 'https://mod-ventas.onrender.com/api'
}) => {

    const [vendedorData, setVendedorData] = useState<VendedorResponse | null>(null);
    const [statusText, setStatusText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Efecto para buscar el vendedor cada vez que el ID de la prop cambia
    useEffect(() => {
        if (!sellerId) {
            setVendedorData(null);
            setStatusText(null);
            return;
        }

        const fetchSeller = async () => {
            setIsLoading(true);
            setVendedorData(null);
            setStatusText(null);

            try {
                const url = `${backendBaseUrl}/vendedores/${sellerId}`;
                const response = await fetch(url);

                if (response.ok) {
                    const data: VendedorResponse = await response.json();
                    setVendedorData(data);
                } else {
                    const errorData: ErrorResponse = await response.json();

                    if (response.status === 404) {
                        setStatusText(`ID ${sellerId} no encontrado.`);
                    } else if (response.status === 400) {
                        // Error de negocio: Inactivo
                        setStatusText(`INACTIVO: ${errorData.message}`);
                    } else {
                        setStatusText(`Error ${response.status} del servidor.`);
                    }
                }

            } catch (error) {
                setStatusText('Error de conexión.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSeller();
    }, [sellerId, backendBaseUrl]);


    // ----------------------------------------------------
    // Lógica de Renderizado Compacto con Tailwind
    // ----------------------------------------------------

    // 1. Estado de Carga
    if (isLoading) {
        return (
            <div className="p-2 text-sm text-center text-blue-600 bg-blue-50 border border-blue-300 rounded-md">
                Cargando...
            </div>
        );
    }

    // 2. Estado de Error/No encontrado/Inactivo
    if (statusText || (vendedorData && vendedorData.sellerStatus === 'INACTIVE')) {
        return (
            <div className="p-2 text-sm text-red-700 bg-red-50 border border-red-300 rounded-md">
                <span className="font-semibold">⚠️ Validación Fallida:</span> {statusText || 'Vendedor inactivo.'}
            </div>
        );
    }

    // 3. Estado de Éxito: Vendedor ACTIVO
    if (vendedorData) {
        return (
            <div className="p-3 text-sm text-green-800 bg-green-50 border border-green-300 rounded-md shadow-sm">
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-base">✅ {vendedorData.fullName}</span>
                    <span className="text-xs px-2 py-0.5 bg-green-500 text-white rounded-full">
                        ACTIVO
                    </span>
                </div>
                <p className="text-xs mt-1 text-gray-600">ID: {vendedorData.sellerId} | Sede: {vendedorData.sellerBranchName}</p>
            </div>
        );
    }

    // 4. Estado inicial (sin ID o ID reseteado)
    return null;
};

export default SellerDisplayWidget;
