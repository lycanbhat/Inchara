'use client';

import { KPICard } from './KPICard';
import { formatCurrency } from '@/lib/utils';

interface Stats {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  spentPercentage: number;
  todaySpending: number;
  thisWeekSpending: number;
  thisMonthSpending: number;
  activeTasks: number;
  completedTasks: number;
  totalExpenses: number;
  averageDailySpending: number;
}

export function KPISection({ stats }: { stats: Stats }) {
  const overBudget = stats.remaining < 0;
  const nearBudget = stats.spentPercentage >= 80 && !overBudget;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Total Budget"
        value={formatCurrency(stats.totalBudget)}
        subtitle="Project budget"
        description="Total project budget"
      />
      <KPICard
        title="Total Spent"
        value={formatCurrency(stats.totalSpent)}
        badge={stats.totalExpenses > 0 ? `${stats.spentPercentage}%` : undefined}
        badgePositive={!nearBudget && !overBudget}
        subtitle={
          stats.totalExpenses > 0
            ? `${stats.totalExpenses} transactions logged`
            : 'No expenses yet'
        }
        description={stats.totalExpenses > 0 ? 'Of total budget used' : undefined}
      />
      <KPICard
        title="Remaining"
        value={formatCurrency(Math.abs(stats.remaining))}
        badge={overBudget ? 'Over budget' : undefined}
        badgePositive={false}
        subtitle={overBudget ? 'Budget exceeded' : 'Budget remaining'}
        description={`${stats.activeTasks} active category${stats.activeTasks !== 1 ? 'ies' : ''}`}
      />
      <KPICard
        title="This Month"
        value={formatCurrency(stats.thisMonthSpending)}
        subtitle="Spent this month"
        description={`Today: ${formatCurrency(stats.todaySpending)}`}
      />
    </div>
  );
}
