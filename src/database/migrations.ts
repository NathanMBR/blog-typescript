// Modules
import connection from "./connection";
import { usersLengths, categoriesLengths, articlesLengths } from "../settings/lengths";
const { name, email, password, profilePicture } = usersLengths;
const { category } = categoriesLengths;
const { title, description } = articlesLengths;

// Tables creation
const runMigrations = async () => new Promise(async (resolve: Function, reject: Function) => {
    try {
        await connection.transaction(async transaction => {
            await transaction.raw(
                `CREATE TABLE IF NOT EXISTS users(` +
                    `id SERIAL NOT NULL, ` +
                    `name VARCHAR(${name.max}) NOT NULL, ` +
                    `email VARCHAR(${email.max}) NOT NULL, ` +
                    `password VARCHAR(${password.max}) NOT NULL, ` +
                    `profile_picture VARCHAR(${profilePicture.max}) DEFAULT NULL, ` +
                    `is_admin BOOLEAN NOT NULL DEFAULT false, ` +
                    `is_email_public BOOLEAN NOT NULL DEFAULT false, ` +
                    `is_banned BOOLEAN NOT NULL DEFAULT false, ` +
                    `slug VARCHAR(${name.max}) NOT NULL, ` +
                    `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), ` +
                    `is_deleted BOOLEAN NOT NULL DEFAULT false, ` +
                    `PRIMARY KEY (id)` +
                `);`
            );

            await transaction.raw(
                `CREATE TABLE IF NOT EXISTS categories(` +
                    `id SERIAL NOT NULL, ` +
                    `category VARCHAR(${category.max}) NOT NULL, ` +
                    `author_id INTEGER NOT NULL, ` +
                    `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), ` +
                    `is_deleted BOOLEAN NOT NULL DEFAULT false, ` +
                    `PRIMARY KEY (id)` +
                `);`
            );
        
            await transaction.raw(
                `CREATE TABLE IF NOT EXISTS articles(` +
                    `id SERIAL NOT NULL, ` +
                    `title VARCHAR(${title.max}) NOT NULL, ` +
                    `description VARCHAR(${description.max}) NOT NULL, ` +
                    `article TEXT NOT NULL, ` +
                    `category_id INTEGER NOT NULL, ` +
                    `author_id INTEGER NOT NULL, ` +
                    `slug VARCHAR(${title.max}) NOT NULL, ` +
                    `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), ` +
                    `is_deleted BOOLEAN NOT NULL DEFAULT false, ` +
                    `PRIMARY KEY (id)` +
                `);`
            );

            await transaction.raw(
                `CREATE TABLE IF NOT EXISTS commentaries(` +
                    `id SERIAL NOT NULL, ` +
                    `commentary TEXT NOT NULL, ` +
                    `article_id INTEGER NOT NULL, ` +
                    `commentary_id INTEGER DEFAULT NULL, ` +
                    `author_id INTEGER NOT NULL, ` +
                    `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), ` +
                    `is_deleted BOOLEAN NOT NULL DEFAULT false, ` +
                    `PRIMARY KEY (id)` +
                `);`
            );
        });
        resolve("Tables successfully created!");
    } catch (error) {
        reject(error);
    }
});

export default runMigrations;