

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