'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Project } from '@/types';
import { updateProject } from '@/lib/storage';

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  project: Project;
}

const inputClass =
  'w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 transition-colors';

const labelClass = 'block text-xs font-medium text-gray-500 mb-1.5';

export function ProjectSettingsModal({
  isOpen,
  onClose,
  onSuccess,
  project,
}: ProjectSettingsModalProps) {
  const [formData, setFormData] = useState({
    name: project.name || '',
    startDate: project.startDate || '',
    endDate: project.endDate || '',
    totalBudget: project.totalBudget ?? 0,
    location: project.location || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form state if project prop updates
  useEffect(() => {
    setFormData({
      name: project.name || '',
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      totalBudget: project.totalBudget ?? 0,
      location: project.location || '',
    });
  }, [project]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = 'Required';
    if (!formData.startDate) e.startDate = 'Required';
    if (!formData.endDate) e.endDate = 'Required';
    if (formData.totalBudget <= 0) e.totalBudget = 'Enter a valid budget';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await updateProject({
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalBudget: Number(formData.totalBudget),
        location: formData.location,
      });
      onSuccess();
      onClose();
    } catch {
      alert('Failed to save project settings');
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
            <h2 className="text-sm font-semibold text-gray-900">Project Settings</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Update project information and budget configurations
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
            <label className={labelClass}>Project Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={inputClass}
              placeholder="e.g., House Renovation"
              autoFocus
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Budget */}
          <div>
            <label className={labelClass}>Total Budget (₹)</label>
            <input
              type="number"
              value={formData.totalBudget}
              onChange={(e) => setFormData({ ...formData, totalBudget: parseFloat(e.target.value) || 0 })}
              className={inputClass}
              placeholder="0"
              min="0"
            />
            {errors.totalBudget && <p className="text-xs text-red-500 mt-1">{errors.totalBudget}</p>}
          </div>

          {/* Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className={inputClass}
              />
              {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className={labelClass}>End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className={inputClass}
              />
              {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className={labelClass}>Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={inputClass}
              placeholder="Address"
            />
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
              {isSubmitting ? 'Saving…' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
