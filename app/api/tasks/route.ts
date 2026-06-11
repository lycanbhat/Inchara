import { NextRequest, NextResponse } from 'next/server';
import { readDataFile, writeDataFile } from '@/lib/db';
import { AppData, Task } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const task: Task = await request.json();
    const data = await readDataFile();

    data.tasks.push(task);
    await writeDataFile(data);

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error('POST /api/tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to add task' },
      { status: 500 }
    );
  }
}
