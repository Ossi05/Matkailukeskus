import { routes } from "../configs.js";

export default function flashAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => {
            if (req.params.id && e.name === "CastError") {
                req.flash("messages", { "danger": "Etsimääsi leiriä ei löytynyt!" });
                return res.redirect(routes.campground.root);
            }
            req.flash("messages", { "danger": e.message });
            const redirectRoute = req.originalUrl || routes.root; // fallback to home route if undefined
            res.redirect(redirectRoute);
        });
    }
}
