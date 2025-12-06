// src/components/IngresosPorCanalChart.tsx

import React from 'react';
// IMPORTANTE: DEBES INSTALAR UNA LIBRERÍA DE GRÁFICOS AQUÍ
// import { Pie } from 'react-chartjs-2'; // Ejemplo usando react-chartjs-2

interface ChartData {
    labels: string[];
    datasets: {
        data: number[];
        backgroundColor: string[];
        hoverBackgroundColor: string[];
    }[];
}

interface IngresosPorCanalChartProps {
    /** Objeto de datos listo para el gráfico (ya procesado) */
    chartData: ChartData;
}

const IngresosPorCanalChart: React.FC<IngresosPorCanalChartProps> = ({ chartData }) => {
    // Colores predefinidos para los canales
    const colors = [
        'rgba(59, 130, 246, 0.8)', // Azul (FÍSICO)
        'rgba(234, 88, 12, 0.8)',  // Naranja (LLAMADA)
        'rgba(107, 114, 128, 0.8)',// Gris (OTRO)
    ];

    // 🚨 Aquí iría el componente de la librería (ej: <Pie data={chartData} />)

    // MOCKUP VISUAL DE BAJA FIDELIDAD:
    const total = chartData.datasets[0].data.reduce((sum, val) => sum + val, 0);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Distribución de Ingresos por Canal</h2>

            <div className="flex flex-col md:flex-row items-center justify-between">

                {/* Placeholder del Gráfico Circular */}
                <div
                    className="w-full md:w-1/2 h-64 bg-gray-50 rounded-full flex items-center justify-center border border-dashed border-gray-300"
                    style={{
                        // Simulación de los cortes del gráfico usando CSS Conic Gradient
                        backgroundImage: `conic-gradient(
                            ${colors[0]} 0% ${chartData.datasets[0].data[0]/total * 100}%,
                            ${colors[1]} ${chartData.datasets[0].data[0]/total * 100}% ${chartData.datasets[0].data[0]/total * 100 + chartData.datasets[0].data[1]/total * 100}%,
                            ${colors[2]} ${chartData.datasets[0].data[0]/total * 100 + chartData.datasets[0].data[1]/total * 100}% 100%
                        )`,
                    }}
                >
                    <span className="text-gray-700 font-bold text-lg">GRÁFICO CIRCULAR</span>
                </div>

                {/* Leyenda y Totales */}
                <div className="w-full md:w-1/2 p-4">
                    <ul className="space-y-3">
                        {chartData.labels.map((label, index) => (
                            <li key={label} className="flex justify-between items-center text-sm">
                                <div className="flex items-center">
                                    <span style={{ backgroundColor: colors[index], width: '12px', height: '12px', borderRadius: '4px', marginRight: '10px' }}></span>
                                    <span className="font-medium text-gray-700">{label.replace('_', ' ')}</span>
                                </div>
                                <span className="font-bold text-gray-900">
                                    {((chartData.datasets[0].data[index] / total) * 100).toFixed(1)}%
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between font-bold text-md">
                        <span>Total Ingresos:</span>
                        <span>S/ {total.toFixed(2)}</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default IngresosPorCanalChart;
