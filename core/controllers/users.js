import User from "../models/user.js";
import { userRequirements, routes } from "../configs.js";
import { redirectToReturnTo } from "../utils/utils.js";
import Campground from "../models/campground.js";
import Review from "../models/review.js";

const renderIndex = (req, res) => {
    res.render("users/account", { userRequirements, postRoute: req.originalUrl });
}

const renderRegister = (req, res) => {
    res.render("users/register", { postRoute: req.originalUrl, userRequirements });
}

const register = async (req, res, next) => {
    const { user } = req.body;
    if (!user.password) {
        req.flash("messages", { "error": `Salasana ei voi olla tyhjä!` });
        return res.redirect(routes.account.root + routes.account.register);
    }
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
    redirectToReturnTo(res);
}

const logout = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("messages", { "info": "Et ole kirjautunut sisään!" });
        return res.redirect(routes.root);
    }

    req.logOut((error) => {
        if (error) { return next(err); }
        req.flash("messages", { "success": "Heippa!" });
        res.redirect(req.get("referrer") || routes.root);
    });
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { user: userData } = req.body;
    const user = await User.findByIdAndUpdate(
        id,
        userData,
        { new: true },
    )
    req.flash("messages", { "success": "Käyttäjätiedot päivitetty!" });

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.user.password;
    if (newPassword && oldPassword) {
        try {
            await req.user.changePassword(userData.password, newPassword);
        }
        catch (e) {
            req.flash("messages", { "danger": "Salasana on väärin!" });
            return res.redirect(routes.account.root);
        }
        req.flash("messages", { "success": "Salasana vaihdettu!" });
    }
    res.redirect(routes.account.root);
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    await Campground.deleteMany({ author: user._id });
    await Review.deleteMany({ author: user._id });
    await user.deleteOne();
    req.flash("messages", { "success": "Tilisi on nyt poistettu! Kiitos, että olit osa yhteisöämme." });
    res.redirect(routes.root);

};

export default {
    renderIndex,
    renderRegister,
    register,
    renderLogin,
    login,
    logout,
    updateUser,
    deleteUser,

}