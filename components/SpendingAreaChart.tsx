'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Expense } from '@/types';
import { formatCurrency, getSpendingByRange } from '@/lib/utils';

interface Props {
  expenses: Expense[];
  projectStartDate: string;
}

export function SpendingAreaChart({ expenses, projectStartDate }: Props) {
  const data = useMemo(() => {
    return getSpendingByRange(expenses, projectStartDate);
  }, [expenses, projectStartDate]);

  const totalForPeriod = data.reduce((s, d) => s + d.amount, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
          <p className="text-xs text-gray-400 mb-0.5">{label}</p>
          <p className="text-sm font-semibold text-gray-900">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Total Spending</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {formatCurrency(totalForPeriod)} · since project started
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#111827" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#111827" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            interval="preserveStartEnd"
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#111827"
            strokeWidth={1.5}
            fill="url(#grad)"
            dot={false}
            activeDot={{ r: 3, fill: '#111827', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
