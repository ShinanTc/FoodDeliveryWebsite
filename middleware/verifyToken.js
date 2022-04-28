const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log("Inside Verify Token");

    const token = req.cookies.token;

    try {
        const user = jwt.verify(token, 'secretkey');
        req.user = user;
        next();
    } catch (error) {
        res.clearCookie("token");
        return res.redirect("/admin/login");
    }

    console.log(token);
}