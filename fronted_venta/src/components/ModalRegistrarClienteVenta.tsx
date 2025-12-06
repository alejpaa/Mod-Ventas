import { useState } from 'react';
import { createPortal } from 'react-dom';
import { registrarCliente, type RegistroClienteRequest, type Cliente } from '../services/cliente.service';

interface ModalRegistrarClienteVentaProps {
    isOpen: boolean;
    onClose: () => void;
    onClienteRegistrado: (cliente: Cliente) => void;
}

export function ModalRegistrarClienteVenta({ isOpen, onClose, onClienteRegistrado }: ModalRegistrarClienteVentaProps) {
    const [formData, setFormData] = useState<RegistroClienteRequest>({
        dni: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        address: '',
        telefonoFijo: '',
        fechaNacimiento: '',
    });
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setCargando(true);

        try {
            const cliente = await registrarCliente(formData);
            onClienteRegistrado(cliente);
            onClose();
            // Limpiar formulario
            setFormData({
                dni: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                email: '',
                address: '',
                telefonoFijo: '',
                fechaNacimiento: '',
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al registrar cliente');
        } finally {
            setCargando(false);
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <div
            className="fixed inset-0 flex items-center justify-center"
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                zIndex: 999999,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
                style={{ zIndex: 100000 }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
                    <h2 className="text-xl font-bold">Registrar Nuevo Cliente</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Apellido */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Apellido *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* DNI */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            DNI *
                        </label>
                        <input
                            type="text"
                            required
                            maxLength={8}
                            pattern="[0-9]{8}"
                            value={formData.dni}
                            onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="12345678"
                        />
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Teléfono *
                        </label>
                        <input
                            type="tel"
                            required
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="987654321"
                        />
                    </div>

                    {/* Email (opcional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="cliente@example.com"
                        />
                    </div>

                    {/* Dirección (opcional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dirección
                        </label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Av. Principal 123"
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={cargando}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {cargando ? 'Registrando...' : 'Registrar Cliente'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
