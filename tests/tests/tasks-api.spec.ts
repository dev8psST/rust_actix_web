// // tasks-api.spec.ts
// //import { test, } from '../fixtures/db-fixtures';
// //import { TasksApi, Task } from '../api/tasks-api';
// import { test, expect } from '@playwright/test';

// // Describe the test suite for Tasks API
// test.describe('Tasks API', () => {
//   let tasksApi: TasksApi;

//   // Set up the TasksApi instance before each test
//   test.beforeEach(({ request, baseURL }) => {
//     tasksApi = new TasksApi(request, baseURL!);
//   });

//   // Test: Create a new task
//   test('should create a new task', async ({ db }) => {
//     // Define a new task
//     const newTask: Omit<Task, 'id'> = { title: 'Test Task', completed: false };

//     // Send POST request
//     const response = await tasksApi.createTask(newTask);

//     // Verify response
//     expect(response.status).toBe(201);
//     expect(response.body).toEqual({ message: 'Task created' });

//     // Verify task exists in database
//     const tasks = await db.fetchAll('SELECT * FROM tasks');
//     expect(tasks).toHaveLength(2); // Initial task + new task
//     expect(tasks.some((task) => task.title === 'Test Task')).toBe(true);
//   });

//   // Test: Retrieve all tasks
//   test('should retrieve all tasks', async ({ db }) => {
//     // Send GET request
//     const response = await tasksApi.getTasks();

//     // Verify response
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual([
//       expect.objectContaining({ title: 'Initial Task', completed: false }),
//     ]);

//     // Verify database state
//     const tasks = await db.fetchAll('SELECT * FROM tasks');
//     expect(tasks).toHaveLength(1);
//   });

//   // Test: Update a task
//   test('should update a task', async ({ db }) => {
//     // Get initial task ID
//     const tasks = await db.fetchAll('SELECT * FROM tasks');
//     const taskId = tasks[0].id;

//     // Define updated task
//     const updatedTask: Omit<Task, 'id'> = { title: 'Updated Task', completed: true };

//     // Send PUT request
//     const response = await tasksApi.updateTask(taskId, updatedTask);

//     // Verify response
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual({ message: 'Task updated' });

//     // Verify database state
//     const updatedTasks = await db.fetchAll('SELECT * FROM tasks WHERE id = ?', [taskId]);
//     expect(updatedTasks[0]).toMatchObject({ title: 'Updated Task', completed: 1 });
//   });

//   // Test: Delete a task
//   test('should delete a task', async ({ db }) => {
//     // Get initial task ID
//     const tasks = await db.fetchAll('SELECT * FROM tasks');
//     const taskId = tasks[0].id;

//     // Send DELETE request
//     const response = await tasksApi.deleteTask(taskId);

//     // Verify response
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual({ message: 'Task deleted' });

//     // Verify database state
//     const remainingTasks = await db.fetchAll('SELECT * FROM tasks');
//     expect(remainingTasks).toHaveLength(0);
//   });

//   // Test: Handle non-existent task deletion
//   test('should return error for deleting non-existent task', async ({}) => {
//     // Send DELETE request for non-existent task
//     const response = await tasksApi.deleteTask(999);

//     // Verify response
//     expect(response.status).toBe(500); // Actix returns 500 for SQL errors
//     expect(response.body).toMatchObject({ error: expect.stringContaining('Error') });
//   });
// });

import { test, expect } from '@playwright/test';



// Request context is reused by all tests in the file.
let apiContext;

test.beforeAll(async ({ playwright }) => {
  apiContext = await playwright.request.newContext({
    // All requests we send go to this API endpoint.
    baseURL: 'http://127.0.0.1:8087',

  });
});

test.afterAll(async ({ }) => {
  // Dispose all responses.
  await apiContext.dispose();
});

test('last created issue should be first in the list', async ({ page }) => {
  const newIssue = await apiContext.post(`/tasks`, {
    data: {
      title: 'buy coffee 45',
      completed: false
    }
  });
  expect(newIssue.ok()).toBeTruthy();
  
  const responseBody = JSON.parse(await newIssue.text());
  expect(responseBody).toBe('Task created');
  expect(newIssue.status()).toBe(201);

});