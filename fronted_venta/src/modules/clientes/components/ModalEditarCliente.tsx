import { useState, useEffect, type FormEvent } from 'react';
import { type ClienteResponse, type ModificacionClienteRequest } from '../types/cliente.types';
import { obtenerClientePorId, actualizarCliente } from '../services/cliente.service';

interface ModalEditarClienteProps {
  clienteId: number;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export function ModalEditarCliente({ clienteId, onClose, onSaveSuccess }: ModalEditarClienteProps) {
  const [cliente, setCliente] = useState<ClienteResponse | null>(null);
  const [formData, setFormData] = useState<ModificacionClienteRequest>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del cliente
  useEffect(() => {
    const fetchCliente = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await obtenerClientePorId(clienteId);
        setCliente(data);
        // Inicializar formulario con los datos del cliente
        // Formatear fecha de nacimiento para el input date (YYYY-MM-DD)
        let fechaNacimientoFormatted = '';
        if (data.fechaNacimiento) {
          const date = new Date(data.fechaNacimiento);
          if (!isNaN(date.getTime())) {
            fechaNacimientoFormatted = date.toISOString().split('T')[0];
          }
        }

        setFormData({
          dni: data.dni || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          telefonoFijo: data.telefonoFijo || '',
          address: data.address || '',
          fechaNacimiento: fechaNacimientoFormatted,
          estado: data.estado || '',
        });
      } catch (err: any) {
        setError(err.message || 'Error al cargar los datos del cliente');
      } finally {
        setIsLoading(false);
      }
    };

    if (clienteId) {
      fetchCliente();
    }
  }, [clienteId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Preparar datos para enviar (solo los campos que tienen valor)
      const datosActualizacion: ModificacionClienteRequest = {};

      if (formData.dni) datosActualizacion.dni = formData.dni;
      if (formData.firstName) datosActualizacion.firstName = formData.firstName;
      if (formData.lastName) datosActualizacion.lastName = formData.lastName;
      if (formData.email) datosActualizacion.email = formData.email;
      if (formData.phoneNumber) datosActualizacion.phoneNumber = formData.phoneNumber;
      if (formData.telefonoFijo) datosActualizacion.telefonoFijo = formData.telefonoFijo;
      if (formData.address) datosActualizacion.address = formData.address;
      if (formData.fechaNacimiento) datosActualizacion.fechaNacimiento = formData.fechaNacimiento;
      if (formData.estado) datosActualizacion.estado = formData.estado;

      await actualizarCliente(clienteId, datosActualizacion);
      onSaveSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el cliente');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <p className="text-center">Cargando datos del cliente...</p>
        </div>
      </div>
    );
  }

  if (error && !cliente) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full min-w-[600px] mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Modificar Información del Cliente</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección: Datos Personales */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 bg-gray-100 p-2 rounded">
              Datos personales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID
                </label>
                <input
                  type="text"
                  value={cliente?.clienteId || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DNI *
                </label>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni || ''}
                  onChange={handleChange}
                  maxLength={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha nacimiento
                </label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Sección: Datos de Contacto */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 bg-gray-100 p-2 rounded">
              Datos de contacto
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono fijo
                </label>
                <input
                  type="text"
                  name="telefonoFijo"
                  value={formData.telefonoFijo || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Botón de envío */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded font-medium transition-colors"
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Guardando...' : 'Modificar información'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

