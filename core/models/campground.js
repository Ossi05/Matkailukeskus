import mongoose from "mongoose";
import Review from "./review.js";
import { cloudinary } from "../cloudinary/index.js";
import { cloudinaryUploadFolder, routes } from "../configs.js";
const campgroundRoute = routes.campground;
const Schema = mongoose.Schema;


const imageSchema = new Schema({
    src: String,
    filepath: String,
});

imageSchema.virtual("thumbnail").get(function () {
    return this.src.replace("/upload", "/upload/w_200");
});

imageSchema.methods.width = function (width = 500) {
    width = "w_" + width;
    return this.src.replace("/upload", `/upload/${width}`);
}

imageSchema.methods.paramas = function (params) {
    return this.src.replace("/upload", `/upload/${params}`);
}

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema({
    name: String,
    location: {
        name: String,
        geometry: {
            type: {
                type: String,
                enum: ["Point"],
            },
            coordinates: {
                type: [Number],
            }
        }
    },
    description: String,
    price: Number,
    images: [imageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },

}, opts);

campgroundSchema.post("findOneAndDelete", async (campground) => {
    await deleteCampgroundData();
});

campgroundSchema.pre("deleteMany", async function (next) {
    const conditions = this._conditions;
    const campgrounds = await this.model.find(conditions);
    for (let campground of campgrounds) {
        await deleteCampgroundData(campground);
    }
    next();
});


async function deleteCampgroundData(campground) {
    if (!campground) { return; }
    const reviews = campground.reviews;
    if (reviews.length > 0) {
        await Review.deleteMany({
            _id: {
                $in: reviews
            }
        });
    }
    const images = campground.images.map(img => img.filepath);
    await campground.deleteImages(images);
}

campgroundSchema.methods.isAuthor = function (userId) {
    return this.author.equals(userId);
}

campgroundSchema.methods.getAverageRating = async function () {
    await this.populate("reviews");
    if (this.reviews.length === 0) {
        return 0;
    }
    const totalRating = this.reviews.reduce((total, review) => {
        return total + review.rating;
    }, 0);
    const avgRating = totalRating / this.reviews.length;
    return parseFloat(avgRating.toFixed(1));
}

campgroundSchema.methods.deleteImages = async function (imageFilepaths) {
    if (!imageFilepaths) { return; }

    if (imageFilepaths.length > 0) {
        const usersUploadedImages = imageFilepaths.filter(filepath => {
            return filepath.startsWith(cloudinaryUploadFolder);
        });
        if (usersUploadedImages.length > 0) {
            // Delete images from cloudinary
            console.log("Delete images from cloudinary");
            for (let img of usersUploadedImages) {
                await cloudinary.uploader.destroy(img);
            }
        };

        const res = await this.updateOne({ $pull: { images: { filepath: { $in: imageFilepaths } } } });
    }
}

campgroundSchema.virtual("location.mapPoint").get(function () {
    const coordinates = this.location.geometry.coordinates;
    return {
        coordinates: [coordinates[1], coordinates[0]],
        popupText: `
        <h6><a target="_blank" href="${campgroundRoute.root}/${this._id}">${this.name}</a></h6>
        <p class="mb-0 mt-0">Hinta: ${this.price} €</p>
        <p class="mt-2"><i class="bi bi-geo-alt-fill"></i>${this.location.name} </p>`
    };

});


const Campground = mongoose.model("Campground", campgroundSchema);

export default Campground;