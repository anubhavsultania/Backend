export function isAuthenticated(req, res, next) {

    if (!req.session.userId) {
        return res.redirect("/");
    }

    next();
}

export function isGuest(req, res, next) {

    if(req.session.userId) {
        return res.redirect("/dashboard");
    }

    next(); 
}