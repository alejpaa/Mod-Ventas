import { useState } from 'react';
import { registrarCliente, type RegistroClienteRequest, type Cliente } from '../services/cliente.service';

interface ModalRegistrarClienteDirectoProps {
    isOpen: boolean;
    onClose: () => void;
    onClienteRegistrado: (cliente: Cliente) => void;
}

export function ModalRegistrarClienteDirecto({ isOpen, onClose, onClienteRegistrado }: ModalRegistrarClienteDirectoProps) {
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

        // Validación básica
        if (!formData.dni || !formData.firstName || !formData.lastName || !formData.phoneNumber) {
            setError('Por favor complete todos los campos obligatorios');
            return;
        }

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

    // SOLUCIÓN AGRESIVA: Renderizar directamente en el body con estilos inline
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                zIndex: 999999999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    width: '100%',
                    maxWidth: '500px',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    position: 'relative',
                    zIndex: 1000000000
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    padding: '20px',
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    borderRadius: '8px 8px 0 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Registrar Nuevo Cliente</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '24px',
                            cursor: 'pointer',
                            padding: '0',
                            width: '30px',
                            height: '30px'
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                    {error && (
                        <div style={{
                            backgroundColor: '#fee2e2',
                            border: '1px solid #fecaca',
                            color: '#991b1b',
                            padding: '12px',
                            borderRadius: '4px',
                            marginBottom: '16px'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* DNI */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                            DNI *
                        </label>
                        <input
                            type="text"
                            required
                            maxLength={8}
                            value={formData.dni}
                            onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                            placeholder="12345678"
                        />
                    </div>

                    {/* Nombre */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                            Nombre *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Apellido */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                            Apellido *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Teléfono */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                            Teléfono *
                        </label>
                        <input
                            type="tel"
                            required
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                            placeholder="987654321"
                        />
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                            placeholder="cliente@example.com"
                        />
                    </div>

                    {/* Dirección */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                            Dirección
                        </label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                            placeholder="Av. Principal 123"
                        />
                    </div>

                    {/* Botones */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '10px 16px',
                                border: '1px solid #d1d5db',
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={cargando}
                            style={{
                                flex: 1,
                                padding: '10px 16px',
                                border: 'none',
                                backgroundColor: cargando ? '#9ca3af' : '#3b82f6',
                                color: 'white',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: cargando ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {cargando ? 'Registrando...' : 'Registrar Cliente'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
