import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app';

describe("POST /auth/register", () => {
    describe("Given all fields", () => {
        it("should return the 201 status code", async () => {
            /* AAA: Arrange the data, Act on the data, Assert the result */

            /* 1. Arrange the data */
            const userData = {
                firstName: "Rakesh",
                lastName: "Kumar",
                email: "rakesh@mern.space",
                password: "secret"
            }

            /* 2. Act on the data */
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            /* 3. Assert the result */
            expect(response.statusCode).toBe(201);
        })

        it("should return valid JSON response", async () => {
            /* 1. Arrange the data */
            const userData = {
                firstName: "Rakesh",
                lastName: "Kumar",
                email: "rakesh@mern.space",
                password: "secret"
            }

            /* 2. Act on the data */
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            /* 3. Assert the result (application/json) */
            expect((response.headers as Record<string, string>)['content-type']).toEqual(
                expect.stringContaining("json")
            );
        })
    });

    describe("Fields are missing", () => {

    });
})