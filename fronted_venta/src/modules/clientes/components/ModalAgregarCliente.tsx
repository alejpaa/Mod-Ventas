import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { type RegistroClienteRequest } from '../types/cliente.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface ModalAgregarClienteProps {
  onClose: () => void;
  onSaveSuccess: () => void;
}

type TabType = 'personal' | 'contacto' | 'preferencias';

export function ModalAgregarCliente({ onClose, onSaveSuccess }: ModalAgregarClienteProps) {
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<RegistroClienteRequest>({
    // Datos Personales
    dni: '',
    estado: 'ACTIVO',
    firstName: '',
    lastName: '',
    fechaNacimiento: '',
    genero: '',
    edad: undefined,
    nivelEducativo: '',
    ocupacion: '',
    // Datos de Contacto
    email: '',
    phoneNumber: '',
    telefonoFijo: '',
    direccionCompleta: '',
    departamento: '',
    provincia: '',
    distrito: '',
    referencia: '',
    // Preferencias
    idiomaPreferido: 'Español',
    canalContactoFavorito: '',
    intereses: '',
    aceptaPublicidad: false,
  });

  // Calcular edad automáticamente desde fecha de nacimiento
  useEffect(() => {
    if (formData.fechaNacimiento) {
      const birthDate = new Date(formData.fechaNacimiento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setFormData(prev => ({ ...prev, edad: age >= 0 ? age : undefined }));
    } else {
      setFormData(prev => ({ ...prev, edad: undefined }));
    }
  }, [formData.fechaNacimiento]);

  // Guardar datos en localStorage para persistencia
  useEffect(() => {
    const hasData = Object.values(formData).some(value => 
      value !== '' && value !== undefined && value !== false
    );
    if (hasData) {
      localStorage.setItem('clienteFormData', JSON.stringify(formData));
      setHasUnsavedChanges(true);
    }
  }, [formData]);

  // Cargar datos guardados al montar
  useEffect(() => {
    const savedData = localStorage.getItem('clienteFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
        setHasUnsavedChanges(true);
      } catch (e) {
        // Ignorar errores de parsing
      }
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    // Validar que el DNI solo contenga números
    if (name === 'dni' && value && !/^\d*$/.test(value)) {
      return; // No actualizar si no es un número
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Limpiar error general cuando se hace un cambio
    if (error) {
      setError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar Datos Personales
    if (!formData.dni || formData.dni.trim() === '') {
      newErrors.dni = 'El DNI es obligatorio';
    } else if (!/^\d{8}$/.test(formData.dni)) {
      newErrors.dni = 'El DNI debe tener 8 dígitos';
    }

    if (!formData.estado) {
      newErrors.estado = 'El estado es obligatorio';
    }

    if (!formData.firstName || formData.firstName.trim() === '') {
      newErrors.firstName = 'El nombre es obligatorio';
    }

    if (!formData.lastName || formData.lastName.trim() === '') {
      newErrors.lastName = 'El apellido es obligatorio';
    }

    // Validar Datos de Contacto
    if (!formData.phoneNumber || formData.phoneNumber.trim() === '') {
      newErrors.phoneNumber = 'El teléfono móvil es obligatorio';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTabChange = (tab: TabType) => {
    // Validar pestaña actual antes de cambiar
    if (activeTab === 'personal') {
      if (!formData.dni || !formData.firstName || !formData.lastName || !formData.estado) {
        setError('Por favor complete los campos obligatorios de la pestaña actual');
        return;
      }
    } else if (activeTab === 'contacto') {
      if (!formData.phoneNumber) {
        setError('Por favor complete el teléfono móvil (obligatorio)');
        return;
      }
    }
    
    setError(null);
    setActiveTab(tab);
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmCancel = window.confirm(
        '¿Está seguro de cancelar? Se perderán todos los datos ingresados.'
      );
      if (!confirmCancel) return;
    }
    
    localStorage.removeItem('clienteFormData');
    setHasUnsavedChanges(false);
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Por favor complete todos los campos obligatorios correctamente');
      // Cambiar a la pestaña con errores
      if (errors.dni || errors.firstName || errors.lastName || errors.estado) {
        setActiveTab('personal');
      } else if (errors.phoneNumber || errors.email) {
        setActiveTab('contacto');
      }
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Preparar datos para enviar al backend
      const dataToSend = {
        dni: formData.dni,
        estado: formData.estado,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || undefined,
        phoneNumber: formData.phoneNumber,
        telefonoFijo: formData.telefonoFijo || undefined,
        address: formData.direccionCompleta || undefined,
        fechaNacimiento: formData.fechaNacimiento || undefined,
        // Campos adicionales que el backend podría aceptar
        ...(formData.genero && { genero: formData.genero }),
        ...(formData.edad && { edad: formData.edad }),
        ...(formData.nivelEducativo && { nivelEducativo: formData.nivelEducativo }),
        ...(formData.ocupacion && { ocupacion: formData.ocupacion }),
        ...(formData.departamento && { departamento: formData.departamento }),
        ...(formData.provincia && { provincia: formData.provincia }),
        ...(formData.distrito && { distrito: formData.distrito }),
        ...(formData.referencia && { referencia: formData.referencia }),
        ...(formData.idiomaPreferido && { idiomaPreferido: formData.idiomaPreferido }),
        ...(formData.canalContactoFavorito && { canalContactoFavorito: formData.canalContactoFavorito }),
        ...(formData.intereses && { intereses: formData.intereses }),
        ...(formData.aceptaPublicidad !== undefined && { aceptaPublicidad: formData.aceptaPublicidad }),
      };

      const response = await fetch(`${API_BASE_URL}/clientes/registroClientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: No se pudo registrar el cliente`);
      }

      // Limpiar datos guardados
      localStorage.removeItem('clienteFormData');
      setHasUnsavedChanges(false);
      onSaveSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al registrar el cliente');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'personal' as TabType, label: 'Datos Personales', number: 1 },
    { id: 'contacto' as TabType, label: 'Datos de Contacto', number: 2 },
    { id: 'preferencias' as TabType, label: 'Preferencias', number: 3 },
  ];

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Agregar Nuevo Cliente</h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
            disabled={isSaving}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <nav className="flex space-x-1" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                disabled={isSaving}
                className={`
                  px-6 py-4 text-sm font-medium transition-all duration-200 relative
                  ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  border-b-2 border-transparent
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }
                    `}
                  >
                    {tab.number}
                  </span>
                  {tab.label}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PESTAÑA 1: DATOS PERSONALES */}
            {activeTab === 'personal' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      DNI <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="dni"
                      value={formData.dni}
                      onChange={handleChange}
                      placeholder="Ingrese DNI"
                      maxLength={8}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.dni ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.dni && (
                      <p className="mt-1 text-xs text-red-500">{errors.dni}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.estado ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="ACTIVO">Activo</option>
                      <option value="INACTIVO">Inactivo</option>
                    </select>
                    {errors.estado && (
                      <p className="mt-1 text-xs text-red-500">{errors.estado}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Ingrese nombres"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Ingrese apellidos"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de nacimiento
                    </label>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.fechaNacimiento && (
                      <p className="mt-1 text-xs text-gray-500">
                        Fecha: {formatDateForDisplay(formData.fechaNacimiento)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Edad
                    </label>
                    <input
                      type="number"
                      name="edad"
                      value={formData.edad || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      placeholder="Se calcula automáticamente"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Género
                    </label>
                    <select
                      name="genero"
                      value={formData.genero}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione...</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                      <option value="Prefiero no decir">Prefiero no decir</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nivel educativo
                    </label>
                    <select
                      name="nivelEducativo"
                      value={formData.nivelEducativo}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione...</option>
                      <option value="Primaria">Primaria</option>
                      <option value="Secundaria">Secundaria</option>
                      <option value="Técnico">Técnico</option>
                      <option value="Universitario">Universitario</option>
                      <option value="Posgrado">Posgrado</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ocupación
                    </label>
                    <input
                      type="text"
                      name="ocupacion"
                      value={formData.ocupacion}
                      onChange={handleChange}
                      placeholder="Ej: Ingeniero, Estudiante, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PESTAÑA 2: DATOS DE CONTACTO */}
            {activeTab === 'contacto' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ejemplo@correo.com"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono móvil <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+51 999 888 777"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono fijo
                    </label>
                    <input
                      type="tel"
                      name="telefonoFijo"
                      value={formData.telefonoFijo}
                      onChange={handleChange}
                      placeholder="(01) 123 4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección completa
                    </label>
                    <textarea
                      name="direccionCompleta"
                      value={formData.direccionCompleta}
                      onChange={handleChange}
                      placeholder="Av. Principal #123"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departamento
                    </label>
                    <input
                      type="text"
                      name="departamento"
                      value={formData.departamento}
                      onChange={handleChange}
                      placeholder="Lima"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Provincia
                    </label>
                    <input
                      type="text"
                      name="provincia"
                      value={formData.provincia}
                      onChange={handleChange}
                      placeholder="Lima"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Distrito
                    </label>
                    <input
                      type="text"
                      name="distrito"
                      value={formData.distrito}
                      onChange={handleChange}
                      placeholder="Miraflores"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Referencia
                    </label>
                    <textarea
                      name="referencia"
                      value={formData.referencia}
                      onChange={handleChange}
                      placeholder="Cerca al parque..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PESTAÑA 3: PREFERENCIAS */}
            {activeTab === 'preferencias' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Idioma preferido
                    </label>
                    <select
                      name="idiomaPreferido"
                      value={formData.idiomaPreferido}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Español">Español</option>
                      <option value="Inglés">Inglés</option>
                      <option value="Portugués">Portugués</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Canal de contacto favorito
                    </label>
                    <select
                      name="canalContactoFavorito"
                      value={formData.canalContactoFavorito}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione...</option>
                      <option value="Email">Email</option>
                      <option value="Teléfono">Teléfono</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="SMS">SMS</option>
                      <option value="Presencial">Presencial</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Intereses declarados
                    </label>
                    <textarea
                      name="intereses"
                      value={formData.intereses}
                      onChange={handleChange}
                      placeholder="Ej: Tecnología, Deportes, Moda..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="aceptaPublicidad"
                        checked={formData.aceptaPublicidad}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        Sí, acepto recibir publicidad y ofertas
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <div className="flex gap-2">
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={`
                      px-3 py-1 text-xs rounded-full transition-colors
                      ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }
                    `}
                    disabled={isSaving}
                  >
                    {tab.number}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Guardando...
                    </>
                  ) : (
                    'Agregar Cliente'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
