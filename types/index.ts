export interface Project {
  name: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  location: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  budgetedAmount: number;
  createdDate: string;
  status: 'active' | 'completed' | 'paused';
  priority: 'low' | 'medium' | 'high';
  color: string;
}

export interface Expense {
  id: string;
  taskId: string;
  amount: number;
  paymentMethod: 'cash' | 'upi' | 'card' | 'check';
  date: string;
  description: string;
  receipt?: string;
  status: 'completed' | 'pending';
}

export interface AppData {
  project: Project;
  tasks: Task[];
  expenses: Expense[];
}
