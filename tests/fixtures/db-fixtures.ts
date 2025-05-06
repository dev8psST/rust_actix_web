// db-fixtures.ts
import { test as base, APIRequestContext } from '@playwright/test';
import { SqlitePool, connect } from 'sqlx';

// Extend Playwright's test object with a database fixture
export const test = base.extend<{
  db: SqlitePool;
}>({
  db: async ({}, use) => {
    // Connect to the SQLite database (same as Rust backend)
    const pool = await connect('sqlite:database.db');

    // Clean the database before the test
    await pool.execute('DELETE FROM tasks');

    // Insert initial test data (optional)
    await pool.execute(
      "INSERT INTO tasks (title, completed) VALUES ('Initial Task', FALSE)"
    );

    // Provide the database connection to the test
    await use(pool);

    // Clean up after the test
    await pool.execute('DELETE FROM tasks');
    await pool.close();
  },
});