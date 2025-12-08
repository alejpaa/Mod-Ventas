import { useEffect, useMemo, useState } from 'react';
import { Edit, UserX, History, Download } from 'lucide-react'; // <--- 1. Agregado icono Download
import { ModalActualizarCliente } from '../modules/clientes/components/ModalActualizarCliente';
import { ModalCrearCliente } from '../modules/clientes/components/ModalCrearCliente';
import { ModalHistorialCompras } from '../modules/clientes/components/ModalHistorialCompras';
import type { ClienteResponse } from '../modules/clientes/types/cliente.types';
import { filtrarClientes, actualizarCliente } from '../modules/clientes/services/cliente.service';
import Toast from '../modules/venta/components/Toast';
import { useToast } from '../modules/venta/hooks/useToast';

type EstadoFiltro = 'TODOS' | 'ACTIVO' | 'INACTIVO';

export function PaginaCliente() {
  const { toasts, showToast, removeToast } = useToast();
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState<EstadoFiltro>('TODOS');
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHistorialOpen, setIsHistorialOpen] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<ClienteResponse | null>(null);

  const filtroEstado = useMemo(() => (estado === 'TODOS' ? undefined : estado), [estado]);

  const cargarClientes = async () => {
    setLoading(true);
    try {
      const data = await filtrarClientes(search.trim() || undefined, filtroEstado);
      setClientes(data.clientes || []);
    } catch (err: any) {
      showToast(err?.message || 'No se pudo cargar la lista de clientes', 'error');
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  const handleBuscar = () => {
    cargarClientes();
  };

  // --- 2. NUEVA FUNCIÓN PARA DESCARGAR EL EXCEL ---
  const handleDescargarExcel = async () => {
    try {
      // Ajusta la URL si tu backend corre en otro puerto
      const response = await fetch('http://localhost:8080/api/reportes/descargar-excel', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`, // Si usas token, descomenta esto
        },
      });

      if (!response.ok) throw new Error('Error al generar el reporte en el backend');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Reporte_Ventas_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error descargando el excel:', error);
      alert('No se pudo descargar el reporte. Verifica que el backend esté corriendo.');
    }
  };

  const handleOpenEditar = (clienteId: number) => {
    setSelectedClienteId(clienteId);
    setIsEditOpen(true);
  };

  const handleCloseEditar = () => {
    setIsEditOpen(false);
    setSelectedClienteId(null);
    cargarClientes();
  };

  const handleCreado = () => {
    setIsCreateOpen(false);
    cargarClientes();
  };

  const handleOpenHistorial = (cliente: ClienteResponse) => {
    setSelectedCliente(cliente);
    setIsHistorialOpen(true);
  };

  const handleCambiarEstado = async (
    cliente: ClienteResponse,
    nuevoEstado: 'ACTIVO' | 'INACTIVO'
  ) => {
    if (cliente.estado === nuevoEstado) return;

    const confirmar = confirm(
      `¿${nuevoEstado === 'ACTIVO' ? 'Activar' : 'Desactivar'} al cliente ${cliente.fullName}?`
    );
    if (!confirmar) return;

    try {
      await actualizarCliente(cliente.clienteId, { estado: nuevoEstado });
      // Actualizar el estado local
      setClientes((prev) =>
        prev.map((c) => (c.clienteId === cliente.clienteId ? { ...c, estado: nuevoEstado } : c))
      );
      showToast(
        `Cliente ${nuevoEstado === 'ACTIVO' ? 'activado' : 'desactivado'} exitosamente`,
        'success'
      );
    } catch (err: any) {
      showToast(
        err?.message ||
        `No se pudo ${nuevoEstado === 'ACTIVO' ? 'activar' : 'desactivar'} el cliente`,
        'error'
      );
    }
  };

  const getEstadoBadge = (value?: string) => {
    if (value === 'INACTIVO') return 'bg-gray-100 text-gray-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {/* Filtros */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Buscar</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                placeholder="Buscar por nombre o DNI..."
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Estado</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as EstadoFiltro)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="TODOS">Todos los estados</option>
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </select>
            </div>

            <div className="flex items-end justify-end gap-3">
              <button
                onClick={handleBuscar}
                className="h-10 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Buscar
              </button>

              {/* --- 3. BOTÓN EXCEL AGREGADO --- */}
              <button
                onClick={handleDescargarExcel}
                className="h-10 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium shadow-sm whitespace-nowrap flex items-center gap-2"
                title="Descargar reporte completo"
              >
                <Download size={18} />
                <span>Excel</span>
              </button>

              <button
                onClick={() => setIsCreateOpen(true)}
                className="h-10 px-4 py-2 bg-[#3C83F6] text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm whitespace-nowrap"
              >
                <span className="mr-2 text-lg">+</span>Agregar Cliente
              </button>
            </div>
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Clientes</h2>
              <p className="text-sm text-gray-500 mt-1">
                {clientes.length} cliente{clientes.length !== 1 ? 's' : ''} en total
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">DNI/RUC</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Teléfono</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Cargando clientes...
                  </td>
                </tr>
              ) : clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <tr key={cliente.clienteId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{cliente.fullName}</p>
                      <p className="text-xs text-gray-500">ID: {cliente.clienteId}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{cliente.dni || '—'}</td>
                    <td className="px-6 py-4 text-gray-700">{cliente.email || '—'}</td>
                    <td className="px-6 py-4 text-gray-700">{cliente.phoneNumber || '—'}</td>
                    <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoBadge(
                            cliente.estado
                          )}`}
                        >
                          {cliente.estado === 'INACTIVO' ? 'Inactivo' : 'Activo'}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditar(cliente.clienteId)}
                          className="px-3 py-1.5 text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-all font-medium text-sm inline-flex items-center gap-1.5"
                          title="Editar Cliente"
                        >
                          <Edit size={16} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleCambiarEstado(cliente, 'INACTIVO')}
                          className="px-3 py-1.5 text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-all font-medium text-sm inline-flex items-center gap-1.5"
                          title="Desactivar Cliente"
                        >
                          <UserX size={16} />
                          Desactivar
                        </button>
                        <button
                          onClick={() => handleOpenHistorial(cliente)}
                          className="px-3 py-1.5 text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-all font-medium text-sm inline-flex items-center gap-1.5"
                          title="Ver Historial"
                        >
                          <History size={16} />
                          Historial
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No hay clientes que mostrar
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isCreateOpen && (
        <ModalCrearCliente onClose={() => setIsCreateOpen(false)} onSuccess={handleCreado} />
      )}

      {isEditOpen && selectedClienteId !== null && (
        <ModalActualizarCliente
          clienteId={selectedClienteId}
          onClose={handleCloseEditar}
          onSuccess={handleCloseEditar}
        />
      )}

      {isHistorialOpen && selectedCliente && (
        <ModalHistorialCompras
          cliente={selectedCliente}
          compras={[
            {
              codigo: 'PED-001',
              fecha: '2024-03-15',
              monto: 450,
              productos: 3,
              estadoPago: 'Pagado',
              items: [
                { nombre: 'Producto A', cantidad: 1, precio: 150 },
                { nombre: 'Producto B', cantidad: 1, precio: 200 },
                { nombre: 'Producto C', cantidad: 1, precio: 100 },
              ],
              metodoPago: 'Tarjeta',
              fechaPago: '2024-03-15',
            },
            {
              codigo: 'PED-002',
              fecha: '2024-03-22',
              monto: 1200,
              productos: 5,
              estadoPago: 'Pendiente',
              items: [
                { nombre: 'Producto X', cantidad: 2, precio: 200 },
                { nombre: 'Producto Y', cantidad: 3, precio: 266.67 },
              ],
              metodoPago: 'Transferencia',
            },
          ]}
          onClose={() => setIsHistorialOpen(false)}
        />
      )}

      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}