import { useMemo, useState } from 'react';
import type { ClienteResponse } from '../types/cliente.types';

type EstadoPago = 'Pagado' | 'Pendiente' | 'Anulado';

interface Compra {
  codigo: string;
  fecha: string;
  monto: number;
  productos: number;
  estadoPago: EstadoPago;
  items: { nombre: string; cantidad: number; precio: number }[];
  metodoPago?: string;
  fechaPago?: string;
  comprobante?: string;
}

interface Props {
  cliente: ClienteResponse;
  compras: Compra[];
  onClose: () => void;
}

export function ModalHistorialCompras({ cliente, compras, onClose }: Props) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [seleccion, setSeleccion] = useState<Compra | null>(null);

  const filtradas = useMemo(() => {
    return compras.filter((c) => {
      const coincideTexto =
        c.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.estadoPago.toLowerCase().includes(busqueda.toLowerCase());
      const coincideFecha = filtroFecha ? c.fecha === filtroFecha : true;
      return coincideTexto && coincideFecha;
    });
  }, [compras, busqueda, filtroFecha]);

  const totalGastado = filtradas.reduce((acc, c) => acc + c.monto, 0);
  const totalTrans = filtradas.length;
  const promedio = totalTrans ? totalGastado / totalTrans : 0;
  const ultimaCompra = filtradas[0]?.fecha || cliente.ultimaCompra || '';

  const exportarCSV = () => {
    const header = ['codigo', 'fecha', 'monto', 'productos', 'estadoPago'];
    const rows = filtradas.map((c) => [c.codigo, c.fecha, c.monto, c.productos, c.estadoPago]);
    const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historial_compras.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const diasDesdeUltima = useMemo(() => {
    if (!ultimaCompra) return '-';
    const d = new Date(ultimaCompra);
    if (isNaN(d.getTime())) return '-';
    const diff = Date.now() - d.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }, [ultimaCompra]);

  const badgePago = (estado: EstadoPago) => {
    if (estado === 'Pagado') return 'bg-green-100 text-green-700';
    if (estado === 'Pendiente') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Historial de Compras</h3>
            <p className="text-sm text-gray-500">{cliente.fullName} · DNI/RUC: {cliente.dni}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cliente.estado === 'INACTIVO' ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'}`}>
              {cliente.estado === 'INACTIVO' ? 'Inactivo' : 'Activo'}
            </span>
            <button className="text-gray-500 text-xl font-bold" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="px-6 py-4 flex items-center justify-between bg-gray-50 border-b">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Fecha de registro</p>
            <p className="font-semibold text-gray-800">{cliente.registrationDate || '—'}</p>
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium"
            onClick={() => alert('Aquí iría el flujo para agregar una nueva compra')}
          >
            Agregar Nueva Compra
          </button>
        </div>

        <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-5 gap-4 border-b">
          <ResumenItem label="Total Gastado" value={`S/ ${totalGastado.toFixed(2)}`} />
          <ResumenItem label="Total Transacciones" value={`${totalTrans}`} />
          <ResumenItem label="Promedio por Compra" value={`S/ ${promedio.toFixed(2)}`} />
          <ResumenItem label="Última Compra" value={ultimaCompra || '—'} />
          <ResumenItem label="Días desde última compra" value={`${diasDesdeUltima}`} />
        </div>

        <div className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-3 border-b">
          <input
            placeholder="Buscar por código o estado..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full md:max-w-xs border border-gray-300 rounded-lg px-3 py-2"
          />
          <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="w-full md:max-w-xs border border-gray-300 rounded-lg px-3 py-2"
          />
          <div className="flex gap-2 ml-auto">
            <button
              className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700"
              onClick={() => { setBusqueda(''); setFiltroFecha(''); }}
            >
              Limpiar
            </button>
            <button className="px-3 py-2 bg-gray-900 text-white rounded-lg" onClick={exportarCSV}>
              Exportar CSV
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-12 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide px-4 py-2 rounded-lg border border-gray-100">
            <div className="col-span-3">Código Pedido</div>
            <div className="col-span-2">Fecha</div>
            <div className="col-span-2">Monto</div>
            <div className="col-span-2"># Productos</div>
            <div className="col-span-2">Estado Pago</div>
            <div className="col-span-1 text-right">Acciones</div>
          </div>
          <div className="divide-y divide-gray-100 border border-gray-100 border-t-0 rounded-b-lg">
            {filtradas.length === 0 && (
              <div className="py-8 text-center text-gray-500">No hay compras registradas.</div>
            )}
            {filtradas.map((c) => (
              <div key={c.codigo} className="grid grid-cols-12 px-4 py-3 items-center">
                <div className="col-span-3 text-blue-600 font-semibold cursor-pointer" onClick={() => setSeleccion(c)}>
                  {c.codigo}
                </div>
                <div className="col-span-2 text-gray-800">{c.fecha}</div>
                <div className="col-span-2 text-gray-900 font-medium">S/ {c.monto.toFixed(2)}</div>
                <div className="col-span-2 text-gray-800">{c.productos}</div>
                <div className="col-span-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgePago(c.estadoPago)}`}>
                    {c.estadoPago}
                  </span>
                </div>
                <div className="col-span-1 text-right">
                  <button className="text-blue-600 font-medium" onClick={() => setSeleccion(c)}>
                    Ver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {seleccion && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Detalle de compra</h4>
                <p className="text-sm text-gray-500">Pedido {seleccion.codigo}</p>
              </div>
              <button className="text-gray-500 text-xl font-bold" onClick={() => setSeleccion(null)}>×</button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Info label="Fecha" value={seleccion.fecha} />
                <Info label="Monto" value={`S/ ${seleccion.monto.toFixed(2)}`} />
                <Info label="Método de pago" value={seleccion.metodoPago || 'No registrado'} />
                <Info label="Fecha de pago" value={seleccion.fechaPago || '—'} />
                <Info label="Comprobante" value={seleccion.comprobante || 'No adjunto'} />
              </div>

              <div className="border rounded-lg">
                <div className="grid grid-cols-12 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide px-4 py-2">
                  <div className="col-span-6">Producto</div>
                  <div className="col-span-2 text-right">Cant.</div>
                  <div className="col-span-2 text-right">Precio</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>
                <div className="divide-y divide-gray-100">
                  {seleccion.items.map((i, idx) => (
                    <div key={idx} className="grid grid-cols-12 px-4 py-2 text-sm">
                      <div className="col-span-6 text-gray-900">{i.nombre}</div>
                      <div className="col-span-2 text-right text-gray-700">{i.cantidad}</div>
                      <div className="col-span-2 text-right text-gray-700">S/ {i.precio.toFixed(2)}</div>
                      <div className="col-span-2 text-right text-gray-900 font-medium">S/ {(i.precio * i.cantidad).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
              <button className="px-5 py-2 rounded-lg bg-blue-500 text-white" onClick={() => setSeleccion(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ResumenItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}


