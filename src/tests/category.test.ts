jest.mock("../config/prismaClient", () => require("../__mocks__/prismaClient"));
import request from "supertest";
import app from "../server";
import mockPrisma from "../__mocks__/prismaClient";

describe("Category Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /categories", () => {
        test("should return a list of categories", async () => {
            mockPrisma.category.findMany.mockResolvedValueOnce([
                { id: 1, name: "Cat A", description: "Desc A" },
                { id: 2, name: "Cat B", description: "Desc B" },
            ]);

            const response = await request(app).get("/categories");

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body[0].name).toBe("Cat A");
            expect(mockPrisma.category.findMany).toHaveBeenCalledTimes(1);
        });
    });

    describe("GET /categories/:categoryId", () => {
        test("should return 200 if found", async () => {
            mockPrisma.category.findFirst.mockResolvedValueOnce({
                id: 5,
                name: "Some Category",
            });

            const response = await request(app).get("/categories/5");
            expect(response.status).toBe(200);
            expect(response.body.id).toBe(5);
        });

        test("should return 404 if not found", async () => {
            mockPrisma.category.findFirst.mockResolvedValueOnce(null);

            const response = await request(app).get("/categories/999");
            expect(response.status).toBe(404);
            expect(response.body.message).toMatch(/not found/i);
        });
    });

    describe("POST /categories", () => {
        test("should create a category", async () => {
            mockPrisma.category.create.mockResolvedValueOnce({
                id: 10,
                name: "New Category",
                description: "Cat desc",
            });

            const response = await request(app).post("/categories").send({
                name: "New Category",
                description: "Cat desc",
            });

            expect(response.status).toBe(201);
            expect(response.body.data.id).toBe(10);
            expect(mockPrisma.category.create).toHaveBeenCalledTimes(1);
        });
    });

    describe("PATCH /categories/:categoryId", () => {
        test("should update partial category fields", async () => {
            mockPrisma.category.update.mockResolvedValueOnce({
                id: 3,
                name: "Updated Name",
                description: "Original desc",
            });

            const response = await request(app).patch("/categories/3").send({
                name: "Updated Name",
            });

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe("Updated Name");
            expect(mockPrisma.category.update).toHaveBeenCalledWith({
                where: { id: 3 },
                data: { name: "Updated Name" },
            });
        });
    });

    describe("DELETE /categories/:categoryId", () => {
        test("should delete category if exists", async () => {
            mockPrisma.category.delete.mockResolvedValueOnce({
                id: 9,
                name: "To be deleted",
            });

            const response = await request(app).delete("/categories/9");
            expect(response.status).toBe(200);
            expect(response.body.message).toMatch(/successfully deleted/i);
            expect(mockPrisma.category.delete).toHaveBeenCalledTimes(1);
        });

        test("should return 404 if category not found", async () => {
            mockPrisma.category.delete.mockRejectedValueOnce(
                new Error("Record not found"),
            );

            const response = await request(app).delete("/categories/999");
            expect(response.status).toBe(404);
            expect(response.body.message).toMatch(/not found/i);
        });
    });
});
