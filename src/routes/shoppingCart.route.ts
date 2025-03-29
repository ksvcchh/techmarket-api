import { Router } from "express";
import {
    addProductToCartController,
    getCartController,
    updateProductQuantityController,
    removeProductFromCartController,
} from "../controllers/shoppingCart.controller";

const router = Router();

// POST /shopping-cart to add a product
router.post("/", addProductToCartController);

// GET /shopping-cart/:userId to get the user's cart
router.get("/:userId", getCartController);

// PATCH /shopping-cart/:userId/:productId to update a product's quantity
router.patch("/:userId/:productId", updateProductQuantityController);

// DELETE /shopping-cart/:userId/:productId to remove a product from the cart
router.delete("/:userId/:productId", removeProductFromCartController);

export default router;
