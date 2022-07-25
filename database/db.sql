
CREATE DATABASE db_login;

USE db_login;

-- TABLE USER

CREATE TABLE IF NOT EXISTS users (
	`id` int not null auto_increment,
	`email` varchar(255) not null,
	`password` varchar(255) not null,
	`username` varchar(255) not null,
	`phone_number` varchar(255) not null,
	PRIMARY KEY (`id`),
	UNIQUE KEY (`email`),
    UNIQUE KEY (`username`)
);

ALTER TABLE users MODIFY COLUMN `id` int not null auto_increment;

alter table users drop primary key;

describe users;

select * from users;
