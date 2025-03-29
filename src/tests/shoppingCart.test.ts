jest.mock("../config/prismaClient", () => require("../__mocks__/prismaClient"));

import request from "supertest";
import app from "../server";
import mockPrisma from "../__mocks__/prismaClient";

describe("Shopping Cart Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /shopping-cart", () => {
        test("should add product to cart (creating cart if not exists)", async () => {
            mockPrisma.shoppingCart.findUnique.mockResolvedValueOnce(null);
            mockPrisma.shoppingCart.create.mockResolvedValueOnce({
                id: 1,
                userId: 1,
                products: [],
            });
            mockPrisma.productsInShoppingCart.findUnique.mockResolvedValueOnce(
                null,
            );
            const createdEntry = {
                productId: 2,
                shoppingCartId: 1,
                quantity: 3,
                addedAt: new Date(),
            };
            mockPrisma.productsInShoppingCart.create.mockResolvedValueOnce(
                createdEntry,
            );

            const response = await request(app)
                .post("/shopping-cart")
                .send({ userId: "1", productId: "2", quantity: "3" });

            expect(response.status).toBe(201);
            expect(response.body.message).toMatch(/added to cart/i);
            expect(response.body.data).toMatchObject({
                productId: 2,
                shoppingCartId: 1,
                quantity: 3,
            });
            expect(new Date(response.body.data.addedAt).toString()).not.toBe(
                "Invalid Date",
            );
        });

        test("should update quantity if product already exists in cart", async () => {
            mockPrisma.shoppingCart.findUnique.mockResolvedValueOnce({
                id: 1,
                userId: 1,
            });
            const existingEntry = {
                productId: 2,
                shoppingCartId: 1,
                quantity: 2,
                addedAt: new Date(),
            };
            mockPrisma.productsInShoppingCart.findUnique.mockResolvedValueOnce(
                existingEntry,
            );
            const updatedEntry = { ...existingEntry, quantity: 4 };
            mockPrisma.productsInShoppingCart.update.mockResolvedValueOnce(
                updatedEntry,
            );

            const response = await request(app)
                .post("/shopping-cart")
                .send({ userId: "1", productId: "2", quantity: "2" });

            expect(response.status).toBe(201);
            expect(response.body.data.quantity).toBe(4);
        });
    });

    describe("GET /shopping-cart/:userId", () => {
        test("should get cart for user", async () => {
            const cart = {
                id: 1,
                userId: 1,
                products: [
                    {
                        productId: 2,
                        shoppingCartId: 1,
                        quantity: 3,
                        addedAt: new Date(),
                        product: { id: 2, name: "Product A" },
                    },
                ],
            };
            mockPrisma.shoppingCart.findUnique.mockResolvedValueOnce(cart);

            const response = await request(app).get("/shopping-cart/1");
            expect(response.status).toBe(200);
            expect(response.body.userId).toBe(1);
            expect(response.body.products).toHaveLength(1);
        });

        test("should return 404 if cart not found", async () => {
            mockPrisma.shoppingCart.findUnique.mockResolvedValueOnce(null);
            const response = await request(app).get("/shopping-cart/99");
            expect(response.status).toBe(404);
        });
    });

    describe("PATCH /shopping-cart/:userId/:productId", () => {
        test("should update product quantity in cart", async () => {
            const updatedEntry = {
                productId: 2,
                shoppingCartId: 1,
                quantity: 5,
                addedAt: new Date(),
            };
            mockPrisma.shoppingCart.findUnique.mockResolvedValueOnce({
                id: 1,
                userId: 1,
            });
            mockPrisma.productsInShoppingCart.update.mockResolvedValueOnce(
                updatedEntry,
            );

            const response = await request(app)
                .patch("/shopping-cart/1/2")
                .send({ quantity: "5" });
            expect(response.status).toBe(200);
            expect(response.body.data.quantity).toBe(5);
        });

        test("should return 400 for invalid quantity", async () => {
            const response = await request(app)
                .patch("/shopping-cart/1/2")
                .send({ quantity: "0" });
            expect(response.status).toBe(400);
        });
    });

    describe("DELETE /shopping-cart/:userId/:productId", () => {
        test("should remove product from cart", async () => {
            mockPrisma.shoppingCart.findUnique.mockResolvedValueOnce({
                id: 1,
                userId: 1,
            });
            mockPrisma.productsInShoppingCart.delete.mockResolvedValueOnce({
                productId: 2,
                shoppingCartId: 1,
                quantity: 3,
                addedAt: new Date(),
            });

            const response = await request(app).delete("/shopping-cart/1/2");
            expect(response.status).toBe(200);
            expect(response.body.message).toMatch(/removed from cart/i);
        });
    });
});
