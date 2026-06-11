'use client';

import { useState } from 'react';
import { Task, Expense } from '@/types';
import { formatCurrency, getTaskSpent, formatDate, getTimeAgo } from '@/lib/utils';
import { MoreHorizontal, Plus, Trash2, GripVertical, Edit2 } from 'lucide-react';

interface Props {
  tasks: Task[];
  expenses: Expense[];
  onDeleteTask: (id: string) => void;
  onDeleteExpense: (id: string) => void;
  onAddTask: () => void;
  onAddExpense: () => void;
  onRefresh: () => void;
  onEditTask?: (task: Task) => void;
  onEditExpense?: (expense: Expense) => void;
}

const TABS = ['Expenses', 'Categories'] as const;

function TaskStatusBadge({ task }: { task: Task }) {
  if (task.status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-green-700">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
        Done
      </span>
    );
  }
  if (task.status === 'paused') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-orange-600">
        <span className="w-1.5 h-1.5 rounded-full border border-orange-400 flex-shrink-0" />
        Paused
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
      <span className="w-1.5 h-1.5 rounded-full border border-gray-400 flex-shrink-0" />
      In Progress
    </span>
  );
}

function PriorityBadge({ priority }: { priority: Task['priority'] }) {
  const styles = {
    high: 'bg-red-50 text-red-600',
    medium: 'bg-orange-50 text-orange-600',
    low: 'bg-gray-100 text-gray-500',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[priority]}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

function PaymentBadge({ method }: { method: Expense['paymentMethod'] }) {
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium uppercase">
      {method}
    </span>
  );
}

function RowMenu({ onEdit, onDelete }: { onEdit?: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-7 z-20 bg-white border border-gray-200 rounded-lg shadow-md py-1 w-36">
            {onEdit && (
              <button
                onClick={() => { onEdit(); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
            <button
              onClick={() => { onDelete(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function TasksTable({
  tasks,
  expenses,
  onDeleteTask,
  onEditTask,
}: {
  tasks: Task[];
  expenses: Expense[];
  onDeleteTask: (id: string) => void;
  onEditTask?: (task: Task) => void;
}) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-medium text-gray-900 mb-1">No categories yet</p>
        <p className="text-xs text-gray-400">Create your first category to get started</p>
      </div>
    );
  }

  const totalSpent = tasks.reduce((s, t) => s + getTaskSpent(t.id, expenses), 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="w-8 px-4 py-3" />
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 whitespace-nowrap">
              Category Name
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Status</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">Spent</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 hidden sm:table-cell">Priority</th>
            <th className="w-10 px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {tasks.map((task) => {
            const spent = getTaskSpent(task.id, expenses);
            return (
              <tr key={task.id} className="hover:bg-gray-50/50 group transition-colors">
                <td className="px-4 py-3">
                  <GripVertical className="w-3.5 h-3.5 text-gray-300" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                     <span
                      className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: task.color }}
                    />
                    <div>
                      <p className="text-sm text-gray-900 font-medium leading-none">
                        {task.name}
                      </p>
                      {task.description && (
                        <p className="text-xs text-gray-400 mt-0.5">{task.description}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <TaskStatusBadge task={task} />
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-700">
                  {formatCurrency(spent)}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="px-4 py-3">
                  <RowMenu
                    onEdit={onEditTask ? () => onEditTask(task) : undefined}
                    onDelete={() => onDeleteTask(task.id)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-gray-100 bg-gray-50/50">
            <td colSpan={3} className="px-4 py-3 text-xs text-gray-400">
              {tasks.length} categor{tasks.length !== 1 ? 'ies' : 'y'}
            </td>
            <td className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
              {formatCurrency(totalSpent)}
            </td>
            <td className="px-4 py-3 hidden sm:table-cell" />
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function ExpensesTable({
  expenses,
  tasks,
  onDeleteExpense,
  onEditExpense,
}: {
  expenses: Expense[];
  tasks: Task[];
  onDeleteExpense: (id: string) => void;
  onEditExpense?: (expense: Expense) => void;
}) {
  const taskMap = new Map(tasks.map((t) => [t.id, t]));
  const sorted = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-medium text-gray-900 mb-1">No expenses yet</p>
        <p className="text-xs text-gray-400">Add your first expense to track spending</p>
      </div>
    );
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="w-8 px-4 py-3" />
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Description</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Category</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 hidden sm:table-cell">Payment</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 hidden sm:table-cell">Date</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">Amount</th>
            <th className="w-10 px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sorted.map((expense) => {
            const task = taskMap.get(expense.taskId);
            return (
              <tr key={expense.id} className="hover:bg-gray-50/50 group transition-colors">
                <td className="px-4 py-3">
                  <GripVertical className="w-3.5 h-3.5 text-gray-300" />
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-gray-900 font-medium">{expense.description}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{getTimeAgo(expense.date)}</p>
                </td>
                <td className="px-4 py-3">
                  {task ? (
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: task.color }}
                      />
                      <span className="text-sm text-gray-600">{task.name}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Unknown</span>
                  )}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <PaymentBadge method={expense.paymentMethod} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap hidden sm:table-cell">
                  {formatDate(expense.date)}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900 whitespace-nowrap">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-4 py-3">
                  <RowMenu
                    onEdit={onEditExpense ? () => onEditExpense(expense) : undefined}
                    onDelete={() => onDeleteExpense(expense.id)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-gray-100 bg-gray-50/50">
            <td colSpan={3} className="px-4 py-3 text-xs text-gray-400">
              {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
            </td>
            <td className="px-4 py-3 hidden sm:table-cell" />
            <td className="px-4 py-3 hidden sm:table-cell" />
            <td className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
              {formatCurrency(total)}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export function TasksExpenseTable({
  tasks,
  expenses,
  onDeleteTask,
  onDeleteExpense,
  onAddTask,
  onAddExpense,
  onEditTask,
  onEditExpense,
}: Props) {
  const [activeTab, setActiveTab] = useState<0 | 1>(0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Tab bar */}
      <div className="flex items-center justify-between px-4 border-b border-gray-100">
        <div className="flex items-center">
          {TABS.map((tab, i) => {
            const count = i === 0 ? expenses.length : tasks.length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(i as 0 | 1)}
                className={`flex items-center gap-1.5 px-1 py-3 mr-4 text-sm border-b-2 transition-colors ${
                  activeTab === i
                    ? 'border-gray-900 text-gray-900 font-medium'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
                {count > 0 && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full leading-none">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={activeTab === 0 ? onAddExpense : onAddTask}
          className="flex items-center gap-1.5 text-xs bg-gray-900 text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors my-3"
        >
          <Plus className="w-3 h-3" />
          {activeTab === 0 ? 'Add Expense' : 'Add Category'}
        </button>
      </div>

      {activeTab === 0 ? (
        <ExpensesTable
          expenses={expenses}
          tasks={tasks}
          onDeleteExpense={onDeleteExpense}
          onEditExpense={onEditExpense}
        />
      ) : (
        <TasksTable tasks={tasks} expenses={expenses} onDeleteTask={onDeleteTask} onEditTask={onEditTask} />
      )}
    </div>
  );
}
