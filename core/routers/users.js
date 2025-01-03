import express from "express";
import flashAsync from "../utils/flashAsync.js";
import { routes } from "../configs.js";
import passport from "passport";
import { requireLogin, storeReturnTo } from "../middleware.js";
import { validateUser } from "../middleware.js";
import userController from "../controllers/users.js";

const accountRoutes = routes.account;
const router = express.Router({ mergeParams: true });

// ROOT
router.route("/")
    .get(
        requireLogin("Sinun täytyy olla kirjautunut nähdäksesi tilisi"),
        userController.renderIndex
    );

// REGISTER
router.route(accountRoutes.register)
    .get(
        userController.renderRegister
    )
    .post(
        storeReturnTo,
        flashAsync(validateUser),
        flashAsync(userController.register)
    );

// LOGIN
router.route(accountRoutes.login)
    .get(
        storeReturnTo,
        flashAsync(userController.renderLogin)
    )
    .post(
        storeReturnTo,
        passport.authenticate("local", { failureFlash: true, failureRedirect: accountRoutes.root + accountRoutes.login }),
        flashAsync(userController.login)
    );

// LOGOUT
router.route(accountRoutes.logout)
    .get(
        userController.logout
    );

export default router;