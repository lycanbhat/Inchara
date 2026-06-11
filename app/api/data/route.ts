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

export async function GET() {
  try {
    const data = await readDataFile();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
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
    return NextResponse.json(
      { error: 'Failed to save data' },
      { status: 500 }
    );
  }
}
