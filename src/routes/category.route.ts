import { Router } from "express";
import {
    createCategoryController,
    getAllCategoriesController,
    getCategoryByIdController,
    partlyChangeCategoryController,
    deleteCategoryController,
    getCategoryDetailsController,
} from "../controllers/category.controller";

const router = Router();

router.get("/", getAllCategoriesController);
router.get("/:categoryId", getCategoryByIdController);
router.get("/:categoryId/details", getCategoryDetailsController);
router.post("/", createCategoryController);
router.patch("/:categoryId", partlyChangeCategoryController);
router.delete("/:categoryId", deleteCategoryController);

export default router;
