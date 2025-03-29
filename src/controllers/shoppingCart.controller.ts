import { Request, Response, NextFunction } from "express";
import {
    addProductToCart,
    getCart,
    updateProductQuantity,
    removeProductFromCart,
} from "../models/shoppingCart.model";

export async function addProductToCartController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const userId = parseInt(req.body.userId);
        const productId = parseInt(req.body.productId);
        const quantity = parseInt(req.body.quantity);

        if (!userId || !productId || !quantity || quantity < 1) {
            res.status(400).json({ message: "Invalid input" });
        } else {
            const result = await addProductToCart(userId, productId, quantity);
            res.status(201).json({
                message: "Product added to cart successfully",
                data: result,
            });
        }
    } catch (error) {
        next(error);
    }
}

export async function getCartController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const userId = parseInt(req.params.userId);
        if (!userId) {
            res.status(400).json({ message: "Invalid user id" });
        } else {
            const cart = await getCart(userId);
            if (!cart) {
                res.status(404).json({ message: "Cart not found" });
            } else {
                res.status(200).json(cart);
            }
        }
    } catch (error) {
        next(error);
    }
}

export async function updateProductQuantityController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const userId = parseInt(req.params.userId);
        const productId = parseInt(req.params.productId);
        const quantity = parseInt(req.body.quantity);
        if (!userId || !productId || !quantity || quantity < 1) {
            res.status(400).json({ message: "Invalid input" });
        } else {
            const result = await updateProductQuantity(
                userId,
                productId,
                quantity,
            );
            res.status(200).json({
                message: "Product quantity updated successfully",
                data: result,
            });
        }
    } catch (error) {
        next(error);
    }
}

export async function removeProductFromCartController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const userId = parseInt(req.params.userId);
        const productId = parseInt(req.params.productId);
        if (!userId || !productId) {
            res.status(400).json({ message: "Invalid input" });
        } else {
            await removeProductFromCart(userId, productId);
            res.status(200).json({
                message: "Product removed from cart successfully",
            });
        }
    } catch (error) {
        next(error);
    }
}
