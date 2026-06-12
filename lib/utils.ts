import { AppData, Task, Expense } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  });
}

export function formatToCustomDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const cleanDateStr = dateStr.split('T')[0];
  const parts = cleanDateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  
  if (isNaN(date.getTime())) return dateStr;

  const formatter = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });
  
  const formattedParts = formatter.formatToParts(date);
  const dayVal = formattedParts.find(p => p.type === 'day')?.value || day;
  const monthVal = formattedParts.find(p => p.type === 'month')?.value || '';
  const yearVal = formattedParts.find(p => p.type === 'year')?.value || year;
  
  return `${dayVal}-${monthVal}-${yearVal}`;
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata'
  });
}

export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(dateString);
}

export function getTotalBudget(tasks: Task[]): number {
  return tasks.reduce((sum, task) => sum + task.budgetedAmount, 0);
}

export function getTotalSpent(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

export function getTaskSpent(taskId: string, expenses: Expense[]): number {
  return expenses
    .filter(e => e.taskId === taskId && e.status === 'completed')
    .reduce((sum, e) => sum + e.amount, 0);
}

export function getTaskProgress(task: Task, expenses: Expense[]): number {
  const spent = getTaskSpent(task.id, expenses);
  if (task.budgetedAmount === 0) return 0;
  return Math.min((spent / task.budgetedAmount) * 100, 100);
}

export function getTaskStatus(task: Task, expenses: Expense[]): 'on-budget' | 'warning' | 'over-budget' {
  const spent = getTaskSpent(task.id, expenses);
  const percentage = (spent / task.budgetedAmount) * 100;

  if (percentage > 100) return 'over-budget';
  if (percentage > 80) return 'warning';
  return 'on-budget';
}

export function getExpensesByDate(expenses: Expense[]): Record<string, Expense[]> {
  const grouped: Record<string, Expense[]> = {};

  expenses.forEach(expense => {
    const date = formatDate(expense.date);
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(expense);
  });

  return grouped;
}

export function getLastNDays(days: number): string[] {
  const result = [];
  const formatter = new Intl.DateTimeFormat('fr-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    result.push(formatter.format(date));
  }
  return result;
}

export function getSpendingByRange(
  expenses: Expense[],
  startDate: string
): Array<{ date: string; amount: number }> {
  const formatter = new Intl.DateTimeFormat('fr-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  const startStr = startDate;
  const nowStr = formatter.format(new Date());
  
  // Use UTC times to execute exact day difference calculation consistently
  const start = new Date(startStr + 'T00:00:00Z');
  const now = new Date(nowStr + 'T00:00:00Z');

  const dayDiff = Math.ceil((now.getTime() - start.getTime()) / 86400000);
  const useWeekly = dayDiff > 60;

  const result: Array<{ date: string; amount: number }> = [];
  const cursor = new Date(start);

  while (cursor <= now) {
    const periodStart = new Date(cursor);
    const periodEnd = new Date(cursor);
    if (useWeekly) {
      periodEnd.setDate(periodEnd.getDate() + 6);
    }
    
    const periodStartStr = formatter.format(periodStart);
    const periodEndStr = formatter.format(periodEnd);
    const limitEndStr = nowStr;

    const total = expenses
      .filter(e => {
        const eDateStr = e.date.split('T')[0];
        return eDateStr >= periodStartStr && eDateStr <= (periodEndStr > limitEndStr ? limitEndStr : periodEndStr);
      })
      .reduce((sum, e) => sum + e.amount, 0);

    result.push({
      date: periodStart.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        timeZone: 'UTC'
      }),
      amount: total,
    });

    cursor.setDate(cursor.getDate() + (useWeekly ? 7 : 1));
  }

  return result;
}

export function getDailySpending(expenses: Expense[], days: number = 30): Array<{ date: string; amount: number }> {
  const dateRange = getLastNDays(days);
  const dailyMap = new Map<string, number>();

  expenses.forEach(expense => {
    const dateStr = expense.date.split('T')[0];
    if (dateRange.includes(dateStr)) {
      dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + expense.amount);
    }
  });

  return dateRange.map(date => ({
    date: formatDate(date),
    amount: dailyMap.get(date) || 0
  }));
}

export function getPaymentMethodBreakdown(expenses: Expense[]): Array<{ name: string; value: number }> {
  const breakdown = {
    'Cash': 0,
    'UPI': 0,
    'Card': 0,
    'Check': 0
  };

  expenses.forEach(expense => {
    if (expense.paymentMethod === 'cash') breakdown['Cash'] += expense.amount;
    else if (expense.paymentMethod === 'upi') breakdown['UPI'] += expense.amount;
    else if (expense.paymentMethod === 'card') breakdown['Card'] += expense.amount;
    else if (expense.paymentMethod === 'check') breakdown['Check'] += expense.amount;
  });

  return Object.entries(breakdown)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));
}

export function getSpendingByTask(tasks: Task[], expenses: Expense[]): Array<{ name: string; budgeted: number; spent: number }> {
  return tasks.map(task => ({
    name: task.name,
    budgeted: task.budgetedAmount,
    spent: getTaskSpent(task.id, expenses)
  }));
}

export function getTaskDistribution(tasks: Task[], expenses: Expense[]): Array<{ name: string; value: number; color: string }> {
  return tasks
    .map(task => ({
      name: task.name,
      value: getTaskSpent(task.id, expenses),
      color: task.color
    }))
    .filter(item => item.value > 0);
}

export function getDayInfo(date: string): string {
  const formatter = new Intl.DateTimeFormat('fr-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const today = formatter.format(new Date());
  
  const yesterdayDate = new Date(Date.now() - 86400000);
  const yesterday = formatter.format(yesterdayDate);

  const dateStr = date.split('T')[0];

  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';

  const expenseDate = new Date(dateStr + 'T12:00:00+05:30');
  const now = new Date();
  const daysAgo = Math.floor((now.getTime() - expenseDate.getTime()) / 86400000);

  if (daysAgo < 7) return 'This Week';
  if (daysAgo < 30) return 'This Month';
  return formatDate(date);
}

export function groupExpensesByDay(expenses: Expense[]): Record<string, Expense[]> {
  const grouped: Record<string, Expense[]> = {};

  [...expenses].reverse().forEach(expense => {
    const dayLabel = getDayInfo(expense.date);
    if (!grouped[dayLabel]) {
      grouped[dayLabel] = [];
    }
    grouped[dayLabel].push(expense);
  });

  return grouped;
}

export function getQuickStats(data: AppData) {
  const totalBudget = data.project.totalBudget;
  const totalSpent = getTotalSpent(data.expenses);
  const remaining = totalBudget - totalSpent;
  const spentPercentage = Math.round((totalSpent / totalBudget) * 100) || 0;

  const todayDate = new Date();
  const weekAgo = new Date(todayDate.getTime() - 7 * 86400000);
  const monthAgo = new Date(todayDate.getTime() - 30 * 86400000);

  const formatter = new Intl.DateTimeFormat('fr-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const today = formatter.format(todayDate);
  const thisWeekStart = formatter.format(weekAgo);
  const thisMonthStart = formatter.format(monthAgo);

  const todaySpending = data.expenses
    .filter(e => e.date.split('T')[0] === today)
    .reduce((sum, e) => sum + e.amount, 0);

  const thisWeekSpending = data.expenses
    .filter(e => e.date.split('T')[0] >= thisWeekStart)
    .reduce((sum, e) => sum + e.amount, 0);

  const thisMonthSpending = data.expenses
    .filter(e => e.date.split('T')[0] >= thisMonthStart)
    .reduce((sum, e) => sum + e.amount, 0);

  const completedTasks = data.tasks.filter(t => t.status === 'completed').length;
  const activeTasks = data.tasks.filter(t => t.status === 'active').length;

  const upiSpending = data.expenses
    .filter(e => e.paymentMethod === 'upi')
    .reduce((sum, e) => sum + e.amount, 0);

  const cashSpending = data.expenses
    .filter(e => e.paymentMethod === 'cash')
    .reduce((sum, e) => sum + e.amount, 0);

  let maxSpent = 0;
  let mostExpensiveCategory = 'None';

  data.tasks.forEach(task => {
    const spent = getTaskSpent(task.id, data.expenses);
    if (spent > maxSpent) {
      maxSpent = spent;
      mostExpensiveCategory = task.name;
    }
  });

  return {
    totalBudget,
    totalSpent,
    remaining,
    spentPercentage,
    todaySpending,
    thisWeekSpending,
    thisMonthSpending,
    completedTasks,
    activeTasks,
    totalExpenses: data.expenses.length,
    averageDailySpending: Math.round(thisMonthSpending / 30),
    upiSpending,
    cashSpending,
    mostExpensiveCategory,
    mostExpensiveCategorySpent: maxSpent
  };
}
