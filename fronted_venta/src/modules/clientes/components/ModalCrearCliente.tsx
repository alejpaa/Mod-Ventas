import { useEffect, useMemo, useState } from 'react';
import { registrarCliente } from '../services/cliente.service';
import type { RegistroClienteRequest } from '../types/cliente.types';

interface ModalCrearClienteProps {
  onClose: () => void;
  onSuccess: () => void;
}

type PasoFormulario = 1 | 2 | 3;

interface DatosClienteExtendido extends RegistroClienteRequest {
  estado?: string;
  fechaNacimiento?: string;
  edad?: number;
  genero?: string;
  nivelEducativo?: string;
  ocupacion?: string;
  telefonoFijo?: string;
  direccionCompleta?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  referencia?: string;
  idioma?: string;
  canalContacto?: string;
  intereses?: string;
  aceptaPublicidad?: boolean;
}

const opcionesEstado = ['ACTIVO', 'INACTIVO'];
const opcionesGenero = ['Masculino', 'Femenino'];
const opcionesNivelEducativo = [
  'Primaria',
  'Secundaria',
  'Técnico',
  'Universitario',
  'Postgrado',
];
const opcionesIdioma = ['Español', 'Inglés', 'Portugués'];
const opcionesCanal = ['Email', 'Teléfono', 'WhatsApp', 'SMS'];

export function ModalCrearCliente({ onClose, onSuccess }: ModalCrearClienteProps) {
  const [paso, setPaso] = useState<PasoFormulario>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<DatosClienteExtendido>({
    dni: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    estado: 'ACTIVO',
    genero: '',
    nivelEducativo: '',
    ocupacion: '',
    telefonoFijo: '',
    departamento: '',
    provincia: '',
    distrito: '',
    referencia: '',
    idioma: 'Español',
    canalContacto: '',
    intereses: '',
    aceptaPublicidad: false,
  });

  const calcularEdad = (fecha: string | undefined) => {
    if (!fecha) return undefined;
    const nacimiento = new Date(fecha);
    if (isNaN(nacimiento.getTime())) return undefined;
    const diferencia = Date.now() - nacimiento.getTime();
    const edadCalculada = Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365.25));
    return edadCalculada >= 0 ? edadCalculada : undefined;
  };

  const edadCalculada = useMemo(() => calcularEdad(formData.fechaNacimiento), [formData.fechaNacimiento]);

  useEffect(() => {
    if (edadCalculada !== formData.edad) {
      setFormData((prev) => ({ ...prev, edad: edadCalculada }));
    }
  }, [edadCalculada, formData.edad]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    const checked = 'checked' in target ? target.checked : false;
    const nextValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const camposObligatoriosPaso1 = formData.dni.trim() && formData.firstName.trim() && formData.lastName.trim();
  const camposObligatoriosPaso2 = formData.phoneNumber.trim();

  const sePuedeAvanzar = () => {
    if (paso === 1) return Boolean(camposObligatoriosPaso1);
    if (paso === 2) return Boolean(camposObligatoriosPaso2);
    return true;
  };

  const irAlSiguiente = () => {
    if (paso < 3 && sePuedeAvanzar()) {
      setPaso((prev) => (prev + 1) as PasoFormulario);
    }
  };

  const irAlAnterior = () => {
    if (paso > 1) {
      setPaso((prev) => (prev - 1) as PasoFormulario);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    if (!camposObligatoriosPaso1 || !camposObligatoriosPaso2) {
      setError('Completa los campos obligatorios marcados con *');
      if (!camposObligatoriosPaso1) setPaso(1);
      else setPaso(2);
      return;
    }

    const payload: RegistroClienteRequest = {
      dni: formData.dni.trim(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email?.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      address: formData.address || formData.direccionCompleta || '',
    };

    setIsSaving(true);
    try {
      await registrarCliente(payload);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'No se pudo registrar el cliente');
    } finally {
      setIsSaving(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center gap-2 mt-4">
      {[1, 2, 3].map((value) => (
        <button
          key={value}
          className={`w-8 h-8 rounded-full border text-sm font-medium transition-colors ${paso === value
              ? 'bg-primary-500 text-white border-primary-500'
              : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
            }`}
          onClick={() => setPaso(value as PasoFormulario)}
          type="button"
        >
          {value}
        </button>
      ))}
    </div>
  );

  const renderPaso1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            DNI *
          </label>
          <input
            name="dni"
            value={formData.dni}
            onChange={handleInputChange}
            maxLength={8}
            placeholder="Ingrese DNI"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado *
          </label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {opcionesEstado.map((opt) => (
              <option key={opt} value={opt}>
                {opt === 'ACTIVO' ? 'Activo' : 'Inactivo'}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Ingrese nombres"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellido *
          </label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Ingrese apellidos"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Edad
          </label>
          <input
            value={formData.edad ?? ''}
            disabled
            placeholder="Se calcula automáticamente"
            className="w-full px-3 py-2 border border-gray-200 rounded bg-gray-100 text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Género
          </label>
          <select
            name="genero"
            value={formData.genero}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Seleccione...</option>
            {opcionesGenero.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nivel educativo
          </label>
          <select
            name="nivelEducativo"
            value={formData.nivelEducativo}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Seleccione...</option>
            {opcionesNivelEducativo.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ocupación
        </label>
        <input
          name="ocupacion"
          value={formData.ocupacion}
          onChange={handleInputChange}
          placeholder="Ej: Ingeniero, Estudiante, etc."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
    </div>
  );

  const renderPaso2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="ejemplo@correo.com"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono móvil *
          </label>
          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="+51 999 888 777"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono fijo
          </label>
          <input
            name="telefonoFijo"
            value={formData.telefonoFijo || ''}
            onChange={handleInputChange}
            placeholder="(01) 123 4567"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección completa
        </label>
        <textarea
          name="direccionCompleta"
          value={formData.direccionCompleta || ''}
          onChange={handleInputChange}
          rows={2}
          placeholder="Av. Principal #123"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Departamento
          </label>
          <input
            name="departamento"
            value={formData.departamento || ''}
            onChange={handleInputChange}
            placeholder="Lima"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Provincia
          </label>
          <input
            name="provincia"
            value={formData.provincia || ''}
            onChange={handleInputChange}
            placeholder="Lima"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Distrito
          </label>
          <input
            name="distrito"
            value={formData.distrito || ''}
            onChange={handleInputChange}
            placeholder="Miraflores"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Referencia
          </label>
          <input
            name="referencia"
            value={formData.referencia || ''}
            onChange={handleInputChange}
            placeholder="Cerca al parque..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
    </div>
  );

  const renderPaso3 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Idioma preferido
          </label>
          <select
            name="idioma"
            value={formData.idioma}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {opcionesIdioma.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Canal de contacto favorito
          </label>
          <select
            name="canalContacto"
            value={formData.canalContacto}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Seleccione...</option>
            {opcionesCanal.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Intereses declarados
        </label>
        <textarea
          name="intereses"
          value={formData.intereses || ''}
          onChange={handleInputChange}
          rows={3}
          placeholder="Ej: Tecnología, Deportes, Moda..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          name="aceptaPublicidad"
          checked={formData.aceptaPublicidad || false}
          onChange={handleInputChange}
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        Sí, acepto recibir publicidad y ofertas
      </label>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div className="bg-white p-8 rounded-lg shadow-xl z-50 w-full max-w-4xl flex flex-col" style={{ height: '85vh' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Agregar Nuevo Cliente</h2>
          <button onClick={onClose} className="text-gray-500 text-3xl">
            &times;
          </button>
        </div>

        <div className="flex items-center gap-6 px-6 pt-4 pb-2 border-b bg-gray-50">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${paso === 1 ? 'bg-primary-100 text-primary-700' : 'text-gray-600'}`}>
            <span className="w-6 h-6 rounded-full border flex items-center justify-center text-sm font-semibold">
              1
            </span>
            <span className="text-sm font-medium">Datos Personales</span>
          </div>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${paso === 2 ? 'bg-primary-100 text-primary-700' : 'text-gray-600'}`}>
            <span className="w-6 h-6 rounded-full border flex items-center justify-center text-sm font-semibold">
              2
            </span>
            <span className="text-sm font-medium">Datos de Contacto</span>
          </div>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${paso === 3 ? 'bg-primary-100 text-primary-700' : 'text-gray-600'}`}>
            <span className="w-6 h-6 rounded-full border flex items-center justify-center text-sm font-semibold">
              3
            </span>
            <span className="text-sm font-medium">Preferencias</span>
          </div>
        </div>

        <div className="px-6 py-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}
          {paso === 1 && renderPaso1()}
          {paso === 2 && renderPaso2()}
          {paso === 3 && renderPaso3()}
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <StepIndicator />
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
              disabled={isSaving}
            >
              Cancelar
            </button>
            {paso > 1 && (
              <button
                onClick={irAlAnterior}
                className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-primary-400 transition-colors"
                disabled={isSaving}
                type="button"
              >
                Anterior
              </button>
            )}
            {paso < 3 && (
              <button
                onClick={irAlSiguiente}
                className="px-5 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:bg-gray-300"
                disabled={!sePuedeAvanzar() || isSaving}
                type="button"
              >
                Siguiente
              </button>
            )}
            {paso === 3 && (
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:bg-gray-300"
                disabled={isSaving}
                type="button"
              >
                {isSaving ? 'Guardando...' : 'Agregar Cliente'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

