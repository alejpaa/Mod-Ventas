import { useEffect, useState, type FormEvent } from 'react';

interface Sede {
  id: number;
  name: string;
}

interface CreateModalProps {
  onClose: () => void;
  onSaveSuccess: () => void;
}

type SellerFormData = {
  dni: string;
  firstName: string;
  lastName: string;
  type: string;
  email: string;
  phone_number: string;
  address: string;
  idSede: number | string; // Empezará como string "" y luego será un número
};

const initialState: SellerFormData = {
  dni: '',
  firstName: '',
  lastName: '',
  type: '',
  email: '',
  phone_number: '',
  address: '',
  idSede: '',
};

const MOCK_SEDES: Sede[] = [
  { id: 1, name: 'Módulo Real Plaza - 1er Piso' },
  { id: 2, name: 'Call Center (Piso 4 - Lima Norte)' },
  { id: 3, name: 'Distribuidor Autorizado (Lince)' },
  { id: 4, name: 'Oficina Central - Miraflores' },
  { id: 5, name: 'Tienda San Isidro - Calle Elías' },
  { id: 6, name: 'Agencia Arequipa Sur' },
  { id: 7, name: 'Agencia Cusco Plaza' },
  { id: 8, name: 'Módulo Tottus - Trujillo' },
];

export function CreateSellerModal({ onClose, onSaveSuccess }: CreateModalProps) {
  const [formData, setFormData] = useState<SellerFormData>(initialState);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sedes, setSedes] = useState<Sede[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSedeDropdownOpen, setIsSedeDropdownOpen] = useState(false);
  const [selectedSedeName, setSelectedSedeName] = useState('');

  useEffect(() => {
    const fetchSedes = async () => {
      // Simulamos fetch con datos mock
      setSedes(MOCK_SEDES);
    };
    fetchSedes();
  }, []);

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
        idSede: '',
      }));
    } else {
      setIsSedeDropdownOpen(false);
      setFormData((prev) => ({
        ...prev,
        idSede: '',
      }));
    }
    setSelectedSedeName(query);
  };

  const handleSedeSelect = (sede: Sede) => {
    setFormData((prev) => ({
      ...prev,
      idSede: sede.id,
    }));
    setSelectedSedeName(sede.name);
    setSearchQuery(sede.name);
    setIsSedeDropdownOpen(false);
  };

  // Para el manejo de cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'idSede' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleSearchHR = async () => {
    // TODO
    // ... (Lógica para buscar en RRHH por DNI y autocompletar)
    // Estaba pensando si llamar directamente a la api que exponen ellos o desde mi backend los llamo
    // setIsSearching(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    // Voy añadiendo de a poco las validaciones mientra más campos se agregan
    if (
      !formData.dni ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.type ||
      typeof formData.idSede !== 'number'
    ) {
      setError('Por favor, complete todos los campos obligatorios.');
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/vendedores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el vendedor');
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
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ... (Encabezado no cambia) ... */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Registrar Nuevo Vendedor</h2>
          <button onClick={onClose} className="text-gray-500 text-3xl">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Dividimos en 2 columnas */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* Tipo de Vendedor */}
            <div>
              <label>Tipo de Vendedor</label>
              {/* Gozu esta opción de select */}
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="Externo">Externo</option>
                <option value="Interno">Interno (Planilla)</option>
              </select>
            </div>

            {/* DNI y Botón RRHH */}
            <div className="col-span-2">
              <label>DNI</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  placeholder="Ej: 12345678"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                {/* Agregamos condicional para agregar el botón de RRHH */}
                {formData.type === 'Interno' && (
                  <button
                    type="button"
                    onClick={handleSearchHR}
                    className="mt-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-md whitespace-nowrap"
                  >
                    Buscar en RRHH
                  </button>
                )}
              </div>
            </div>

            {/* Nombres */}
            <div>
              <label>Nombres</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ej: Juan"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Apellidos */}
            <div>
              <label>Apellidos</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Ej: Pérez"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Correo Electrónico */}
            <div>
              <label>Correo Electrónico</label>
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
              <label>Teléfono</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Dirección */}
            <div className="col-span-2">
              <label>Dirección</label>
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
              <label>Sede de venta asignada</label>
              {/* Input de busqueda */}
              <input
                type="text"
                value={selectedSedeName}
                onChange={handleSedeSearchChange}
                onFocus={() => setIsSedeDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsSedeDropdownOpen(false), 200)}
                placeholder="Busque por nombre de sede..."
                className={`mt-1 block w-full border rounded-md p-2 ${formData.idSede === '' && 'border-red-400'}`}
              />

              {formData.idSede !== '' && (
                <p className="text-xs text-green-600 mt-1">
                  Sede ID **{formData.idSede}** seleccionada.
                </p>
              )}

              {isSedeDropdownOpen && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-40 overflow-y-auto rounded-md shadow-lg">
                  {filteredSedes.length > 0 ? (
                    filteredSedes.map((sede) => (
                      <li
                        key={sede.id}
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

          {/* ... (Botones 'Cancelar' y 'Guardar' no cambian) ... */}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              {isSaving ? 'Guardando...' : 'Guardar Vendedor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
