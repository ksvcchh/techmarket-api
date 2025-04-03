import { Router } from "express";
import {
    getAllReviewsController,
    getReviewByIdController,
    createReviewController,
    partlyChangeReviewController,
    deleteReviewController,
    getReviewDetailsController,
    getReviewsByProductController,
    getReviewStatsForProductController,
    advancedSearchReviewController,
    likeReviewController,
} from "../controllers/review.controller";

const router = Router();

router.get("/", getAllReviewsController);
router.get("/:reviewId", getReviewByIdController);
router.get("/:reviewId/details", getReviewDetailsController);
router.get("/product/:productId", getReviewsByProductController);
router.get("/product/:productId/stats", getReviewStatsForProductController);
router.get("/search", advancedSearchReviewController);
router.post("/", createReviewController);
router.patch("/:reviewId", partlyChangeReviewController);
router.patch("/:reviewId/like", likeReviewController);
router.delete("/:reviewId", deleteReviewController);

export default router;
