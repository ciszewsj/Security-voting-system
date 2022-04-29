const mysql = require('mysql');
const config = require("config");
const util = require('util');


class Database {
    constructor() {
        this.database = mysql.createConnection({
            host: config.get('database.host'),
            user: config.get('database.user'),
            password: config.get('database.password'),
            database: config.get('database.database')
        });

        this.database.connect((err) => {
            if (err) throw err;
            console.log("Connected to database!");
        });

        this.query = util.promisify(this.database.query).bind(this.database);


    };

    async ifUserNickNotExist(nick) {
        let sql = `SELECT * FROM users WHERE name = "${nick}"`;
        let users = await this.query(sql);
        return users.length === 0;
    }

    async ifEmailExist(email) {
        let sql = `SELECT * FROM users WHERE email = "${email}"`;
        let emails = await this.query(sql);
        return emails.length === 0;
    }

    async registerUser(nick, email, password, role) {
        let sql = `INSERT INTO users(Name, Email, Password, Role, Active) 
            VALUES ("${nick}","${email}","${password}","${role}",True)`;
        await this.query(sql);
    }

    async getUserDataByEmail(email) {
        let sql = `SELECT * FROM users WHERE Email = "${email}"`;
        return JSON.parse(JSON.stringify(await this.query(sql)))[0];
    }

    async getUserDataById(userId) {
        let sql = `SELECT * FROM users WHERE Id = "${userId}"`;
        return JSON.parse(JSON.stringify(await this.query(sql)))[0];
    }

    async getImagesInfo(userId, status = true) {
        let sql = `SELECT i.Title AS Title, i.Description AS Description, i.Id AS ImageId, u.Name AS Author,
			IFNULL(l.numberOfLikes,0) as Likes, IF(ls.ImageID is NULL, 'false', 'true') AS Liked
            FROM images i 
            LEFT JOIN users u ON i.UserId = u.id 
            LEFT JOIN (SELECT ImageId, COUNT(*) AS numberOfLikes FROM likes GROUP BY ImageId) l ON i.Id = l.ImageId
			LEFT JOIN (SELECT ImageId, COUNT(*) AS numberOfLikes FROM likes WHERE UserId = "${userId}" GROUP BY ImageId) ls ON i.id = ls.ImageId
			WHERE i.Active = ${status}`;
        return JSON.parse(JSON.stringify(await this.query(sql)));
    }

    async putImage(title, description, userid) {
        let sql = `INSERT INTO images(Title, Description, UserId, Active)  
                VALUES ("${title}", "${description}", ${userid}, true)`;
        await this.query(sql);
    }

    async getMyImageInfo(userid) {
        let sql = `SELECT Id, Title, Description, Active FROM images WHERE UserId = ${userid}`;
        return JSON.parse(JSON.stringify(await this.query(sql)))[0];
    }

    async removeImage(imageId) {
        let sql = `DELETE FROM likes WHERE ImageId = ${imageId}`;
        await this.query(sql);
        let sql2 = `DELETE FROM images WHERE Id = ${imageId}`
        await this.query(sql2);
    }

    async acceptImage(imageId) {
        let sql = `UPDATE images SET ACTIVE = true WHERE id = ${imageId}`;
        await this.query(sql);
    }

    async likeImage(userId, imageId) {
        let sql = `INSERT INTO likes(UserId, ImageId) VALUES (${userId}, ${imageId})`;
        await this.query(sql);
    }

    async unLikeImage(userId, imageId) {
        let sql = `DELETE FROM likes WHERE ImageId = ${imageId} AND UserId = ${userId}`;
        await this.query(sql);
    }

    async ifImageActive(imageId, status = true) {
        let sql = `SELECT * FROM images WHERE id = "${imageId}" AND Active = ${status}`;
        let images = await this.query(sql);
        return images.length === 1;
    }
}


module
    .exports
    .Database = Database;