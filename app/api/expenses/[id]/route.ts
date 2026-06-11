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
    console.error(`PUT /api/expenses/${(await params).id} error:`, error);
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
    console.error(`DELETE /api/expenses/${(await params).id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500 }
    );
  }
}
