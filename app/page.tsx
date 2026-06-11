'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { KPISection } from '@/components/KPISection';
import { SpendingAreaChart } from '@/components/SpendingAreaChart';
import { TasksExpenseTable } from '@/components/TasksExpenseTable';
import { AddExpenseModal } from '@/components/AddExpenseModal';
import { AddTaskModal } from '@/components/AddTaskModal';
import { ProjectSettingsModal } from '@/components/ProjectSettingsModal';
import { AppData, Task, Expense } from '@/types';
import { getAppData, saveAppData, deleteExpense, deleteTask, updateProject } from '@/lib/storage';
import { getQuickStats } from '@/lib/utils';

export default function Dashboard() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showProjectSettings, setShowProjectSettings] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Task | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

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

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    await deleteExpense(id);
    handleRefresh();
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Delete this category and all its expenses?')) return;
    await deleteTask(id);
    handleRefresh();
  };

  const handleEditCategory = (category: Task) => {
    setEditingCategory(category);
    setShowAddTask(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowAddExpense(true);
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
        onAddExpense={() => setShowAddExpense(true)}
        onSettings={() => setShowProjectSettings(true)}
      />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
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
          onEditTask={handleEditCategory}
          onEditExpense={handleEditExpense}
        />
      </main>

      <AddExpenseModal
        isOpen={showAddExpense}
        onClose={() => {
          setShowAddExpense(false);
          setEditingExpense(null);
        }}
        tasks={data.tasks}
        onSuccess={handleRefresh}
        minDate={projectStartDate}
        expense={editingExpense || undefined}
      />
      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => {
          setShowAddTask(false);
          setEditingCategory(null);
        }}
        onSuccess={handleRefresh}
        task={editingCategory || undefined}
      />
      <ProjectSettingsModal
        isOpen={showProjectSettings}
        onClose={() => setShowProjectSettings(false)}
        onSuccess={handleRefresh}
        project={data.project}
      />
    </div>
  );
}
