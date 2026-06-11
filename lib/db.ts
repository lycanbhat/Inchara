import { promises as fs } from 'fs';
import path from 'path';
import { AppData } from '@/types';

const defaultPath = path.join(process.cwd(), 'data', 'data.json');
const tempPath = path.join('/tmp', 'data.json');

let resolvedPath: string | null = null;
let writeLock: Promise<void> = Promise.resolve();

async function queryUpstash<T>(command: any[]): Promise<T | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    });

    if (!response.ok) {
      throw new Error(`Upstash API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.result as T;
  } catch (error) {
    console.error('Error querying Upstash Redis:', error);
    throw error;
  }
}

async function ensureTempFileInitialized() {
  try {
    await fs.access(tempPath);
  } catch {
    try {
      const defaultContent = await fs.readFile(defaultPath, 'utf-8');
      await fs.mkdir(path.dirname(tempPath), { recursive: true });
      await fs.writeFile(tempPath, defaultContent, 'utf-8');
      console.log('Successfully initialized temp data file at:', tempPath);
    } catch (err) {
      console.error('Failed to initialize temp file from default path:', err);
    }
  }
}

async function getWritablePath(): Promise<string> {
  if (resolvedPath) return resolvedPath;

  const isServerless =
    process.env.VERCEL === '1' ||
    process.env.NOW_BUILDER === '1' ||
    !!process.env.AWS_LAMBDA_FUNCTION_NAME;

  if (isServerless) {
    resolvedPath = tempPath;
    await ensureTempFileInitialized();
    return resolvedPath;
  }

  try {
    await fs.mkdir(path.dirname(defaultPath), { recursive: true });
    // Test write accessibility
    const testFile = path.join(path.dirname(defaultPath), '.write-test');
    await fs.writeFile(testFile, 'test');
    await fs.unlink(testFile);
    resolvedPath = defaultPath;
  } catch (error) {
    console.warn('Default data directory is not writable. Falling back to /tmp/data.json. Error:', error);
    resolvedPath = tempPath;
    await ensureTempFileInitialized();
  }

  return resolvedPath;
}

export async function readDataFile(): Promise<AppData> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      const result = await queryUpstash<string>(['GET', 'inchara_data']);
      if (result) {
        return JSON.parse(result);
      }
      console.log('No data found in Upstash Redis, initializing from local template...');
      const defaultContent = await fs.readFile(defaultPath, 'utf-8');
      const data = JSON.parse(defaultContent);
      await queryUpstash(['SET', 'inchara_data', defaultContent]);
      return data;
    } catch (error) {
      console.error('Failed to read from Upstash Redis, falling back to local files...', error);
    }
  }

  try {
    const filePath = await getWritablePath();
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading data file:', error);
    try {
      const content = await fs.readFile(defaultPath, 'utf-8');
      return JSON.parse(content);
    } catch (innerError) {
      console.error('Error reading default data file fallback:', innerError);
      throw new Error('Failed to read data file');
    }
  }
}

export async function writeDataFile(data: AppData): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      await queryUpstash(['SET', 'inchara_data', JSON.stringify(data)]);
      return;
    } catch (error) {
      console.error('Failed to write to Upstash Redis, falling back to local files...', error);
    }
  }

  const currentLock = writeLock;
  let resolveLock: () => void;
  writeLock = new Promise<void>((resolve) => {
    resolveLock = resolve;
  });

  try {
    await currentLock;
    const filePath = await getWritablePath();
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing data file:', error);
    throw new Error('Failed to write data file');
  } finally {
    resolveLock!();
  }
}
