'use client';

import { motion } from 'framer-motion';
import { Task, Expense } from '@/types';
import { getTaskSpent, getTaskProgress, formatCurrency, getTimeAgo } from '@/lib/utils';
import { Trash2, Edit2 } from 'lucide-react';

interface TaskProgressCardProps {
  task: Task;
  expenses: Expense[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  index?: number;
}

export function TaskProgressCard({
  task,
  expenses,
  onEdit,
  onDelete,
  index = 0
}: TaskProgressCardProps) {
  const spent = getTaskSpent(task.id, expenses);
  const progress = getTaskProgress(task, expenses);
  const remaining = task.budgetedAmount - spent;
  const isOverBudget = spent > task.budgetedAmount;

  const lastExpense = expenses
    .filter(e => e.taskId === task.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const progressColor =
    progress > 100 ? 'bg-red-500' : progress > 80 ? 'bg-yellow-500' : 'bg-green-500';

  const progressBgColor =
    progress > 100 ? 'bg-red-100' : progress > 80 ? 'bg-yellow-100' : 'bg-green-100';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: task.color }}
          />
          <div>
            <h4 className="font-semibold text-gray-900">{task.name}</h4>
            <p className="text-sm text-gray-600">{task.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-bold text-gray-900">{Math.round(progress)}%</span>
          </div>
          <div className={cn('h-3 rounded-full overflow-hidden', progressBgColor)}>
            <motion.div
              className={progressColor}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ height: '100%' }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Budgeted</p>
          <p className="font-semibold text-gray-900">{formatCurrency(task.budgetedAmount)}</p>
        </div>
        <div>
          <p className="text-gray-600">Spent</p>
          <p className={cn(
            'font-semibold',
            isOverBudget ? 'text-red-600' : 'text-green-600'
          )}>
            {formatCurrency(spent)}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Remaining</p>
          <p className={cn(
            'font-semibold',
            remaining < 0 ? 'text-red-600' : 'text-green-600'
          )}>
            {formatCurrency(Math.abs(remaining))}
          </p>
        </div>
      </div>

      {lastExpense && (
        <div className="mt-4 border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-600">
            Last expense: <span className="font-medium">{getTimeAgo(lastExpense.date)}</span>
          </p>
        </div>
      )}
    </motion.div>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
