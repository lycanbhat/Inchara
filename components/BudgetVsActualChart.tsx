'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Task, Expense } from '@/types';
import { getTaskSpent, formatCurrency } from '@/lib/utils';

interface BudgetVsActualChartProps {
  tasks: Task[];
  expenses: Expense[];
}

export function BudgetVsActualChart({ tasks, expenses }: BudgetVsActualChartProps) {
  const data = tasks.map(task => ({
    name: task.name,
    Budgeted: task.budgetedAmount,
    Spent: getTaskSpent(task.id, expenses),
    color: task.color
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded border border-gray-300 bg-white p-3 shadow-lg">
          <p className="font-semibold">{payload[0].payload.name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Budget vs Actual Spending</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Budgeted" fill="#3B82F6" />
          <Bar dataKey="Spent" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
