import express from "express";
import catchAsync from "../utils/catchAsync.js";
import { requireLogin, requireCampgroundOwnership, validateCampground } from "../middleware.js";
import campgroundController from "../controllers/campgrounds.js";
import { routes } from "../configs.js";
import multer from "multer";
import { storage } from "../cloudinary/index.js";
import flashAsync from "../utils/flashAsync.js";

// Limit file amt and fileSize
const upload = multer({
    storage,
    limits: { files: 5, fileSize: 4 * 1024 * 1024 },
});

const router = express.Router({ mergeParams: true });
const campgroundRoutes = routes.campground;

// INDEX
router.route("/")
    .get(
        catchAsync(campgroundController.renderIndex))
    .post(
        requireLogin("Sinun täytyy olla kirjautunut luodaksesi uuden leirin!"),
        upload.array("campground[images]"),
        validateCampground,
        catchAsync(campgroundController.createCampground));

// RENDER NEW
router.get(campgroundRoutes.new,
    requireLogin("Sinun täytyy olla kirjautunut luodaksesi uuden leirin!"),
    campgroundController.renderNewForm);

// RENDER EDIT
router.get(`/:id${campgroundRoutes.edit}`,
    requireLogin("Sinun täytyy olla kirjautunut muokataksesi leiriä!"),
    requireCampgroundOwnership("Sinulla ei ole oikeutta muokata tätä leiriä!"),
    catchAsync(campgroundController.renderEditForm));

// ID
router.route("/:id")
    .get(
        flashAsync(campgroundController.renderShow))
    .put(
        requireLogin("Sinun täytyy olla kirjautunut päivittääksesi leirin tietoja!"),
        requireCampgroundOwnership("Sinulla ei ole oikeutta muokata tämän leirin tetoja"),
        upload.array("campground[images]"),
        validateCampground,
        catchAsync(campgroundController.update))
    .delete(
        requireLogin("Sinun täytyy olla kirjautunut poistaaksesi leirin!"),
        requireCampgroundOwnership("Sinulla ei ole oikeutta poistaa tätä leiriä!"),
        catchAsync(campgroundController.deleteCamground));

export default router;