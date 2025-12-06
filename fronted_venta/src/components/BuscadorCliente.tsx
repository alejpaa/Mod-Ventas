import { useState, useEffect, useRef } from 'react';
import { buscarClientes, type Cliente } from '../services/cliente.service';

interface BuscadorClienteProps {
    onClienteSeleccionado: (cliente: Cliente) => void;
    clienteInicial?: Cliente | null;
}

export function BuscadorCliente({ onClienteSeleccionado, clienteInicial }: BuscadorClienteProps) {
    const [busqueda, setBusqueda] = useState(clienteInicial?.fullName || '');
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [mostrarResultados, setMostrarResultados] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(clienteInicial || null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setMostrarResultados(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Buscar clientes cuando cambia el texto
    useEffect(() => {
        const buscarClientesDebounced = async () => {
            if (!busqueda || busqueda.length < 2) {
                setClientes([]);
                return;
            }

            console.log('🔍 Buscando clientes con:', busqueda);
            setCargando(true);
            try {
                const response = await buscarClientes(busqueda, 0, 10);
                console.log('✅ Respuesta recibida:', response);
                setClientes(response.clientes);  // ← Cambiado de content a clientes
                setMostrarResultados(true);
            } catch (error) {
                console.error('❌ Error al buscar clientes:', error);
                setClientes([]);
            } finally {
                setCargando(false);
            }
        };

        const timeoutId = setTimeout(buscarClientesDebounced, 300);
        return () => clearTimeout(timeoutId);
    }, [busqueda]);

    const handleSeleccionarCliente = (cliente: Cliente) => {
        setClienteSeleccionado(cliente);
        setBusqueda(cliente.fullName);
        setMostrarResultados(false);
        onClienteSeleccionado(cliente);
    };

    const handleLimpiar = () => {
        setClienteSeleccionado(null);
        setBusqueda('');
        setClientes([]);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente *
            </label>
            <div className="relative">
                <input
                    type="text"
                    value={busqueda || ''}
                    onChange={(e) => setBusqueda(e.target.value)}
                    onFocus={() => busqueda && busqueda.length >= 2 && setMostrarResultados(true)}
                    placeholder="Buscar por DNI, nombre o email..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!!clienteSeleccionado}
                />
                {clienteSeleccionado && (
                    <button
                        type="button"
                        onClick={handleLimpiar}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Resultados de búsqueda */}
            {mostrarResultados && clientes && clientes.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {clientes.map((cliente) => (
                        <button
                            key={cliente.clienteId}
                            type="button"
                            onClick={() => handleSeleccionarCliente(cliente)}
                            className="w-full px-4 py-2 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                        >
                            <div className="font-medium text-gray-900">{cliente.fullName}</div>
                            <div className="text-sm text-gray-500">
                                DNI: {cliente.dni} • {cliente.email}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Loading */}
            {cargando && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3 text-center text-gray-500">
                    Buscando...
                </div>
            )}

            {/* Sin resultados */}
            {mostrarResultados && !cargando && busqueda && busqueda.length >= 2 && clientes && clientes.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3 text-center text-gray-500">
                    No se encontraron clientes
                </div>
            )}

            {/* Información del cliente seleccionado */}
            {clienteSeleccionado && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="text-sm">
                        <div className="font-medium text-blue-900">{clienteSeleccionado.fullName}</div>
                        <div className="text-blue-700">DNI: {clienteSeleccionado.dni}</div>
                        <div className="text-blue-700">Email: {clienteSeleccionado.email}</div>
                        {clienteSeleccionado.phoneNumber && (
                            <div className="text-blue-700">Teléfono: {clienteSeleccionado.phoneNumber}</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
