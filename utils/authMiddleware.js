const authMiddleware = (req, res, next) => {
    if (req.session.user.login) {
        next();
    } else {
        res.status(401).json({ message: 'You are not authorized' });
    }
};

module.exports = authMiddleware;