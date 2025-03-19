jest.mock("../config/prismaClient", () => require("../__mocks__/prismaClient"));
import request from "supertest";
import app from "../server";
import mockPrisma from "../__mocks__/prismaClient";

describe("User Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /users", () => {
        test("should return list of users", async () => {
            mockPrisma.user.findMany.mockResolvedValueOnce([
                { id: 1, username: "john", email: "john@example.com" },
                { id: 2, username: "jane", email: "jane@example.com" },
            ]);

            const response = await request(app).get("/users");
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
        });
    });

    describe("GET /users/:userId", () => {
        test("should return user if found", async () => {
            mockPrisma.user.findUnique.mockResolvedValueOnce({
                id: 123,
                username: "johnny",
                email: "johnny@example.com",
            });

            const response = await request(app).get("/users/123");
            expect(response.status).toBe(200);
            expect(response.body.username).toBe("johnny");
        });

        test("should return 404 if not found", async () => {
            mockPrisma.user.findUnique.mockResolvedValueOnce(null);

            const response = await request(app).get("/users/999");
            expect(response.status).toBe(404);
            expect(response.body.message).toMatch(/not found/i);
        });
    });

    describe("POST /users", () => {
        test("should create user", async () => {
            mockPrisma.user.create.mockResolvedValueOnce({
                id: 10,
                username: "newuser",
                email: "new@example.com",
                passwordHash: "hashedpassword",
                firstName: "New",
                lastName: "User",
            });

            const response = await request(app).post("/users").send({
                username: "newuser",
                email: "new@example.com",
                passwordHash: "hashedpassword",
                firstName: "New",
                lastName: "User",
            });

            expect(response.status).toBe(201);
            expect(response.body.data.id).toBe(10);
        });
    });

    describe("PATCH /users/:userId", () => {
        test("should update user partially", async () => {
            mockPrisma.user.update.mockResolvedValueOnce({
                id: 5,
                username: "updatedUser",
                email: "updated@example.com",
                passwordHash: "pass",
                firstName: "Up",
                lastName: "Dated",
            });

            const response = await request(app).patch("/users/5").send({
                username: "updatedUser",
                email: "updated@example.com",
            });

            expect(response.status).toBe(200);
            expect(response.body.data.username).toBe("updatedUser");
        });
    });

    describe("DELETE /users/:userId", () => {
        test("should delete user if found", async () => {
            mockPrisma.user.delete.mockResolvedValueOnce({
                id: 11,
                username: "deleteMe",
                email: "deleteMe@example.com",
            });

            const response = await request(app).delete("/users/11");
            expect(response.status).toBe(200);
            expect(response.body.message).toMatch(/successfully deleted/i);
        });

        test("should 404 if user not found", async () => {
            mockPrisma.user.delete.mockRejectedValueOnce(
                new Error("Not found"),
            );

            const response = await request(app).delete("/users/9999");
            expect(response.status).toBe(404);
        });
    });
});
