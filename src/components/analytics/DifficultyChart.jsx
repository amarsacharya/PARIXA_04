import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const DifficultyChart = ({ data, title = "Difficulty Performance" }) => {
    // Expected data format: 
    // [
    //   { name: 'Easy', value: 40, color: '#10B981' }, // green
    //   { name: 'Medium', value: 30, color: '#F59E0B' }, // yellow/orange
    //   { name: 'Hard', value: 30, color: '#EF4444' } // red
    // ]

    const defaultData = [
        { name: 'Easy', value: 33, color: '#10B981' },
        { name: 'Medium', value: 34, color: '#F59E0B' },
        { name: 'Hard', value: 33, color: '#EF4444' }
    ];

    const chartData = (data && data.length > 0) ? data : defaultData;

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-100 shadow-md rounded-md">
                    <p className="font-medium" style={{ color: payload[0].payload.color }}>
                        {`${payload[0].name}: ${payload[0].value}%`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-full">
            <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DifficultyChart;
