module.exports = (req, res, next) => {

    let auth = req.session.isLoggedIn;
    if (auth)
        next();

    else
        res.redirect('/auth/login');
}