import { Prisma } from "@prisma/client";
import prisma from "../config/prismaClient";

export interface Category {
    id?: number;
    name: string;
    description: string;
}

export async function getAllCategories() {
    const result = await prisma.category.findMany({});
    return result;
}

export async function getCategoryById(id: string) {
    const result = await prisma.category.findFirst({
        where: { id: parseInt(id) },
    });
    return result;
}

export async function partlyChangeCategory(
    id: string,
    newCategoryInfo: Partial<Omit<Prisma.CategoryUpdateInput, "id">>,
) {
    if (Object.keys(newCategoryInfo).length === 0) {
        throw new Error("No fields provided for update");
    } else {
        const result = prisma.category.update({
            where: {
                id: parseInt(id),
            },
            data: newCategoryInfo,
        });
        return result;
    }
}

export async function createCategory(category: Omit<Category, "id">) {
    const { name, description } = category;

    const result = await prisma.category.create({
        data: {
            name: name,
            description: description,
        },
    });

    return result;
}

export async function deleteCategory(id: string) {
    const result = await prisma.category.delete({
        where: { id: parseInt(id) },
    });
    return result;
}

export async function getCategoryWithRelations(id: string) {
    const category = await prisma.category.findUnique({
        where: { id: parseInt(id) },
        include: { products: true },
    });
    return category;
}
