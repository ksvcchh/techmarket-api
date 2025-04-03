import { NextFunction, Request, Response } from "express";
import {
    Product,
    createProduct,
    getAllProducts,
    getProductById,
    updateProductPartly,
    deleteProduct,
    searchProducts,
    getProductWithRelations,
} from "../models/product.model";

export async function getAllProductsController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { sortByPrice, isAvailable } = req.query;

        if (sortByPrice || isAvailable !== undefined) {
            let available: boolean | undefined;
            if (isAvailable !== undefined) {
                if (isAvailable == "true") available = true;
                else if (isAvailable == "false") available = false;
            }

            const products = await searchProducts({
                sortByPrice: sortByPrice as "asc" | "desc" | undefined,
                isAvailable: available,
            });

            res.status(200).json(products);
        } else {
            const allProducts = await getAllProducts();
            res.status(200).json(allProducts);
        }
    } catch (error) {
        next(error);
    }
}

export async function getProductByIdController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { productId } = req.params;
        const result = await getProductById(productId);
        result
            ? res.status(200).json(result)
            : res
                  .status(404)
                  .json({ message: "Product of the given Id was not found! " });
    } catch (error) {
        next(error);
    }
}

export async function createProductController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const {
            name,
            category,
            description,
            price,
            stockCount,
            brand,
            imageUrl,
            isAvailable,
        } = req.body;

        const newProduct: Omit<Product, "id" | "createdAt"> = {
            name,
            category,
            description,
            price: parseFloat(price),
            stockCount: parseInt(stockCount),
            brand,
            imageUrl,
            isAvailable: isAvailable == "true",
        };

        const result = await createProduct(newProduct);

        res.status(201).json({
            message: "Product created succesfully!",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function partlyChangeProductController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { productId } = req.params;

        const allowedFields: (keyof Omit<Product, "id" | "created_at">)[] = [
            "name",
            "category",
            "description",
            "price",
            "stockCount",
            "brand",
            "imageUrl",
            "isAvailable",
        ];

        const updateFields: Partial<Omit<Product, "id" | "created_at">> = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                if (field === "price") {
                    updateFields.price = parseFloat(req.body.price);
                } else if (field === "stockCount") {
                    updateFields.stockCount = parseInt(req.body.stockCount);
                } else if (field === "isAvailable") {
                    updateFields.isAvailable = req.body.isAvailable == "true";
                } else {
                    updateFields[field] = req.body[field];
                }
            }
        });

        if (Object.keys(updateFields).length === 0) {
            res.status(400).json({
                message: "No valid fields provided for update.",
            });
        } else {
            const updatedProduct = await updateProductPartly(
                productId,
                updateFields,
            );

            if (!updatedProduct) {
                res.status(404).json({
                    message: "Product of the given Id was not found!",
                });
            } else {
                res.status(200).json({
                    message: "Product successfully updated!",
                    data: updatedProduct,
                });
            }
        }
    } catch (error) {
        next(error);
    }
}

export async function deleteProductController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { productId } = req.params;
        const deletedProduct = await deleteProduct(productId);

        if (!deletedProduct) {
            res.status(404).json({
                message: "Product of the given Id was not found!",
            });
        } else {
            res.status(200).json({
                message: "Product successfully deleted!",
                data: deletedProduct,
            });
        }
    } catch (error) {
        next(error);
    }
}

export async function getProductDetailsController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { productId } = req.params;
        const product = await getProductWithRelations(productId);
        product
            ? res.status(200).json(product)
            : res.status(404).json({ message: "Product not found" });
    } catch (error) {
        next(error);
    }
}
