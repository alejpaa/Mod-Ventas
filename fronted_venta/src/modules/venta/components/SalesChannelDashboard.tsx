import React, { useState, useEffect, useMemo } from 'react';
import type { VentasPorCanalResponse } from '../types/Ventas';
import IngresosPorCanalChart from './IngresosPorCanalChart';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const SalesChannelDashboard: React.FC = () => {
    const [data, setData] = useState<VentasPorCanalResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/venta/analisis/ventas-por-canal`);

                if (!response.ok) {
                    throw new Error(`Fallo al cargar datos: ${response.status}`);
                }

                const result: VentasPorCanalResponse[] = await response.json();
                setData(result);

            } catch (err) {
                setError('No se pudo conectar con el servicio de análisis de ventas.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const resumen = useMemo(() => {
        return data.reduce((acc, current) => {
            acc.totalVentas += current.cantidadVentas;
            acc.totalIngresos += current.ingresosTotales;
            return acc;
        }, { totalVentas: 0, totalIngresos: 0 });
    }, [data]);

    const chartConfig = useMemo(() => {
        const labels: string[] = [];
        const dataPoints: number[] = [];
        const backgroundColors: string[] = [
            '#3B82F6',
            '#EA580C',
            '#6B7280'
        ];

        for (const item of data) {
            labels.push(item.canal);
            dataPoints.push(item.ingresosTotales);
        }

        return {
            labels,
            datasets: [
                {
                    data: dataPoints,
                    backgroundColor: backgroundColors.slice(0, dataPoints.length),
                    hoverBackgroundColor: backgroundColors.slice(0, dataPoints.length)
                }
            ]
        };
    }, [data]);

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Cargando datos del dashboard...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-700 bg-red-50 border border-red-300 rounded-lg">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Análisis de Ventas por Canal de Contacto</h1>

            {/* Tarjetas de Resumen (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Ventas Totales (Confirmadas)" value={resumen.totalVentas} type="count" />
                <Card title="Ingresos Totales (S/)" value={resumen.totalIngresos} type="money" />
                <Card title="Canales Analizados" value={data.length} type="count" />
            </div>

            {/* RENDERIZAR EL GRÁFICO */}
            {data.length > 0 && <IngresosPorCanalChart chartData={chartConfig} />}

            {/* Tabla de Desglose por Canal */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Desglose por Canal de Contacto</h2>

                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Canal</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad de Ventas</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ingresos Totales</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">% de Ingreso</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {data.map((item) => (
                            <tr key={item.canal}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 uppercase">{item.canal.replace('_', ' ')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">{item.cantidadVentas}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">S/ {item.ingresosTotales.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    {(item.ingresosTotales / resumen.totalIngresos * 100).toFixed(1)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Componente Auxiliar para las Tarjetas (KPIs)
const Card = ({ title, value, type }: { title: string, value: number, type: 'count' | 'money' }) => (
    <div className="bg-white p-5 border border-blue-100 rounded-xl shadow-md">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-extrabold text-blue-600 mt-2">
            {type === 'money' ? `S/ ${value.toFixed(2)}` : value}
        </p>
    </div>
);


export default SalesChannelDashboard;
