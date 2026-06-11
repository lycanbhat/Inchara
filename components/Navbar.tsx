'use client';

import { Calendar, Download, Upload, Plus, Home } from 'lucide-react';

interface NavbarProps {
  projectName: string;
  projectStartDate: string;
  onStartDateChange: (date: string) => void;
  onExport: () => void;
  onImport: () => void;
  onAddExpense: () => void;
}

export function Navbar({
  projectName,
  projectStartDate,
  onStartDateChange,
  onExport,
  onImport,
  onAddExpense,
}: NavbarProps) {
  const formatted = projectStartDate
    ? new Date(projectStartDate + 'T00:00:00').toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Set date';

  return (
    <header className="flex-shrink-0 flex items-center justify-between px-6 h-16 bg-white border-b border-gray-100">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
          <Home className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-900">{projectName}</span>
      </div>

      {/* Project start date — <label> wraps the input so clicking anywhere opens the picker natively */}
      <label className="relative flex items-center gap-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-xl px-6 py-2.5 transition-all group cursor-pointer">
        <Calendar className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 pointer-events-none" />
        <div className="text-left pointer-events-none">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-none mb-1">
            Project Start Date
          </p>
          <p className="text-base font-bold text-gray-900 leading-none">{formatted}</p>
        </div>
        <svg
          className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors ml-2 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>

        {/* Input covers the whole label area — label click natively activates it in all browsers */}
        <input
          type="date"
          value={projectStartDate}
          onChange={(e) => {
            if (e.target.value) onStartDateChange(e.target.value);
          }}
          max={new Date().toISOString().split('T')[0]}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </label>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onImport}
          className="flex items-center gap-1.5 text-xs text-gray-600 px-3 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          Import
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 text-xs text-gray-600 px-3 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
        <button
          onClick={onAddExpense}
          className="flex items-center gap-1.5 text-xs bg-gray-900 text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Expense
        </button>
      </div>
    </header>
  );
}
