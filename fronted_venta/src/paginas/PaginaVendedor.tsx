import { useState } from "react";
import SellerToolbar from "../components/SellerToolbar";
import SellerTable from "../components/SellerTable";
import { type Seller, SellerType, SellerStatus } from "../types/seller.types";

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
  // Ahora el estado está tipado con 'vendedores' o 'sedes'
  const [activeTab, setActiveTab] = useState<TabId>('vendedores');

  const tabs = [
    { id: 'vendedores', label: 'Vendedores' },
    { id: 'sedes', label: 'Sede de Venta' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        
        {/* 1. Cabecera */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Vendedores y Sedes</h1>
          <p className="text-gray-600 mt-1">Waaaaa</p>
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
              <SellerToolbar />
              <SellerTable sellers={mockSellers} />
            </div>
          )}

          {/* Contenido de la pestaña SEDES (placeholder) */}
          {activeTab === 'sedes' && (
            <div className="p-4">
              <h3 className="text-xl font-semibold">Visualizar Sedes de Venta</h3>
              <p className="text-gray-500 mt-2">
                Waaaaaaa.).
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}