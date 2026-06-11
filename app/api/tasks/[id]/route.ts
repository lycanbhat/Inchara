import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { AppData } from '@/types';

const dataFilePath = path.join(process.cwd(), 'data', 'data.json');

async function readDataFile(): Promise<AppData> {
  try {
    const content = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading data file:', error);
    throw new Error('Failed to read data file');
  }
}

async function writeDataFile(data: AppData): Promise<void> {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing data file:', error);
    throw new Error('Failed to write data file');
  }
}

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
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
