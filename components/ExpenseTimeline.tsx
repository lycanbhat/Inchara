'use client';

import { motion } from 'framer-motion';
import { Expense, Task } from '@/types';
import { formatCurrency, formatDate, formatTime, groupExpensesByDay } from '@/lib/utils';
import { Trash2, Edit2, CreditCard, Banknote } from 'lucide-react';

interface ExpenseTimelineProps {
  expenses: Expense[];
  tasks: Task[];
  onEdit?: (expense: Expense) => void;
  onDelete?: (expenseId: string) => void;
}

export function ExpenseTimeline({
  expenses,
  tasks,
  onEdit,
  onDelete
}: ExpenseTimelineProps) {
  const grouped = groupExpensesByDay(expenses);
  const taskMap = new Map(tasks.map(t => [t.id, t]));

  if (expenses.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-600">No expenses recorded yet. Start by adding your first expense!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([dayLabel, dayExpenses]) => (
        <div key={dayLabel}>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{dayLabel}</h3>
          <div className="space-y-3">
            {dayExpenses.map((expense, index) => {
              const task = taskMap.get(expense.taskId);
              const icon = expense.paymentMethod === 'cash' ? Banknote : CreditCard;
              const Icon = icon;

              return (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex flex-1 items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: task?.color || '#gray' }}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{task?.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-600">{expense.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(expense.amount)}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Icon className="h-3 w-3" />
                        <span className="capitalize">{expense.paymentMethod}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(expense)}
                          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(expense.id)}
                          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
