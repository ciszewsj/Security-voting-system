const express = require('express');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const {body, validationResult, param} = require('express-validator');

const path = require("path");
const config = require('config');
const fs = require('fs');
const passwordSecurity = require("./password-security");

const databaseConnector = require('./database');

const response = require('./response');
const {authenticateJWT, checkUserDataJWT} = require("./authentication");
const {auth} = require("mysql/lib/protocol/Auth");

let pass = new passwordSecurity.PasswordSecurity();

app = express();

const database = new databaseConnector.Database();


app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/api/getMyImageInfo', authenticateJWT, async (req, res) => {
    try {
        let image = await database.getMyImageInfo(req.userid);
        return res.json(image);
    } catch (e) {
        console.error(e);
        return res.status(500).json(response.internal_error_response({}));
    }
});

app.get('/api/getImagesInfo'
    , checkUserDataJWT
    , async (req, res) => {
        try {
            let imagesInfo = req.userid ? await database.getImagesInfo(req.userid) : await database.getImagesInfo("");
            return res.json(response.success_response(imagesInfo));
        } catch (e) {
            console.error(e);
            return res.status(500).json(response.internal_error_response({}));
        }
    });

app.get('/api/getImage/:id',
    param('id')
        .exists()
        .isNumeric(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            if (fs.existsSync(`${__dirname}/images/${req.params.id}.png`)) {
                res.sendFile(`${__dirname}/images/${req.params.id}.png`);
            } else {
                res.status(404).json(response.not_found_response({}));
            }
        } catch (e) {
            console.error(e);
            res.status(500).json(response.internal_error_response({}));
        }
    });

app.get('/api/removeImage/:id',
    authenticateJWT,
    param('id').isNumeric(),
    async (req, res) => {
        try {
            let user = await database.getUserDataById(req.userid);
            if (user.role !== "Admin") {
                if (await database.getMyImageInfo(user.Id) !== req.params.id) {
                    return res.status(403).json(response.unauthorized_response({}));
                }
            }
            await database.removeImage(req.params.id);
            return res.json(response.success_response({}));
        } catch (e) {
            console.error(e);
            return res.status(500).json(response.internal_error_response({}));
        }
    });

app.post('/api/register',
    body('Name')
        .exists()
        .withMessage("Nazwa użytkownika jest wymagana")
        .isLength({min: 5, max: 35})
        .withMessage("Nazwa użytkownika musi zawierać od 5 do 35 znaków")
        .matches("^[A-Za-z][A-Za-z0-9_]{0,}$")
        .withMessage("Nazwa użytkownika musi składać się z liter i cyfr bez polskich znaków diakrytycznych i specjalnych")
    ,
    body('Email')
        .exists()
        .withMessage("Email jest wymagany")
        .isEmail()
        .withMessage("Email ma nieprawidłowy format")
        .normalizeEmail()
        .withMessage("Email ma nieprawidłowy format")
    ,
    body('Password')
        .exists()
        .withMessage("Hasło jest wymagane")
        .isLength({min: 5, max: 60})
        .withMessage("Hasło musi mieć od 5 do 60 znaków"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let translateErrors = [];
            for (let error of errors.array()) {
                translateErrors.push({
                    field: error.param,
                    msg: error.msg
                });
            }
            return res.status(400).json(response.failure_response(translateErrors));
        }
        try {
            try {
                await database.registerUser(req.body.Name, req.body.Email, await pass.hashPassword(req.body.Password), config.get("default_role"))
            } catch (e) {
                if (e.code === "ER_DUP_ENTRY") {
                    let errors = [];
                    if (!await database.ifUserNickNotExist(req.body.Name)) {
                        errors.push({
                            field: 'Name',
                            msg: 'Użytkownik o podanej nazwie już istnieje.'
                        });
                    }
                    if (!await database.ifEmailExist(req.body.Email)) {
                        errors.push({
                            field: 'Name',
                            msg: 'Użytkownik o podanym emailu już istnieje.'
                        });
                    }
                    return res.status(400).json(response.failure_response(errors));
                } else {
                    throw e;
                }
            }
            res.json(response.success_response());
        } catch (e) {
            console.error(e)
            res.status(500).json(response.internal_error_response({}));
        }
    });

app.post('/api/login',
    body('Email').isEmail(),
    body('Password').isString()
        .isString()
        .isLength({min: 5, max: 60}),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            let userData = await database.getUserDataByEmail(req.body.Email);
            if (userData === undefined) {
                return res.status(404).json(response.failure_response(
                    {"msg": "Nie znaleziono użytkownika."}
                ));
            }
            if (userData.Active === false) {
                return res.json({"": ""})
            }
            if (await pass.comparePassword(req.body.Password, userData.Password)) {
                const token = jwt.sign({
                    id: userData.Id
                }, "1222", {
                    expiresIn: 86400
                });
                return res.status(404).json(response.success_response(
                    {
                        'token': token,
                        'role': userData.Role,
                        'name': userData.Name
                    }));
            }
            return res.json(response.unauthorized_response(
                {
                    "msg": "Nazwa użytkownika lub hasło jest nieprawidłowa."
                }
            ));
        } catch (e) {
            console.error(e)
            return res.status(500).json(response.internal_error_response({}));
        }
    });

app.get('/api/logout', async (req, res) => {
    }
);

app.post('/api/addImage',
    authenticateJWT,
    body('Title')
        .exists()
        .isString()
        .isLength({min: 1, max: 255}),
    body('Description')
        .isLength({max: 1024}),
    body('Image').isBase64(),
    async (req, res) => {
        try {
            try {
                await database.putImage("123", "123456", 1).Id;
            } catch (e) {
                if (e.code === "ER_DUP_ENTRY") {
                    return res.json(response.failure_response({"msg": "Użytkownik może umieścić tylko 1 obrazek"}));
                } else {
                    throw e;
                }
            }
            let imageId = await database.getMyImageInfo(req.userid)
            fs.writeFile("images/" + imageId + ".png", req.body.Image, 'base64', function (err) {
            });
            return res.json(response.success_response({}));
        } catch (e) {
            console.error(e)
            return res.status(500).json(response.internal_error_response({}))
        }
    });

app.get('/api/likeImage/:id',
    authenticateJWT,
    param('id').isNumeric(),
    async (req, res) => {
        try {
            if (!await database.ifImageActive(req.params.id)) {
                return res.status(400).json(response.failure_response({"msg": "Obrazek jest nie aktywny bądź nie istnieje"}));
            }
            await database.likeImage(req.userid, req.params.id);
            return req.json(response.success_response({}));
        } catch (e) {
            if (e.code === "ER_DUP_ENTRY") {
                return res.status(400).json(response.failure_response({"msg": "Zdjęcie zostało już polubione"}));
            }
            console.error(e);
            return req.status(500).json(response.internal_error_response({}));
        }
    }
);

app.get('/api/unlikeImage/:imageId',
    authenticateJWT,
    param('id').isNumeric(),
    async (req, res) => {
        try {
            if (!await database.ifImageActive(req.params.id)) {
                return res.status(400).json(response.failure_response({"msg": "Obrazek jest nie aktywny bądź nie istnieje"}));
            }
            await database.unLikeImage(req.params.id);
            return res.json(response.success_response({}));
        } catch (e) {
            console.error(e);
            return res.status(500).json(response.internal_error_response({}));
        }
    }
);

app.get('/api/acceptImage/:id',
    authenticateJWT,
    param('id').isNumeric(),
    async (req, res) => {
        try {
            let user = await database.getUserDataById(req.userid);
            if (user.role !== "Admin") {
                    return res.status(403).json(response.unauthorized_response({}));
            }
            if (!await database.ifImageActive(req.params.id, false)) {
                return res.status(400).json(response.failure_response({"msg": "Obrazek jest już aktywny, bądź nie istnieje"}));
            }
            await database.acceptImage(req.params.id);
            req.json(response.success_response());
        } catch (e) {
            console.error(e);
            return res.status(500).json(response.internal_error_response({}));
        }
    }
);

app.get('/api/getImageToAcceptList',
    authenticateJWT,
    async (req, res) => {
        try {
            let user = await database.getUserDataById(req.userid);
            if (user.role !== "Admin") {
                    return res.status(403).json(response.unauthorized_response({}));

            }
            let imagesInfo = await database.getImagesInfo(null, false);
            return res.json(response.success_response(imagesInfo));
        } catch (e) {
            console.error(e);
            return res.status(500).json(response.internal_error_response());
        }
    }
);

app.get('/api/*', async (req, res) => {
    res.status(404).json(response.not_support_response({}))
});

app.post('/api/*', async (req, res) => {
    res.status(404).json(response.not_support_response({}))
});


app.get('/*', async (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
});

app.listen(config.get("server").get("port"), () => {
    console.log('Server is started!');
});


