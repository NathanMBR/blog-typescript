// Modules
import connection from "./connection";

// Tables creation
const createTables = async () => {
    try {
        await connection.transaction(async transaction => {
            await transaction.raw(
                "CREATE TABLE IF NOT EXISTS users(" +
                    "id SERIAL NOT NULL, " +
                    "name VARCHAR(20) NOT NULL, " +
                    "email VARCHAR(50) NOT NULL, " +
                    "password VARCHAR(20) NOT NULL, " +
                    "isAdmin BOOLEAN NOT NULL DEFAULT false, " +
                    "isEmailPublic BOOLEAN NOT NULL DEFAULT false, " +
                    "profilePicture VARCHAR(255) DEFAULT NULL, " +
                    "createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(), " +
                    "PRIMARY KEY (id)" +
                ");"
            );

            await transaction.raw(
                "CREATE TABLE IF NOT EXISTS categories(" +
                    "id SERIAL NOT NULL, " +
                    "name VARCHAR(50) NOT NULL, " + 
                    "createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(), " +
                    "PRIMARY KEY (id)" +
                ");"
            );
        
            await transaction.raw(
                "CREATE TABLE IF NOT EXISTS articles(" +
                    "id SERIAL NOT NULL, " +
                    "title VARCHAR(100) NOT NULL, " +
                    "description VARCHAR(200) NOT NULL, " +
                    "article TEXT NOT NULL, " +
                    "categoryId INTEGER NOT NULL, " +
                    "authorId INTEGER NOT NULL, " +
                    "slug VARCHAR(100) NOT NULL, " +
                    "createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(), " +
                    "PRIMARY KEY (id)" +
                ");"
            );

            await transaction.raw(
                "CREATE TABLE IF NOT EXISTS commentaries(" +
                    "id SERIAL NOT NULL, " +
                    "commentary TEXT NOT NULL, " +
                    "articleId INTEGER NOT NULL, " +
                    "commentaryId INTEGER DEFAULT NULL, " +
                    "authorId INTEGER NOT NULL, " +
                    "createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(), " +
                    "PRIMARY KEY (id)" +
                ");"
            );
        });
        console.log("Tables successfully created!");
    } catch (error) {
        console.error(error);
    }
};

createTables();