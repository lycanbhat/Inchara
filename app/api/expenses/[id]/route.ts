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

    const index = data.expenses.findIndex(e => e.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }

    data.expenses[index] = { ...data.expenses[index], ...updates };
    await writeDataFile(data);

    return NextResponse.json({ success: true, expense: data.expenses[index] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update expense' },
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

    const index = data.expenses.findIndex(e => e.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }

    const deletedExpense = data.expenses.splice(index, 1)[0];
    await writeDataFile(data);

    return NextResponse.json({ success: true, expense: deletedExpense });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500 }
    );
  }
}
