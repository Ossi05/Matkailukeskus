import { routes } from "../configs.js";

export function redirectToReturnTo(res) {
    const redirectUrl = res.locals.returnTo || routes.root;
    res.redirect(redirectUrl);
}