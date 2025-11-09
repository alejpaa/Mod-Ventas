import { useState, type FormEvent } from 'react';
import { type Seller, SellerType } from '../types/seller.types'; // Traemos también SellerType

interface CreateModalProps {
  onClose: () => void;
  onSaveSuccess: () => void;
}

// Usamos Partial<> para que todos los campos sean opcionales al inicio
type SellerFormData = Partial<Seller> & {
  email?: string;
  phone?: string;
  lastName?: string;
  // ...y cualquier otro campo que tengas en el form
};

// --- Estado inicial del formulario (vacío) ---
const initialState: SellerFormData = {
  id: '',
  name: '',
  lastName: '',
  dni: '',
  type: undefined,
  sede: '',
  email: '',
  phone: '',
};

export function CreateSellerModal({ onClose, onSaveSuccess }: CreateModalProps) {

  // --- Estados para este componente ---
  const [formData, setFormData] = useState<SellerFormData>(initialState);
  const [isSaving, setIsSaving] = useState(false); // Para el botón 'Guardar'
  const [isSearching, setIsSearching] = useState(false); // Para 'Buscar en RRHH'
  const [error, setError] = useState<string | null>(null);

  // --- Manejadores de eventos ---

  // 1. Actualiza el estado 'formData' cuando cualquier input cambia
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 2. Lógica para buscar en RRHH
  const handleSearchHR = async () => {
    if (!formData.dni) {
      alert("Por favor, ingrese un DNI.");
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // Endpoint Ficticio: debes crear este endpoint en tu backend
      const response = await fetch(`/api/rrhh/buscar?dni=${formData.dni}`);
      if (!response.ok) throw new Error('DNI no encontrado en RRHH');

      const data = await response.json(); // Ej: { nombres: "Juan", apellidos: "Perez" }

      // Autocompleta el formulario
      setFormData(prev => ({
        ...prev,
        name: data.nombres,
        lastName: data.apellidos,
        email: data.email,
        phone: data.telefono,
      }));

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  // 3. Lógica para guardar el vendedor (el 'submit' del formulario)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    setIsSaving(true);
    setError(null);

    // Aquí irían tus validaciones
    if (!formData.id || !formData.name || !formData.dni) {
      setError("Los campos Código, Nombre y DNI son obligatorios.");
      setIsSaving(false);
      return;
    }

    try {
      // Llamamos a tu API para CREAR (usando el método POST)
      const response = await fetch('/api/vendedores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al guardar el vendedor');

      // ¡Éxito! Avisa a la página principal
      onSaveSuccess();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex justify-center items-center" // bg-black/20 para un transparente y backdrop-blur para desenfoque
      onClick={onClose}
    >
      {/* 2. Ventana emergente (el modal en sí) */}
      <div
        className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-2xl"
        onClick={e => e.stopPropagation()} // Evita que se cierre al hacer clic dentro
      >

        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Registrar Nuevo Vendedor</h2>
          <button onClick={onClose} className="text-gray-500 text-3xl">&times;</button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Contenido del formulario (basado en tu imagen) */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">

            {/* Tipo de Vendedor */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Vendedor</label>
              <select name="type" value={formData.type || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                <option value="">Seleccione...</option>
                <option value={SellerType.Interno}>Interno (Planilla)</option>
                <option value={SellerType.Externo}>Externo</option>
              </select>
            </div>

            {/* Código de Vendedor */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Código de Vendedor</label>
              <input type="text" name="id" value={formData.id || ''} onChange={handleChange} placeholder="Ej: V-INT-003" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>

            {/* DNI y Botón RRHH */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">DNI</label>
              <div className="flex items-center space-x-2">
                <input type="text" name="dni" value={formData.dni || ''} onChange={handleChange} placeholder="Ej: 12345678" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                <button type="button" onClick={handleSearchHR} disabled={isSearching} className="mt-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-md whitespace-nowrap">
                  {isSearching ? 'Buscando...' : 'Buscar en RRHH'}
                </button>
              </div>
            </div>

            {/* Nombres */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombres</label>
              <input type="text" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Ej: Juan" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>

            {/* Apellidos */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Apellidos</label>
              <input type="text" name="lastName" value={formData.lastName || ''} onChange={handleChange} placeholder="Ej: Pérez" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>

            {/* ... Agrega los demás campos (Correo, Teléfono, Zona) aquí ... */}

          </div>

          {/* Botones del pie del modal */}
          <div className="flex justify-end space-x-4 mt-8">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">
              Cancelar
            </button>
            <button type="submit" disabled={isSaving} className="bg-blue-600 text-white px-4 py-2 rounded-md">
              {isSaving ? 'Guardando...' : 'Guardar Vendedor'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
