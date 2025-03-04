import { Router } from "express";
import {
  getAllProductsController,
  getProductByIdController,
  createProductController,
  partlyChangeProductController,
  deleteProductController,
} from "../controllers/productController";

const router = Router();

router.get("/", getAllProductsController);
router.get("/:productId", getProductByIdController);
router.post("/", createProductController);
router.patch("/:productId", partlyChangeProductController);
router.delete("/:productId", deleteProductController);

export default router;
