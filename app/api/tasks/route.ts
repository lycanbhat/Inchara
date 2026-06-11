import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { AppData, Task } from '@/types';

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

export async function POST(request: NextRequest) {
  try {
    const task: Task = await request.json();
    const data = await readDataFile();

    data.tasks.push(task);
    await writeDataFile(data);

    return NextResponse.json({ success: true, task });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add task' },
      { status: 500 }
    );
  }
}
