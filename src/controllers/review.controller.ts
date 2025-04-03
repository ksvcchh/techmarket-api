import { NextFunction, Request, Response } from "express";
import {
    createReview,
    getReviewById,
    getAllReviews,
    partlyChangeReview,
    deleteReview,
    getReviewWithRelations,
    getReviewsByProduct,
    getReviewStatsForProduct,
    advancedSearchReviews,
    likeReview,
} from "../models/review.model";
import { ObjectId } from "mongodb";

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
        if (!review) {
            res.status(404).json({ message: "Review not found" });
        } else {
            res.status(200).json(review);
        }
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
        const {
            productId,
            userId,
            rating,
            title,
            content,
            pros,
            cons,
            verifiedPurchase,
            likes,
        } = req.body;

        if (!ObjectId.isValid(productId) || !ObjectId.isValid(userId)) {
            res.status(400).json({ message: "Invalid productId or userId" });
        } else {
            const newReview = {
                productId: new ObjectId(productId),
                userId: new ObjectId(userId),
                rating: parseInt(rating, 10),
                title: title,
                content: content,
                pros: Array.isArray(pros) ? pros : [],
                cons: Array.isArray(cons) ? cons : [],
                verifiedPurchase: verifiedPurchase === true,
                likes: likes ? parseInt(likes, 10) : 0,
            };

            const createdReview = await createReview(newReview);
            res.status(201).json({
                message: "Review created successfully",
                data: createdReview,
            });
        }
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
            if (
                updateData.productId &&
                ObjectId.isValid(updateData.productId)
            ) {
                updateData.productId = new ObjectId(updateData.productId);
            }
            if (updateData.userId && ObjectId.isValid(updateData.userId)) {
                updateData.userId = new ObjectId(updateData.userId);
            }
            if (updateData.rating) {
                updateData.rating = parseInt(updateData.rating, 10);
            }
            if (updateData.likes) {
                updateData.likes = parseInt(updateData.likes, 10);
            }

            const updatedReview = await partlyChangeReview(
                reviewId,
                updateData,
            );

            if (!updatedReview) {
                res.status(404).json({
                    message: "Review not found",
                });
            } else {
                res.status(200).json({
                    message: "Review successfully updated",
                    data: updatedReview,
                });
            }
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
        if (!deletedReview) {
            res.status(404).json({ message: "Review not found" });
        } else {
            res.status(200).json({
                message: "Review successfully deleted",
                data: deletedReview,
            });
        }
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
        if (!review) {
            res.status(404).json({ message: "Review not found" });
        } else {
            res.status(200).json(review);
        }
    } catch (error) {
        next(error);
    }
}

export async function getReviewsByProductController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { productId } = req.params;
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const sortBy = (req.query.sortBy as "rating" | "likes") || "rating";
        const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

        const reviews = await getReviewsByProduct(
            productId,
            page,
            limit,
            sortBy,
            sortOrder,
        );
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
}

export async function getReviewStatsForProductController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { productId } = req.params;
        const stats = await getReviewStatsForProduct(productId);
        if (!stats) {
            res.status(404).json({
                message: "Product not found or no reviews",
            });
        } else {
            res.status(200).json(stats);
        }
    } catch (error) {
        next(error);
    }
}

export async function advancedSearchReviewController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { searchText, rating, verifiedPurchase, sortField, sortOrder } =
            req.query;

        const ratingAsNum = rating ? parseInt(rating as string, 10) : undefined;
        const verifiedPurchaseBool =
            verifiedPurchase === "true"
                ? true
                : verifiedPurchase === "false"
                  ? false
                  : undefined;

        const reviews = await advancedSearchReviews({
            searchText: searchText ? String(searchText) : undefined,
            rating: ratingAsNum,
            verifiedPurchase: verifiedPurchaseBool,
            sortField:
                sortField === "rating" || sortField === "likes"
                    ? sortField
                    : undefined,
            sortOrder:
                sortOrder === "asc" || sortOrder === "desc"
                    ? sortOrder
                    : undefined,
        });

        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
}

export async function likeReviewController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { reviewId } = req.params;
        const updated = await likeReview(reviewId);

        if (!updated) {
            res.status(404).json({ message: "Review not found" });
        } else {
            res.status(200).json({
                message: "Review liked",
                data: updated,
            });
        }
    } catch (error) {
        next(error);
    }
}
