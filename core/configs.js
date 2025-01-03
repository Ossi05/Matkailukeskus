export const WEBSITE_NAME = "Matkailukeskus";
export const cloudinaryUploadFolder = `${WEBSITE_NAME}/uploads`;

export const campgroundRequirements = {
    minDescriptionLength: 20,
    maxDescriptionLength: 200,
    minNameLength: 3,
    maxNameLength: 50,
    minPrice: 0,
    maxPrice: 10000,
};

export const reviewRequirements = {
    minRating: 1,
    maxRating: 5, // Recommended is 5
    minReviewTextLength: 20,
    maxReviewTextLength: 200,
    minTitleLength: 3,
    maxTitleLength: 20
}

export const userRequirements = {
    minPasswordLength: 8,
    maxPasswordLength: 50,
    minUsernameLength: 3,
    maxUsernameLength: 20,
    minNameLength: 2,
    maxNameLength: 50,
    maxEmailLength: 70
};

export const routes = {
    home: "/",
    campground: {
        root: "/leirit",
        new: "/uusi",
        edit: "/muokkaa",
    },
    review: "/arvostelut",
    account: {
        root: "/tili",
        register: "/rekisteroidy",
        login: "/kirjaudu",
        logout: "/kirjaudu-ulos",
        edit: "/muokkaa",
    }
}