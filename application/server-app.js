const express = require('express');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const {body, validationResult, param} = require('express-validator');

const path = require("path");
const config = require('config');
const fs = require('fs');
const passwordSecurity = require("./password-security");

const databaseConnector = require('./database');

let pass = new passwordSecurity.PasswordSecurity();

app = express();

const database = new databaseConnector.Database();


app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/api/getMyImageInfo', async (req, res) => {
    ;
});

app.get('/api/getImagesInfo', async (req, res) => {
    let imagesInfo = JSON.stringify(await database.getImagesInfo("12", true));
    res.json({"res": imagesInfo});
});

app.get('/api/getImage/:id',
    param('id').isNumeric(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        if (fs.existsSync(`${__dirname}/images/${req.params.id}.png`)) {
            res.sendFile(`${__dirname}/images/${req.params.id}.png`);
        } else {
            res.json({"erro": "errr"});
        }
    });

app.get('/api/removeImage/:id',
    param('id').isNumeric(),
    async (req, res) => {
        try {
            await database.removeImage(req.params.id);
            req.json({"ok": ""});
        } catch (e) {
            req.json({"fail": ""});
            throw e;
        }
    });

app.post('/api/register',
    body('Nick')
        .isString()
        .isLength({min: 5, max: 35}),
    body('Email').isEmail(),
    body('Password')
        .isString()
        .isLength({min: 5, max: 60}),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            await database.registerUser(req.body.Nick, req.body.Email, await pass.hashPassword(req.body.Password), config.get("default_role"))
        } catch (e) {
            if (e.code === "ER_DUP_ENTRY") {
                if (!await databaseifUserNickNotExist(req.body.Nick)) {
                    res.json({'user': 'is in database yes'});
                    return;
                }
                if (!await database.ifEmailExist(req.body.Email)) {
                    res.json({'email': 'is in database yes'});
                    return;
                }
                res.json();
                return;
            } else {
                throw e;
            }
        }
        res.json({'user': 'added'});
    });

app.post('/api/login',
    body('Email').isEmail(),
    body('Password').isString()
        .isString()
        .isLength({min: 5, max: 60}),
    async (req, res) => {
        console.log(await pass.hashPassword(req.body.Password))
        const token = jwt.sign({
            id: "user.id"
        }, "1222", {
            expiresIn: 86400
        });
        res.json({'token': token})
    });

app.get('/api/logout', async (req, res) => {
    }
);

app.post('/api/addImage',
    body('Title').exists()
        .isString()
        .isLength({min: 1, max: 255}),
    body('Description')
        .isString()
        .isLength({max: 1024}),
    body('Image').isBase64(),
    async (req, res) => {
        let imageId = undefined;
        try {
            imageId = JSON.parse(JSON.stringify(await database.putImage("123", "123456", 1)))[0].Id;
        } catch (e) {
            if (e.code === "ER_DUP_ENTRY") {
                res.json({"error": "error"});
                return;
            } else {
                throw e;
            }
        }
        fs.writeFile("images/" + imageId + ".png", req.body.Image, 'base64', function (err) {
        });
        res.json({'ok': 'ok'});
    });

app.get('/api/likeImage/:id',
    param('id').isNumeric(),
    async (req, res) => {
        try {
            await database.likeImage(req.params.id);
            req.json({"ok": ""});
        } catch (e) {
            req.json({"fail": ""});
            throw e;
        }
    }
);

app.get('/api/unlikeImage/:imageId',
    param('id').isNumeric(),
    async (req, res) => {
        try {
            if (!await database.ifImageActive(req.params.id)) {
                req.json({"could not": ""});
                return;
            }
            await database.unLikeImage(req.params.id);
            req.json({"ok": ""});
        } catch (e) {
            req.json({"fail": ""});
            throw e;
        }
    }
);

app.get('/api/acceptImage/:id',
    param('id').isNumeric(),
    async (req, res) => {
        try {
            if (!await database.ifImageActive(req.params.id)) {
                req.json({"could not": ""});
                return;
            }
            await database.acceptImage(req.params.id);
            req.json({"ok": ""});
        } catch (e) {
            req.json({"fail": ""});
            throw e;
        }
    }
);

app.get('/api/getImageToAcceptList', async (req, res) => {
        try {
            let imagesInfo = JSON.stringify(await database.getImagesInfo(null, false));
            res.json({"res": imagesInfo});
        } catch (e) {
            res.json({"err": "error"})
        }
    }
);

app.get('/*', async (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
});


app.listen(config.get("server").get("port"), () => {
    console.log('Server is started!');
});


