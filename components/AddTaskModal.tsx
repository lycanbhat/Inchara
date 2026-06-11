'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Task } from '@/types';
import { addTask, updateTask } from '@/lib/storage';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  task?: Task;
}

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#06B6D4', '#10B981', '#EF4444', '#6366F1'];

export function AddTaskModal({
  isOpen,
  onClose,
  onSuccess,
  task
}: AddTaskModalProps) {
  const [formData, setFormData] = useState({
    name: task?.name || '',
    description: task?.description || '',
    budgetedAmount: task?.budgetedAmount || 0,
    priority: task?.priority || 'medium',
    color: task?.color || COLORS[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.budgetedAmount || formData.budgetedAmount <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      if (task) {
        await updateTask(task.id, {
          name: formData.name,
          description: formData.description,
          budgetedAmount: formData.budgetedAmount,
          priority: formData.priority as any,
          color: formData.color
        });
      } else {
        const newTask: Task = {
          id: `task_${Date.now()}`,
          name: formData.name,
          description: formData.description,
          budgetedAmount: formData.budgetedAmount,
          createdDate: new Date().toISOString(),
          status: 'active',
          priority: formData.priority as any,
          color: formData.color
        };
        await addTask(newTask);
      }

      onSuccess();
      onClose();
    } catch (error) {
      alert('Failed to save task');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-md rounded-lg bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900">
            {task ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Task Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
              placeholder="e.g., Foundation"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
              placeholder="Brief description of the task"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Budgeted Amount (₹)</label>
            <input
              type="number"
              value={formData.budgetedAmount}
              onChange={(e) => setFormData({ ...formData, budgetedAmount: parseFloat(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`h-8 rounded-lg border-2 ${
                    formData.color === color ? 'border-gray-900' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : task ? 'Update' : 'Create'} Task
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
