import { cloudinary } from "./cloudinary/index.js";
import { routes } from "./configs.js";
import Campground from "./models/campground.js";
import Review from "./models/review.js";
import { campgroundJoiSchema, reviewJoiSchema, userJoiShema } from "./schemas.js";
import ExpressError from "./utils/expressError.js";

export function requireLogin(message = "Sinun täytyy kirjautua sisään nähdäksesi tämän sivun!") {
    return (req, res, next) => {
        req.session.returnTo = req.originalUrl;
        if (!req.isAuthenticated()) {
            req.flash("messages", { "danger": message });
            return res.redirect(routes.account.root + routes.account.login);
        }
        next();
    }
}

export function storeReturnTo(req, res, next) {
    const referer = req.get("referer");
    console.log(referer);
    if (referer && !req.session.returnTo) {
        req.session.returnTo = referer;
    }
    else if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

export function validateCampground(req, res, next) {
    // Validate the request body
    const { error } = campgroundJoiSchema.validate(req.body);
    if (error) {
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                cloudinary.uploader.destroy(file.filename);
            }
        }
        const errorMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errorMsg);
    }
    next()
}

export function requireCampgroundOwnership(message = "Sinulla ei ole oikeutta tähän!") {
    return async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        if (!campground.isAuthor(req.user._id)) {
            req.flash("messages", { "danger": message });
            return res.redirect(`${routes.campground}/${id}`);
        }
        next();
    };
}


export function requireReviewOwnership(message = "Sinulla ei ole oikeutta tähän arvosteluun") {
    return async (req, res, next) => {
        const { id, reviewId } = req.params;
        const review = await Review.findById(reviewId);
        if (!review.isAuthor(req.user._id)) {
            // User is not the author of the review!
            req.flash("messages", { "danger": message });
            return res.redirect(`${routes.campground}/${id}`);
        }
        next();

    }
}

export function validateReview(req, res, next) {
    const { error } = reviewJoiSchema.validate(req.body);
    if (error) {
        const errorMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errorMsg);
    }
    const review = req.body.review;
    review.reviewText = review.reviewText.trim();
    next();
}

export async function validateUser(req, res, next) {
    const { error } = userJoiShema.validate(req.body);
    if (error) {
        const errorMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errorMsg);
    }
    next();
}