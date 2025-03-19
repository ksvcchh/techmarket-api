// import query from "../config/query";

import { Prisma } from "@prisma/client";
import prisma from "../config/prismaClient";

export interface Product {
    id?: string;
    name: string;
    categoryId: string;
    description: string;
    price: number;
    stockCount: number;
    brand: string;
    imageUrl: string;
    isAvailable: boolean;
    createdAt?: string;
}

export async function getAllProducts() {
    const products = await prisma.product.findMany();
    return products;
}

export async function getProductById(id: string) {
    const product = await prisma.product.findFirst({
        where: { id: parseInt(id) },
    });
    return product;
}

export async function createProduct(
    product: Omit<Product, "id" | "createdAt">,
) {
    const {
        name,
        categoryId,
        description,
        price,
        stockCount,
        brand,
        imageUrl,
        isAvailable,
    } = product;

    const result = await prisma.product.create({
        data: {
            name: name,
            categoryId: parseInt(categoryId),
            description: description,
            price: price,
            stockCount: stockCount,
            brand: brand,
            imageUrl: imageUrl,
            isAvailable: isAvailable,
        },
    });

    return result;
}

export async function updateProductPartly(
    id: string,
    fields: Partial<Omit<Prisma.ProductUpdateInput, "id" | "createdAt">>,
) {
    if (Object.keys(fields).length === 0) {
        throw new Error("No fields provided for update");
    } else {
        const result = prisma.product.update({
            where: {
                id: parseInt(id),
            },
            data: fields,
        });
        return result;
    }
}

export async function deleteProduct(id: string) {
    const result = await prisma.product.delete({
        where: {
            id: parseInt(id),
        },
    });

    return result;
}

export async function searchProducts(criteria: {
    sortByPrice?: "asc" | "desc";
    isAvailable?: boolean;
}) {
    const query: Prisma.ProductFindManyArgs = {};

    if (criteria.isAvailable !== undefined) {
        query.where = {
            isAvailable: criteria.isAvailable,
        };
    }

    if (criteria.sortByPrice) {
        query.orderBy = {
            price: criteria.sortByPrice,
        };
    }

    const result = await prisma.product.findMany(query);
    return result;
}

export async function getProductWithRelations(id: string) {
    const product = await prisma.product.findUnique({
        where: { id: parseInt(id) },
        include: {
            category: true,
            reviews: {
                include: { user: true },
            },
        },
    });
    return product;
}
