import { describe, it, beforeAll, beforeEach, afterAll, } from '@jest/globals';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';

describe('POST /auth/login', () => {
  let connection: DataSource;

  beforeAll(async () => {
    /* Database Connection */
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    /* Database Truncate */
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterAll(async () => {
    /* Database Connection Close */
    await connection.destroy();
  });

  describe("Given all fields", () => {
    it.todo("should login the user");
  })
});
