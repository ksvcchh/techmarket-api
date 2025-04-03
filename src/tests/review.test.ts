jest.mock("../services/database.service");

import request from "supertest";
import app from "../server";
import { collections } from "../services/database.service";

describe("Review Routes - Using Mock DB", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /reviews", () => {
        it("should create a new review", async () => {
            (collections.reviews.insertOne as jest.Mock).mockResolvedValueOnce({
                insertedId: "0B428B3CB6B8DACF8D9E58EE",
            });

            const response = await request(app)
                .post("/reviews")
                .send({
                    productId: "644345abcde1234567890000",
                    userId: "644345abcde1234567891111",
                    rating: 5,
                    title: "Great product!",
                    content: "Loved it overall",
                    pros: ["Battery life"],
                    cons: ["Pricey"],
                    verifiedPurchase: true,
                    likes: 0,
                });

            expect(response.status).toBe(201);
            expect(response.body.message).toMatch(
                /Review created successfully/i,
            );
            expect(response.body.data).toBeDefined();
            expect(response.body.data._id).toBe("0B428B3CB6B8DACF8D9E58EE");

            expect(collections.reviews.insertOne).toHaveBeenCalledTimes(1);
            expect(collections.reviews.insertOne).toHaveBeenCalledWith({
                productId: expect.anything(),
                userId: expect.anything(),
                rating: 5,
                title: "Great product!",
                content: "Loved it overall",
                pros: ["Battery life"],
                cons: ["Pricey"],
                verifiedPurchase: true,
                likes: 0,
            });
        });

        it("should return 400 if productId is invalid", async () => {
            const response = await request(app).post("/reviews").send({
                productId: "not_a_valid_object_id",
                userId: "644345abcde1234567891111",
                rating: 3,
                title: "Title",
                content: "Content",
                pros: [],
                cons: [],
                verifiedPurchase: false,
                likes: 0,
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(
                /Invalid productId or userId/i,
            );
            expect(collections.reviews.insertOne).not.toHaveBeenCalled();
        });
    });

    describe("GET /reviews", () => {
        it("should list all reviews", async () => {
            (collections.reviews.find as jest.Mock).mockReturnValueOnce({
                toArray: jest.fn().mockResolvedValueOnce([
                    { _id: "BA3A7E3658C8B5A8373C87F8", rating: 5 },
                    { _id: "E6A2653089E76CEC4406FD0A", rating: 4 },
                ]),
            });

            const response = await request(app).get("/reviews");
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);

            expect(collections.reviews.find).toHaveBeenCalledTimes(1);
            expect(collections.reviews.find).toHaveBeenCalledWith({});
        });
    });

    describe("GET /reviews/:reviewId", () => {
        it("should return 200 and the review if found", async () => {
            (collections.reviews.findOne as jest.Mock).mockResolvedValueOnce({
                _id: "94085FE5E0902B0247FC5550",
                title: "Mocked Review",
            });

            const res = await request(app).get(
                "/reviews/94085FE5E0902B0247FC5550",
            );
            expect(res.status).toBe(200);
            expect(res.body._id).toBe("94085FE5E0902B0247FC5550");
            expect(collections.reviews.findOne).toHaveBeenCalledWith({
                _id: expect.anything(),
            });
        });

        it("should return 404 if not found", async () => {
            (collections.reviews.findOne as jest.Mock).mockResolvedValueOnce(
                null,
            );

            const res = await request(app).get("/reviews/12321sad");
            expect(res.status).toBe(404);
            expect(res.body.message).toMatch(/Review not found/i);
        });
    });

    describe("PATCH /reviews/:reviewId", () => {
        it("should update the review partially", async () => {
            (
                collections.reviews.findOneAndUpdate as jest.Mock
            ).mockResolvedValueOnce({
                value: {
                    _id: "AE8F46221A11F9C31E20E3AB",
                    rating: 4,
                    title: "Title remains",
                },
            });

            const res = await request(app)
                .patch("/reviews/AE8F46221A11F9C31E20E3AB")
                .send({ rating: 4 });
            expect(res.status).toBe(200);
            expect(res.body.data.rating).toBe(4);

            expect(collections.reviews.findOneAndUpdate).toHaveBeenCalledTimes(
                1,
            );
        });

        it("should return 404 if review not found", async () => {
            (
                collections.reviews.findOneAndUpdate as jest.Mock
            ).mockResolvedValueOnce({ value: null });

            const res = await request(app)
                .patch("/reviews/A9613426BF863EADA43ECC5F")
                .send({ rating: 2 });
            expect(res.status).toBe(404);
            expect(res.body.message).toMatch(/Review not found/i);
        });
    });

    describe("DELETE /reviews/:reviewId", () => {
        it("should delete review if found", async () => {
            (
                collections.reviews.findOneAndDelete as jest.Mock
            ).mockResolvedValueOnce({
                value: { _id: "32BF8F1B9891B5D97BE3C38F" },
            });

            const res = await request(app).delete(
                "/reviews/32BF8F1B9891B5D97BE3C38F",
            );
            expect(res.status).toBe(200);
            expect(res.body.message).toMatch(/successfully deleted/i);
            expect(collections.reviews.findOneAndDelete).toHaveBeenCalledTimes(
                1,
            );
        });

        it("should return 404 if review not found", async () => {
            (
                collections.reviews.findOneAndDelete as jest.Mock
            ).mockResolvedValueOnce({
                value: null,
            });

            const res = await request(app).delete(
                "/reviews/6E24BEBC016E97BB2F33FEB2",
            );
            expect(res.status).toBe(404);
            expect(res.body.message).toMatch(/Review not found/i);
        });
    });

    describe("GET /reviews/:reviewId/details (getReviewWithRelations)", () => {
        it("should return detailed review when valid ID is found", async () => {
            (collections.reviews.aggregate as jest.Mock).mockReturnValueOnce({
                next: jest.fn().mockResolvedValueOnce({
                    _id: "644345abcde1234567892222",
                    productId: "644345abcde1234567890000",
                    userId: "644345abcde1234567891111",
                    rating: 4,
                    title: "Full Detailed Review",
                    content: "Some content",
                    product: [{ name: "Mock Product" }],
                    user: [{ username: "MockUser" }],
                }),
            });

            const res = await request(app).get(
                "/reviews/644345abcde1234567892222/details",
            );
            expect(res.status).toBe(200);
            expect(res.body._id).toBe("644345abcde1234567892222");
            expect(res.body.product).toHaveLength(1);
            expect(res.body.user).toHaveLength(1);
            expect(collections.reviews.aggregate).toHaveBeenCalledTimes(1);
        });

        it("should return 404 if review does not exist", async () => {
            (collections.reviews.aggregate as jest.Mock).mockReturnValueOnce({
                next: jest.fn().mockResolvedValueOnce(null),
            });

            const res = await request(app).get("/reviews/notValidId/details");
            expect(res.status).toBe(404);
            expect(res.body.message).toMatch(/Review not found/i);
        });
    });

    describe("GET /reviews/product/:productId (getReviewsByProduct)", () => {
        it("should return 200 and an array of reviews for the product if any exist", async () => {
            (collections.reviews.find as jest.Mock).mockReturnValueOnce({
                sort: jest.fn().mockReturnValueOnce({
                    skip: jest.fn().mockReturnValueOnce({
                        limit: jest.fn().mockReturnValueOnce({
                            toArray: jest.fn().mockResolvedValueOnce([
                                {
                                    _id: "644345abcde1234567891010",
                                    rating: 5,
                                    likes: 10,
                                },
                            ]),
                        }),
                    }),
                }),
            });

            const res = await request(app).get(
                "/reviews/product/644345abcde1234567899999?page=1&limit=10&sortBy=rating&sortOrder=desc",
            );
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
            expect(res.body[0]._id).toBe("644345abcde1234567891010");
            expect(collections.reviews.find).toHaveBeenCalledTimes(1);
        });

        it("should return 200 with an empty array if productId is invalid or no reviews found", async () => {
            (collections.reviews.find as jest.Mock).mockReturnValueOnce({
                sort: jest.fn().mockReturnValueOnce({
                    skip: jest.fn().mockReturnValueOnce({
                        limit: jest.fn().mockReturnValueOnce({
                            toArray: jest.fn().mockResolvedValueOnce([]),
                        }),
                    }),
                }),
            });

            const res = await request(app).get(
                "/reviews/product/notValidId?page=1&limit=10",
            );
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(0);
        });
    });

    describe("GET /reviews/product/:productId/stats (getReviewStatsForProduct)", () => {
        it("should return 200 and stats if found", async () => {
            (collections.reviews.aggregate as jest.Mock).mockReturnValueOnce({
                toArray: jest.fn().mockResolvedValueOnce([
                    { _id: 5, count: 2 },
                    { _id: 3, count: 1 },
                ]),
            });

            const res = await request(app).get(
                "/reviews/product/644345abcde123456789bbbb/stats",
            );
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("averageRating");
            expect(res.body).toHaveProperty("ratingCounts");
            expect(res.body).toHaveProperty("totalReviews");
        });

        it("should return 404 if product not found or invalid ID (stats null)", async () => {
            (collections.reviews.aggregate as jest.Mock).mockReturnValueOnce({
                toArray: jest.fn().mockResolvedValueOnce([]),
            });

            const res = await request(app).get(
                "/reviews/product/notAValidObjectId/stats",
            );
            expect(res.status).toBe(404);
            expect(res.body.message).toMatch(
                /Product not found or no reviews/i,
            );
        });
    });

    describe("GET /reviews/search (advancedSearchReviews)", () => {
        it("should return 200 and array of reviews matching search", async () => {
            (collections.reviews.find as jest.Mock).mockReturnValueOnce({
                sort: jest.fn().mockReturnValueOnce({
                    toArray: jest
                        .fn()
                        .mockResolvedValueOnce([
                            { _id: "644345abcde123456789aaaa", rating: 5 },
                        ]),
                }),
            });

            const res = await request(app).get(
                "/reviews/search?searchText=love&rating=5&verifiedPurchase=true&sortField=rating&sortOrder=desc",
            );
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
            expect(res.body[0]._id).toBe("644345abcde123456789aaaa");
        });

        it("should return 200 and empty array if no matches", async () => {
            (collections.reviews.find as jest.Mock).mockReturnValueOnce({
                sort: jest.fn().mockReturnValueOnce({
                    toArray: jest.fn().mockResolvedValueOnce([]),
                }),
            });

            const res = await request(app).get(
                "/reviews/search?searchText=xxx",
            );
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(0);
        });
    });

    describe("PATCH /reviews/:reviewId/like (likeReview)", () => {
        it("should increment likes if review is found", async () => {
            (
                collections.reviews.findOneAndUpdate as jest.Mock
            ).mockResolvedValueOnce({
                value: {
                    _id: "644345abcde123456789cccc",
                    likes: 3,
                },
            });

            const res = await request(app).patch(
                "/reviews/644345abcde123456789cccc/like",
            );
            expect(res.status).toBe(200);
            expect(res.body.message).toMatch(/Review liked/i);
            expect(res.body.data.likes).toBe(3);
            expect(collections.reviews.findOneAndUpdate).toHaveBeenCalledTimes(
                1,
            );
        });

        it("should return 404 if review not found or invalid ID", async () => {
            (
                collections.reviews.findOneAndUpdate as jest.Mock
            ).mockResolvedValueOnce({ value: null });

            const res = await request(app).patch("/reviews/notAValidId/like");
            expect(res.status).toBe(404);
            expect(res.body.message).toMatch(/Review not found/i);
        });
    });
});
