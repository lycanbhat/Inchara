import { NextRequest, NextResponse } from 'next/server';
import { readDataFile, writeDataFile } from '@/lib/db';
import { AppData } from '@/types';

export async function GET() {
  try {
    const data = await readDataFile();
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/data error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch data', 
        message: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: AppData = await request.json();
    await writeDataFile(data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('POST /api/data error:', error);
    return NextResponse.json(
      { error: 'Failed to save data' },
      { status: 500 }
    );
  }
}
