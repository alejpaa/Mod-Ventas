import { useEffect, useMemo, useState } from 'react';
import { obtenerClientePorId, actualizarCliente } from '../services/cliente.service';
import type { ModificacionClienteRequest } from '../types/cliente.types';

type Paso = 1 | 2 | 3;

interface Props {
  clienteId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const opcionesEstado = ['ACTIVO', 'INACTIVO'];
const opcionesGenero = ['Masculino', 'Femenino', 'Prefiero no decirlo'];
const opcionesNivelEducativo = ['Primaria', 'Secundaria', 'Técnico', 'Universitario', 'Postgrado'];
const opcionesIdioma = ['Español', 'Inglés', 'Portugués'];
const opcionesCanal = ['Email', 'Teléfono', 'WhatsApp', 'SMS'];

export function ModalActualizarCliente({ clienteId, onClose, onSuccess }: Props) {
  const [paso, setPaso] = useState<Paso>(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<
    ModificacionClienteRequest & {
      genero?: string;
      nivelEducativo?: string;
      ocupacion?: string;
      departamento?: string;
      provincia?: string;
      distrito?: string;
      referencia?: string;
      idioma?: string;
      canalContacto?: string;
      intereses?: string;
      aceptaPublicidad?: boolean;
      edad?: number;
    }
  >({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await obtenerClientePorId(clienteId);
        let fechaNacimiento = '';
        if (data.fechaNacimiento) {
          const d = new Date(data.fechaNacimiento);
          if (!isNaN(d.getTime())) fechaNacimiento = d.toISOString().split('T')[0];
        }
        setFormData({
          dni: data.dni,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          telefonoFijo: data.telefonoFijo,
          address: data.address,
          fechaNacimiento,
          estado: data.estado,
        });
      } catch (e: any) {
        setError(e?.message || 'No se pudo cargar el cliente');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [clienteId]);

  const edadCalculada = useMemo(() => {
    if (!formData.fechaNacimiento) return undefined;
    const birth = new Date(formData.fechaNacimiento);
    if (isNaN(birth.getTime())) return undefined;
    const diff = Date.now() - birth.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }, [formData.fechaNacimiento]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    const checked = 'checked' in target ? target.checked : false;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validarPaso = (): boolean => {
    if (paso === 1) return Boolean(formData.dni && formData.firstName && formData.lastName);
    if (paso === 2) return Boolean(formData.phoneNumber);
    return true;
  };

  const handleGuardar = async () => {
    if (!validarPaso()) {
      setError('Completa los campos obligatorios marcados con *');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload: ModificacionClienteRequest = {
        dni: formData.dni,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        telefonoFijo: formData.telefonoFijo,
        address: formData.address,
        fechaNacimiento: formData.fechaNacimiento,
        estado: formData.estado,
      };
      await actualizarCliente(clienteId, payload);
      onSuccess();
      onClose();
    } catch (e: any) {
      setError(e?.message || 'No se pudo guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleDesactivar = () => {
    if (!confirm('¿Seguro que deseas desactivar este cliente?')) return;
    setFormData((prev) => ({ ...prev, estado: 'INACTIVO' }));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 shadow-md">Cargando cliente...</div>
      </div>
    );
  }

  const PasoBadge = ({ num, label }: { num: number; label: string }) => (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${paso === num ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
    >
      <span className="w-6 h-6 rounded-full border flex items-center justify-center text-sm font-semibold">
        {num}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden flex flex-col" style={{ height: '85vh' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-2xl font-semibold text-gray-900">Actualizar Cliente</h2>
          <button className="text-gray-500 text-xl font-bold" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="flex gap-4 px-6 pt-4 pb-2 border-b bg-gray-50">
          <PasoBadge num={1} label="Datos Personales" />
          <PasoBadge num={2} label="Datos de Contacto" />
          <PasoBadge num={3} label="Preferencias" />
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="px-6 py-6 overflow-y-auto flex-1">
          {paso === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">DNI/RUC *</label>
                  <input
                    name="dni"
                    value={formData.dni || ''}
                    onChange={handleChange}
                    maxLength={12}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Estado *</label>
                  <select
                    name="estado"
                    value={formData.estado || 'ACTIVO'}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    {opcionesEstado.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === 'ACTIVO' ? 'Activo' : 'Inactivo'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Nombres *</label>
                  <input
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Apellidos *</label>
                  <input
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Fecha de nacimiento</label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Edad</label>
                  <input
                    value={edadCalculada ?? ''}
                    disabled
                    placeholder="Automático"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 text-gray-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Género</label>
                  <select
                    name="genero"
                    value={formData.genero || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccione...</option>
                    {opcionesGenero.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Nivel educativo</label>
                  <select
                    name="nivelEducativo"
                    value={formData.nivelEducativo || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccione...</option>
                    {opcionesNivelEducativo.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Ocupación</label>
                <input
                  name="ocupacion"
                  value={formData.ocupacion || ''}
                  onChange={handleChange}
                  placeholder="Ej: Ingeniero, Estudiante, etc."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {paso === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Teléfono móvil *</label>
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Teléfono fijo</label>
                  <input
                    name="telefonoFijo"
                    value={formData.telefonoFijo || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Dirección completa</label>
                <textarea
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Departamento</label>
                  <input
                    name="departamento"
                    value={formData.departamento || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Provincia</label>
                  <input
                    name="provincia"
                    value={formData.provincia || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Distrito</label>
                  <input
                    name="distrito"
                    value={formData.distrito || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Referencia</label>
                  <input
                    name="referencia"
                    value={formData.referencia || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {paso === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Idioma preferido</label>
                  <select
                    name="idioma"
                    value={formData.idioma || 'Español'}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    {opcionesIdioma.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">
                    Canal de contacto favorito
                  </label>
                  <select
                    name="canalContacto"
                    value={formData.canalContacto || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccione...</option>
                    {opcionesCanal.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Intereses declarados</label>
                <textarea
                  name="intereses"
                  value={formData.intereses || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Tecnología, Deportes, Moda..."
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="aceptaPublicidad"
                  checked={formData.aceptaPublicidad || false}
                  onChange={handleChange}
                  className="h-4 w-4 border-gray-300"
                />
                Acepta publicidad
              </label>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`w-8 h-8 rounded-full border text-sm font-medium ${paso === n ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300'}`}
                onClick={() => setPaso(n as Paso)}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800" onClick={onClose}>
              Cancelar
            </button>
            <button
              className="px-5 py-2 rounded-lg bg-red-100 text-red-700 border border-red-200"
              onClick={handleDesactivar}
              type="button"
            >
              Desactivar Cliente
            </button>
            <button
              className="px-5 py-2 rounded-lg bg-blue-500 text-white"
              onClick={handleGuardar}
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
