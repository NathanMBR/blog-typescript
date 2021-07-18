import runMigrations from "../database/migrations";
runMigrations()
    .then((successMsg) => console.log(successMsg))
    .catch((error) => console.error(error))
    .finally(() => process.exit(0));
