import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";

export interface Review {
    _id?: ObjectId;
    productId: ObjectId;
    userId: ObjectId;
    rating: number;
    title: string;
    content: string;
    pros: string[];
    cons: string[];
    verifiedPurchase: boolean;
    likes: number;
}

export async function createReview(data: Omit<Review, "_id">): Promise<Review> {
    if (!collections.reviews) throw new Error("reviews collection not found");

    const result = await collections.reviews.insertOne(data);
    return { _id: result.insertedId, ...data };
}

export async function getReviewById(id: string): Promise<Review | null> {
    if (!collections.reviews) throw new Error("reviews collection not found");
    if (!ObjectId.isValid(id)) return null;

    const review = (await collections.reviews.findOne({
        _id: new ObjectId(id),
    })) as Review | null;

    return review;
}

export async function getAllReviews(): Promise<Review[]> {
    if (!collections.reviews) throw new Error("reviews collection not found");
    const cursor = collections.reviews.find({});
    const results = (await cursor.toArray()) as Review[];
    return results;
}

export async function partlyChangeReview(
    id: string,
    updateFields: Partial<Omit<Review, "_id">>,
): Promise<Review | null> {
    if (!collections.reviews) throw new Error("reviews collection not found");
    if (!ObjectId.isValid(id)) return null;

    const filter = { _id: new ObjectId(id) };
    const update = { $set: updateFields };
    const result = await collections.reviews.findOneAndUpdate(filter, update, {
        returnDocument: "after",
    });

    return result ? (result.value as Review) : null;
}

export async function deleteReview(id: string): Promise<Review | null> {
    if (!collections.reviews) throw new Error("reviews collection not found");
    if (!ObjectId.isValid(id)) return null;

    const filter = { _id: new ObjectId(id) };
    const result = await collections.reviews.findOneAndDelete(filter);

    return result ? (result.value as Review) : null;
}

export async function getReviewWithRelations(id: string): Promise<any | null> {
    if (!collections.reviews) throw new Error("reviews collection not found");
    if (!ObjectId.isValid(id)) return null;

    const aggCursor = collections.reviews.aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
            $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "product",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
            },
        },
    ]);
    const result = await aggCursor.next();
    return result || null;
}

export async function getReviewsByProduct(
    productId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: "rating" | "likes" = "rating",
    sortOrder: "asc" | "desc" = "desc",
): Promise<Review[]> {
    if (!collections.reviews) throw new Error("reviews collection not found");
    if (!ObjectId.isValid(productId)) return [];

    const filter = { productId: new ObjectId(productId) };
    const skip = (page - 1) * limit;
    const sort: any = {
        [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const cursor = collections.reviews
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);

    return (await cursor.toArray()) as Review[];
}

export async function getReviewStatsForProduct(productId: string): Promise<{
    averageRating: number;
    ratingCounts: { [rating: number]: number };
    totalReviews: number;
} | null> {
    if (!collections.reviews) throw new Error("reviews collection not found");
    if (!ObjectId.isValid(productId)) return null;

    const aggCursor = collections.reviews.aggregate([
        { $match: { productId: new ObjectId(productId) } },
        {
            $group: {
                _id: "$rating",
                count: { $sum: 1 },
                all_ratings_sum: { $sum: "$rating" },
            },
        },
    ]);

    const results = await aggCursor.toArray();

    if (!results || results.length === 0) {
        return {
            averageRating: 0,
            ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            totalReviews: 0,
        };
    }

    let totalReviews = 0;
    let totalRatingSum = 0;
    const ratingCounts: { [key: number]: number } = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
    };

    for (const doc of results) {
        const rating = doc._id as number;
        const count = doc.count as number;
        totalReviews += count;
        totalRatingSum += rating * count;
        ratingCounts[rating] = count;
    }

    const averageRating = totalReviews ? totalRatingSum / totalReviews : 0;

    return {
        averageRating,
        ratingCounts,
        totalReviews,
    };
}

export async function advancedSearchReviews(params: {
    searchText?: string;
    rating?: number;
    verifiedPurchase?: boolean;
    sortField?: "rating" | "likes";
    sortOrder?: "asc" | "desc";
}): Promise<Review[]> {
    if (!collections.reviews) throw new Error("reviews collection not found");

    const filter: any = {};

    if (params.searchText) {
        filter.$text = { $search: params.searchText };
    }

    if (
        typeof params.rating === "number" &&
        params.rating >= 1 &&
        params.rating <= 5
    ) {
        filter.rating = params.rating;
    }

    if (typeof params.verifiedPurchase === "boolean") {
        filter.verifiedPurchase = params.verifiedPurchase;
    }

    let sortQuery: any = {};
    if (params.sortField) {
        sortQuery[params.sortField] = params.sortOrder === "asc" ? 1 : -1;
    }

    const cursor = collections.reviews.find(filter).sort(sortQuery);
    return (await cursor.toArray()) as Review[];
}

export async function likeReview(id: string): Promise<Review | null> {
    if (!collections.reviews) throw new Error("reviews collection not found");
    if (!ObjectId.isValid(id)) return null;

    const filter = { _id: new ObjectId(id) };
    const update = { $inc: { likes: 1 } };
    const result = await collections.reviews.findOneAndUpdate(filter, update, {
        returnDocument: "after",
    });

    return result ? (result.value as Review) : null;
}
