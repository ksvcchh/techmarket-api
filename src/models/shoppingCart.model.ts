import { Prisma } from "@prisma/client";
import prisma from "../config/prismaClient";

async function getOrCreateShoppingCart(userId: number) {
    let cart = await prisma.shoppingCart.findUnique({
        where: { userId },
    });
    if (!cart) {
        cart = await prisma.shoppingCart.create({
            data: { userId },
        });
    }
    return cart;
}

export async function addProductToCart(
    userId: number,
    productId: number,
    quantity: number,
) {
    if (quantity < 1) {
        throw new Error("Quantity must be at least 1");
    }
    const cart = await getOrCreateShoppingCart(userId);

    const existingEntry = await prisma.productsInShoppingCart.findUnique({
        where: {
            productId_shoppingCartId: {
                productId,
                shoppingCartId: cart.id,
            },
        },
    });

    if (existingEntry) {
        const newQuantity = existingEntry.quantity + quantity;
        const updatedEntry = await prisma.productsInShoppingCart.update({
            where: {
                productId_shoppingCartId: {
                    productId,
                    shoppingCartId: cart.id,
                },
            },
            data: { quantity: newQuantity },
        });
        return updatedEntry;
    } else {
        const newEntry = await prisma.productsInShoppingCart.create({
            data: {
                productId,
                shoppingCartId: cart.id,
                quantity,
            },
        });
        return newEntry;
    }
}

export async function getCart(userId: number) {
    const cart = await prisma.shoppingCart.findUnique({
        where: { userId },
        include: {
            products: {
                include: {
                    product: true,
                },
            },
        },
    });
    return cart;
}

export async function updateProductQuantity(
    userId: number,
    productId: number,
    quantity: number,
) {
    if (quantity < 1) {
        throw new Error("Quantity must be at least 1");
    }
    const cart = await prisma.shoppingCart.findUnique({ where: { userId } });
    if (!cart) {
        throw new Error("Shopping cart not found for user");
    }
    const updatedEntry = await prisma.productsInShoppingCart.update({
        where: {
            productId_shoppingCartId: {
                productId,
                shoppingCartId: cart.id,
            },
        },
        data: { quantity },
    });
    return updatedEntry;
}

export async function removeProductFromCart(userId: number, productId: number) {
    const cart = await prisma.shoppingCart.findUnique({ where: { userId } });
    if (!cart) {
        throw new Error("Shopping cart not found for user");
    }
    const deletedEntry = await prisma.productsInShoppingCart.delete({
        where: {
            productId_shoppingCartId: {
                productId,
                shoppingCartId: cart.id,
            },
        },
    });
    return deletedEntry;
}
