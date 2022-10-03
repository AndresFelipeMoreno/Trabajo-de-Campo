CREATE DATABASE database_Marketplace;

USE database_Marketplace;

CREATE TABLE users(
    idUser INT(11) NOT NULL,
    fullname VARCHAR(60) NOT NULL,
    email VARCHAR(60) NOT NULL,
    password VARCHAR(60) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    department VARCHAR(60) NOT NULL,
    town VARCHAR(60) NOT NULL
);

ALTER TABLE users
    ADD PRIMARY KEY (idUser);

ALTER TABLE users
    MODIFY idUser INT(11) NOT NULL AUTO_INCREMENT;

CREATE TABLE seed(
    idSeed INT(11) NOT NULL,
    name VARCHAR(60) NOT NULL,
    description VARCHAR(2000),
    quantityAvailable INT(10),
    priceKg INT(60),
    cultivationTown VARCHAR(60),
    typeSeed VARCHAR(60),
    idUser INT(11),
    CONSTRAINT fk_user FOREIGN KEY (idUser) REFERENCES users(idUser)
);




ALTER TABLE seed
    ADD PRIMARY KEY (idSeed);

ALTER TABLE seed
    MODIFY idSeed INT(11) NOT NULL AUTO_INCREMENT;

DESCRIBE users;
DESCRIBE seed;
