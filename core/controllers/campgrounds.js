import Campground from "../models/campground.js";
import { campgroundRequirements, reviewRequirements } from "../configs.js";
import { routes } from "../configs.js";
import getGeometry from "../utils/geometry.js";
const campgroundRoute = routes.campground;

const index = async (req, res) => {
    const maxPerPage = 12;
    let currentPage = parseInt(req.query.sivu) || 1;
    const maxPages = Math.ceil(await Campground.countDocuments() / maxPerPage);
    const campgrounds = await Campground.find().skip((currentPage - 1) * maxPerPage).limit(maxPerPage);
    const page = {
        maxPages,
        currentPage,
    }
    res.render("campgrounds/index", { campgrounds, page });
}

const renderNewForm = (req, res) => {
    res.render("campgrounds/form", { campground: undefined, campgroundRequirements });
}

const createCampground = async (req, res) => {
    const campgroundData = req.body.campground;
    const campground = new Campground(campgroundData);
    const geometry = await getGeometry(campgroundData.location.name);
    if (!geometry) {
        req.flash("messages", { "danger": "Sijaintia ei löytynyt!" });
        return res.redirect(campgroundRoute.root + campgroundRoute.new);
    }
    campground.location.geometry = geometry;
    campground.author = req.user._id;
    campground.images = req.files.map(file => ({ src: file.path, filepath: file.filename }));

    await campground.save();
    req.flash("messages", { "success": `${campground.name} luotiin onnistuneesti!` });
    if (req.headers.accept.includes("text/html")) {
        res.redirect(`${campgroundRoute.root}/${campground._id}`);
    } else {
        res.send(campground);
    }
}

const renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("messages", { "danger": "Etsimääsi leiriä ei löytynyt!" });
        return res.redirect(campgroundRoute.root);
    }
    res.render("campgrounds/form", { campground, campgroundRequirements });
}

// TODO REFACTOR
const update = async (req, res) => {
    const { id } = req.params;
    const campgroundData = req.body.campground;
    const campground = await Campground.findByIdAndUpdate(id, campgroundData, { new: true });
    const geometry = await getGeometry(campgroundData.location.name);
    if (!geometry) {
        req.flash("messages", { "danger": "Sijaintia ei löytynyt!" });
        return res.redirect(`${campgroundRoute.root}/${campground._id}${campgroundRoute.edit}`);
    }
    campground.location.geometry = geometry;
    const imageOrder = req.body.imageOrder;

    let images = campground.images;
    if (images) {
        images.sort((a, b) => {
            const aIndex = imageOrder.indexOf(a._id.toString());
            const bIndex = imageOrder.indexOf(b._id.toString());
            return aIndex - bIndex;
        });
    }
    const newImages = req.files.map(file => ({ src: file.path, filepath: file.filename }));
    images.push(...newImages);
    campground.images = images;

    await campground.save();

    let deleteImages = req.body.deleteImages;
    if (deleteImages) {
        await campground.deleteImages(deleteImages);
    }


    req.flash("messages", { "success": `${campground.name} muokattiin onnistuneesti!` })
    res.redirect(`${campgroundRoute.root}/${campground._id}`);
}

const show = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        }).populate("author", "username");
    if (!campground) {
        req.flash("messages", { "danger": "Etsimääsi leiriä ei löytynyt!" });
        return res.redirect(campgroundRoute.root);
    }
    res.render("campgrounds/show", { campground, reviewRequirements });

}

const deleteCamground = async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    req.flash("messages", { "info": `${deletedCampground.name} poistettiin onnistuneesti!` })
    res.redirect(campgroundRoute.root);
}

export default {
    renderIndex: index,
    renderNewForm,
    createCampground,
    renderEditForm,
    update,
    renderShow: show,
    deleteCamground
}