import { Router } from "express";
import {
    getAllReviewsController,
    getReviewByIdController,
    createReviewController,
    partlyChangeReviewController,
    deleteReviewController,
    getReviewDetailsController,
} from "../controllers/review.controller";

const router = Router();

router.get("/", getAllReviewsController);
router.get("/:reviewId", getReviewByIdController);
router.get("/:reviewId/details", getReviewDetailsController);
router.post("/", createReviewController);
router.patch("/:reviewId", partlyChangeReviewController);
router.delete("/:reviewId", deleteReviewController);

export default router;
