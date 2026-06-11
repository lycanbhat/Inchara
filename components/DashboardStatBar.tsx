'use client';

import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

interface DashboardStatBarProps {
  todaySpending: number;
  weekSpending: number;
  monthSpending: number;
  activeTasks: number;
}

export function DashboardStatBar({
  todaySpending,
  weekSpending,
  monthSpending,
  activeTasks
}: DashboardStatBarProps) {
  const stats = [
    { label: 'Today', value: formatCurrency(todaySpending) },
    { label: 'This Week', value: formatCurrency(weekSpending) },
    { label: 'This Month', value: formatCurrency(monthSpending) },
    { label: 'Active Tasks', value: activeTasks.toString() }
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 p-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
