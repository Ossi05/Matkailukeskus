import {routes} from "../configs.js";

export function redirectToReturnTo(res) {
    const redirectUrl = res.locals.returnTo || routes.home;
    res.redirect(redirectUrl);
}