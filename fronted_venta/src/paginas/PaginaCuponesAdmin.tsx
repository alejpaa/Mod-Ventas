// src/paginas/PaginaCuponesAdmin.tsx

import React, { useState, useEffect, useCallback } from 'react';
import CrearCuponForm from '../modules/descuentos/components/CrearCuponForm';
import { listarTodosLosCupones, eliminarCupon } from '../modules/descuentos/services/cupon.service';
import type { CuponResponse } from '../modules/descuentos/types/cupon.types';
import { Plus, Trash2, Edit, X } from 'lucide-react'; // Asumiendo que Lucide es tu librería de iconos

// --- Componente Local de la Tabla de Cupones (Simplificado) ---
// En un proyecto real, esto debería estar en un archivo aparte (CuponTable.tsx)
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
          {['ID', 'Código', 'Tipo', 'Valor', 'Expiración', 'Usos (Max)', 'Monto Mín.', 'Estado', 'Acciones'].map((header) => (
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
              {cupon.tipoDescuento === 'PORCENTAJE' ? `${(cupon.valor * 100).toFixed(0)}%` : `S/ ${cupon.valor.toFixed(2)}`}
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


// --- Componente Principal ---
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


      {/* Modal de Creación/Edición (se usa el mismo componente CrearCuponForm) */}
      {isModalOpen && (
          <Modal title={cuponToEdit ? 'Editar Cupón' : 'Crear Cupón'} onClose={handleCloseModal}>
              <CrearCuponForm
                  onSuccess={handleSaveSuccess}
                  onCancel={handleCloseModal}
                  cuponDataToEdit={cuponToEdit}
              />
          </Modal>
      )}
    </div>
  );
};

export default PaginaCuponesAdmin;

// --- Modal Básico (Necesario para envolver el formulario, asume que no tienes uno global) ---
// Puedes mover esto a src/components/Modal.tsx si es necesario
const Modal: React.FC<{ children: React.ReactNode, title: string, onClose: () => void }> = ({ children, title, onClose }) => (
  <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
    <div className="relative bg-white rounded-xl max-w-2xl w-full mx-auto shadow-2xl">
      {/* Header del Modal */}
      <div className="p-5 border-b flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>
      {/* Contenido del Modal */}
      <div className="p-5">
        {children}
      </div>
    </div>
  </div>
);