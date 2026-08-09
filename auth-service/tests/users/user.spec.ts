import { describe, it, expect, beforeAll, beforeEach, afterAll, afterEach } from '@jest/globals';
import request from 'supertest';
import createJWKSMock from 'mock-jwks';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import app from '../../src/app';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';

describe('GET /auth/self', () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;

  beforeAll(async () => {
    /* Create Mock Server */
    jwks = createJWKSMock('http://localhost:3000');

    /* Database Connection */
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    /* Start Mock Server */
    jwks.start();

    /* Database Truncate */
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterEach(() => {
    jwks.stop();
  });

  afterAll(async () => {
    /* Database Connection Close */
    await connection.destroy();
  });

  describe('Given all fields', () => {
    it('should return the 200 status code', async () => {
      const accessToken = jwks.token({ sub: String('1'), role: Roles.CUSTOMER });
      const response = await request(app)
      .get('/auth/self')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send();
      expect(response.statusCode).toBe(200);
    });

    it('should return the userdata', async () => {
      /* Register User */
      const userData = {
        firstName: 'Rakesh',
        lastName: 'Kumar',
        email: 'rakesh@mern.space',
        password: 'secret',
      };
      const userRepository = connection.getRepository(User);
      const data = await userRepository.save({ ...userData, role: Roles.CUSTOMER });

      /* Generate Token */
      const accessToken = jwks.token({ sub: String(data.id), role: data.role });

      /* Add token to cookie */
      const response = await request(app)
        .get('/auth/self')
        .set('Cookie', [`accessToken=${accessToken};`])
        .send();

      /* Assert: Check if user id matches with registered user */
      expect((response.body as Record<string, string>).id).toBe(data.id);
    });
  });
});
