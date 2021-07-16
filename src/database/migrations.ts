// Modules
import connection from "./connection";
import { usersLengths, categoriesLengths, articlesLengths } from "../settings/lengths";
const { name, email, password, profilePicture } = usersLengths;
const { category } = categoriesLengths;
const { title, description } = articlesLengths;

// Tables creation
const runMigrations = async () => {
    try {
        await connection.transaction(async transaction => {
            await transaction.raw(
                `CREATE TABLE IF NOT EXISTS users(` +
                    `id SERIAL NOT NULL, ` +
                    `name VARCHAR(${name.max}) NOT NULL, ` +
                    `email VARCHAR(${email.max}) NOT NULL, ` +
                    `password VARCHAR(${password.max}) NOT NULL, ` +
                    `is_admin BOOLEAN NOT NULL DEFAULT false, ` +
                    `is_email_public BOOLEAN NOT NULL DEFAULT false, ` +
                    `profile_picture VARCHAR(${profilePicture.max}) DEFAULT NULL, ` +
                    `slug VARCHAR(${name.max}) NOT NULL, ` +
                    `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), ` +
                    `PRIMARY KEY (id)` +
                `);`
            );

            await transaction.raw(
                `CREATE TABLE IF NOT EXISTS categories(` +
                    `id SERIAL NOT NULL, ` +
                    `category VARCHAR(${category.max}) NOT NULL, ` + 
                    `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), ` +
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
                    `PRIMARY KEY (id)` +
                `);`
            );
        });
        console.log("Tables successfully created!");
    } catch (error) {
        console.error(error);
    }
};

export default runMigrations;