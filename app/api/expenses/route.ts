import { NextRequest, NextResponse } from 'next/server';
import { readDataFile, writeDataFile } from '@/lib/db';
import { AppData, Expense } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const expense: Expense = await request.json();
    const data = await readDataFile();

    data.expenses.push(expense);
    await writeDataFile(data);

    return NextResponse.json({ success: true, expense });
  } catch (error) {
    console.error('POST /api/expenses error:', error);
    return NextResponse.json(
      { error: 'Failed to add expense' },
      { status: 500 }
    );
  }
}
