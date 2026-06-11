import { NextRequest, NextResponse } from 'next/server';
import { readDataFile, writeDataFile } from '@/lib/db';
import { AppData } from '@/types';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();
    const data = await readDataFile();

    const index = data.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    data.tasks[index] = { ...data.tasks[index], ...updates };
    await writeDataFile(data);

    return NextResponse.json({ success: true, task: data.tasks[index] });
  } catch (error) {
    console.error(`PUT /api/tasks/${(await params).id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await readDataFile();

    const index = data.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const deletedTask = data.tasks.splice(index, 1)[0];
    data.expenses = data.expenses.filter(e => e.taskId !== id);
    await writeDataFile(data);

    return NextResponse.json({ success: true, task: deletedTask });
  } catch (error) {
    console.error(`DELETE /api/tasks/${(await params).id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
