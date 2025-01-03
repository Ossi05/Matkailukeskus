import mongoose from "mongoose";
import Campground from "../core/models/campground.js";
import finnishCities from './finnishCities.json' with { type: 'json' };
import seedHelpers from './seedHelpers.json' with { type: 'json' };
import { v2 as cloudinary } from 'cloudinary';
import { reviewRequirements, WEBSITE_NAME } from "../core/configs.js";
import Review from "../core/models/review.js";
import connectToDatabase from "../core/databaseConnection.js";

let reviews = [];
await connectToDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const { resources: cloudinaryImages } = await cloudinary.search.expression(`folder:${WEBSITE_NAME}/Seeds`).execute();

function getRandomCampgroundName() {
    const descriptor = seedHelpers.campgrounds.descriptors[Math.floor(Math.random() * seedHelpers.campgrounds.descriptors.length)];
    const place = seedHelpers.campgrounds.places[Math.floor(Math.random() * seedHelpers.campgrounds.places.length)];
    return `${descriptor} ${place}`;
}

function getRandomDescription() {

    return seedHelpers.campgrounds.descriptions[Math.floor(Math.random() * seedHelpers.campgrounds.descriptions.length)];
}

function getRandomImages() {
    const maxImagesPerCampground = 5;
    const minImagesPerCampground = 1;
    const imgAmt = Math.floor(Math.random() * (maxImagesPerCampground - minImagesPerCampground + 1)) + minImagesPerCampground;
    let images = [];
    for (let i = 0; i < imgAmt; i++) {
        const randomIndex = Math.floor(Math.random() * cloudinaryImages.length);
        const image = cloudinaryImages[randomIndex];
        images.push({
            src: image.secure_url,
            filepath: image.public_id
        })
    }
    return images;
}

function getRandomReviews() {
    const maxImagesPerCampground = 5;
    const minImagesPerCampground = 0;
    const reviewAmt = Math.floor(Math.random() * (maxImagesPerCampground - minImagesPerCampground + 1)) + minImagesPerCampground;
    let campgroundReviews = [];
    for (let i = 0; i < reviewAmt; i++) {
        campgroundReviews.push(reviews[Math.floor(Math.random() * reviews.length)]._id);
    }
    return campgroundReviews;
}

async function getRandomLocation() {
    const randomCity = finnishCities[Math.floor(Math.random() * finnishCities.length)];
    const name = `${randomCity.city}, ${randomCity.admin_name}`;
    return {
        name: `${randomCity.city}, ${randomCity.admin_name}`,
        geometry: {
            type: "Point",
            coordinates: [randomCity.lng, randomCity.lat]
        }
    };
}

async function deleteCampgrounds() {
    console.log("Deleting all campgrounds...");
    await Campground.deleteMany({});
}

async function deleteReviews() {
    console.log("Deleting all reviews...");
    await Review.deleteMany({});
}


async function seedCampgrounds() {
    const maxCampgrounds = 50;
    await deleteCampgrounds();
    console.log("Seeding the database with campgrounds...");
    for (let i = 0; i < maxCampgrounds; i++) {
        const camp = new Campground({
            name: getRandomCampgroundName(),
            location: await getRandomLocation(),
            price: Math.floor(Math.random() * 200) + 10,
            images: getRandomImages(),
            description: getRandomDescription(),
            author: "677798ff37a87b8af1b4acab", // Your accounts user id
            reviews: getRandomReviews()
        });
        await camp.save();
    }
}

async function seedReviews() {
    const maxReviews = 50;
    const author = "677798ff37a87b8af1b4acab"; // TODO RANDOM AUTHOR
    await deleteReviews();
    console.log("Seeding the database with reviews...");
    for (let i = 0; i < maxReviews; i++) {
        const review = new Review({
            reviewText: seedHelpers.reviews.descriptions[Math.floor(Math.random() * seedHelpers.reviews.descriptions.length)],
            rating: Math.random() * (reviewRequirements.maxRating - reviewRequirements.minRating) + reviewRequirements.minRating,
            title: seedHelpers.reviews.titles[Math.floor(Math.random() * seedHelpers.reviews.titles.length)],
            author
        });
        await review.save();
    }
}


async function seedDb() {
    await seedReviews();
    reviews = await Review.find({});
    await seedCampgrounds();
    console.log("Database seeded!");

}

seedDb().then(() => {
    mongoose.connection.close();
});


