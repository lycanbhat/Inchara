'use client';

import { motion } from 'framer-motion';
import { Home, BarChart3, Plus, FileText, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'add-expense', label: 'Add Expense', icon: Plus },
  { id: 'tasks', label: 'Tasks', icon: BarChart3 },
  { id: 'reports', label: 'Reports', icon: FileText },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="border-r border-gray-200 bg-white p-4"
    >
      <nav className="space-y-2">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 text-left',
                isActive
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
              whileHover={{ x: 4 }}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 border-t border-gray-200 pt-4"
      >
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Quick Actions</p>
        <button className="mt-3 flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-600 transition-all duration-200 hover:bg-gray-100">
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </button>
      </motion.div>
    </motion.aside>
  );
}
