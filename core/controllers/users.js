import User from "../models/user.js";
import { userRequirements, routes } from "../configs.js";
import { redirectToReturnTo } from "../utils/utils.js";

const renderIndex = (req, res) => {
    res.render("users/account", { userRequirements });
}

const renderRegister = (req, res) => {
    res.render("users/register", { postRoute: req.originalUrl, userRequirements });
}

const register = async (req, res, next) => {
    const { user } = req.body;
    const newUser = new User({
        email: user.email,
        name: {
            first: user.name.first,
            last: user.name.last,
        },
        username: user.username,
    });
    const registeredUser = await User.register(newUser, user.password);
    req.login(registeredUser, (error) => {
        if (error) { return next(error); }
        req.flash("messages", { "success": `Tervetuloa Matkailukeskukseen ${newUser.name.first}!` });
        redirectToReturnTo(res);
    });

}

const renderLogin = async (req, res) => {
    res.render("users/login", { postRoute: req.originalUrl, userRequirements });
}

const login = async (req, res) => {
    req.flash("messages", { "success": `Tervetuloa takaisin ${req.user.name.first}!` });
    console.log("RETURNING TO:", res.locals.returnTo);
    redirectToReturnTo(res);
}

const logout = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("messages", { "info": "Et ole kirjautunut sisään!" });
        return res.redirect(routes.home);
    }

    req.logOut((error) => {
        if (error) { return next(err); }
        req.flash("messages", { "success": "Heippa!" });
        res.redirect(req.get("referrer") || routes.home);
    });
}

export default {
    renderIndex,
    renderRegister,
    register,
    renderLogin,
    login,
    logout,

}