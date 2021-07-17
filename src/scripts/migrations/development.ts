// Migration
import runMigrations from "../../database/migrations";
import { development as connection } from "../../database/connection";
runMigrations(connection);