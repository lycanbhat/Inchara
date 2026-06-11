'use client';

import { Home, Settings, Download, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  projectName: string;
  onExport?: () => void;
  onImport?: () => void;
  onSettings?: () => void;
}

export function Header({
  projectName,
  onExport,
  onImport,
  onSettings
}: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-gray-200 bg-white shadow-sm"
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Home className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{projectName}</h1>
              <p className="text-sm text-gray-600">Construction Expense Tracker</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onImport && (
              <button
                onClick={onImport}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-all duration-200 hover:bg-gray-50"
              >
                <Upload className="h-4 w-4" />
                <span className="text-sm font-medium">Import</span>
              </button>
            )}
            {onExport && (
              <button
                onClick={onExport}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-all duration-200 hover:bg-gray-50"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm font-medium">Export</span>
              </button>
            )}
            {onSettings && (
              <button
                onClick={onSettings}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-all duration-200 hover:bg-gray-50"
              >
                <Settings className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
