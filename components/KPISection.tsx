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
  upiSpending: number;
  cashSpending: number;
  mostExpensiveCategory: string;
  mostExpensiveCategorySpent: number;
}

export function KPISection({ stats }: { stats: Stats }) {
  const overBudget = stats.remaining < 0;
  const nearBudget = stats.spentPercentage >= 80 && !overBudget;

  const totalUpiCash = stats.upiSpending + stats.cashSpending;
  const upiPercentage = totalUpiCash > 0 ? Math.round((stats.upiSpending / totalUpiCash) * 100) : 0;
  const cashPercentage = totalUpiCash > 0 ? 100 - upiPercentage : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
      
      {/* UPI vs Cash Custom Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-2">
            <span className="text-sm text-gray-500">UPI vs Cash</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex my-3">
            <div 
              className="bg-blue-600 h-full transition-all duration-500" 
              style={{ width: `${upiPercentage}%` }} 
            />
            <div 
              className="bg-emerald-500 h-full transition-all duration-500" 
              style={{ width: `${cashPercentage}%` }} 
            />
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
              <span className="text-[10px] text-gray-400 font-medium">UPI</span>
            </div>
            <p className="text-sm font-semibold text-gray-900 leading-none">{formatCurrency(stats.upiSpending)}</p>
            <span className="text-[10px] text-gray-400">{upiPercentage}%</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-[10px] text-gray-400 font-medium">Cash</span>
            </div>
            <p className="text-sm font-semibold text-gray-900 leading-none">{formatCurrency(stats.cashSpending)}</p>
            <span className="text-[10px] text-gray-400">{cashPercentage}%</span>
          </div>
        </div>
      </div>

      <KPICard
        title="Expensive Category"
        value={stats.mostExpensiveCategory}
        subtitle="Highest spent category"
        description={`Spent: ${formatCurrency(stats.mostExpensiveCategorySpent)}`}
      />
    </div>
  );
}
