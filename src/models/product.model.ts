import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";

export interface Product {
    _id?: ObjectId;
    name: string;
    category: string;
    description: string;
    price: number;
    stockCount: number;
    brand: string;
    imageUrl: string;
    isAvailable: boolean;
}

export async function getAllProducts(): Promise<Product[]> {
    if (!collections.products) throw new Error("products collection not found");
    const productsCursor = collections.products.find({});
    const products = (await productsCursor.toArray()) as Product[];
    return products;
}

export async function getProductById(id: string): Promise<Product | null> {
    if (!collections.products) throw new Error("products collection not found");

    if (!ObjectId.isValid(id)) {
        return null;
    }

    const product = (await collections.products.findOne({
        _id: new ObjectId(id),
    })) as Product | null;
    return product;
}

export async function createProduct(
    productData: Omit<Product, "_id">,
): Promise<Product> {
    if (!collections.products) throw new Error("products collection not found");

    const result = await collections.products.insertOne(productData);
    return {
        _id: result.insertedId,
        ...productData,
    };
}

export async function updateProductPartly(
    id: string,
    updateData: Partial<Omit<Product, "_id">>,
): Promise<Product | null> {
    if (!collections.products) throw new Error("products collection not found");

    if (!ObjectId.isValid(id)) {
        return null;
    }

    const result = await collections.products.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: "after" },
    );

    if (!result || !result.value) {
        return null;
    }

    return result.value as Product;
}

export async function deleteProduct(id: string): Promise<Product | null> {
    if (!collections.products) throw new Error("products collection not found");

    if (!ObjectId.isValid(id)) {
        return null;
    }

    const result = await collections.products.findOneAndDelete({
        _id: new ObjectId(id),
    });

    if (!result || !result.value) {
        return null;
    }
    return result.value as Product;
}

export async function searchProducts(criteria: {
    sortByPrice?: "asc" | "desc";
    isAvailable?: boolean;
}): Promise<Product[]> {
    if (!collections.products) throw new Error("products collection not found");

    const filter: any = {};

    if (typeof criteria.isAvailable === "boolean") {
        filter.isAvailable = criteria.isAvailable;
    }

    let sortOption: any = {};
    if (criteria.sortByPrice) {
        sortOption = { price: criteria.sortByPrice === "asc" ? 1 : -1 };
    }

    const productsCursor = collections.products.find(filter).sort(sortOption);
    const products = (await productsCursor.toArray()) as Product[];
    return products;
}

export async function getProductWithRelations(id: string): Promise<any | null> {
    if (!collections.products) throw new Error("products collection not found");

    if (!ObjectId.isValid(id)) return null;

    const aggCursor = collections.products.aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
            $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "productId",
                as: "reviews",
            },
        },
    ]);

    const result = await aggCursor.next();

    return result || null;
}
