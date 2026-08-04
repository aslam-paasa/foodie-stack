import { describe, expect, it, beforeAll, beforeEach, afterAll,  } from '@jest/globals';
import request from 'supertest';
import { DataSource } from 'typeorm';


import app from '../../src/app';
import { User } from '../../src/entity/User';
import { AppDataSource } from '../../src/config/data-source';
import { truncateTable } from '../utils';
import { Roles } from '../../src/constants/index';


describe("POST /auth/register", () => {
    let connection: DataSource;

    beforeAll(async () => {
        /* Database Connection */
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        /* Database Truncate */
        await connection.dropDatabase();
        await connection.synchronize();
    })

    afterAll(async () => {
        /* Database Connection Close */
        await connection.destroy();
    });


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

        it("should persist the user in the database", async () => {
            /* 1. Arrange the data */
            const userData = {
                firstName: "Rakesh",
                lastName: "Kumar",
                email: "rakesh@mern.space",
                password: "secret"
            }

            /* 2. Act on the data */
            await request(app).post("/auth/register").send(userData);

            /* 3. Assert the result */
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0]?.firstName).toBe(userData.firstName);
            expect(users[0]?.lastName).toBe(userData.lastName);
            expect(users[0]?.email).toBe(userData.email);
        })

        it("should return an id of the created user", async () => {
            /* 1. Arrange the data */
            const userData = {
                firstName: "Rakesh",
                lastName: "Kumar",
                email: "rakesh@mern.space",
                password: "secret"
            }

            /* 2. Act on the data */
            const response = await request(app).post("/auth/register").send(userData);

            /* 3. Assert the result */
            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual({ id: expect.any(Number) });
        });

        it("should assign a customer role", async () => {
            /* 1. Arrange the data */
            const userData = {
                firstName: "Rakesh",
                lastName: "Kumar",
                email: "rakesh@mern.space",
                password: "secret"
            }

            /* 2. Act on the data */
            await request(app).post("/auth/register").send(userData);

            /* 3. Assert the result */
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0]).toHaveProperty("role");
            expect(users[0]?.role).toBe(Roles.CUSTOMER);
        })

        it("should store the hashed password in the database", async () => {
            /* 1. Arrange the data */
            const userData = {
                firstName: "Rakesh",
                lastName: "Kumar",
                email: "rakesh@mern.space",
                password: "secret"
            }

            /* 2. Act on the data */
            await request(app).post("/auth/register").send(userData);

            /* 3. Assert the result */
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            console.log(users[0]?.password);
            expect(users[0]?.password).not.toBe(userData.password);
            expect(users[0]?.password).toHaveLength(60);
            expect(users[0]?.password).toMatch(/^\$2b\$\d+\$/);
        })
    });

    describe("Fields are missing", () => {

    });
})