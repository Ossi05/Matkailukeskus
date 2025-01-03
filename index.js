import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import ExpressError from "./core/utils/expressError.js";
import campgroundRouter from "./core/routers/campgrounds.js";
import reviewRouter from "./core/routers/reviews.js";
import userRouter from "./core/routers/users.js";
import { routes, WEBSITE_NAME } from "./core/configs.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./core/models/user.js";
import Campground from "./core/models/campground.js";
import mongoSanitize from "express-mongo-sanitize";
import { contentSecurityPolicy, referrerPolicy } from "./core/security/helmet.js";
import helmet from "helmet";
import connectToDatabase from "./core/databaseConnection.js";


const app = express();
app.use(helmet());
app.use(helmet.contentSecurityPolicy(contentSecurityPolicy));
app.use(helmet.referrerPolicy(referrerPolicy));

await connectToDatabase();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 80;

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "core/views"));
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "core/public")));

const store = MongoStore.create({
    mongoUrl: process.env.DATABASE_URL,
    touchAfter: 24 * 3600,
    crypto: {
        secret: process.env.SECRET
    }
})

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
});

app.use(session({
    store,
    name: `${WEBSITE_NAME}-session`,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true, // Set `secure: true` in production with HTTPS
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // Cookie expires in 1 week
        maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7, // Cookie's max age is 1 week
    }
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(mongoSanitize());

app.use((req, res, next) => {
    let messages = req.flash("messages");
    // If passport errors
    let passportError = req.flash("error");
    if (passportError != "") {
        messages.push({ "danger": passportError });
    }
    res.locals.messages = messages;
    res.locals.routes = routes;
    res.locals.currentRoute = req.originalUrl;
    res.locals.user = req.user;
    res.locals.WEBSITE_NAME = WEBSITE_NAME;
    res.locals.TITLE = WEBSITE_NAME;
    next();
});
app.use(routes.campground.root, campgroundRouter);
app.use(`${routes.campground.root}/:id${routes.review}`, reviewRouter);
app.use(`${routes.account.root}`, userRouter);

app.get("/", async (req, res) => {
    const campgrounds = await Campground.find({});
    const maxPopularCampgrounds = 6;

    const ratings = [];
    for (let campground of campgrounds) {
        const rating = await campground.getAverageRating();
        ratings.push({ campground, rating });
    }
    const mostPopularCampgrounds = ratings.sort((a, b) => b.rating - a.rating).slice(0, maxPopularCampgrounds).map(item => item.campground);
    res.render("home", { campgrounds, mostPopularCampgrounds });
})

app.all("*", (req, res, next) => {
    const expressError = new ExpressError(404, "Sivua ei löytynyt");
    next(expressError);
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) { err.message = "Voi ei, jokin meni pieleen!"; }
    res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});