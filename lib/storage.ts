import { AppData, Project, Task, Expense } from '@/types';

const API_BASE_URL = '/api';

async function fetchWithErrorHandling(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function getAppData(): Promise<AppData> {
  try {
    return await fetchWithErrorHandling(`${API_BASE_URL}/data`);
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Failed to fetch data');
  }
}

export async function saveAppData(data: AppData): Promise<void> {
  try {
    await fetchWithErrorHandling(`${API_BASE_URL}/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error('Error saving data:', error);
    throw new Error('Failed to save data');
  }
}

export async function addExpense(expense: Expense): Promise<Expense> {
  try {
    const response = await fetchWithErrorHandling(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });
    return response.expense;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw new Error('Failed to add expense');
  }
}

export async function updateExpense(id: string, expense: Partial<Expense>): Promise<Expense> {
  try {
    const response = await fetchWithErrorHandling(`${API_BASE_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });
    return response.expense;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw new Error('Failed to update expense');
  }
}

export async function deleteExpense(id: string): Promise<void> {
  try {
    await fetchWithErrorHandling(`${API_BASE_URL}/expenses/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw new Error('Failed to delete expense');
  }
}

export async function addTask(task: Task): Promise<Task> {
  try {
    const response = await fetchWithErrorHandling(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    return response.task;
  } catch (error) {
    console.error('Error adding task:', error);
    throw new Error('Failed to add task');
  }
}

export async function updateTask(id: string, task: Partial<Task>): Promise<Task> {
  try {
    const response = await fetchWithErrorHandling(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    return response.task;
  } catch (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    await fetchWithErrorHandling(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  }
}

export async function updateProject(project: Partial<Project>): Promise<void> {
  try {
    const data = await getAppData();
    data.project = { ...data.project, ...project };
    await saveAppData(data);
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
}

export async function resetToDefault(): Promise<void> {
  // This would reset to the default data from data.json
  // In a real scenario, you might want to reload from a backup
  console.log('Reset to default not implemented');
}
