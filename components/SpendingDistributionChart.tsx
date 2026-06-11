'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Task, Expense } from '@/types';
import { getTaskSpent, formatCurrency } from '@/lib/utils';

interface SpendingDistributionChartProps {
  tasks: Task[];
  expenses: Expense[];
}

export function SpendingDistributionChart({ tasks, expenses }: SpendingDistributionChartProps) {
  const data = tasks
    .map(task => ({
      name: task.name,
      value: getTaskSpent(task.id, expenses),
      color: task.color
    }))
    .filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      const total = data.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((entry.value / total) * 100).toFixed(1);
      return (
        <div className="rounded border border-gray-300 bg-white p-3 shadow-lg">
          <p className="font-semibold">{entry.name}</p>
          <p>{formatCurrency(entry.value)}</p>
          <p className="text-sm text-gray-600">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Spending Distribution</h3>
        <div className="flex items-center justify-center h-80 text-gray-500">
          No spending data yet
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Spending Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            label={({ name, percent }: any) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
