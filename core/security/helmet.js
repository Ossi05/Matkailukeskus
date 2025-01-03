const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
    "https://api.mapbox.com",
    "https://unpkg.com"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net",
    "https://cdnjs.cloudflare.com",
    "https://unpkg.com",
    "https://api.mapbox.com",
];
const connectSrcUrls = [
    "https://*.mongodb.com",
];
const fontSrcUrls = ["https://cdn.jsdelivr.net"];

export const contentSecurityPolicy = {
    directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        childSrc: ["blob:"],
        objectSrc: [],
        imgSrc: [
            "'self'",
            "blob:",
            "data:",
            `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
            "https://images.unsplash.com",
            "https://api.mapbox.com",
            "https://unpkg.com",
            "https://*.tile.openstreetmap.org",
            "https://mt1.google.com",
        ],
        fontSrc: ["'self'", ...fontSrcUrls],
    },
};
export const referrerPolicy = {
    policy: 'strict-origin-when-cross-origin',
};