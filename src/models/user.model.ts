import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";

export interface User {
    _id?: ObjectId;
    username: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
}

export async function getAllUsers(): Promise<User[]> {
    if (!collections.users) throw new Error("users collection not found");
    const usersCursor = collections.users.find({});
    const users = (await usersCursor.toArray()) as User[];
    return users;
}

export async function getUserById(id: string): Promise<User | null> {
    if (!collections.users) throw new Error("users collection not found");
    if (!ObjectId.isValid(id)) return null;

    const user = (await collections.users.findOne({
        _id: new ObjectId(id),
    })) as User | null;

    return user;
}

export async function createUser(userData: Omit<User, "_id">): Promise<User> {
    if (!collections.users) throw new Error("users collection not found");
    const result = await collections.users.insertOne(userData);
    return { _id: result.insertedId, ...userData };
}

export async function partlyChangeUser(
    id: string,
    newUserInfo: Partial<Omit<User, "_id">>,
): Promise<User | null> {
    if (!collections.users) throw new Error("users collection not found");
    if (!ObjectId.isValid(id)) return null;

    const filter = { _id: new ObjectId(id) };
    const update = { $set: newUserInfo };

    const result = await collections.users.findOneAndUpdate(filter, update, {
        returnDocument: "after",
    });

    if (!result || !result.value) return null;
    return result.value as User;
}

export async function deleteUser(id: string): Promise<User | null> {
    if (!collections.users) throw new Error("users collection not found");
    if (!ObjectId.isValid(id)) return null;

    const filter = { _id: new ObjectId(id) };
    const result = await collections.users.findOneAndDelete(filter);
    if (!result || !result.value) return null;
    return result.value as User;
}

export async function getUserWithRelations(id: string): Promise<any | null> {
    if (!collections.users) throw new Error("users collection not found");
    if (!ObjectId.isValid(id)) return null;

    const aggCursor = collections.users.aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
            $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "userId",
                as: "reviews",
            },
        },
    ]);
    const result = await aggCursor.next();
    return result || null;
}
