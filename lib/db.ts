import { AppData } from '@/types';

const INITIAL_DATA: AppData = {
  project: {
    name: "Inchara Renovation",
    startDate: "2026-06-06",
    endDate: "2026-07-10",
    totalBudget: 500000,
    location: "Kumara Park,  Hubli"
  },
  tasks: [
    {
      id: "task_1781201012898",
      name: "Tile Procurement",
      description: "",
      budgetedAmount: 0,
      createdDate: "2026-06-11T18:03:32.898Z",
      status: "active",
      priority: "medium",
      color: "#10B981"
    },
    {
      id: "task_1781201025798",
      name: "Tile Labour",
      description: "",
      budgetedAmount: 0,
      createdDate: "2026-06-11T18:03:45.798Z",
      status: "active",
      priority: "medium",
      color: "#10B981"
    },
    {
      id: "task_1781201043181",
      name: "Civil Procurement",
      description: "",
      budgetedAmount: 0,
      createdDate: "2026-06-11T18:04:03.181Z",
      status: "active",
      priority: "medium",
      color: "#EF4444"
    },
    {
      id: "task_1781201060531",
      name: "Civil Labour ",
      description: "",
      budgetedAmount: 0,
      createdDate: "2026-06-11T18:04:20.531Z",
      status: "active",
      priority: "medium",
      color: "#EF4444"
    },
    {
      id: "task_1781201103957",
      name: "Plumbing Procurement",
      description: "",
      budgetedAmount: 0,
      createdDate: "2026-06-11T18:05:03.957Z",
      status: "active",
      priority: "medium",
      color: "#3B82F6"
    },
    {
      id: "task_1781201110697",
      name: "Plumbing Labour",
      description: "",
      budgetedAmount: 0,
      createdDate: "2026-06-11T18:05:10.697Z",
      status: "active",
      priority: "medium",
      color: "#3B82F6"
    },
    {
      id: "task_1781201259908",
      name: "Electrical Procurement",
      description: "",
      budgetedAmount: 0,
      createdDate: "2026-06-11T18:07:39.908Z",
      status: "active",
      priority: "medium",
      color: "#F59E0B"
    },
    {
      id: "task_1781201270592",
      name: "Electrical Labour",
      description: "",
      budgetedAmount: 0,
      createdDate: "2026-06-11T18:07:50.592Z",
      status: "active",
      priority: "medium",
      color: "#F59E0B"
    },
    {
      id: "task_1781201315775",
      name: "Carpentry Procurement",
      description: "",
      budgetedAmount: 0,
      createdDate: "2026-06-11T18:08:35.775Z",
      status: "active",
      priority: "medium",
      color: "#EC4899"
    },
    {
      id: "task_1781201361225",
      name: "Carpentry Labour",
      description: "",
      budgetedAmount: 0,
      createdDate: "2026-06-11T18:09:21.225Z",
      status: "active",
      priority: "medium",
      color: "#EC4899"
    },
    {
      id: "task_1781201376125",
      name: "Transportation",
      description: "",
      budgetedAmount: 0,
      createdDate: "2026-06-11T18:09:36.125Z",
      status: "active",
      priority: "medium",
      color: "#6366F1"
    },
    {
      id: "task_1781201394858",
      name: "Scrap",
      description: "",
      budgetedAmount: 0,
      createdDate: "2026-06-11T18:09:54.858Z",
      status: "active",
      priority: "medium",
      color: "#8B5CF6"
    },
    {
      id: "task_1781201422192",
      name: "Tips",
      description: "",
      budgetedAmount: 0,
      createdDate: "2026-06-11T18:10:22.192Z",
      status: "active",
      priority: "medium",
      color: "#06B6D4"
    }
  ],
  expenses: []
};

async function queryUpstash<T>(command: any[]): Promise<T | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error('Missing Upstash Redis environment variables. Please configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.');
  }

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

export async function readDataFile(): Promise<AppData> {
  try {
    const result = await queryUpstash<string>(['GET', 'inchara_data']);
    if (result) {
      return JSON.parse(result);
    }
    console.log('No data found in Upstash Redis, initializing with template...');
    await queryUpstash(['SET', 'inchara_data', JSON.stringify(INITIAL_DATA)]);
    return INITIAL_DATA;
  } catch (error) {
    console.error('Failed to read from Upstash Redis:', error);
    throw new Error('Database read failed');
  }
}

export async function writeDataFile(data: AppData): Promise<void> {
  try {
    await queryUpstash(['SET', 'inchara_data', JSON.stringify(data)]);
  } catch (error) {
    console.error('Failed to write to Upstash Redis:', error);
    throw new Error('Database write failed');
  }
}
