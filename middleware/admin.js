module.exports = function (req, res, next) {
    if (process.env.isRequired === true) {
    if (!req.user.isAdmin) return res.status(403).send('Forbidden: Access Denied');
    next();
    }
}