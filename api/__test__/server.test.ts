import request from "supertest";
import app from "../src/app";
import { describe, it, expect, jest, afterAll } from "@jest/globals";
import * as db from "../src/db";

// Mock the db module
jest.mock("../src/db");
const mockDb = db as jest.Mocked<typeof db>;

describe("Todo API", () => {
    // mock the return of pool connect with a resolved promise
    (mockDb.pool.connect as any).mockResolvedValueOnce(
        Promise.resolve({
            query: mockDb.query as any,
            release: jest.fn() as any,
        })
    );

    afterAll(() => {
        // close the pool
        mockDb.pool.end();
        // clear all mocks to avoid memory leaks
        jest.clearAllMocks();
    });

    describe("GET /", () => {
        it("should return a welcome message", async () => {
            const response = await request(app).get("/");
            expect(response.statusCode).toBe(200);
            expect(response.text).toBe("Welcome to the Todo List API!");
        });
    });

    describe("GET /todos", () => {
        it("should return all todos", async () => {
            mockDb.query.mockResolvedValueOnce({
                command: "",
                rowCount: 1,
                oid: 0,
                fields: [],
                rows: [{ id: 1, name: "Test todo" }],
            });
            const response = await request(app).get("/todos");
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            // Add more assertions based on the expected structure and content of the todos
        });

        it("should return 204 for no todos", async () => {
            mockDb.query.mockResolvedValueOnce({
                command: "",
                rowCount: 0,
                oid: 0,
                fields: [],
                rows: [],
            });
            const id = 9999;
            const response = await request(app).get(`/todos`);
            expect(response.statusCode).toBe(204);
        });

        it("should return 500 for error", async () => {
            mockDb.query.mockRejectedValue(new Error("Database error"));
            const response = await request(app).get(`/todos`);
            expect(response.statusCode).toBe(500);
        });
    });

    describe("GET /todos/:id", () => {
        it("should return a single todo", async () => {
            mockDb.query.mockResolvedValueOnce({
                command: "",
                rowCount: 1,
                oid: 0,
                fields: [],
                rows: [{ id: 1, name: "Test todo" }],
            });
            const id = 1;
            const response = await request(app).get(`/todos/${id}`);
            expect(response.statusCode).toBe(200);
            // Add assertions based on the expected structure and content of the todo
        });

        it("should return 404 for non-existent todo", async () => {
            mockDb.query.mockResolvedValueOnce({
                command: "",
                rowCount: 0,
                oid: 0,
                fields: [],
                rows: [],
            });
            const id = 9999;
            const response = await request(app).get(`/todos/${id}`);
            expect(response.statusCode).toBe(404);
        });

        it("should return 500 for error", async () => {
            const id = 1;
            mockDb.query.mockRejectedValue(new Error("Database error"));
            const response = await request(app).get(`/todos/${id}`);
            expect(response.statusCode).toBe(500);
        });
    });

    describe("POST /todos", () => {
        it("should create a new todo", async () => {
            const newTodo = { name: "Test todo" };
            mockDb.query.mockResolvedValueOnce({
                command: "",
                rowCount: 1,
                oid: 0,
                fields: [],
                rows: [{ id: 1, name: "Test todo" }],
            });

            const response = await request(app).post("/todos").send(newTodo);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("id");
            expect(response.body.name).toBe(newTodo.name);
        });

        it("should return 400 for missing name", async () => {
            const newTodo = {};
            mockDb.query.mockResolvedValueOnce({
                command: "",
                rowCount: 0,
                oid: 0,
                fields: [],
                rows: [],
            });
            const response = await request(app).post(`/todos`).send(newTodo);
            expect(response.statusCode).toBe(400);
        });

        it("should return 500 for error", async () => {
            const id = 1;
            mockDb.query.mockRejectedValue(new Error("Database error"));
            const response = await request(app).post(`/todos`);
            expect(response.statusCode).toBe(500);
        });
    });

    describe("PUT /todos/:id", () => {
        it("should update an existing todo", async () => {
            const id = 1;
            const updatedTodo = { name: "Updated todo" };
            mockDb.query.mockResolvedValueOnce({
                command: "",
                rowCount: 1,
                oid: 0,
                fields: [],
                rows: [{ id: 1, name: "Updated todo" }],
            });
            const response = await request(app)
                .put(`/todos/${id}`)
                .send(updatedTodo);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("message", "Updated");
        });

        it("should return 400 for non-existent todo", async () => {
            const id = 9999;
            const updatedTodo = { name: "Updated todo" };
            mockDb.query.mockResolvedValueOnce({
                command: "",
                rowCount: 0,
                oid: 0,
                fields: [],
                rows: [],
            });
            const response = await request(app)
                .put(`/todos/${id}`)
                .send(updatedTodo);
            expect(response.statusCode).toBe(400);
        });

        it("should return 500 for error", async () => {
            const id = 1;
            mockDb.query.mockRejectedValueOnce(new Error("Database error"));
            const response = await request(app).put(`/todos/${id}`);
            expect(response.statusCode).toBe(500);
        });
    });

    describe("DELETE /todos/:id", () => {
        it("should delete an existing todo", async () => {
            const id = 1;
            mockDb.query.mockResolvedValueOnce({
                command: "",
                rowCount: 1,
                oid: 0,
                fields: [],
                rows: [{ id: 1, name: "Test todo" }],
            });
            const response = await request(app).delete(`/todos/${id}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("message", "Deleted");
        });

        it("should return 400 for non-existent todo", async () => {
            const id = 9999;
            mockDb.query.mockResolvedValueOnce({
                command: "",
                rowCount: 0,
                oid: 0,
                fields: [],
                rows: [],
            });
            const response = await request(app).delete(`/todos/${id}`);
            expect(response.statusCode).toBe(400);
        });

        it("should return 500 for error", async () => {
            const id = 1;
            mockDb.query.mockRejectedValueOnce(new Error("Database error"));
            const response = await request(app).delete(`/todos/${id}`);
            expect(response.statusCode).toBe(500);
        });
    });
});
