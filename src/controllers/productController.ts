import { NextFunction, Request, Response } from "express";
import {
  Product,
  createProduct,
  getAllProducts,
  getProductById,
  updateProductPartly,
  deleteProduct,
  searchProducts,
} from "../models/productModel";

export async function getAllProductsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { sortByPrice, isavailable } = req.query;

    if (sortByPrice || isavailable !== undefined) {
      let available: boolean | undefined;
      if (isavailable !== undefined) {
        if (isavailable == "true") available = true;
        else if (isavailable == "false") available = false;
      }

      const products = await searchProducts({
        sortByPrice: sortByPrice as "asc" | "desc" | undefined,
        isavailable: available,
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
      isAvailable: isAvailable === "true",
    };

    const result = await createProduct(newProduct);

    res
      .status(201)
      .json({ message: "Product created succesfully!", data: result });
  } catch (error) {
    next(error);
  }
}

/* EXAMPLE POST BODY

{
  "name": "Lenovo ThinkPad X1 Carbon",
  "category": "Laptopy",
  "description": "Laptop Lenovo z procesorem Intel Core i7, 16GB RAM, 1TB SSD",
  "price": 8499.99,
  "stockCount": 12,
  "brand": "Lenovo",
  "imageUrl": "https://example.com/thinkpad-x1.jpg",
  "isAvailable": true,
  "createdAt": "2023-05-01T10:15:00Z"
}

*/

// export function partlyChangeProductController(req: Request, res: Response) {
//   const { productId } = req.params;
//   const newInfo = req.body;

//   const allProducts = products.resources;
//   const indexOfProduct = allProducts.map((elem) => elem.id).indexOf(productId);

//   if (indexOfProduct === -1) {
//     res
//       .status(404)
//       .json({ message: "Product of the given Id was not found! " });
//   } else {
//     allProducts[indexOfProduct] = {
//       ...allProducts[indexOfProduct],
//       ...newInfo,
//     };
//     res.status(200).json({ message: "Product succesfully changed!" });
//   }
// }

export async function partlyChangeProductController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { productId } = req.params;

    const allowedFields: (keyof Omit<Product, "id" | "createdAt">)[] = [
      "name",
      "category",
      "description",
      "price",
      "stockCount",
      "brand",
      "imageUrl",
      "isAvailable",
    ];

    const updateFields: Partial<Omit<Product, "id" | "createdAt">> = {};

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
      res.status(400).json({ message: "No valid fields provided for update." });
    } else {
      const updatedProduct = await updateProductPartly(productId, updateFields);

      if (!updatedProduct) {
        res
          .status(404)
          .json({ message: "Product of the given Id was not found!" });
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

/* EXAMPLE PATCH BODY

{
  "name": "Lenovo Legion y540",
  "description": "Laptop Lenovo z procesorem Intel Core i3, 8GB RAM, 256GB SSD",
  "price": 999.99,
  "stockCount": 4,
  "brand": "Lenovo",
  "imageUrl": "https://example.com/legion-y540.jpg",
  "isAvailable": true,
  "createdAt": "2025-02-02T11:11:11Z"
}

*/

export async function deleteProductController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { productId } = req.params;
    const deletedProduct = await deleteProduct(productId);

    if (!deletedProduct) {
      res
        .status(404)
        .json({ message: "Product of the given Id was not found!" });
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
