interface ModalVisualizarVentaProps {
    isOpen: boolean;
    onClose: () => void;
    tipoVenta: 'DIRECTA' | 'LEAD';
}

export function ModalVisualizarVenta({ isOpen, onClose, tipoVenta }: ModalVisualizarVentaProps) {
    if (!isOpen) return null;

    // Datos estáticos de ejemplo
    const ventaData = {
        numVenta: tipoVenta === 'DIRECTA' ? 'VTA-DIR-000123' : 'VTA-LED-000045',
        fecha: '2024-12-05',
        estado: 'CONFIRMADA',
        estadoPago: 'PAGADO',
        origen: tipoVenta,

        cliente: {
            nombre: 'Juan Carlos Pérez García',
            dni: '12345678',
            telefono: '+51 987 654 321',
            email: 'juan.perez@email.com',
            direccion: 'Av. Principal 123, San Isidro, Lima'
        },

        vendedor: {
            nombre: 'María González',
            id: 'VEN-001',
            codigo: '12345'
        },

        productos: [
            { codigo: 'PROD-001', nombre: 'Laptop HP Pavilion 15', cantidad: 2, precioUnitario: 2500.00, subtotal: 5000.00 },
            { codigo: 'PROD-002', nombre: 'Mouse Logitech MX Master 3', cantidad: 3, precioUnitario: 350.00, subtotal: 1050.00 },
            { codigo: 'PROD-003', nombre: 'Teclado Mecánico Keychron K2', cantidad: 1, precioUnitario: 450.00, subtotal: 450.00 },
        ],

        subtotal: 6500.00,
        descuento: 500.00,
        total: 6000.00,

        metodoPago: 'TARJETA',

        // Datos específicos para LEAD
        ...(tipoVenta === 'LEAD' && {
            lead: {
                fuente: 'Facebook Ads',
                campana: 'Campaña Verano 2024',
                fechaContacto: '2024-11-28',
                observaciones: 'Cliente interesado en productos de tecnología. Contactado vía WhatsApp.'
            }
        })
    };

    return (
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Detalles de Venta</h2>
                        <p className="text-blue-100 text-sm mt-1">{ventaData.numVenta}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">

                    {/* Información General */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Fecha de Venta</p>
                            <p className="font-semibold text-gray-900">{ventaData.fecha}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Estado</p>
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                {ventaData.estado}
                            </span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Estado de Pago</p>
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                {ventaData.estadoPago}
                            </span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Método de Pago</p>
                            <p className="font-semibold text-gray-900">{ventaData.metodoPago}</p>
                        </div>
                    </div>

                    {/* Información del Cliente */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
                        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Información del Cliente
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Nombre Completo</p>
                                <p className="font-semibold text-gray-900">{ventaData.cliente.nombre}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">DNI</p>
                                <p className="font-semibold text-gray-900">{ventaData.cliente.dni}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Teléfono</p>
                                <p className="font-semibold text-gray-900">{ventaData.cliente.telefono}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-semibold text-gray-900">{ventaData.cliente.email}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-600">Dirección</p>
                                <p className="font-semibold text-gray-900">{ventaData.cliente.direccion}</p>
                            </div>
                        </div>
                    </div>

                    {/* Información del Vendedor */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-5 mb-6">
                        <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Vendedor Asignado
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Nombre</p>
                                <p className="font-semibold text-gray-900">{ventaData.vendedor.nombre}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">ID Vendedor</p>
                                <p className="font-semibold text-gray-900">{ventaData.vendedor.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Código</p>
                                <p className="font-semibold text-gray-900">{ventaData.vendedor.codigo}</p>
                            </div>
                        </div>
                    </div>

                    {/* Información de Lead (solo para ventas LEAD) */}
                    {tipoVenta === 'LEAD' && ventaData.lead && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-5 mb-6">
                            <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Información del Lead
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Fuente</p>
                                    <p className="font-semibold text-gray-900">{ventaData.lead.fuente}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Campaña</p>
                                    <p className="font-semibold text-gray-900">{ventaData.lead.campana}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Fecha de Contacto</p>
                                    <p className="font-semibold text-gray-900">{ventaData.lead.fechaContacto}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray-600">Observaciones</p>
                                    <p className="font-semibold text-gray-900">{ventaData.lead.observaciones}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Productos */}
                    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden mb-6">
                        <div className="bg-gray-100 px-5 py-3 border-b border-gray-300">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Productos ({ventaData.productos.length})
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">P. Unitario</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {ventaData.productos.map((producto, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">{producto.codigo}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{producto.nombre}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-center">{producto.cantidad}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right">S/ {producto.precioUnitario.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 font-semibold text-right">S/ {producto.subtotal.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Resumen de Totales */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen de Totales</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center pb-2">
                                <span className="text-gray-700">Subtotal:</span>
                                <span className="text-lg font-semibold text-gray-900">S/ {ventaData.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-300">
                                <span className="text-red-600">Descuento:</span>
                                <span className="text-lg font-semibold text-red-600">- S/ {ventaData.descuento.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-xl font-bold text-gray-900">TOTAL:</span>
                                <span className="text-2xl font-bold text-blue-600">S/ {ventaData.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
                    >
                        Cerrar
                    </button>
                    <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Imprimir
                    </button>
                </div>
            </div>
        </div>
    );
}
