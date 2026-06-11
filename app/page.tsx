'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { KPISection } from '@/components/KPISection';
import { BudgetVsActualChart } from '@/components/BudgetVsActualChart';
import { SpendingDistributionChart } from '@/components/SpendingDistributionChart';
import { TaskProgressSection } from '@/components/TaskProgressSection';
import { ExpenseTimeline } from '@/components/ExpenseTimeline';
import { SpendingTrendChart } from '@/components/SpendingTrendChart';
import { PaymentMethodChart } from '@/components/PaymentMethodChart';
import { DashboardStatBar } from '@/components/DashboardStatBar';
import { AddExpenseModal } from '@/components/AddExpenseModal';
import { AddTaskModal } from '@/components/AddTaskModal';
import { AppData, Task, Expense } from '@/types';
import { getAppData, saveAppData, deleteExpense, deleteTask } from '@/lib/storage';
import { getQuickStats } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const appData = await getAppData();
        setData(appData);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">{error || 'Failed to load data'}</p>
        </div>
      </div>
    );
  }

  const stats = getQuickStats(data);

  const handleDeleteExpense = async (expenseId: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(expenseId);
        const updated = await getAppData();
        setData(updated);
      } catch (err) {
        alert('Failed to delete expense');
        console.error(err);
      }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task and all related expenses?')) {
      try {
        await deleteTask(taskId);
        const updated = await getAppData();
        setData(updated);
      } catch (err) {
        alert('Failed to delete task');
        console.error(err);
      }
    }
  };

  const handleRefreshData = async () => {
    try {
      const updated = await getAppData();
      setData(updated);
    } catch (err) {
      alert('Failed to refresh data');
      console.error(err);
    }
  };

  const handleAddExpenseSuccess = () => {
    handleRefreshData();
  };

  const handleAddTaskSuccess = () => {
    handleRefreshData();
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `house-construction-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event: any) => {
        try {
          const imported = JSON.parse(event.target.result);
          await saveAppData(imported);
          setData(imported);
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        projectName={data.project.name}
        onExport={handleExport}
        onImport={handleImport}
      />

      <div className="flex flex-1">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-6 py-8">
            {currentPage === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* KPI Cards */}
                <KPISection
                  totalBudget={stats.totalBudget}
                  totalSpent={stats.totalSpent}
                  remaining={stats.remaining}
                  spentPercentage={stats.spentPercentage}
                />

                {/* Stat Bar */}
                <DashboardStatBar
                  todaySpending={stats.todaySpending}
                  weekSpending={stats.thisWeekSpending}
                  monthSpending={stats.thisMonthSpending}
                  activeTasks={stats.activeTasks}
                />

                {/* Charts Section */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <BudgetVsActualChart tasks={data.tasks} expenses={data.expenses} />
                  <SpendingDistributionChart tasks={data.tasks} expenses={data.expenses} />
                </div>

                {/* Task Progress Section */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Task Progress</h2>
                    <button
                      onClick={() => setShowAddTask(true)}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add Task
                    </button>
                  </div>
                  <TaskProgressSection
                    tasks={data.tasks}
                    expenses={data.expenses}
                    onDelete={handleDeleteTask}
                  />
                </div>

                {/* Expense Timeline Section */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Recent Expenses</h2>
                    <button
                      onClick={() => setShowAddExpense(true)}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add Expense
                    </button>
                  </div>
                  <ExpenseTimeline
                    expenses={data.expenses}
                    tasks={data.tasks}
                    onDelete={handleDeleteExpense}
                  />
                </div>

                {/* Bottom Charts */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <PaymentMethodChart expenses={data.expenses} />
                  <SpendingTrendChart expenses={data.expenses} />
                </div>
              </motion.div>
            )}

            {currentPage === 'add-expense' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="rounded-lg border border-gray-200 bg-white p-8">
                  <p className="text-center text-gray-600">Add Expense functionality coming soon...</p>
                </div>
              </motion.div>
            )}

            {currentPage === 'tasks' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">All Tasks</h2>
                    <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700">
                      <Plus className="h-4 w-4" />
                      New Task
                    </button>
                  </div>
                  <TaskProgressSection
                    tasks={data.tasks}
                    expenses={data.expenses}
                    onDelete={handleDeleteTask}
                  />
                </div>
              </motion.div>
            )}

            {currentPage === 'reports' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="rounded-lg border border-gray-200 bg-white p-8">
                  <p className="text-center text-gray-600">Reports and analytics coming soon...</p>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      <AddExpenseModal
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        tasks={data.tasks}
        onSuccess={handleAddExpenseSuccess}
        expense={editingExpense || undefined}
      />

      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        onSuccess={handleAddTaskSuccess}
        task={editingTask || undefined}
      />
    </div>
  );
}
