CREATE DATABASE "s3explorer"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

\c s3explorer;

CREATE TYPE user_role AS ENUM('user','viewer','admin');

create table if not exists users(
    id serial primary key,
    password text not null,
    username varchar(50) not null,
    email varchar(100),
    role user_role,
    verified boolean
);

ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';
ALTER TABLE users ALTER COLUMN verified SET DEFAULT 'false';
ALTER TABLE users ADD CONSTRAINT uc_username UNIQUE(username);
ALTER TABLE users ADD CONSTRAINT uc_email UNIQUE(email);

create table if not exists accounts(
    id serial primary key,
    name varchar(500) not null, 
    aws_id text not null
);

ALTER TABLE accounts ADD CONSTRAINT uc_aws_id UNIQUE(aws_id);

create table if not exists accounts_users_join(
    user_id int, 
    account_id int, 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL,
    CONSTRAINT accounts_users_ckey PRIMARY KEY (user_id, account_id)
);

