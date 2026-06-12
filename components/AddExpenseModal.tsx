'use client';

import { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { Task, Expense } from '@/types';
import { addExpense, updateExpense } from '@/lib/storage';
import { formatToCustomDisplayDate } from '@/lib/utils';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onSuccess: () => void;
  expense?: Expense;
  minDate?: string;
}

const inputClass =
  'w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-0 transition-colors';

const labelClass = 'block text-xs font-medium text-gray-500 mb-1.5';

const getTodayISTString = () => {
  return new Intl.DateTimeFormat('fr-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
};

export function AddExpenseModal({
  isOpen,
  onClose,
  tasks,
  onSuccess,
  expense,
  minDate,
}: AddExpenseModalProps) {
  const [formData, setFormData] = useState({
    taskId: expense?.taskId || tasks[0]?.id || '',
    amount: expense?.amount ?? '',
    paymentMethod: expense?.paymentMethod || 'cash',
    description: expense?.description || '',
    date: expense?.date?.split('T')[0] || getTodayISTString(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        taskId: expense?.taskId || tasks[0]?.id || '',
        amount: expense?.amount ?? '',
        paymentMethod: expense?.paymentMethod || 'cash',
        description: expense?.description || '',
        date: expense?.date?.split('T')[0] || getTodayISTString(),
      });
      setErrors({});
    }
  }, [expense, isOpen, tasks]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.taskId) e.taskId = 'Select a task';
    if (!formData.description.trim()) e.description = 'Required';
    if (!formData.amount || Number(formData.amount) <= 0) e.amount = 'Enter a valid amount';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const dateTime = `${formData.date}T12:00:00+05:30`;
      if (expense) {
        await updateExpense(expense.id, {
          taskId: formData.taskId,
          amount: Number(formData.amount),
          paymentMethod: formData.paymentMethod as any,
          description: formData.description,
          date: dateTime,
        });
      } else {
        await addExpense({
          id: `exp_${Date.now()}`,
          taskId: formData.taskId,
          amount: Number(formData.amount),
          paymentMethod: formData.paymentMethod as any,
          description: formData.description,
          date: dateTime,
          status: 'completed',
        });
      }
      onSuccess();
      onClose();
    } catch {
      alert('Failed to save expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full h-full sm:h-auto sm:max-w-sm bg-white rounded-none sm:rounded-xl border-0 sm:border border-gray-200 shadow-none sm:shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              {expense ? 'Edit Expense' : 'Add Expense'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {expense ? 'Update the expense details' : 'Log a new construction expense'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4 flex-1 overflow-y-auto">
          {/* Category */}
          <div>
            <label className={labelClass}>Category</label>
            {tasks.length === 0 ? (
              <p className="text-xs text-orange-500 bg-orange-50 px-3 py-2 rounded-md border border-orange-100">
                No categories yet — create a category first
              </p>
            ) : (
              <select
                value={formData.taskId}
                onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
                className={inputClass}
              >
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.name}
                  </option>
                ))}
              </select>
            )}
            {errors.taskId && <p className="text-xs text-red-500 mt-1">{errors.taskId}</p>}
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={inputClass}
              placeholder="e.g., Cement and steel purchase"
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Amount + Payment row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Amount (₹)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className={inputClass}
                placeholder="0"
                min="0"
              />
              {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
            </div>
            <div>
              <label className={labelClass}>Payment</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                className={inputClass}
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="check">Check</option>
              </select>
            </div>
          </div>

          {/* Date row */}
          <div>
            <label className={labelClass}>Date</label>
            <div className="relative rounded-md border border-gray-200 focus-within:border-gray-400 transition-colors">
              <div className="w-full bg-white px-3 py-2 text-sm text-gray-900 flex justify-between items-center pointer-events-none min-h-[38px] rounded-md">
                <span className={formData.date ? 'text-gray-900' : 'text-gray-400'}>
                  {formData.date ? formatToCustomDisplayDate(formData.date) : 'Select date'}
                </span>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={minDate}
                max={getTodayISTString()}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 text-sm px-4 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || tasks.length === 0}
              className="flex-1 text-sm px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving…' : expense ? 'Update' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
