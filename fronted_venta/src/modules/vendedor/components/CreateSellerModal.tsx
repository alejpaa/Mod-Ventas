import React, { useEffect, useState, type FormEvent } from 'react';
// Importamos los tipos necesarios. Asumimos que SedeResponse y VendedorResponse están en Vendedor.ts
import type { VendedorResponse, SedeResponse } from '../types/Vendedor';

// 1. Tipos de la Sede (coincide con la entidad Sede.java)
type Sede = SedeResponse;

// 2. Tipo de Datos del Formulario (Alineado a RegistroVendedorRequest.java y ModificacionVendedorRequest.java)
type SellerFormData = {
  // Datos principales
  dni: string;
  firstName: string;
  lastName: string;
  sellerType: 'INTERNAL' | 'EXTERNAL';
  sellerBranchId: number | string; // ID de la sede seleccionada

  // Datos de Contacto/Dirección
  email: string;
  phoneNumber: string;
  address: string;

  // Datos Bancarios/Fiscales
  bankAccount: string;
  bankName: string;
  ruc: string;
  documentType: 'DNI' | 'CE' | 'PASSPORT' | 'RUC';
};

// Estado inicial para el modo CREACIÓN
const initialState: SellerFormData = {
  dni: '',
  firstName: '',
  lastName: '',
  sellerType: 'EXTERNAL',
  sellerBranchId: '',
  email: '',
  phoneNumber: '',
  address: '',
  bankAccount: '',
  bankName: '',
  ruc: '',
  documentType: 'DNI',
};

interface RrhhData {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  telefono: string;
  direccion: string;
  idEmpleado: number;
  documentoIdentidad: string;
  // Agrega aquí cualquier otro campo que el RRHH DTO envíe que necesites
}

// 3. Interfaz de Props del Modal
interface CreateModalProps {
  onClose: () => void;
  onSaveSuccess: () => void;
  apiBaseUrl: string;
  sellerDataToEdit: VendedorResponse | null; // <-- Datos para la edición
}

// FUNCIÓN DE MAPEO: Convierte el DTO de la API (VendedorResponse) al estado del Formulario (SellerFormData)
const generateInitialState = (data: VendedorResponse | null): SellerFormData => {
  if (!data) return initialState;

  return {
    dni: data.dni || '',
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    sellerType: data.sellerType || 'EXTERNAL',
    sellerBranchId: data.sellerBranchId || '',
    email: data.email || '',
    phoneNumber: data.phoneNumber || '',
    address: data.address || '',
    bankAccount: data.bankAccount || '',
    bankName: data.bankName || '',
    ruc: data.ruc || '',
    documentType: data.documentType || 'DNI',
  };
};

export function CreateSellerModal({
  onClose,
  onSaveSuccess,
  apiBaseUrl,
  sellerDataToEdit,
}: CreateModalProps) {
  // 4. ESTADO INICIAL
  const [formData, setFormData] = useState<SellerFormData>(() =>
    generateInitialState(sellerDataToEdit)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sedes, setSedes] = useState<Sede[]>([]);
  const [isSedesLoading, setIsSedesLoading] = useState(false);

  // Estados para el Select de Sede
  const [searchQuery, setSearchQuery] = useState('');
  const [isSedeDropdownOpen, setIsSedeDropdownOpen] = useState(false);
  const [selectedSedeName, setSelectedSedeName] = useState('');

  // Lógica de Modo y Restricciones
  const isEditing = !!sellerDataToEdit;
  const sellerId = isEditing ? sellerDataToEdit!.sellerId : null;
  const isInternal = formData.sellerType === 'INTERNAL';
  // Deshabilitar Nombres/Apellidos/DNI si estamos EDITANDO un vendedor INTERNO
  const disablePersonalData = isInternal && isEditing;

  // 5. FETCH REAL DE SEDES
  useEffect(() => {
    const fetchSedes = async () => {
      setIsSedesLoading(true);
      try {
        // GET /api/sedes/activas
        const response = await fetch(`${apiBaseUrl}/sedes/activas`);

        if (!response.ok) {
          throw new Error('Error al cargar las sedes activas.');
        }

        const data: Sede[] = await response.json();
        setSedes(data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(`Error al cargar sedes: ${errorMessage}`);
      } finally {
        setIsSedesLoading(false);
      }
    };
    fetchSedes();

    // Precarga la sede actual en el campo de texto en modo edición
    if (sellerDataToEdit) {
      setSelectedSedeName(sellerDataToEdit.sellerBranchName || '');
    }
  }, [apiBaseUrl, sellerDataToEdit]);

  // Filtra las sedes por el nombre escrito en el input
  const filteredSedes = sedes.filter((sede) =>
    sede.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSedeSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      setIsSedeDropdownOpen(true);
      setFormData((prev) => ({
        ...prev,
        sellerBranchId: '',
      }));
    } else {
      setIsSedeDropdownOpen(false);
      setFormData((prev) => ({
        ...prev,
        sellerBranchId: '',
      }));
    }
    setSelectedSedeName(query);
  };

  const handleSedeSelect = (sede: Sede) => {
    setFormData((prev) => ({
      ...prev,
      sellerBranchId: sede.branchId,
    }));
    setSelectedSedeName(sede.name);
    setSearchQuery(sede.name);
    setIsSedeDropdownOpen(false);
  };

  // Manejo de cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'sellerType' && value === 'INTERNAL') {
      setFormData((prev) => ({
        ...prev,
        [name]: value as 'INTERNAL',
        documentType: 'DNI',
        ruc: '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSearchHR = async () => {
    if (!formData.dni) {
      setError('Ingrese el DNI para buscar en RRHH.');
      return;
    }

    setIsSaving(true); // Reutilizamos el estado de guardado para indicar la carga
    setError(null);

    try {
      // Llamada al nuevo endpoint Proxy de tu backend
      const response = await fetch(`${apiBaseUrl}/vendedores/rrhh-employee/${formData.dni}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al buscar empleado en RRHH.');
      }

      const data: RrhhData = await response.json();

      // AUTOCOMPLETADO DE CAMPOS
      setFormData((prev) => ({
        ...prev,
        dni: data.documentoIdentidad,
        firstName: data.nombres,
        lastName: `${data.apellidoPaterno} ${data.apellidoMaterno}`, // Concatenamos para el formulario
        email: data.email,
        phoneNumber: data.telefono,
        address: data.direccion,
        // CLAVE: Almacenamos el ID de RRHH en el campo de referencia (employee_rrhh_id)
        // Aunque este campo no existe en SellerFormData, lo enviamos en el request final.
        // Para ser limpios, deberías crear un campo temporal para este ID.
        // Por ahora, usaremos un truco en el submit, pero la DTO de Java lo tiene como employeeRrhhId
        // Como el campo en el DTO de Vendedor es employeeRrhhId (Long), actualizaremos el form data.
        employeeRrhhId: data.idEmpleado,
      }));

      alert(`Empleado ${data.nombres} encontrado. Datos rellenados.`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // 6. SUBMIT (POST para Crear, PUT para Editar)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    // Validación básica
    if (
      !formData.dni ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.sellerType ||
      typeof formData.sellerBranchId !== 'number'
    ) {
      setError('Por favor, complete DNI, Nombres, Apellidos y asigne una Sede.');
      setIsSaving(false);
      return;
    }

    // Determinar la URL y el Método
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${apiBaseUrl}/vendedores/${sellerId}` : `${apiBaseUrl}/vendedores`;

    try {
      // El Request Body ya es compatible con RegistroVendedorRequest/ModificacionVendedorRequest
      const requestBody = {
        ...formData,
        sellerBranchId: formData.sellerBranchId as number, // Asegura el tipo
      };

      // Llamada a la API
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error desconocido al procesar el vendedor.');
      }

      alert(isEditing ? 'Vendedor actualizado exitosamente!' : 'Vendedor registrado exitosamente!');
      onSaveSuccess();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-xl z-50 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? `Editar Vendedor (ID: ${sellerId})` : 'Registrar Nuevo Vendedor'}
          </h2>
          <button onClick={onClose} className="text-gray-500 text-3xl">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <p className="text-red-500 mb-4 p-2 bg-red-100 border border-red-300 rounded-md">
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* Tipo de Vendedor: Deshabilitado en Edición */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Vendedor</label>
              <select
                name="sellerType"
                value={formData.sellerType}
                onChange={handleChange}
                disabled={isEditing} // BLOQUEAR TIPO EN EDICIÓN
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
              >
                <option value="EXTERNAL">Externo</option>
                <option value="INTERNAL">Interno (Planilla)</option>
              </select>
            </div>

            {/* Document Type */}
            {formData.sellerType === 'EXTERNAL' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo Doc.</label>
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="DNI">DNI</option>
                  <option value="CE">CE (Carnet Extranjería)</option>
                  <option value="RUC">RUC</option>
                </select>
              </div>
            )}
            {formData.sellerType === 'INTERNAL' && <div></div>}

            {/* DNI / RUC y Botón RRHH */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                DNI / {formData.sellerType === 'EXTERNAL' && 'RUC Opcional'}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  placeholder="DNI (8 dígitos)"
                  disabled={isEditing} // BLOQUEAR DNI EN EDICIÓN
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
                />

                {formData.sellerType === 'INTERNAL' && (
                  <button
                    type="button"
                    onClick={handleSearchHR}
                    disabled={!formData.dni || formData.dni.length !== 8 || isEditing}
                    className="mt-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-md whitespace-nowrap disabled:bg-gray-200 disabled:text-gray-500 transition-colors"
                  >
                    Buscar en RRHH
                  </button>
                )}
              </div>
            </div>

            {/* RUC (Solo si es EXTERNAL y DocumentType es RUC) */}
            {formData.sellerType === 'EXTERNAL' && formData.documentType === 'RUC' && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">RUC (11 dígitos)</label>
                <input
                  type="text"
                  name="ruc"
                  value={formData.ruc}
                  onChange={handleChange}
                  placeholder="RUC (11 dígitos)"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            )}

            {/* Nombres */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombres</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ej: Juan"
                disabled={disablePersonalData} // APLICAR RESTRICCIÓN DE INTERNO
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
              />
            </div>

            {/* Apellidos */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Apellidos</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Ej: Pérez"
                disabled={disablePersonalData} // APLICAR RESTRICCIÓN DE INTERNO
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
              />
            </div>

            {/* Correo Electrónico */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Dirección */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Sede de venta */}
            <div className="col-span-2 relative">
              <label className="block text-sm font-medium text-gray-700">
                Sede de venta asignada
              </label>
              {/* Input de busqueda */}
              <input
                type="text"
                value={selectedSedeName}
                onChange={handleSedeSearchChange}
                onFocus={() => setIsSedeDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsSedeDropdownOpen(false), 200)}
                placeholder={isSedesLoading ? 'Cargando sedes...' : 'Busque por nombre de sede...'}
                disabled={isSedesLoading}
                className={`mt-1 block w-full border rounded-md p-2 ${formData.sellerBranchId === '' ? 'border-red-400' : 'border-gray-300'}`}
              />

              {formData.sellerBranchId !== '' && (
                <p className="text-xs text-green-600 mt-1">
                  Sede ID **{formData.sellerBranchId}** seleccionada.
                </p>
              )}

              {isSedeDropdownOpen && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-40 overflow-y-auto rounded-md shadow-lg">
                  {filteredSedes.length > 0 ? (
                    filteredSedes.map((sede) => (
                      <li
                        key={sede.branchId}
                        onMouseDown={() => handleSedeSelect(sede)}
                        className="p-2 cursor-pointer hover:bg-blue-100 text-gray-700"
                      >
                        {sede.name}
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-gray-500 italic">No se encontraron sedes.</li>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Bloque de Información Bancaria */}
          {!isInternal && (
            <>
              <h3 className="text-lg font-bold text-gray-700 mt-8 mb-4 border-t pt-4">
                Información Bancaria (Comisiones)
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cuenta Bancaria</label>
                  <input
                    type="text"
                    name="bankAccount"
                    value={formData.bankAccount}
                    onChange={handleChange}
                    placeholder="Ej: 001-XXXXXX-XX"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre del Banco
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="Ej: BCP, Interbank"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>
            </>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Guardar Vendedor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
