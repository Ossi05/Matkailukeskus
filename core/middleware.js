import { MongooseError } from "mongoose";
import { cloudinary } from "./cloudinary/index.js";
import { routes } from "./configs.js";
import Campground from "./models/campground.js";
import Review from "./models/review.js";
import User from "./models/user.js";
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
        if (!campground) { return next(new ExpressError(404, "Leirintäaluetta ei löytynyt!")) };
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
        if (!review) { return next(new ExpressError(404, "Arvostelua ei löytynyt!")) };
        if (!review.isAuthor(req.user._id)) {
            // User is not the author of the review!
            req.flash("messages", { "danger": message });
            return res.redirect(`${routes.campground}/${id}`);
        }
        next();

    }
}

export function requireUserOwnership(message = "Sinulla ei ole oikeutta tähän käyttäjään!") {
    return async (req, res, next) => {
        const { id } = req.params;
        const user = id ? await User.findById(id) : await User.findByUsername(req.body.user.username);
        if (!user) { return next(new ExpressError(404, "Käyttäjää ei löytynyt!")) };
        if (req.user._id.toString() !== user._id.toString()) {
            req.flash("messages", { "danger": message });
            return res.redirect(req.get("Referrer") || routes.root);
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