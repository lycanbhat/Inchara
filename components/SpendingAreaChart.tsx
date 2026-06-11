'use client';

import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Expense } from '@/types';
import { formatCurrency, getLastNDays, getSpendingByRange } from '@/lib/utils';

const PERIODS = [
  { label: 'Since Start', days: null },
  { label: 'Last 3 months', days: 90 },
  { label: 'Last 30 days', days: 30 },
];

interface Props {
  expenses: Expense[];
  projectStartDate: string;
}

export function SpendingAreaChart({ expenses, projectStartDate }: Props) {
  const [activePeriod, setActivePeriod] = useState(0);

  const data = useMemo(() => {
    const period = PERIODS[activePeriod];

    if (period.days === null) {
      // Since project start
      return getSpendingByRange(expenses, projectStartDate);
    }

    // Last N days — daily
    const dateRange = getLastNDays(period.days);
    return dateRange.map((date) => {
      const total = expenses
        .filter((e) => e.date.startsWith(date))
        .reduce((sum, e) => sum + e.amount, 0);
      const d = new Date(date);
      return {
        date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        amount: total,
      };
    });
  }, [expenses, activePeriod, projectStartDate]);

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
            {formatCurrency(totalForPeriod)} ·{' '}
            {PERIODS[activePeriod].days === null
              ? 'since project started'
              : PERIODS[activePeriod].label.toLowerCase()}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-lg p-1">
          {PERIODS.map((p, i) => (
            <button
              key={p.label}
              onClick={() => setActivePeriod(i)}
              className={`text-xs px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                i === activePeriod
                  ? 'bg-white text-gray-900 shadow-sm font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p.label}
            </button>
          ))}
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
