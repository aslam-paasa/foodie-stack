import { calculateDiscount } from './src/utils';
import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from './src/app';

/**
 * skip is used to skip the test suite/case
 */
describe.skip('App', () => {
  /**
   * Unit Testing
   * */
  it('should return the correct discount amount', () => {
    const discount = calculateDiscount(100, 10);
    expect(discount).toBe(10);
  });

  /**
   * API Testing
   * */
  it('should return 200 status code', async () => {
    const response = await request(app).get('/').send();
    expect(response.status).toBe(200);
  });
});
