jest.mock("../config/prismaClient", () => require("../__mocks__/prismaClient"));
import request from "supertest";
import app from "../server";
import mockPrisma from "../__mocks__/prismaClient";

describe("Review Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /reviews", () => {
        test("should list reviews", async () => {
            mockPrisma.review.findMany.mockResolvedValueOnce([
                {
                    id: 1,
                    productId: 100,
                    userId: 10,
                    rating: 5,
                    comment: "Great!",
                },
                {
                    id: 2,
                    productId: 101,
                    userId: 11,
                    rating: 4,
                    comment: "Good",
                },
            ]);

            const response = await request(app).get("/reviews");
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
        });
    });

    describe("GET /reviews/:reviewId", () => {
        test("should return 200 if review found", async () => {
            mockPrisma.review.findUnique.mockResolvedValueOnce({
                id: 5,
                productId: 100,
                userId: 10,
                rating: 3,
                comment: "Average",
            });

            const response = await request(app).get("/reviews/5");
            expect(response.status).toBe(200);
            expect(response.body.id).toBe(5);
        });

        test("should return 404 if review not found", async () => {
            mockPrisma.review.findUnique.mockResolvedValueOnce(null);

            const response = await request(app).get("/reviews/999");
            expect(response.status).toBe(404);
        });
    });

    describe("POST /reviews", () => {
        test("should create review", async () => {
            mockPrisma.review.create.mockResolvedValueOnce({
                id: 10,
                productId: 100,
                userId: 1,
                rating: 5,
                comment: "Excellent",
            });

            const response = await request(app).post("/reviews").send({
                productId: "100",
                userId: "1",
                rating: "5",
                comment: "Excellent",
            });

            expect(response.status).toBe(201);
            expect(response.body.data.id).toBe(10);
        });
    });

    describe("PATCH /reviews/:reviewId", () => {
        test("should update review partially", async () => {
            mockPrisma.review.update.mockResolvedValueOnce({
                id: 10,
                productId: 100,
                userId: 1,
                rating: 2,
                comment: "Updated Comment",
            });

            const response = await request(app).patch("/reviews/10").send({
                comment: "Updated Comment",
                rating: 2,
            });

            expect(response.status).toBe(200);
            expect(response.body.data.comment).toBe("Updated Comment");
        });
    });

    describe("DELETE /reviews/:reviewId", () => {
        test("should delete if found", async () => {
            mockPrisma.review.delete.mockResolvedValueOnce({
                id: 99,
                productId: 500,
                userId: 10,
                rating: 5,
                comment: "To delete",
            });

            const response = await request(app).delete("/reviews/99");
            expect(response.status).toBe(200);
            expect(response.body.message).toMatch(/successfully deleted/i);
        });

        test("should 404 if not found", async () => {
            mockPrisma.review.delete.mockRejectedValueOnce(
                new Error("Not found"),
            );
            const response = await request(app).delete("/reviews/999");
            expect(response.status).toBe(404);
        });
    });
});
