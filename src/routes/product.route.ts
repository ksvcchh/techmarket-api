import { Router } from "express";
import {
    getAllProductsController,
    getProductByIdController,
    createProductController,
    partlyChangeProductController,
    deleteProductController,
    getProductDetailsController,
} from "../controllers/product.controller";

const router = Router();

router.get("/", getAllProductsController);
router.get("/:productId", getProductByIdController);
router.get("/:productId/details", getProductDetailsController);
router.post("/", createProductController);
router.patch("/:productId", partlyChangeProductController);
router.delete("/:productId", deleteProductController);

export default router;
