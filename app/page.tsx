'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { KPISection } from '@/components/KPISection';
import { SpendingAreaChart } from '@/components/SpendingAreaChart';
import { TasksExpenseTable } from '@/components/TasksExpenseTable';
import { AddExpenseModal } from '@/components/AddExpenseModal';
import { AddTaskModal } from '@/components/AddTaskModal';
import { AppData, Task, Expense } from '@/types';
import { getAppData, saveAppData, deleteExpense, deleteTask } from '@/lib/storage';
import { getQuickStats } from '@/lib/utils';
import { Download, Upload, Plus } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  tasks: 'Tasks',
  expenses: 'Expenses',
  reports: 'Reports',
  settings: 'Settings',
};

export default function Dashboard() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  const loadData = async () => {
    try {
      const appData = await getAppData();
      setData(appData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleRefresh = async () => {
    const updated = await getAppData();
    setData(updated);
  };

  const handleDeleteExpense = async (id: string) => {
    if (confirm('Delete this expense?')) {
      await deleteExpense(id);
      handleRefresh();
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm('Delete this task and all its expenses?')) {
      await deleteTask(id);
      handleRefresh();
    }
  };

  const handleExport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inchara-renovation-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev: any) => {
        try {
          const imported = JSON.parse(ev.target.result);
          await saveAppData(imported);
          setData(imported);
        } catch {
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <p className="text-sm text-red-500">{error ?? 'Something went wrong'}</p>
      </div>
    );
  }

  const stats = getQuickStats(data);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-white">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 h-14 border-b border-gray-100 flex-shrink-0">
          <h1 className="text-sm font-semibold text-gray-900">
            {PAGE_TITLES[currentPage] ?? 'Dashboard'}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleImport}
              className="flex items-center gap-1.5 text-xs text-gray-600 px-3 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Import
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 text-xs text-gray-600 px-3 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <button
              onClick={() => setShowAddExpense(true)}
              className="flex items-center gap-1.5 text-xs bg-gray-900 text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Expense
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          <KPISection stats={stats} />
          <SpendingAreaChart expenses={data.expenses} />
          <TasksExpenseTable
            tasks={data.tasks}
            expenses={data.expenses}
            onDeleteTask={handleDeleteTask}
            onDeleteExpense={handleDeleteExpense}
            onAddTask={() => setShowAddTask(true)}
            onAddExpense={() => setShowAddExpense(true)}
            onRefresh={handleRefresh}
          />
        </main>
      </div>

      <AddExpenseModal
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        tasks={data.tasks}
        onSuccess={handleRefresh}
      />
      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
