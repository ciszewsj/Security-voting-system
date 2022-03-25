const jwt = require("jsonwebtoken");
const response = require("./response");
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, "1222", (err, user) => {
            if (err) {
                return res.status(403).json(response.unauthorized_response({}));
            }
            req.userid = user.id;
            next();
        });
    } else {
        return res.status(401).json(response.unauthorized_response({}));
    }
};
const checkUserDataJWT = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, "1222", (err, user) => {
            if (!err) {
                req.userid = user;
            }
            next();
        });
    }
    next();
};

module
    .exports
    .authenticateJWT = (req, res, next) => authenticateJWT(req, res, next);
module
    .exports
    .checkUserDataJWT = (req, res, next) => checkUserDataJWT(req, res, next);