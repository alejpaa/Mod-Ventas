import { useEffect, useState, type FormEvent } from 'react';
// importamos la URL de VITE para un fallback si no se pasa como prop

// 1. Tipos de la Sede (coincide con la entidad Sede.java)
interface Sede {
  branchId: number; // Coincide con branchId del backend
  name: string;
}

// 2. Tipo de Datos del Formulario (Alineado a RegistroVendedorRequest.java)
type SellerFormData = {
  // Datos obligatorios
  dni: string;
  firstName: string;
  lastName: string;
  sellerType: 'INTERNAL' | 'EXTERNAL'; // Usamos los valores de Java
  sellerBranchId: number | string; // Usamos el nombre de Java, será number o string ""
  // Datos opcionales
  email: string;
  phoneNumber: string; // Coincide con phoneNumber de Java
  address: string;
  bankAccount: string;
  bankName: string;
  ruc: string;
  documentType: 'DNI' | 'CE' | 'PASSPORT' | 'RUC'; // Por defecto será DNI
};

// 3. Interfaz de Props del Modal
interface CreateModalProps {
  onClose: () => void;
  onSaveSuccess: () => void;
  apiBaseUrl: string; // <-- RECIBIMOS LA URL AQUÍ
}

const initialState: SellerFormData = {
  dni: '',
  firstName: '',
  lastName: '',
  sellerType: 'EXTERNAL', // Por defecto
  sellerBranchId: '',
  email: '',
  phoneNumber: '',
  address: '',
  bankAccount: '',
  bankName: '',
  ruc: '',
  documentType: 'DNI', // Por defecto
};

export function CreateSellerModal({ onClose, onSaveSuccess, apiBaseUrl }: CreateModalProps) {
  const [formData, setFormData] = useState<SellerFormData>(initialState);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sedes, setSedes] = useState<Sede[]>([]);
  const [isSedesLoading, setIsSedesLoading] = useState(false);

  // Estados para el Select de Sede
  const [searchQuery, setSearchQuery] = useState('');
  const [isSedeDropdownOpen, setIsSedeDropdownOpen] = useState(false);
  const [selectedSedeName, setSelectedSedeName] = useState('');


  // 4. FETCH REAL DE SEDES
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
      } catch (err: any) {
        setError(`Error al cargar sedes: ${err.message}`);
      } finally {
        setIsSedesLoading(false);
      }
    };
    fetchSedes();
  }, [apiBaseUrl]);

  // Filtra las sedes por el nombre escrito en el input
  const filteredSedes = sedes.filter((sede) =>
    sede.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSedeSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      setIsSedeDropdownOpen(true);
      // Limpiamos el ID de la sede si el usuario está buscando
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
    // Al seleccionar, guardamos el ID de la sede del backend (branchId)
    setFormData((prev) => ({
      ...prev,
      sellerBranchId: sede.branchId, // Usamos branchId
    }));
    setSelectedSedeName(sede.name);
    setSearchQuery(sede.name);
    setIsSedeDropdownOpen(false);
  };

  // Para el manejo de cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Si el campo es el tipo, actualizamos el DocumentType por defecto (DNI)
    if (name === 'sellerType' && value === 'INTERNAL') {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            documentType: 'DNI', // Aseguramos DNI para internos
            ruc: '', // Limpiamos RUC para internos
        }));
    } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
    }
  };

  const handleSearchHR = async () => {
    // 1. LLamar al endpoint /api/vendedores/dni/{dni}
    // 2. Usar los datos del VendedorResponse para autocompletar el formulario

    // Por ahora, solo simulación para indicar que la lógica iría aquí
    alert(`Buscando empleado con DNI: ${formData.dni}`);
  };

  // 5. SUBMIT DE CREACIÓN
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    // Validación básica antes de enviar
    if (
      !formData.dni ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.sellerType ||
      typeof formData.sellerBranchId !== 'number' // Verificamos que se haya seleccionado un ID numérico
    ) {
      setError('Por favor, complete DNI, Nombres, Apellidos y asigne una Sede.');
      setIsSaving(false);
      return;
    }

    try {
      // El Request Body ya coincide con RegistroVendedorRequest.java
      const requestBody = {
          dni: formData.dni,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          sellerType: formData.sellerType,
          sellerBranchId: formData.sellerBranchId, // Ya es un number
          ruc: formData.ruc,
          bankAccount: formData.bankAccount,
          bankName: formData.bankName,
          documentType: formData.documentType,
      };

      // POST /api/vendedores
      const response = await fetch(`${apiBaseUrl}/vendedores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        // El GlobalExceptionHandler devuelve un JSON de error
        const errorData = await response.json();
        // Mostrar el mensaje de negocio del backend (ej: "El DNI ya se encuentra registrado.")
        throw new Error(errorData.message || 'Error desconocido al registrar el vendedor.');
      }

      onSaveSuccess();
    } catch (err: any) {
      setError(err.message);
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
          <h2 className="text-2xl font-bold text-gray-800">Registrar Nuevo Vendedor</h2>
          <button onClick={onClose} className="text-gray-500 text-3xl">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4 p-2 bg-red-100 border border-red-300 rounded-md">{error}</p>}

          <div className="grid grid-cols-2 gap-x-6 gap-y-4">

            {/* Tipo de Vendedor */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>Tipo de Vendedor</label>
              <select
                name="sellerType" // <-- Nombre alineado al backend
                value={formData.sellerType}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="EXTERNAL">Externo</option>
                <option value="INTERNAL">Interno (Planilla)</option>
              </select>
            </div>

            {/* Document Type (Oculto, solo si es EXTERNAL y puede ser RUC) */}
            {formData.sellerType === 'EXTERNAL' && (
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Tipo Doc.</label>
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
            {/* Si es Interno, el tipo de documento es DNI, se puede ocultar */}
            {formData.sellerType === 'INTERNAL' && <div></div>}


            {/* DNI / RUC y Botón RRHH */}
            <div className="col-span-2">
              <label className='block text-sm font-medium text-gray-700'>DNI / {formData.sellerType === 'EXTERNAL' && 'RUC Opcional'}</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  placeholder="DNI (8 dígitos)"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />

                {/* Agregamos condicional para agregar el botón de RRHH */}
                {formData.sellerType === 'INTERNAL' && (
                  <button
                    type="button"
                    onClick={handleSearchHR}
                    disabled={!formData.dni || formData.dni.length !== 8}
                    className="mt-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-md whitespace-nowrap disabled:bg-gray-200 disabled:text-gray-500 transition-colors"
                  >
                    Buscar en RRHH
                  </button>
                )}
              </div>
            </div>

            {/* RUC (Solo si es EXTERNAL y DocumentType no es RUC, se puede omitir si solo usamos el campo DNI para la búsqueda) */}
            {formData.sellerType === 'EXTERNAL' && formData.documentType !== 'RUC' && (
                <div className='col-span-2'>
                  <label className='block text-sm font-medium text-gray-700'>RUC (Opcional)</label>
                  <input
                    type="text"
                    name="ruc"
                    value={formData.ruc}
                    onChange={handleChange}
                    placeholder="RUC (11 dígitos, opcional)"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
            )}


            {/* Nombres */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>Nombres</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ej: Juan"
                disabled={formData.sellerType === 'INTERNAL'} // Deshabilitado si viene de RRHH
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-50"
              />
            </div>

            {/* Apellidos */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>Apellidos</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Ej: Pérez"
                disabled={formData.sellerType === 'INTERNAL'}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-50"
              />
            </div>

            {/* Correo Electrónico */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>Correo Electrónico</label>
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
              <label className='block text-sm font-medium text-gray-700'>Teléfono</label>
              <input
                type="tel"
                name="phoneNumber" // <-- Nombre alineado al backend
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Dirección */}
            <div className="col-span-2">
              <label className='block text-sm font-medium text-gray-700'>Dirección</label>
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
              <label className='block text-sm font-medium text-gray-700'>Sede de venta asignada</label>
              {/* Input de busqueda */}
              <input
                type="text"
                value={selectedSedeName}
                onChange={handleSedeSearchChange}
                onFocus={() => setIsSedeDropdownOpen(true)}
                // Usamos onBlur con un timeout para que el onMouseDown (handleSedeSelect) se active primero
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
                        // Usamos onMouseDown para capturar el click antes del onBlur
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
          <h3 className="text-lg font-bold text-gray-700 mt-8 mb-4 border-t pt-4">Información Bancaria (Comisiones)</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className='block text-sm font-medium text-gray-700'>Cuenta Bancaria</label>
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
              <label className='block text-sm font-medium text-gray-700'>Nombre del Banco</label>
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
              {isSaving ? 'Guardando...' : 'Guardar Vendedor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
