# TypeScript Blog API
This is a simple blog API made with Node.js, TypeScript, Jest, Docker, PostgreSQL, Express, JWT and other technologies.

## Documentation
You can access the API documentation at the `/api-docs` route.

## First steps

### _Requirements_
* Git
* Node.js
* npm (v7 or greater) or Yarn
* PostgreSQL or Docker

### _Installing_
1. Clone this repository using the clone command: `git clone https://github.com/NathanMBR/blog-typescript.git`
2. Install the dependencies with `npm i` (if you use _NPM_) or `yarn install` (if you use _yarn_)
3. Create a `.env` file in the repository
4. Copy the content of `.example.env` into the `.env` file and edit it with your parameters (be sure to erase the commentaries)

### _Dotenv file configuration_
Here's a little guide to help you to configure your `.env` file.
| **Parameter** | **Description** |
| --- | --- |
| `APP_PORT` | Defines the port where your application will be run. |
| `APP_MODE` | Defines what database you are using - *development* or *production*. Only accepts these two parameters, otherwise will throw an error. |
| `APP_SECRET` | Defines the secret string that encryption processes use. Prefer to use a string that is difficult to discover, such as an encrypted key. |
| `JWT_TOKEN_EXPIRES_IN` | Defines the expiration time of the JWT tokens. [See the `jsonwebtoken` module documentation](https://www.npmjs.com/package/jsonwebtoken) for more information. |
| `PG_HOST*` | Defines the database host URL for access. |
| `PG_PORT*` | Defines the port where your database is running. |
| `PG_USER*` | Defines the username to authenticate into the database. |
| `PG_PASSWORD*` | Defines the password to authenticate into the database. |
| `PG_DB*` | Defines the database name that the API will use. |

*The `_DEV` parameters acts the same way as their correspondents above quoted. The difference between them is that the `_DEV` parameters are used only when the `APP_MODE` is set to *development*.

### _Docker setup_
If you choose to use Docker, all you need to do is to run the composer command: `docker compose up`. You don't need to create a database inside the Postgres image, because it's configured to do that automatically. If you want to use Docker only to isolate the API, you can build an image using Dockerfile, but be sure to configure a PostgreSQL database by your own. After that, you need to run two commands: `docker container ls`, where you'll copy the API container ID, and `docker container exec <API_container_ID> npm run migrate`, to automatically create the tables into the database.

### _PostgreSQL setup_
If you choose to use PostgreSQL, you need to install it in a machine of your preference and create a database by your own. The tables doesn't need to be manually created, since there's a script that does it for you. Run the `npm run migrate` or `yarn run migrate` command to create the tables. After that, build the project with `npm run build` or `yarn run build` and then start it with `npm run start` or `yarn run start`.

## Using the API
After all these steps, the project is supposed to be running. Access the host URL in the application port to start using the API. Before using it, read the *Testing* section below.

## Testing
To run the tests, use the `npm run test` or `yarn run test` commands. Sometimes, some of the tests fails for no apparent reason. If that occurs to you, try to close the terminal you're using and open it again - that solves the problem in the most of the cases.
**WARNING: TESTS TRUNCATE THE DATABASE AFTER EACH TEST SUITE. BE SURE TO ONLY TEST USING A DEVELOPMENT DATABASE.**
