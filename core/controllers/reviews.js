import Campground from "../models/campground.js";
import Review from "../models/review.js";
import { routes } from "../configs.js";

const newReview = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("messages", { "success": `Arvostelu luotiin onnistuneesti!` })
    res.redirect(`${routes.campground.root}/${id}`)
}

const deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    console.log("DELETING");
    // Remove review from campground
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // Remove review
    await Review.findByIdAndDelete(reviewId);
    req.flash("messages", { "info": `Arvostelu poistettiin onnistuneesti!` })
    res.redirect(`${routes.campground.root}/${id}`);

}

export default {
    createReview: newReview,
    deleteReview,
}