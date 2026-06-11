import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { AppData, Expense } from '@/types';

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
    const expense: Expense = await request.json();
    const data = await readDataFile();

    data.expenses.push(expense);
    await writeDataFile(data);

    return NextResponse.json({ success: true, expense });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add expense' },
      { status: 500 }
    );
  }
}
