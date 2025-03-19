jest.mock("../config/prismaClient", () => require("../__mocks__/prismaClient"));
import request from "supertest";
import app from "../server";
import mockPrisma from "../__mocks__/prismaClient";

describe("Product Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /products", () => {
        test("should return an array of products", async () => {
            mockPrisma.product.findMany.mockResolvedValueOnce([
                { id: 1, name: "Mock Prod 1", price: 100 },
                { id: 2, name: "Mock Prod 2", price: 200 },
            ]);

            const response = await request(app).get("/products");

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body[0].name).toBe("Mock Prod 1");
            expect(mockPrisma.product.findMany).toHaveBeenCalledTimes(1);
        });
    });

    describe("GET /products/:productId", () => {
        test("should return 200 if product is found", async () => {
            mockPrisma.product.findFirst.mockResolvedValueOnce({
                id: 123,
                name: "Single Product",
                price: 999,
            });

            const response = await request(app).get("/products/123");

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(123);
            expect(mockPrisma.product.findFirst).toHaveBeenCalledWith({
                where: { id: 123 },
            });
        });

        test("should return 404 if product is NOT found", async () => {
            mockPrisma.product.findFirst.mockResolvedValueOnce(null);

            const response = await request(app).get("/products/999");

            expect(response.status).toBe(404);
            expect(response.body.message).toMatch(/not found/i);
        });
    });

    describe("POST /products", () => {
        test("should create a product and return 201", async () => {
            mockPrisma.product.create.mockResolvedValueOnce({
                id: 101,
                name: "Newly Created Product",
                categoryId: 3,
                price: 10.99,
                stockCount: 50,
                brand: "Example Brand",
                imageUrl: "example.jpg",
                isAvailable: true,
            });

            const response = await request(app).post("/products").send({
                name: "Newly Created Product",
                categoryId: "3",
                description: "Something",
                price: "10.99",
                stockCount: "50",
                brand: "Example Brand",
                imageUrl: "example.jpg",
                isAvailable: "true",
            });

            expect(response.status).toBe(201);
            expect(response.body.message).toMatch(/created succesfully/i);
            expect(response.body.data.id).toBe(101);
            expect(mockPrisma.product.create).toHaveBeenCalledTimes(1);
        });
    });

    describe("PATCH /products/:productId", () => {
        test("should update a product when valid fields are provided", async () => {
            mockPrisma.product.update.mockResolvedValueOnce({
                id: 999,
                name: "Updated Product Name",
                price: 22.99,
            });

            const response = await request(app).patch("/products/999").send({
                name: "Updated Product Name",
                price: "22.99",
            });

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe("Updated Product Name");
            expect(mockPrisma.product.update).toHaveBeenCalledWith({
                where: { id: 999 },
                data: { name: "Updated Product Name", price: 22.99 },
            });
        });

        test("should return 400 if no valid fields are provided", async () => {
            const response = await request(app).patch("/products/999").send({});
            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/No valid fields provided/i);
            expect(mockPrisma.product.update).not.toHaveBeenCalled();
        });
    });

    describe("DELETE /products/:productId", () => {
        test("should delete a product if found", async () => {
            mockPrisma.product.delete.mockResolvedValueOnce({
                id: 12,
                name: "To be deleted",
            });

            const response = await request(app).delete("/products/12");
            expect(response.status).toBe(200);
            expect(response.body.message).toMatch(/successfully deleted/i);
            expect(mockPrisma.product.delete).toHaveBeenCalledWith({
                where: { id: 12 },
            });
        });

        test("should return 404 if product is not found", async () => {
            mockPrisma.product.delete.mockRejectedValueOnce(
                new Error("Record not found"),
            );

            const response = await request(app).delete("/products/999");
            expect(response.status).toBe(404);
            expect(response.body.message).toMatch(/not found/i);
        });
    });
});
