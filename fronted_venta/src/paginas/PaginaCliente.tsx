import { useEffect, useMemo, useState } from 'react';
import { ModalActualizarCliente } from '../modules/clientes/components/ModalActualizarCliente';
import { ModalCrearCliente } from '../modules/clientes/components/ModalCrearCliente';
import { ModalHistorialCompras } from '../modules/clientes/components/ModalHistorialCompras';
import type { ClienteResponse } from '../modules/clientes/types/cliente.types';
import { filtrarClientes, actualizarCliente } from '../modules/clientes/services/cliente.service';

type EstadoFiltro = 'TODOS' | 'ACTIVO' | 'INACTIVO';

const estadoLabel: Record<string, string> = {
  ACTIVO: 'Activo',
  INACTIVO: 'Inactivo',
};

export function PaginaCliente() {
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState<EstadoFiltro>('TODOS');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHistorialOpen, setIsHistorialOpen] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<ClienteResponse | null>(null);

  const filtroEstado = useMemo(() => (estado === 'TODOS' ? undefined : estado), [estado]);

  const cargarClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await filtrarClientes(search.trim() || undefined, filtroEstado);
      setClientes(data.clientes || []);
    } catch (err: any) {
      setError(err?.message || 'No se pudo cargar la lista de clientes');
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

  const handleCambiarEstado = async (cliente: ClienteResponse, nuevoEstado: 'ACTIVO' | 'INACTIVO') => {
    if (cliente.estado === nuevoEstado) return;
    
    const confirmar = confirm(
      `¿${nuevoEstado === 'ACTIVO' ? 'Activar' : 'Desactivar'} al cliente ${cliente.fullName}?`
    );
    if (!confirmar) return;

    try {
      await actualizarCliente(cliente.clienteId, { estado: nuevoEstado });
      // Actualizar el estado local
      setClientes((prev) =>
        prev.map((c) =>
          c.clienteId === cliente.clienteId ? { ...c, estado: nuevoEstado } : c
        )
      );
    } catch (err: any) {
      setError(err?.message || `No se pudo ${nuevoEstado === 'ACTIVO' ? 'activar' : 'desactivar'} el cliente`);
    }
  };

  const handleEstadisticas = () => {
    alert('Aquí iría el panel de estadísticas del cliente.');
  };

  const getEstadoBadge = (value?: string) => {
    if (value === 'INACTIVO') return 'bg-gray-100 text-gray-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Gestión de Clientes</h2>
            <p className="text-gray-500 text-sm">Busca, filtra y administra tus clientes.</p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            <span className="text-lg">+</span>
            Agregar Cliente
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
              placeholder="Buscar por nombre o RUC..."
              className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            {(['TODOS', 'ACTIVO', 'INACTIVO'] as EstadoFiltro[]).map((estadoBtn) => (
              <button
                key={estadoBtn}
                onClick={() => setEstado(estadoBtn)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  estado === estadoBtn
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {estadoBtn === 'TODOS'
                  ? 'Todos'
                  : estadoBtn === 'ACTIVO'
                  ? 'Activos'
                  : 'Inactivos'}
              </button>
            ))}
          </div>
          <button
            onClick={handleBuscar}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Buscar
          </button>
        </div>

        <div className="mt-6 border border-gray-100 rounded-lg overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide px-6 py-3">
            <div className="col-span-3">Nombre</div>
            <div className="col-span-2">RUC/DNI</div>
            <div className="col-span-2">Email</div>
            <div className="col-span-1">Teléfono</div>
            <div className="col-span-2">Última compra</div>
            <div className="col-span-1">Estado</div>
            <div className="col-span-1 text-right">Acciones</div>
          </div>

          <div className="divide-y divide-gray-100 bg-white">
            {loading && (
              <div className="py-10 text-center text-gray-500">Cargando clientes...</div>
            )}
            {!loading && clientes.length === 0 && (
              <div className="py-10 text-center text-gray-500">No hay clientes para mostrar.</div>
            )}
            {!loading &&
              clientes.map((cliente) => (
                <div key={cliente.clienteId} className="grid grid-cols-12 px-6 py-4 items-center">
                  <div className="col-span-3">
                    <p className="font-medium text-gray-900">{cliente.fullName}</p>
                    <p className="text-xs text-gray-500">ID: {cliente.clienteId}</p>
                  </div>
                  <div className="col-span-2 text-gray-700">{cliente.dni || '—'}</div>
                  <div className="col-span-2 text-gray-700 truncate">{cliente.email || '—'}</div>
                  <div className="col-span-1 text-gray-700 truncate">{cliente.phoneNumber || '—'}</div>
                  <div className="col-span-2 text-gray-900 font-medium">
                    {cliente.ultimaCompra || '—'}
                  </div>
                  <div className="col-span-1">
                    <select
                      value={cliente.estado || 'ACTIVO'}
                      onChange={(e) => handleCambiarEstado(cliente, e.target.value as 'ACTIVO' | 'INACTIVO')}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${getEstadoBadge(
                        cliente.estado
                      )}`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 8px center',
                        paddingRight: '28px',
                      }}
                    >
                      <option value="ACTIVO">Activo</option>
                      <option value="INACTIVO">Inactivo</option>
                    </select>
                  </div>
                  <div className="col-span-1 flex justify-end gap-2 text-sm">
                    <button
                      onClick={() => handleOpenEditar(cliente.clienteId)}
                      className="text-blue-600 hover:text-blue-700"
                      title="Ver/Editar"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => handleOpenHistorial(cliente)}
                      className="text-emerald-600 hover:text-emerald-700"
                      title="Historial de compras"
                    >
                      💰
                    </button>
                    <button
                      onClick={handleEstadisticas}
                      className="text-purple-600 hover:text-purple-700"
                      title="Estadísticas"
                    >
                      📊
                    </button>
                    <button
                      onClick={() => handleDesactivar(cliente)}
                      className="text-red-600 hover:text-red-700"
                      title="Desactivar"
                    >
                      ⏸️
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}
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
    </div>
  );
}
