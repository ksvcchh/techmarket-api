jest.mock("../services/database.service");
import request from "supertest";
import app from "../server";
import { collections } from "../services/database.service";
import { ObjectId } from "mongodb";

describe("Product Routes - Using Mock DB", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /products (no query)", () => {
        it("should return all products (getAllProducts)", async () => {
            (collections.products.find as jest.Mock).mockReturnValueOnce({
                toArray: jest.fn().mockResolvedValueOnce([
                    { _id: "428C084D44011B049F4A8130", name: "MockProd1" },
                    { _id: "340C4A591459201DFFAB0375", name: "MockProd2" },
                ]),
            });

            const res = await request(app).get("/products");
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);

            expect(collections.products.find).toHaveBeenCalledTimes(1);
            expect(collections.products.find).toHaveBeenCalledWith({});
        });
    });

    describe("GET /products (with query sortByPrice / isAvailable)", () => {
        it("should call searchProducts when query is present", async () => {
            (collections.products.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    toArray: jest.fn().mockResolvedValue([
                        {
                            _id: "F3E13EF0DA3475A5B8C573A4",
                            price: 9.99,
                            isAvailable: true,
                        },
                    ]),
                }),
            });

            const res = await request(app).get(
                "/products?sortByPrice=asc&isAvailable=true",
            );
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);

            expect(collections.products.find).toHaveBeenCalledWith({
                isAvailable: true,
            });
        });
    });

    describe("GET /products/:productId", () => {
        it("should return a product if found (getProductById)", async () => {
            (collections.products.findOne as jest.Mock).mockResolvedValueOnce({
                _id: "AF5077ADF984FDEAAE82821D",
                name: "Test Product",
            });

            const res = await request(app).get(
                "/products/AF5077ADF984FDEAAE82821D",
            );
            expect(res.status).toBe(200);
            expect(res.body._id).toBe("AF5077ADF984FDEAAE82821D");
            expect(collections.products.findOne).toHaveBeenCalledWith({
                _id: expect.any(ObjectId),
            });
        });

        it("should return 404 if not found", async () => {
            (collections.products.findOne as jest.Mock).mockResolvedValueOnce(
                null,
            );
            const res = await request(app).get("/products/doesnotexist");
            expect(res.status).toBe(404);
            expect(res.body.message).toMatch(/not found/i);
        });
    });

    describe("GET /products/:productId/details", () => {
        it("should call getProductWithRelations", async () => {
            (collections.products.aggregate as jest.Mock).mockReturnValueOnce({
                next: jest.fn().mockResolvedValueOnce({
                    _id: "36C3705595DF15CB55A05FF7",
                    name: "Detailed Product",
                    reviews: [],
                }),
            });

            const res = await request(app).get(
                "/products/36C3705595DF15CB55A05FF7/details",
            );
            expect(res.status).toBe(200);
            expect(res.body._id).toBe("36C3705595DF15CB55A05FF7");
            expect(collections.products.aggregate).toHaveBeenCalledTimes(1);
        });

        it("should 404 if no product found in aggregation", async () => {
            (collections.products.aggregate as jest.Mock).mockReturnValueOnce({
                next: jest.fn().mockResolvedValueOnce(null),
            });

            const res = await request(app).get("/products/p999/details");
            expect(res.status).toBe(404);
            expect(res.body.message).toMatch(/not found/i);
        });
    });

    describe("POST /products", () => {
        it("should create a product", async () => {
            (collections.products.insertOne as jest.Mock).mockResolvedValueOnce(
                {
                    insertedId: "A56E7E3D7E95F04DD606ED5D",
                },
            );

            const res = await request(app).post("/products").send({
                name: "New Mock Product",
                category: "Accessories",
                description: "Test Desc",
                price: "19.99",
                stockCount: "5",
                brand: "BrandXYZ",
                imageUrl: "some.jpg",
                isAvailable: "true",
            });

            expect(res.status).toBe(201);
            expect(res.body.data._id).toBe("A56E7E3D7E95F04DD606ED5D");
            expect(res.body.data.name).toBe("New Mock Product");
            expect(collections.products.insertOne).toHaveBeenCalledTimes(1);
            expect(collections.products.insertOne).toHaveBeenCalledWith({
                name: "New Mock Product",
                category: "Accessories",
                description: "Test Desc",
                price: 19.99,
                stockCount: 5,
                brand: "BrandXYZ",
                imageUrl: "some.jpg",
                isAvailable: true,
            });
        });
    });

    describe("PATCH /products/:productId", () => {
        it("should update a product partially", async () => {
            (
                collections.products.findOneAndUpdate as jest.Mock
            ).mockResolvedValueOnce({
                value: {
                    _id: "4B0504DBC343B94BD9554CF3",
                    name: "Partially Updated Product",
                    price: 49.99,
                },
            });

            const res = await request(app)
                .patch("/products/4B0504DBC343B94BD9554CF3")
                .send({
                    name: "Partially Updated Product",
                    price: "49.99",
                });

            expect(res.status).toBe(200);
            expect(res.body.data.name).toBe("Partially Updated Product");
            expect(collections.products.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: expect.any(ObjectId) },
                { $set: { name: "Partially Updated Product", price: 49.99 } },
                { returnDocument: "after" },
            );
        });

        it("should return 404 if product not found", async () => {
            (
                collections.products.findOneAndUpdate as jest.Mock
            ).mockResolvedValueOnce({
                value: null,
            });

            const res = await request(app)
                .patch("/products/080662C1DC414837CEC1DF3A")
                .send({ name: "Nope" });
            expect(res.status).toBe(404);
            expect(res.body.message).toMatch(/not found/i);
        });

        it("should return 400 if no fields given", async () => {
            const res = await request(app)
                .patch("/products/D4FA7767562D9EBC89D04DE3")
                .send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toMatch(/No valid fields provided/i);
            expect(
                collections.products.findOneAndUpdate,
            ).not.toHaveBeenCalled();
        });
    });

    describe("DELETE /products/:productId", () => {
        it("should delete product if found", async () => {
            (
                collections.products.findOneAndDelete as jest.Mock
            ).mockResolvedValueOnce({
                value: {
                    _id: "97F7E8B05B0F749090DB1853",
                    name: "To be deleted",
                },
            });

            const res = await request(app).delete(
                "/products/97F7E8B05B0F749090DB1853",
            );
            expect(res.status).toBe(200);
            expect(res.body.message).toMatch(/successfully deleted/i);
            expect(collections.products.findOneAndDelete).toHaveBeenCalledWith({
                _id: expect.any(ObjectId),
            });
        });

        it("should return 404 if product not found", async () => {
            (
                collections.products.findOneAndDelete as jest.Mock
            ).mockResolvedValueOnce({
                value: null,
            });

            const res = await request(app).delete(
                "/products/366C5E4E2DD6CB892CBDFB99",
            );
            expect(res.status).toBe(404);
            expect(res.body.message).toMatch(/not found/i);
        });
    });
});
