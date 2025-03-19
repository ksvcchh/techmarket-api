import { Prisma } from "@prisma/client";
import prisma from "../config/prismaClient";

export interface User {
    id?: number;
    username: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
}

export async function getAllUsers() {
    const users = await prisma.user.findMany();
    return users;
}

export async function getUserById(id: string) {
    const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
    });
    return user;
}

export async function createUser(user: Omit<User, "id">) {
    const { username, email, passwordHash, firstName, lastName } = user;
    const result = await prisma.user.create({
        data: {
            username,
            email,
            passwordHash,
            firstName,
            lastName,
        },
    });
    return result;
}

export async function partlyChangeUser(
    id: string,
    newUserInfo: Partial<Omit<Prisma.UserUpdateInput, "id">>,
) {
    if (Object.keys(newUserInfo).length === 0) {
        throw new Error("No fields provided for update");
    }
    const result = await prisma.user.update({
        where: { id: parseInt(id) },
        data: newUserInfo,
    });
    return result;
}

export async function deleteUser(id: string) {
    const result = await prisma.user.delete({
        where: { id: parseInt(id) },
    });
    return result;
}

export async function getUserWithRelations(id: string) {
    const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: { reviews: { include: { product: true } } },
    });
    return user;
}
