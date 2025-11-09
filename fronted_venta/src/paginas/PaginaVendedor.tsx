import { useCallback, useEffect, useState } from "react";
import SellerToolbar from "../components/SellerToolbar";
import SellerTable from "../components/SellerTable";
import { type Seller, SellerType, SellerStatus } from "../types/seller.types";
import { CreateSellerModal } from "../components/CreateSellerModal";

type TabId = 'vendedores' | 'sedes';

// Datos simulados para los vendedores
const mockSellers: Seller[] = [
  {
    id: 'V-INT-001',
    name: 'Ana Gómez',
    dni: '45678901',
    type: SellerType.Interno,
    sede: 'Call Center (Piso 4)',
    status: SellerStatus.Activo,
  },
  {
    id: 'V-EXT-001',
    name: 'Carlos Rojas',
    dni: '12345678',
    type: SellerType.Externo,
    sede: 'Módulo Real Plaza - 1er Piso',
    status: SellerStatus.Activo,
  },
  {
    id: 'V-EXT-002',
    name: 'Miguel Torres',
    dni: '11223344',
    type: SellerType.Externo,
    sede: 'Distribuidor Autorizado (Lince)',
    status: SellerStatus.Inactivo,
  },
];



export function PaginaVendedor() {
  // Empieza con la pestaña de vendedores
  const [activeTab, setActiveTab] = useState<TabId>('vendedores');

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Para saber si está cargando
  const [error, setError] = useState<Error | null>(null); // Para cualquier error

  // Estado para el modal de creación
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Para las 2 navegaciones
  const tabs = [
    { id: 'vendedores', label: 'Vendedores' },
    { id: 'sedes', label: 'Sedes de Venta' },
  ];

  const fetchSellers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/vendedores');
      if (!response.ok) {
        throw new Error('Error al cargar los vendedores');
      }
      const data = await response.json();
      setSellers(data);
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []); // useCallback la memoriza

  useEffect(() => {
    if (activeTab === 'vendedores') {
      fetchSellers();
    }
  }, [activeTab, fetchSellers]);

  const handleSaveSuccess = () => {
    setIsCreateModalOpen(false); // Cerrar el modal
    fetchSellers(); // Refrescar la lista de vendedores
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">

        {/* 1. Cabecera */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Vendedores</h1>
          <p className="text-gray-600 mt-1">Crear vendedores y asignarles a una sede para empezar a vender</p>
        </div>

        {/* 2. Pestañas (Tabs) */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)} // Aseguramos el tipo al hacer click
                className={`
                  ${activeTab === tab.id
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
                  console.log("Creando nuevo vendedor")
                  setIsCreateModalOpen(true);
                  }
                }
              />

              {isLoading && <p>Cargando vendedores...</p>}
              {/* Por mientras comentamos esta parte hasta tener el endpoint listo */}
              {/*error && <p className="text-red-500">Error: {error.message}</p>*/}
              {/* Colocamos los vendedores de la base de datos */}
              {!isLoading && !error && (
                <SellerTable sellers={sellers} />
              )}
              {/* Simulamos vendedores por si no existe endpoint por mientras */}
              {!isLoading && error && (
                <SellerTable sellers={mockSellers} />
              )}

            </div>
          )}

          {/* Contenido de la pestaña SEDES */}
          {activeTab === 'sedes' && (
            <div className="p-4">
              <h3 className="text-xl font-semibold">Visualizar Sedes de Venta por TODO</h3>
              <p className="text-gray-500 mt-2">
                Waaaaaaa.).
              </p>
            </div>
          )}
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateSellerModal
          onClose={() => setIsCreateModalOpen(false)}
          onSaveSuccess={handleSaveSuccess}
        />
      )}

    </div>
  );
}
