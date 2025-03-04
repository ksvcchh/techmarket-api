import { Request, Response } from "express";
import { products } from "../data/products";
import { v4 as uuidv4 } from "uuid";

export function getAllProductsController(_req: Request, res: Response) {
  const allProducts = products.resources;
  res.status(200).json(allProducts);
}

export function getProductByIdController(req: Request, res: Response) {
  const { productId } = req.params;

  const allProducts = products.resources;
  const product = allProducts.find((elem) => elem.id === productId);
  product
    ? res.status(200).json(product)
    : res
        .status(404)
        .json({ message: "Product of the given Id was not found! " });
}

export function createProductController(req: Request, res: Response) {
  const {
    name,
    category,
    description,
    price,
    stockCount,
    brand,
    imageUrl,
    isAvailable,
    createdAt,
  } = req.body;

  const allProducts = products.resources;

  allProducts.push({
    id: uuidv4(),
    name: name,
    category: category,
    description: description,
    price: parseFloat(parseFloat(price).toFixed(2)),
    stockCount: parseInt(stockCount),
    brand: brand,
    imageUrl: imageUrl,
    isAvailable: isAvailable === "true",
    createdAt: createdAt,
  });

  res.status(201).json({ message: "Product succesfully created!" });
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

export function partlyChangeProductController(req: Request, res: Response) {
  const { productId } = req.params;
  const newInfo = req.body;

  const allProducts = products.resources;
  const indexOfProduct = allProducts.map((elem) => elem.id).indexOf(productId);

  if (indexOfProduct === -1) {
    res
      .status(404)
      .json({ message: "Product of the given Id was not found! " });
  } else {
    allProducts[indexOfProduct] = {
      ...allProducts[indexOfProduct],
      ...newInfo,
    };
    res.status(200).json({ message: "Product succesfully changed!" });
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

export function deleteProductController(req: Request, res: Response) {
  const { productId } = req.params;
  const allProducts = products.resources;
  const indexOfProduct = allProducts.map((elem) => elem.id).indexOf(productId);

  if (indexOfProduct === -1) {
    res
      .status(404)
      .json({ message: "Product of the given Id was not found! " });
  } else {
    allProducts.splice(indexOfProduct, 1);
    res.status(200).json({ message: "Product succesfully deleted!" });
  }
}
