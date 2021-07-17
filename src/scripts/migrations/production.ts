// Migration
import runMigrations from "../../database/migrations";
import { production as connection } from "../../database/connection";
runMigrations(connection);