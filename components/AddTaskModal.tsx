'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task } from '@/types';
import { addTask, updateTask } from '@/lib/storage';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  task?: Task;
}

const COLORS = [
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#F59E0B',
  '#06B6D4',
  '#10B981',
  '#EF4444',
  '#6366F1',
  '#F43F5E',
  '#D946EF',
  '#A855F7',
  '#0EA5E9',
  '#14B8A6',
  '#22C55E',
  '#84CC16',
  '#EAB308',
  '#F97316',
  '#475569',
];

const inputClass =
  'w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 transition-colors';

const labelClass = 'block text-xs font-medium text-gray-500 mb-1.5';

export function AddTaskModal({ isOpen, onClose, onSuccess, task }: AddTaskModalProps) {
  const [formData, setFormData] = useState({
    name: task?.name || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    color: task?.color || COLORS[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: task?.name || '',
        description: task?.description || '',
        priority: task?.priority || 'medium',
        color: task?.color || COLORS[0],
      });
      setErrors({});
    }
  }, [task, isOpen]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      if (task) {
        await updateTask(task.id, {
          name: formData.name,
          description: formData.description,
          budgetedAmount: 0,
          priority: formData.priority as any,
          color: formData.color,
        });
      } else {
        await addTask({
          id: `task_${Date.now()}`,
          name: formData.name,
          description: formData.description,
          budgetedAmount: 0,
          createdDate: new Date().toISOString(),
          status: 'active',
          priority: formData.priority as any,
          color: formData.color,
        });
      }
      onSuccess();
      onClose();
    } catch {
      alert('Failed to save category');
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
      <div className="relative z-10 w-full max-w-sm mx-4 bg-white rounded-xl border border-gray-200 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              {task ? 'Edit Category' : 'Add Category'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {task ? 'Update the category details' : 'Create a new construction category'}
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
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          {/* Name */}
          <div>
            <label className={labelClass}>Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={inputClass}
              placeholder="e.g., Foundation"
              autoFocus
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description <span className="text-gray-300">(optional)</span></label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={inputClass}
              placeholder="Brief description"
            />
          </div>

          {/* Priority */}
          <div>
            <label className={labelClass}>Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className={inputClass}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Color */}
          <div>
            <label className={labelClass}>Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110 focus:outline-none"
                  style={{ backgroundColor: color }}
                >
                  {formData.color === color && (
                    <span className="flex items-center justify-center w-full h-full">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
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
              disabled={isSubmitting}
              className="flex-1 text-sm px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving…' : task ? 'Update Category' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
