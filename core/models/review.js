import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    reviewText: String,
    rating: Number,
    title: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

reviewSchema.methods.isAuthor = function (userId) {
    return this.author.equals(userId);
}

const Review = mongoose.model("Review", reviewSchema);

export default Review;