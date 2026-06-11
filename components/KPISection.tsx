'use client';

import { Wallet, TrendingUp, Target, PieChart } from 'lucide-react';
import { KPICard } from './KPICard';
import { formatCurrency } from '@/lib/utils';

interface KPISectionProps {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  spentPercentage: number;
}

export function KPISection({
  totalBudget,
  totalSpent,
  remaining,
  spentPercentage
}: KPISectionProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Total Budget"
        value={formatCurrency(totalBudget)}
        icon={Wallet}
        color="blue"
        index={0}
      />
      <KPICard
        title="Total Spent"
        value={formatCurrency(totalSpent)}
        icon={TrendingUp}
        color="orange"
        index={1}
      />
      <KPICard
        title="Remaining"
        value={formatCurrency(remaining)}
        icon={Target}
        color={remaining < 0 ? 'red' : 'green'}
        index={2}
      />
      <KPICard
        title="Spent %"
        value={`${spentPercentage}%`}
        icon={PieChart}
        color={spentPercentage > 100 ? 'red' : spentPercentage > 80 ? 'orange' : 'green'}
        index={3}
      />
    </div>
  );
}
