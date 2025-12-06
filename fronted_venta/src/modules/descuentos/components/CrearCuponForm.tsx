// src/modules/descuentos/components/CrearCuponForm.tsx

import React, { useState } from 'react';
import type { CrearCuponRequest } from '../types/cupon.types';
import { initialCuponRequest } from '../types/cupon.types';
import { crearCupon } from '../services/cupon.service';
import { DollarSign, Percent } from 'lucide-react'; 

interface CrearCuponFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  // Propiedad opcional para indicar que estamos editando
  cuponDataToEdit?: CrearCuponRequest & { id?: number } | null;
}

const CrearCuponForm: React.FC<CrearCuponFormProps> = ({ onSuccess, onCancel, cuponDataToEdit }) => {
  const [formData, setFormData] = useState<CrearCuponRequest>(
    cuponDataToEdit || initialCuponRequest
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isEditing = !!cuponDataToEdit;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' && name !== 'usosMaximos' 
        ? parseFloat(value) 
        : type === 'number' && name === 'usosMaximos'
        ? (value === '' ? null : parseInt(value))
        : value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    // Normalizar usosMaximos a null si el usuario dejó 0 o vacío
    const finalData = {
        ...formData,
        usosMaximos: (formData.usosMaximos === 0 || formData.usosMaximos === null) ? null : formData.usosMaximos
    }

    try {
      // Simulación de creación/edición (PENDIENTE de implementar la lógica de edición en el service)
      if (isEditing) {
          // Lógica para actualizarCupon(cuponDataToEdit.id, finalData)
          setSuccessMessage(`Cupón ${formData.codigo} actualizado exitosamente.`);
      } else {
          await crearCupon(finalData);
          setSuccessMessage(`Cupón ${formData.codigo} creado exitosamente.`);
          setFormData(initialCuponRequest); // Limpiar solo si es creación
      }
      
      onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido al guardar el cupón.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-900">
        {isEditing ? 'Editar Cupón' : 'Crear Nuevo Cupón'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Usamos una cuadrícula para organizar los campos en dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Columna 1: Código y Tipo */}
            <div className="space-y-6">
                {/* Código del Cupón */}
                <div>
                  <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">Código {isEditing && `(ID: ${cuponDataToEdit?.id})`}</label>
                  <input
                    type="text"
                    id="codigo"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    required
                    // Desactivamos la edición del código si estamos editando (opcional)
                    disabled={isEditing} 
                    className={`mt-1 block w-full border ${isEditing ? 'bg-gray-50' : 'bg-white'} border-gray-300 rounded-md shadow-sm p-3`}
                  />
                </div>
                
                {/* Tipo de Descuento (Select) */}
                <div>
                  <label htmlFor="tipoDescuento" className="block text-sm font-medium text-gray-700">Tipo de Descuento</label>
                  <select
                    id="tipoDescuento"
                    name="tipoDescuento"
                    value={formData.tipoDescuento}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 bg-white"
                    required
                  >
                    <option value="PORCENTAJE">Porcentaje (%)</option>
                    <option value="MONTO_FIJO">Monto Fijo (S/)</option>
                  </select>
                </div>
            </div>

            {/* Columna 2: Valor y Usos Máximos */}
            <div className="space-y-6">
                {/* Valor del Descuento */}
                <div>
                  <label htmlFor="valor" className="block text-sm font-medium text-gray-700">Valor del Descuento</label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      {formData.tipoDescuento === 'PORCENTAJE' ? <Percent className="h-5 w-5 text-indigo-500" /> : <DollarSign className="h-5 w-5 text-indigo-500" />}
                    </div>
                    <input
                      type="number"
                      id="valor"
                      name="valor"
                      step={formData.tipoDescuento === 'PORCENTAJE' ? '0.01' : '0.10'}
                      min="0"
                      value={formData.valor === 0 ? '' : formData.valor}
                      onChange={handleChange}
                      required
                      placeholder={formData.tipoDescuento === 'PORCENTAJE' ? 'Ej. 0.15 (15%)' : 'Ej. 50.00'}
                      className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Usos Máximos */}
                <div>
                  <label htmlFor="usosMaximos" className="block text-sm font-medium text-gray-700">Usos Máximos (0 o vacío = Ilimitado)</label>
                  <input
                    type="number"
                    id="usosMaximos"
                    name="usosMaximos"
                    min="0"
                    value={formData.usosMaximos === null ? '' : formData.usosMaximos}
                    onChange={handleChange}
                    placeholder="Ej. 100 o dejar en blanco"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
                  />
                </div>
            </div>
        </div>
        
        {/* Fila Única: Fecha Expiración y Monto Mínimo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Fecha de Expiración */}
            <div>
              <label htmlFor="fechaExpiracion" className="block text-sm font-medium text-gray-700">Fecha de Expiración</label>
              <input
                type="date"
                id="fechaExpiracion"
                name="fechaExpiracion"
                value={formData.fechaExpiracion}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 bg-white"
                required
              />
            </div>
            
            {/* Monto Mínimo Requerido */}
            <div>
              <label htmlFor="montoMinimoRequerido" className="block text-sm font-medium text-gray-700">Monto Mínimo Requerido (S/)</label>
              <input
                type="number"
                id="montoMinimoRequerido"
                name="montoMinimoRequerido"
                step="0.01"
                min="0"
                value={formData.montoMinimoRequerido}
                onChange={handleChange}
                required
                placeholder="Ej. 100.00"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
              />
            </div>
        </div>
        
        {/* Mensajes de Estado */}
        {error && <p className="text-red-600 font-medium text-sm border border-red-200 p-2 rounded-md bg-red-50">{error}</p>}
        {successMessage && <p className="text-green-600 font-medium text-sm border border-green-200 p-2 rounded-md bg-green-50">{successMessage}</p>}

        {/* Botones de Acción */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 disabled:bg-indigo-400"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Cupón')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearCuponForm;