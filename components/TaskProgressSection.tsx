'use client';

import { Task, Expense } from '@/types';
import { TaskProgressCard } from './TaskProgressCard';

interface TaskProgressSectionProps {
  tasks: Task[];
  expenses: Expense[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskProgressSection({
  tasks,
  expenses,
  onEdit,
  onDelete
}: TaskProgressSectionProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-600">No tasks created yet. Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {tasks.map((task, index) => (
        <TaskProgressCard
          key={task.id}
          task={task}
          expenses={expenses}
          onEdit={onEdit}
          onDelete={onDelete}
          index={index}
        />
      ))}
    </div>
  );
}
