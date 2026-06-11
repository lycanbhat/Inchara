'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { KPISection } from '@/components/KPISection';
import { SpendingAreaChart } from '@/components/SpendingAreaChart';
import { TasksExpenseTable } from '@/components/TasksExpenseTable';
import { AddExpenseModal } from '@/components/AddExpenseModal';
import { AddTaskModal } from '@/components/AddTaskModal';
import { AppData } from '@/types';
import { getAppData, saveAppData, deleteExpense, deleteTask, updateProject } from '@/lib/storage';
import { getQuickStats } from '@/lib/utils';

export default function Dashboard() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  const loadData = async () => {
    try {
      const appData = await getAppData();
      setData(appData);
    } catch {
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

  const handleStartDateChange = async (newDate: string) => {
    if (!data) return;
    await updateProject({ startDate: newDate });
    setData((prev) =>
      prev ? { ...prev, project: { ...prev.project, startDate: newDate } } : prev
    );
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    await deleteExpense(id);
    handleRefresh();
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Delete this task and all its expenses?')) return;
    await deleteTask(id);
    handleRefresh();
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
  const projectStartDate = data.project.startDate;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <Navbar
        projectName={data.project.name}
        projectStartDate={projectStartDate}
        onStartDateChange={handleStartDateChange}
        onExport={handleExport}
        onImport={handleImport}
        onAddExpense={() => setShowAddExpense(true)}
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">
        <KPISection stats={stats} />
        <SpendingAreaChart
          expenses={data.expenses}
          projectStartDate={projectStartDate}
        />
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

      <AddExpenseModal
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        tasks={data.tasks}
        onSuccess={handleRefresh}
        minDate={projectStartDate}
      />
      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
