import BaseJoi from "joi";
import { campgroundRequirements, reviewRequirements, userRequirements } from "./configs.js";
import sanitizeHtml from 'sanitize-html';

const extensions = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} ei saa sisältää HTML-tageja",
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) { return helpers.error("string.escapeHTML", { value }) };
                return clean;
            },
        },
    },
});

const Joi = BaseJoi.extend(extensions);

export const campgroundJoiSchema = Joi.object({
    campground: Joi.object({
        name: Joi.string().required().min(campgroundRequirements.minNameLength).max(campgroundRequirements.maxNameLength).escapeHTML(),
        description: Joi.string().required().min(campgroundRequirements.minDescriptionLength).escapeHTML(),
        price: Joi.number().required().min(campgroundRequirements.minPrice).max(campgroundRequirements.maxPrice),
        location: Joi.object({
            name: Joi.string().required().escapeHTML(),
            geometry: Joi.object({
                type: Joi.string().required().escapeHTML(),
                coordinates: Joi.array().required().items(Joi.number())
            }),
        }).required(),

    }).required(),
    deleteImages: Joi.array(),
    imageOrder: Joi.array(),
});


export const reviewJoiSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(reviewRequirements.minRating).max(reviewRequirements.maxRating),
        reviewText: Joi.string().required().min(reviewRequirements.minReviewTextLength).max(reviewRequirements.maxReviewTextLength).escapeHTML(),
        date: Joi.date().default(Date.now),
        title: Joi.string().required().min(reviewRequirements.minTitleLength).max(reviewRequirements.maxTitleLength).escapeHTML(),
    }).required()
})

export const userJoiShema = Joi.object({
    user: Joi.object({
        username: Joi.string().required().escapeHTML(),
        email: Joi.string().required().email().messages({
            "string.email": "Sähköpostin pitää olla oikea sähköposti",
        }).escapeHTML(),
        password: Joi.string().optional().min(userRequirements.minPasswordLength).max(userRequirements.maxPasswordLength).messages({
            "string.min": `Salasanan tulee olla vähintään ${userRequirements.minPasswordLength} merkkiä pitkä`,
            "string.max": `Salasanan tulee olla vähintään ${userRequirements.maxPasswordLength} merkkiä pitkä`,
        }),
        name: Joi.object({
            first: Joi.string().required().escapeHTML(),
            last: Joi.string().required().escapeHTML(),
        }).required(),
    }),
    newPassword: Joi.string().min(userRequirements.minPasswordLength).max(userRequirements.maxPasswordLength).messages({
        "string.min": `Salasanan tulee olla vähintään ${userRequirements.minPasswordLength} merkkiä pitkä`,
        "string.max": `Salasanan tulee olla vähintään ${userRequirements.maxPasswordLength} merkkiä pitkä`,
    }).optional()
});