import { useState } from "react";
import VendedorTable from "../components/SellerTable";
import VendedorToolbar from "../components/VendedorToolbar";

type TabId = 'vendedores' | 'sedes';

export const SellerType = {
  Interno: 'Interno',
  Externo: 'Externo',
} as const
export type SellerType = typeof SellerType[keyof typeof SellerType]

export const SellerStatus = {
  Activo: 'Activo',
  Inactivo: 'Inactivo',
} as const
export type SellerStatus = typeof SellerStatus[keyof typeof SellerStatus]

interface Vendedor {
  id: string;
  name: string;
  dni: string;
  type: SellerType;
  sede: string;
  status: SellerStatus;
}

const mockSellers: Vendedor[] = [
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
    <div className="bg-gray-100 p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        
        {/* 1. Cabecera */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Vendedores y Sedes</h1>
          <p className="text-gray-600 mt-1">Administra los vendedores internos/externos y sus sedes de venta asignadas.</p>
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
              <VendedorToolbar />
              <VendedorTable sellers={mockSellers} />
            </div>
          )}

          {/* Contenido de la pestaña SEDES (placeholder) */}
          {activeTab === 'sedes' && (
            <div className="p-4">
              <h3 className="text-xl font-semibold">Gestionar Sedes de Venta</h3>
              <p className="text-gray-500 mt-2">
                Aquí irá la interfaz para crear, ver y editar las sedes (Centros de Atención, Módulos, etc.).
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}