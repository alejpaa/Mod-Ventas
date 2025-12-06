// src/paginas/PaginaCuponesAdmin.tsx

import React, { useState, useEffect, useCallback } from 'react';
import CrearCuponForm from '../modules/descuentos/components/CrearCuponForm';
import { listarTodosLosCupones, eliminarCupon } from '../modules/descuentos/services/cupon.service';
import type { CuponResponse } from '../modules/descuentos/types/cupon.types';
import { Plus, Trash2, Edit } from 'lucide-react'; // <-- CORREGIDO: Se eliminó 'X'

// -----------------------------------------------------
// 1. Modal Componente (REMOVIDO: ya que CrearCuponForm usa Dialog de MUI)
// -----------------------------------------------------
/* // Se ha removido el componente Modal personalizado para evitar conflictos con el Dialog de Material UI
const Modal: React.FC<{ children: React.ReactNode, title: string, onClose: () => void }> = ({ children, title, onClose }) => (
// ...
); 
*/


// -----------------------------------------------------
// 2. Componente de Tabla (CuponTable)
// -----------------------------------------------------
interface CuponTableProps {
  cupones: CuponResponse[];
  onEdit: (cupon: CuponResponse) => void;
  onDelete: (id: number) => void;
}

const CuponTable: React.FC<CuponTableProps> = ({ cupones, onEdit, onDelete }) => (
  <div className="overflow-x-auto shadow-lg rounded-lg">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {['ID', 'Código', 'Tipo', 'Valor', 'Expiración', 'Usos (Actuales/Max)', 'Monto Mín.', 'Estado', 'Acciones'].map((header) => (
            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {cupones.map((cupon) => (
          <tr key={cupon.id} className="hover:bg-indigo-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cupon.id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">{cupon.codigo}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cupon.tipoDescuento}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {/* Ajuste en el formato: El valor ya es el monto final del descuento para MONTO_FIJO */}
              {cupon.tipoDescuento === 'PORCENTAJE' ? `${(cupon.valor).toFixed(0)}%` : `S/ ${cupon.valor.toFixed(2)}`}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cupon.fechaExpiracion}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cupon.usosActuales} / {cupon.usosMaximos === null ? '∞' : cupon.usosMaximos}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">S/ {cupon.montoMinimoRequerido.toFixed(2)}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                cupon.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 
                cupon.estado === 'EXPIRADO' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {cupon.estado}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button onClick={() => onEdit(cupon)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                <Edit size={16} />
              </button>
              <button onClick={() => onDelete(cupon.id)} className="text-red-600 hover:text-red-900">
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


// -----------------------------------------------------
// 3. Componente Principal (PaginaCuponesAdmin)
// -----------------------------------------------------
const PaginaCuponesAdmin = () => {
  const [cupones, setCupones] = useState<CuponResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para el modal de Creación/Edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cuponToEdit, setCuponToEdit] = useState<CuponResponse | null>(null);

  // Cargar lista de cupones
  const fetchCupones = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listarTodosLosCupones();
      setCupones(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido al cargar cupones.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCupones();
  }, [fetchCupones]);

  // Manejadores de CRUD
  const handleEdit = (cupon: CuponResponse) => {
    setCuponToEdit(cupon);
    setIsModalOpen(true);
  };
  
  const handleDelete = async (id: number) => {
    if (!window.confirm(`¿Está seguro de eliminar el cupón ID ${id}? Esta acción es irreversible.`)) {
      return;
    }
    try {
      await eliminarCupon(id);
      alert(`Cupón ${id} eliminado exitosamente.`);
      fetchCupones(); // Refrescar lista
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Error al intentar eliminar.');
    }
  };

  const handleOpenCreateModal = () => {
    setCuponToEdit(null); // Asegura que sea un modal de creación
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCuponToEdit(null);
  };

  const handleSaveSuccess = () => {
    // La lógica de alert/notificación se movió al formulario para simplificar
    handleCloseModal();
    fetchCupones(); // Refrescar lista después de crear/editar
  };


  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Administración de Cupones</h1>
      
      <div className="flex justify-end mb-6">
        <button 
          onClick={handleOpenCreateModal}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-150"
        >
          <Plus size={20} />
          <span>Crear Nuevo Cupón</span>
        </button>
      </div>

      {isLoading && <p className="py-10 text-center text-indigo-600 font-medium">Cargando cupones...</p>}
      
      {error && (
        <div className="p-4 my-4 bg-red-100 text-red-700 rounded-md">
          <p className="font-bold">Error de Conexión:</p>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && cupones.length > 0 && !error && (
        <CuponTable cupones={cupones} onEdit={handleEdit} onDelete={handleDelete} />
      )}
      
      {!isLoading && cupones.length === 0 && !error && (
        <p className="py-10 text-center text-gray-500 italic border border-dashed rounded-lg bg-white">No hay cupones registrados.</p>
      )}


      {/* Modal de Creación/Edición (Usando el Dialog del componente CrearCuponForm) */}
      <CrearCuponForm
          open={isModalOpen} // Usar el estado de apertura
          onClose={handleCloseModal} // Usar la función de cerrar
          onSuccess={handleSaveSuccess}
          cuponDataToEdit={cuponToEdit} 
      />
    </div>
  );
};

export default PaginaCuponesAdmin;