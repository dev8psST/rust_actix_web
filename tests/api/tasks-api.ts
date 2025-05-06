// tasks-api.ts
import { APIRequestContext } from '@playwright/test';

// Interface for Task (matches Rust backend)
export interface Task {
  id?: number;
  title: string;
  completed: boolean;
}

// Page Object Model for Tasks API
export class TasksApi {
  readonly request: APIRequestContext;
  readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  // POST: Create a new task
  async createTask(task: Omit<Task, 'id'>) {
    const response = await this.request.post(`${this.baseUrl}/tasks`, {
      data: task,
    });
    return { status: response.status(), body: await response.json() };
  }

  // GET: Retrieve all tasks
  async getTasks() {
    const response = await this.request.get(`${this.baseUrl}/tasks`);
    return { status: response.status(), body: await response.json() };
  }

  // PUT: Update a task by ID
  async updateTask(id: number, task: Omit<Task, 'id'>) {
    const response = await this.request.put(`${this.baseUrl}/tasks/${id}`, {
      data: task,
    });
    return { status: response.status(), body: await response.json() };
  }

  // DELETE: Delete a task by ID
  async deleteTask(id: number) {
    const response = await this.request.delete(`${this.baseUrl}/tasks/${id}`);
    return { status: response.status(), body: await response.json() };
  }
}