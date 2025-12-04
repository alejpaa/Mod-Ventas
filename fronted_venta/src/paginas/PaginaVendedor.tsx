import { useCallback, useEffect, useState } from 'react';
import SellerToolbar from '../components/SellerToolbar';
import SellerTable from '../components/SellerTable';
import { SellerType, SellerStatus } from '../types/seller.types';
import type { VendedorResponse, SedeResponse } from '../types/Vendedor';
import { CreateSellerModal } from '../components/CreateSellerModal';
import SedeTable from '../components/SedeTable';

type TabId = 'vendedores' | 'sedes';

// 1. OBTENER LA URL DEL ENTORNO VITE (se carga automáticamente)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// La estructura de respuesta de la API es Page<VendedorResponse>
interface PageResponse {
    content: VendedorResponse[];
    totalPages: number;
    totalElements: number;
    // ... otros campos de paginación
}

export function PaginaVendedor() {
  // Empieza con la pestaña de vendedores
  const [activeTab, setActiveTab] = useState<TabId>('vendedores');

  // 2. Usar el tipo VendedorResponse para el estado
  const [sellers, setSellers] = useState<VendedorResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // [ESTADOS PARA SEDES]
  const [sedes, setSedes] = useState<SedeResponse[]>([]);
  const [isSedesLoading, setIsSedesLoading] = useState(false);
  const [sedesError, setSedesError] = useState<Error | null>(null);

  const mappedSellers = sellers.map(vendedor => ({
    id: vendedor.sellerId.toString(),
    name: vendedor.fullName,
    dni: vendedor.dni,
    type: vendedor.sellerType === 'INTERNAL' ? SellerType.Interno : SellerType.Externo,
    sede: vendedor.sellerBranchName,
    status: vendedor.sellerStatus === 'ACTIVE' ? SellerStatus.Activo : SellerStatus.Inactivo,
  }));

  // Estado para el modal de creación
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const tabs = [
    { id: 'vendedores', label: 'Vendedores' },
    { id: 'sedes', label: 'Sedes de Venta' },
  ];

  // 3. Función para hacer la llamada a la API
  const fetchSellers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        // Usamos la URL base y el endpoint de paginación
      const response = await fetch(`${API_BASE_URL}/vendedores?page=0&size=20`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo cargar la lista de vendedores`);
      }
        // 4. Mapear la respuesta de paginación (Page<T>)
      const data: PageResponse = await response.json();
      setSellers(data.content); // Solo guardamos la lista de vendedores (el contenido de la página)

    } catch (error: unknown) {
        // Quitamos el mock data y solo mostramos el error si falla
        setError(error as Error);
        setSellers([]); // Aseguramos que la lista esté vacía en caso de error
    } finally {
        setIsLoading(false);
    }
  }, []);

  // para obtener las sedes
  const fetchSedes = useCallback(async () => {
    setIsSedesLoading(true);
    setSedesError(null);
    try {
      // Endpoint GET /api/sedes
      const response = await fetch(`${API_BASE_URL}/sedes`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo cargar la lista de sedes`);
      }

      const data: SedeResponse[] = await response.json();
      setSedes(data);

    } catch (error: unknown) {
      setSedesError(error as Error);
      setSedes([]);
    } finally {
      setIsSedesLoading(false);
    }
  }, []);

  // para cargar sedes cuando se cambia de pestaña
  useEffect(() => {
    if (activeTab === 'vendedores') {
      fetchSellers();
    } else if (activeTab === 'sedes' && sedes.length === 0 && !isSedesLoading) {
      // Solo cargar si estamos en la pestaña y aún no hay datos
      fetchSedes();
    }
  }, [activeTab, fetchSellers, fetchSedes, sedes.length, isSedesLoading]);

  const handleDeactivateSeller = useCallback(async (sellerId: number) => {
    if (!confirm(`¿Está seguro de desactivar al vendedor con ID ${sellerId}?`)) {
      return;
    }

    try {
      // DELETE /api/vendedores/{id}
      const response = await fetch(`${API_BASE_URL}/vendedores/${sellerId}`, {
        method: 'DELETE',
      });

      if (response.status === 204) {
        // Éxito: Desactivación completada (baja lógica)
        alert(`Vendedor ${sellerId} desactivado exitosamente.`);
        fetchSellers(); // Refrescar la tabla para mostrar el nuevo estado INACTIVE
      } else if (response.status === 404) {
        // Error: Recurso no encontrado
        alert(`Error: Vendedor ${sellerId} no existe.`);
      } else if (response.status === 400) {
        // Error de negocio: Cotizaciones pendientes
        const errorData = await response.json();
        alert(`ACCIÓN BLOQUEADA: ${errorData.message}`);
      } else {
        throw new Error(`Error ${response.status} en el servidor.`);
      }
    } catch (error: any) {
      alert(`Error de conexión: ${error.message}`);
    }
  }, [fetchSellers]); // Depende de fetchSellers

  const handleActivateSeller = useCallback(async (sellerId: number) => {
    if (!confirm(`¿Está seguro de REACTIVAR al vendedor con ID ${sellerId}?`)) {
      return;
    }

    try {
      // Usaremos un endpoint PATCH/PUT para cambiar el estado a ACTIVO
      // Asume que el backend tiene el endpoint: PATCH /api/vendedores/{id}/activate
      const response = await fetch(`${API_BASE_URL}/vendedores/${sellerId}/reactivar`, {
        method: 'POST',
      });

      if (response.ok) { // Verifica si el código es 2xx (e.g., 200 OK)
        // Éxito: Reactivación completada
        alert(`Vendedor ${sellerId} reactivado exitosamente.`);
        fetchSellers(); // Refrescar la tabla para mostrar el nuevo estado ACTIVE
      } else if (response.status === 404) {
        alert(`Error: Vendedor ${sellerId} no existe.`);
      } else {
        // Manejo de otros posibles errores, como sede inactiva, etc.
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status} en el servidor.`);
      }
    } catch (error: any) {
      alert(`Error de conexión o de negocio: ${error.message}`);
    }
  }, [fetchSellers]);

  useEffect(() => {
    if (activeTab === 'vendedores') {
      fetchSellers();
    }
  }, [activeTab, fetchSellers]);

  const handleSaveSuccess = () => {
   setIsCreateModalOpen(false); // Cerrar el modal
  fetchSellers(); // Refrescar la lista de vendedores
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {/* 1. Cabecera */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Vendedores</h1>
          <p className="text-gray-600 mt-1">
            Crear vendedores y asignarles a una sede para empezar a vender
          </p>
        </div>

        {/* 2. Pestañas (Tabs) */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`
                  ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>



        {/* 3. Contenido Principal (basado en la pestaña activa) */}
        <div>
          {/* Contenido de la pestaña VENDEDORES */}
          {activeTab === 'vendedores' && (
            <div>
              <SellerToolbar
                onNewSellerClick={() => {
                  setIsCreateModalOpen(true);
                }}
              />

              {isLoading && <p className='py-4 text-center text-gray-600'>Cargando vendedores desde el backend...</p>}
             
              {error && (
                <div className='p-4 my-4 bg-red-100 text-red-700 rounded-md'>
                    <p className='font-bold'>Error al cargar datos:</p>
                    <p>{error.message}</p>
                    <p className='mt-2 text-sm'>Asegúrese de que el backend (${API_BASE_URL}) esté activo.</p>
                </div>
              )}
             
              {/* Solo mostramos la tabla si no está cargando y no hay error */}
              {!isLoading && !error && <SellerTable
                                          sellers={mappedSellers}
                                          onDeactivate={(id) => handleDeactivateSeller(id)}
                                          onActivate={(id) => handleActivateSeller(id)}
                                        />}
            </div>
          )}

          {/* Contenido de la pestaña SEDES */}
          {activeTab === 'sedes' && (
            <div className="p-4">
                <h3 className="text-xl font-semibold">Listados de sede de ventas</h3>
                {isSedesLoading && <p className='py-4 text-center text-gray-600'>Cargando sedes...</p>}

                {sedesError && (
                    <div className='p-4 my-4 bg-red-100 text-red-700 rounded-md'>
                        <p className='font-bold'>Error al cargar sedes:</p>
                        <p>{sedesError.message}</p>
                        <p className='mt-2 text-sm'>Asegúrese de que el backend ({API_BASE_URL}) esté activo.</p>
                    </div>
                )}

                {/* VISUALIZACIÓN DE LA TABLA */}
                {!isSedesLoading && !sedesError && sedes.length > 0 && (
                    <SedeTable sedes={sedes} />
                )}
                {!isSedesLoading && !sedesError && sedes.length === 0 && (
                    <p className='py-4 text-center text-gray-500 italic'>No hay sedes registradas o activas.</p>
                )}
            </div>
          )}
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateSellerModal
          onClose={() => setIsCreateModalOpen(false)}
          onSaveSuccess={handleSaveSuccess}
          apiBaseUrl={API_BASE_URL}
        />
      )}
    </div>
  );
}
