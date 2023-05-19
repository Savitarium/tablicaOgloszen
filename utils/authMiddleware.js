const authMiddleware = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.login) {
        next()
    } else {
        res.status(401).send('Unauthorized');
    }
}

module.exports = authMiddleware;