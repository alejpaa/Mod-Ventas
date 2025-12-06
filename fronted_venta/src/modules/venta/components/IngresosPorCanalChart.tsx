import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartData {
    labels: string[];
    datasets: {
        data: number[];
        backgroundColor: string[];
        hoverBackgroundColor: string[];
    }[];
}

interface IngresosPorCanalChartProps {
    chartData: ChartData;
}

const IngresosPorCanalChart: React.FC<IngresosPorCanalChartProps> = ({ chartData }) => {
    const total = chartData.datasets[0].data.reduce((sum, val) => sum + val, 0);

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const value = context.parsed;
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `S/ ${value.toFixed(2)} (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Distribución de Ingresos por Canal</h2>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Gráfico Circular Real */}
                <div className="w-full md:w-1/2 flex items-center justify-center">
                    <div className="w-64 h-64">
                        <Pie data={chartData} options={options} />
                    </div>
                </div>

                {/* Leyenda y Totales */}
                <div className="w-full md:w-1/2 p-4">
                    <ul className="space-y-3">
                        {chartData.labels.map((label, index) => (
                            <li key={label} className="flex justify-between items-center text-sm">
                                <div className="flex items-center">
                                    <span
                                        style={{
                                            backgroundColor: chartData.datasets[0].backgroundColor[index],
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '4px',
                                            marginRight: '10px'
                                        }}
                                    ></span>
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
