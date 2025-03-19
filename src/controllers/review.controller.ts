import { NextFunction, Request, Response } from "express";
import {
    getAllReviews,
    getReviewById,
    createReview,
    partlyChangeReview,
    deleteReview,
    getReviewWithRelations,
} from "../models/review.model";
import { Review } from "../models/review.model";

export async function getAllReviewsController(
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const reviews = await getAllReviews();
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
}

export async function getReviewByIdController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { reviewId } = req.params;
        const review = await getReviewById(reviewId);
        review
            ? res.status(200).json(review)
            : res.status(404).json({ message: "Review not found" });
    } catch (error) {
        next(error);
    }
}

export async function createReviewController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { productId, userId, rating, comment } = req.body;
        const newReview: Omit<Review, "id"> = {
            productId: parseInt(productId),
            userId: parseInt(userId),
            rating: parseInt(rating),
            comment,
        };

        const createdReview = await createReview(newReview);
        res.status(201).json({
            message: "Review created successfully",
            data: createdReview,
        });
    } catch (error) {
        next(error);
    }
}

export async function partlyChangeReviewController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { reviewId } = req.params;
        const updateData = req.body;

        if (Object.keys(updateData).length === 0) {
            res.status(400).json({
                message: "No valid fields provided for update.",
            });
        } else {
            const updatedReview = await partlyChangeReview(
                reviewId,
                updateData,
            );
            res.status(200).json({
                message: "Review successfully updated",
                data: updatedReview,
            });
        }
    } catch (error) {
        next(error);
    }
}

export async function deleteReviewController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { reviewId } = req.params;
        const deletedReview = await deleteReview(reviewId);
        deletedReview
            ? res.status(200).json({
                  message: "Review successfully deleted",
                  data: deletedReview,
              })
            : res.status(404).json({ message: "Review not found" });
    } catch (error) {
        next(error);
    }
}

export async function getReviewDetailsController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { reviewId } = req.params;
        const review = await getReviewWithRelations(reviewId);
        review
            ? res.status(200).json(review)
            : res.status(404).json({ message: "Review not found" });
    } catch (error) {
        next(error);
    }
}
