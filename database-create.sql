CREATE DATABASE IF NOT EXISTS `voting-system-database`;
USE `voting-system-database`;

CREATE TABLE IF NOT EXISTS `users`(
	`Id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`Name` VARCHAR(35) NOT NULL UNIQUE,
	`Email` VARCHAR(62) NOT NULL UNIQUE,
	`Password` VARCHAR(60) NOT NULL,
	`Role` VARCHAR(60) NOT NULL,
	`Active` BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS `images`(
	`Id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`Title` TINYTEXT NOT NULL,
	`Description` TEXT(1024),
	`UserId` INT NOT NULL UNIQUE,
	`Active` BOOLEAN NOT NULL,
	CONSTRAINT fk_user_img FOREIGN KEY (UserId)  
	REFERENCES users(Id)  
);

CREATE TABLE IF NOT EXISTS `likes`(
	`Id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`UserId` INT NOT NULL,
	`ImageId` INT NOT NULL,
	CONSTRAINT fk_user_lik FOREIGN KEY (UserId)  
	REFERENCES users(Id),
	CONSTRAINT fk_image_lik FOREIGN KEY (ImageId)  
	REFERENCES images(Id),
	UNIQUE KEY(`UserId`, `ImageId`)
);

CREATE TABLE IF NOT EXISTS `info` (
	`Id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`UserId` INT NOT NULL,
	`Info` TEXT(1024) NOT NULL,
	CONSTRAINT fk_user_inf FOREIGN KEY (UserId)
	REFERENCES users(Id)
);


SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

/*
INSERT INTO images (Title, Description, UserId,Active) VALUES ("1223221", "12121", 1, FALSE)
INSERT INTO likes (UserId,ImageId) VALUES (1,1)
*/
/*
DROP TABLE likes;
DROP TABLE images;
DROP TABLE users;
*/