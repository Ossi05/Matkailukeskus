import express from "express";
import catchAsync from "../utils/catchAsync.js";
import { requireLogin, validateReview, requireReviewOwnership } from "../middleware.js";
import reviewController from "../controllers/reviews.js";
import { routes } from "../configs.js";
const reviewRoutes = routes.review;

const router = express.Router({ mergeParams: true });

// CREATE NEW
router.post("/", requireLogin("Sinun täytyy olla kirjautunut tehdäksesi arvostelun"), validateReview, catchAsync(reviewController.createReview));

// DELETE
router.delete("/:reviewId",
    requireLogin("Sinun täytyy olla kirjautunut poistaaksesi arvostelun"),
    requireReviewOwnership("Sinulla ei ole oikeutta poistaa tätä arvostelua!"),
    catchAsync(reviewController.deleteReview));

export default router;