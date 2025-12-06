// src/modules/descuentos/components/CrearCuponForm.tsx

import React, { useState } from 'react';
import { crearCupon } from '../services/cupon.service';
import { DollarSign, Percent } from 'lucide-react';
import type { CrearCuponRequest } from '../types/cupon.types'; 
import { initialCuponRequest } from '../types/cupon.types';

interface CrearCuponFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CrearCuponForm: React.FC<CrearCuponFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<CrearCuponRequest>(initialCuponRequest);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' && name !== 'usosMaximos' 
        ? parseFloat(value) 
        : type === 'number' && name === 'usosMaximos'
        ? (value === '' ? null : parseInt(value)) // Manejar usosMaximos como null o int
        : value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    // Convertir usosMaximos a null si el usuario lo dejó vacío o puso 0 para simular "ilimitado"
    const finalData = {
        ...formData,
        usosMaximos: formData.usosMaximos === 0 ? null : formData.usosMaximos
    }

    try {
      await crearCupon(finalData);
      setSuccessMessage(`Cupón ${formData.codigo} creado exitosamente.`);
      setFormData(initialCuponRequest); // Limpiar formulario
      onSuccess(); // Opcional: Cerrar modal o refrescar lista
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido al crear el cupón.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Crear Nuevo Cupón de Descuento</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Código del Cupón */}
        <div>
          <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">Código</label>
          <input
            type="text"
            id="codigo"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="PORCENTAJE">Porcentaje (%)</option>
            <option value="MONTO_FIJO">Monto Fijo (S/)</option>
          </select>
        </div>
        
        {/* Valor del Descuento */}
        <div>
          <label htmlFor="valor" className="block text-sm font-medium text-gray-700">Valor</label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {formData.tipoDescuento === 'PORCENTAJE' ? <Percent className="h-5 w-5 text-gray-400" /> : <DollarSign className="h-5 w-5 text-gray-400" />}
            </div>
            <input
              type="number"
              id="valor"
              name="valor"
              step="0.01"
              min="0"
              value={formData.valor === 0 ? '' : formData.valor}
              onChange={handleChange}
              required
              placeholder={formData.tipoDescuento === 'PORCENTAJE' ? 'Ej. 0.15 para 15%' : 'Ej. 50.00 para S/ 50.00'}
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
            />
          </div>
        </div>
        
        {/* Fecha de Expiración */}
        <div>
          <label htmlFor="fechaExpiracion" className="block text-sm font-medium text-gray-700">Fecha de Expiración</label>
          <input
            type="date"
            id="fechaExpiracion"
            name="fechaExpiracion"
            value={formData.fechaExpiracion}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>

        {/* Usos Máximos */}
        <div>
          <label htmlFor="usosMaximos" className="block text-sm font-medium text-gray-700">Usos Máximos (Dejar vacío o 0 para ilimitado)</label>
          <input
            type="number"
            id="usosMaximos"
            name="usosMaximos"
            min="0"
            value={formData.usosMaximos === null ? '' : formData.usosMaximos}
            onChange={handleChange}
            placeholder="Ej. 100"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        
        {/* Mensajes de Estado */}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {successMessage && <p className="text-green-600 text-sm font-medium">{successMessage}</p>}

        {/* Botones de Acción */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            disabled={isLoading}
          >
            {isLoading ? 'Creando...' : 'Crear Cupón'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearCuponForm;