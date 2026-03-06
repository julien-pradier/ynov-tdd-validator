USE ynov_ci;

CREATE TABLE utilisateur
(
    id             INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nom            VARCHAR(100),
    prenom         VARCHAR(100),
    email          VARCHAR(255),
    -- ON CHANGE LE TYPE ICI : VARCHAR au lieu de DATE
    date_naissance VARCHAR(10)
);