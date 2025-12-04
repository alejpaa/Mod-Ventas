import React from 'react';
import type { SedeResponse } from '../types/Vendedor';

interface SedeTableProps {
  sedes: SedeResponse[];
}

const getBranchColor = (type: SedeResponse['branchType']) => {
    switch (type) {
        case 'CENTRO_DE_ATENCION': return 'bg-blue-100 text-blue-800 border-blue-300';
        case 'CALL_CENTER': return 'bg-purple-100 text-purple-800 border-purple-300';
        case 'MODULE': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
}

const SedeTable: React.FC<SedeTableProps> = ({ sedes }) => (
  <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidad Máx.</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref. Almacén</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {sedes.map((sede) => (
          <tr key={sede.branchId} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sede.branchId}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sede.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-xs">
                <span className={`px-2 py-1 rounded-full border font-medium ${getBranchColor(sede.branchType)}`}>
                    {sede.branchType.replace('_', ' ')}
                </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{sede.address}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {sede.maxCapacity === null ? 'ILIMITADA' : sede.maxCapacity}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {sede.warehouseRefId === null ? 'N/A' : sede.warehouseRefId}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-xs">
                <span className={`px-2 py-1 rounded-full font-medium ${sede.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {sede.active ? 'ACTIVA' : 'INACTIVA'}
                </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default SedeTable;
