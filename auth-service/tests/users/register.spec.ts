import { describe, expect, it, beforeAll, beforeEach, afterAll, } from '@jest/globals';
import request from 'supertest';
import { DataSource } from 'typeorm';


import app from '../../src/app';
import { User } from '../../src/entity/User';
import { AppDataSource } from '../../src/config/data-source';
import { Roles } from '../../src/constants/index';
import { isJwt } from '../utils';

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

        it("should return 400 status code if email is already exist", async () => {
            /* 1. Arrange the data */
            const userData = {
                firstName: "Rakesh",
                lastName: "Kumar",
                email: "rakesh@mern.space",
                password: "secret"
            }

            const userRepository = connection.getRepository(User);
            await userRepository.save({ ...userData, role: Roles.CUSTOMER });

            /* 2. Act on the data */
            const response = await request(app).post("/auth/register").send(userData);
            const users = await userRepository.find();

            /* 3. Assert the result */
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
        })

        it("should return the access token and refresh token inside a cookie", async () => {
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
            let accessToken = null;
            let refreshToken = null;
            
            const cookies = (response.headers["set-cookie"] as string[] | undefined) ?? [];

            cookies.forEach((cookie) => {
                if(cookie.startsWith('accessToken=')) {
                    accessToken = cookie.split(';')[0]?.split('=')[1];
                }

                if(cookie.startsWith('refreshToken=')) {
                    refreshToken = cookie.split(';')[0]?.split('=')[1];
                }
            })

            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();
            
            expect(isJwt(accessToken)).toBeTruthy();
            // expect(isJwt(refreshToken)).toBeTruthy();
        })
    });

    describe("Fields are missing", () => {
        it("should return 400 status code if email filled is missing", async () => {
            /* 1. Arrange the data */
            const userData = {
                firstName: "Rakesh",
                lastName: "Kumar",
                email: "",
                password: "secret"
            }

            /* 2. Act on the data */
            const response = await request(app).post("/auth/register").send(userData);

            /* 3. Assert the result */
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(0);
        })

        it.todo("should return 400 status code if first name is missing");
        it.todo("should return 400 status code if last name is missing");
        it.todo("should return 400 status code if password is missing");
    });

    describe("Fields are not in proper format", () => {
        it("should trim the email field", async () => {
            /* 1. Arrange the data */
            const userData = {
                firstName: "Rakesh",
                lastName: "Kumar",
                email: "  rakesh@mern.space  ",
                password: "secret"
            }

            /* 2. Act on the data */
            const response = await request(app).post("/auth/register").send(userData);

            /* 3. Assert the result */
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(1);
            expect(users[0]?.email).toBe("rakesh@mern.space");
        })

        it.todo("should return 400 status code if email is not a valid email");
        it.todo("should return 400 status code if password length is less than 8 chars");
        it.todo("should return an array of error messages if email is missing");
    })
})