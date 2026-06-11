'use client';

import { Download, Plus, Home, Settings } from 'lucide-react';

interface NavbarProps {
  projectName: string;
  onExport: () => void;
  onAddExpense: () => void;
  onSettings: () => void;
}

export function Navbar({
  projectName,
  onExport,
  onAddExpense,
  onSettings,
}: NavbarProps) {
  return (
    <header className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 h-16 bg-white border-b border-gray-100">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
          <Home className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-900 truncate max-w-[120px] sm:max-w-none">
          {projectName}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 text-xs text-gray-600 px-2 py-1.5 sm:px-3 sm:py-1.5 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          title="Export"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>
        <button
          onClick={onSettings}
          className="flex items-center gap-1.5 text-xs text-gray-600 px-2 py-1.5 sm:px-3 sm:py-1.5 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          title="Settings"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Settings</span>
        </button>
        <button
          onClick={onAddExpense}
          className="flex items-center gap-1.5 text-xs bg-gray-900 text-white px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-md hover:bg-gray-800 transition-colors"
          title="Add Expense"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Expense</span>
        </button>
      </div>
    </header>
  );
}
