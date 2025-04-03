jest.mock("../services/database.service");
import request from "supertest";
import app from "../server";
import { collections } from "../services/database.service";
import { ObjectId } from "mongodb";

describe("User Routes - Using Mock DB", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /users", () => {
        it("should return an array of users (getAllUsers)", async () => {
            (collections.users.find as jest.Mock).mockReturnValue({
                toArray: jest.fn().mockResolvedValueOnce([
                    { _id: "86513616E6C5D973C18CDDA0", username: "john" },
                    { _id: "83C870D5DBA174378050C5D6", username: "jane" },
                ]),
            });

            const res = await request(app).get("/users");
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body).toHaveLength(2);

            expect(collections.users.find).toHaveBeenCalledTimes(1);
            expect(collections.users.find).toHaveBeenCalledWith({});
        });
    });

    describe("GET /users/:userId", () => {
        it("should return user if found (getUserById)", async () => {
            (collections.users.findOne as jest.Mock).mockResolvedValueOnce({
                _id: "24CFAE41AAD059396BF5EC27",
                username: "testuser",
            });

            const res = await request(app).get(
                "/users/24CFAE41AAD059396BF5EC27",
            );
            expect(res.status).toBe(200);
            expect(res.body.username).toBe("testuser");
            expect(collections.users.findOne).toHaveBeenCalledWith({
                _id: expect.any(ObjectId),
            });
        });

        it("should return 404 if user not found", async () => {
            (collections.users.findOne as jest.Mock).mockResolvedValueOnce(
                null,
            );
            const res = await request(app).get(
                "/users/7BCECCF4B98CCD27F257BFA9",
            );
            expect(res.status).toBe(404);
            expect(res.body.message).toMatch(/not found/i);
        });
    });

    describe("GET /users/:userId/details", () => {
        it("should return user with relations (getUserWithRelations)", async () => {
            (collections.users.aggregate as jest.Mock).mockReturnValueOnce({
                next: jest.fn().mockResolvedValueOnce({
                    _id: "0A696B087534AD33CA1FE8F2",
                    username: "detailsUser",
                    reviews: [],
                }),
            });

            const res = await request(app).get(
                "/users/0A696B087534AD33CA1FE8F2/details",
            );
            expect(res.status).toBe(200);
            expect(res.body._id).toBe("0A696B087534AD33CA1FE8F2");
            expect(collections.users.aggregate).toHaveBeenCalledTimes(1);
        });

        it("should return 404 if not found", async () => {
            (collections.users.aggregate as jest.Mock).mockReturnValueOnce({
                next: jest.fn().mockResolvedValueOnce(null),
            });

            const res = await request(app).get(
                "/users/9E6F666801DE23896E9BAF66/details",
            );
            expect(res.status).toBe(404);
            expect(res.body.message).toMatch(/not found/i);
        });
    });

    describe("POST /users", () => {
        it("should create a user (createUser)", async () => {
            (collections.users.insertOne as jest.Mock).mockResolvedValueOnce({
                insertedId: "4AFF9312A613A3EF974C025C",
            });

            const res = await request(app).post("/users").send({
                username: "testy",
                email: "test@example.com",
                passwordHash: "hash",
                firstName: "Test",
                lastName: "User",
            });

            expect(res.status).toBe(201);
            expect(res.body.data._id).toBe("4AFF9312A613A3EF974C025C");
            expect(res.body.data.username).toBe("testy");

            expect(collections.users.insertOne).toHaveBeenCalledTimes(1);
            expect(collections.users.insertOne).toHaveBeenCalledWith({
                username: "testy",
                email: "test@example.com",
                passwordHash: "hash",
                firstName: "Test",
                lastName: "User",
            });
        });
    });

    describe("PATCH /users/:userId", () => {
        it("should update user partially (partlyChangeUser)", async () => {
            (
                collections.users.findOneAndUpdate as jest.Mock
            ).mockResolvedValueOnce({
                value: {
                    _id: "04512A8407768EBB138F028C",
                    username: "patched",
                    email: "patched@example.com",
                },
            });

            const res = await request(app)
                .patch("/users/04512A8407768EBB138F028C")
                .send({
                    email: "patched@example.com",
                });
            expect(res.status).toBe(200);
            expect(res.body.data.username).toBe("patched");
            expect(collections.users.findOneAndUpdate).toHaveBeenCalledTimes(1);
            expect(collections.users.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: expect.any(ObjectId) },
                { $set: { email: "patched@example.com" } },
                { returnDocument: "after" },
            );
        });

        it("should return 404 if user not found", async () => {
            (
                collections.users.findOneAndUpdate as jest.Mock
            ).mockResolvedValueOnce({
                value: null,
            });

            const res = await request(app)
                .patch("/users/99D19CA5CBDFBFD4D981CE82")
                .send({
                    username: "Nope",
                });
            expect(res.status).toBe(404);
            expect(res.body.message).toMatch(/not found/i);
        });

        it("should return 400 if empty update body", async () => {
            const res = await request(app).patch("/users/u5").send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toMatch(/No valid fields provided/i);
            expect(collections.users.findOneAndUpdate).not.toHaveBeenCalled();
        });
    });

    describe("DELETE /users/:userId", () => {
        it("should delete user if found", async () => {
            (
                collections.users.findOneAndDelete as jest.Mock
            ).mockResolvedValueOnce({
                value: {
                    _id: "9E15453ED620FB3985DB0955",
                    username: "deletethis",
                },
            });

            const res = await request(app).delete(
                "/users/9E15453ED620FB3985DB0955",
            );
            expect(res.status).toBe(200);
            expect(res.body.message).toMatch(/successfully deleted/i);
            expect(collections.users.findOneAndDelete).toHaveBeenCalledWith({
                _id: expect.any(ObjectId),
            });
        });

        it("should return 404 if user not found", async () => {
            (
                collections.users.findOneAndDelete as jest.Mock
            ).mockResolvedValueOnce({
                value: null,
            });

            const res = await request(app).delete(
                "/users/1FEB49B62CD5696B4B2CA490",
            );
            expect(res.status).toBe(404);
            expect(res.body.message).toMatch(/not found/i);
        });
    });
});
