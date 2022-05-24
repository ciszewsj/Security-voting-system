const jwt = require("jsonwebtoken");
const response = require("./response");
const config = require('config');

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, config.get("secret_key_jwt"), (err, user) => {
            if (err) {
                return res.status(403).json(response.unauthorized_response({msg:"Zaloguj się aby wykonać tą akcję"}));
            }
            req.userid = user.id;
            next();
        });
    } else {
        return res.status(401).json(response.unauthorized_response({msg:"Zaloguj się aby wykonać tą akcję"}));
    }
};
const checkUserDataJWT = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, config.get("secret_key_jwt"), (err, user) => {
            if (!err) {
                req.userid = user.id;
            }
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