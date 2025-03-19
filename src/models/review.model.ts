import { Prisma } from "@prisma/client";
import prisma from "../config/prismaClient";

export interface Review {
    id?: number;
    productId: number;
    userId: number;
    rating: number;
    comment: string;
}

export async function getAllReviews() {
    const reviews = await prisma.review.findMany();
    return reviews;
}

export async function getReviewById(id: string) {
    const review = await prisma.review.findUnique({
        where: { id: parseInt(id) },
    });
    return review;
}

export async function createReview(review: Omit<Review, "id">) {
    const { productId, userId, rating, comment } = review;
    const result = await prisma.review.create({
        data: {
            productId,
            userId,
            rating,
            comment,
        },
    });
    return result;
}

export async function partlyChangeReview(
    id: string,
    newReviewInfo: Partial<Omit<Prisma.ReviewUpdateInput, "id">>,
) {
    if (Object.keys(newReviewInfo).length === 0) {
        throw new Error("No fields provided for update");
    }
    const result = await prisma.review.update({
        where: { id: parseInt(id) },
        data: newReviewInfo,
    });
    return result;
}

export async function deleteReview(id: string) {
    const result = await prisma.review.delete({
        where: { id: parseInt(id) },
    });
    return result;
}

export async function getReviewWithRelations(id: string) {
    const review = await prisma.review.findUnique({
        where: { id: parseInt(id) },
        include: { product: true, user: true },
    });
    return review;
}
