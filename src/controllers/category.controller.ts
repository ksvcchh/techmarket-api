import { NextFunction, Request, Response } from "express";
import {
    Category,
    createCategory,
    getAllCategories,
    partlyChangeCategory,
    getCategoryById,
    deleteCategory,
    getCategoryWithRelations,
} from "../models/category.model";

export async function getAllCategoriesController(
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const allCategories = await getAllCategories();
        res.status(200).json(allCategories);
    } catch (error) {
        next(error);
    }
}

export async function getCategoryByIdController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { categoryId } = req.params;
        const result = await getCategoryById(categoryId);
        result
            ? res.status(200).json(result)
            : res
                  .status(404)
                  .json({
                      message: "Category of the given Id was not found! ",
                  });
    } catch (error) {
        next(error);
    }
}

export async function partlyChangeCategoryController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { categoryId } = req.params;
        const bodyOfRequest = req.body;

        const result = await partlyChangeCategory(categoryId, bodyOfRequest);

        res.status(200).json({
            message: "Category was succesfully changed!",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function createCategoryController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { name, description } = req.body;
        const newCategory: Omit<Category, "id"> = {
            name,
            description,
        };

        const result = await createCategory(newCategory);
        res.status(201).json({
            message: "Category created succesfully!",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteCategoryController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { categoryId } = req.params;
        const deletedCategory = await deleteCategory(categoryId);
        deletedCategory
            ? res.status(200).json({
                  message: "Category successfully deleted",
                  data: deletedCategory,
              })
            : res.status(404).json({ message: "Category not found" });
    } catch (error) {
        next(error);
    }
}

export async function getCategoryDetailsController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { categoryId } = req.params;
        const category = await getCategoryWithRelations(categoryId);
        category
            ? res.status(200).json(category)
            : res.status(404).json({ message: "Category not found" });
    } catch (error) {
        next(error);
    }
}
