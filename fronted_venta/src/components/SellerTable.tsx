// fronted_venta/src/components/SellerTable.tsx

import StatusPill from "./StatusPill";
import TypePill from "./TypePill";
// Asegúrate de importar SellerTableProps y SellerStatus desde el archivo corregido
import { type SellerTableProps, SellerStatus } from "../types/seller.types";

const SellerTable = ({ sellers, onDeactivate, onActivate, onEdit }: SellerTableProps) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      {/* Encabezados de la Tabla */}
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sede Asignada</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
        </tr>
      </thead>

      {/* Cuerpo de la Tabla */}
      <tbody className="bg-white divide-y divide-gray-200">
        {sellers.map((seller) => (
          <tr key={seller.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{seller.id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{seller.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{seller.dni}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <TypePill type={seller.type} />
            </td>
            
            {/* 🔑 CORRECCIÓN: Acceder a la propiedad .name del objeto sede */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {seller.sede ? (typeof seller.sede === 'string' ? seller.sede : seller.sede.name) : 'N/A'}
            </td>
            
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <StatusPill status={seller.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
              <button
                  onClick={(e) => {
                      e.preventDefault();
                      // Llamamos a onEdit, convirtiendo el ID de vuelta a número
                      onEdit(Number(seller.id));
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Editar
              </button>

              {seller.status === SellerStatus.Activo ? (
                <button
                  onClick={(e) => {
                      e.preventDefault();
                      onDeactivate(Number(seller.id)); // Convertir el ID de vuelta a número
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  Desactivar
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onActivate(Number(seller.id));
                  }}
                  className="text-green-600 hover:text-green-800"
                >
                  Reactivar
            </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default SellerTable;