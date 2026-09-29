```js
/**
 * DATABASE MIGRATION (TypeORM + PostgreSQL)
*/

/**
 * WHAT IS A MIGRATION?
 * - A migration is a file that holds the SQL needed to change
 *   the database (create tables, add columns, etc).
 * - It is like "git" for your database. Every change is saved
 *   in a file, so you can apply it or undo it later.
 * 
 * 
 * QUICK CHEAT SHEET (READ THIS FIRST)
 * +---------------------------------------------------+---------+---------------------+
 * | Command                                           | Needs -d| Path needed?        |
 * +---------------------------------------------------+---------+---------------------+
 * | npm run migration:generate -- src/migration/init  | YES     | YES (new file name) |
 * | npm run migration:create -- src/migration/seed    | NO      | YES (new file name) |
 * | npm run migration:run                             | YES     | NO                  |
 * | npm run migration:revert                          | YES     | NO                  |
 * +---------------------------------------------------+---------+---------------------+
 * 
 * Note:
 * - "generate" and "create" take a path, because they CREATE a new file.
 * - "run" and "revert" find the migration files by themselves
 *   using the "migrations" setting in data-source.ts.
 * - "-d" (data source) is already written inside the package.json
 *   scripts. Never type it again in the terminal.
 * - "create" does NOT use -d at all (it never connects to the database).
*/

/**
 * STEP 1: START POSTGRES IN DOCKER
 * - Check if the container is running: docker ps
 * - If it is not listed, start it    : docker start mernpg-container
 * 
 * First time only (create the container):
 * - Postgres 18+ needs the volume at /var/lib/postgresql
 *   (NOT /var/lib/postgresql/data), otherwise the container exits.
 * - Command (one line, works in PowerShell):
 *   docker run --name mernpg-container -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -v mernpgdata:/var/lib/postgresql -p 5432:5432 -d postgres
 * 
 * - If the container exits, read the reason:
 *   docker logs mernpg-container
*/

/**
 * STEP 2: CREATE THE DATABASE
 * - The name must match DB_NAME in .env.dev.
 * - List databases:
 *   docker exec -it mernpg-container psql -U root -c "\l"
 * 
 * - Create it if it is missing:
 *   docker exec -it mernpg-container psql -U root -c "CREATE DATABASE mernstack_auth_service;"
*/

/**
 * STEP 3: TURN OFF synchronize (VERY IMPORTANT)
 * - In src/config/data-source.ts set: synchronize: false,
 * - Why? 
 *   - When synchronize is true, TypeORM creates the tables by
 *     itself every time it connects. 
 *   - Then when you generate a migration, it sees no difference
 *     and says:
 * 
 *    "No changes in database schema were found".
 *    Use either synchronize OR migrations, never both.
*/

/**
 * STEP 4: KEEP THE DATABASE EMPTY BEFORE THE FIRST MIGRATION
 * - If tables were already created by synchronize, wipe them
 *   (only on a dev database, all data will be lost!):
 * - Command:
 *   docker exec -it mernpg-container psql -U root -d mernstack_auth_service -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
 * 
 * - Check it is empty (should say "Did not find any relations"):
 * - Command:  
 *   docker exec -it mernpg-container psql -U root -d mernstack_auth_service -c "\dt"
*/

/**
 * STEP 5: ADD SCRIPTS IN package.json
 * "migration:generate": "typeorm-ts-node-commonjs migration:generate -d src/config/data-source.ts",
 * "migration:create":   "typeorm-ts-node-commonjs migration:create",
 * "migration:run":      "typeorm-ts-node-commonjs migration:run -d src/config/data-source.ts",
 * "migration:revert":   "typeorm-ts-node-commonjs migration:revert -d src/config/data-source.ts"
 * 
 * NOTE: 
 * - "-d src/config/data-source.ts" is already inside generate, run
 *   and revert. So do NOT pass -d or --dataSource again in the
 *   terminal, or you will get "Unknown argument".
 * - "migration:create" has NO -d. It only makes an empty file.
 *   If you add -d to it, TypeORM will show an error.
*/

/**
 * STEP 6: GENERATE THE MIGRATION FILE (AUTO SQL)
 * - TypeORM compares your entities (User, RefreshToken) with the
 *   database and writes the SQL into a file.
 * - Command:
 *   npm run migration:generate -- src/migration/init
 * 
 * Note:
 * - The "--" is needed so npm passes the path to the script.
 * - "init" is just the name of the file. Use a clear name
 *   like init, add-phone-column, create-orders-table, etc.
 * - A file like src/migration/1234567890-init.ts is created.
 * - Open it and check that it has CREATE TABLE statements.
*/

/**
 * STEP 6B: CREATE AN EMPTY MIGRATION FILE (WRITE SQL YOURSELF)
 * - Use this for things TypeORM cannot detect from entities,
 *   like inserting seed data (an admin user) or custom SQL.
 * - Command:
 *   npm run migration:create -- src/migration/seed-admin-user
 * 
 * - It makes a file like src/migration/1234567890-seed-admin-user.ts
 *   with two empty methods:
 *   - up()   -> write the SQL that APPLIES the change
 *   - down() -> write the SQL that UNDOES the change
 * 
 * - After writing your SQL, apply it with: npm run migration:run
 * 
 * generate vs create:
 * - generate = TypeORM writes the SQL for you (needs -d, needs DB).
 * - create   = empty file, you write the SQL (no -d, no DB needed).
*/

/**
 * STEP 7: RUN THE MIGRATION
 * - This applies the SQL and creates the tables.
 * - DO NOT add any path after it.
 * - Command: npm run migration:run
*/

/**
 * STEP 8: VERIFY IT WORKED
 * - Command:  
 *   docker exec -it mernpg-container psql -U root -d mernstack_auth_service -c "\dt"
 * 
 * - You should see these tables: user, refresh_token, migrations
 *   ("migrations" is a table TypeORM uses to remember which
 *   migrations have already been run.)
*/

/**
 * STEP 9: UNDO THE LAST MIGRATION (IF NEEDED)
 * - Command: npm run migration:revert
 * - It undoes only the last migration. Run it again to undo one more.
 * - It uses the down() method of the migration file.
 * 
 * 
 * EVERY TIME YOU CHANGE AN ENTITY LATER
 * 1. Edit the entity (for example, add a new column).
 * 2. npm run migration:generate -- src/migration/add-something
 * 3. npm run migration:run
 * 4. Check with \dt or in pgAdmin.
 * 
 * Note:
 * - No need to wipe the database again. 
 * - That was only for the first migration.
*/

/**
 * COMMON PROBLEMS AND FIXES
 * 1. "Missing required argument: dataSource"
 *    -> Put -d src/config/data-source.ts inside the package.json script.
 * 
 * 2. "No changes in database schema were found"
 *    -> synchronize is still true, or the tables already exist.
 *       Set synchronize: false and reset the schema (Step 4).
 * 
 * 3. "Unknown argument: src/config/data-source.ts"
 *    -> The data source path was passed twice. Run only:
 *       npm run migration:generate -- src/migration/init
 * 
 * 4. "Unknown argument: src/migration/migration" (on migration:run)
 *    -> You gave a path to migration:run. It does not take one.
 *       Run only: npm run migration:run
 * 
 * 5. "No migrations are pending"
 *    -> The migration was already applied, OR TypeORM cannot find
 *       the file. Check that the file exists in src/migration/ and
 *       that data-source.ts has: migrations: ["src/migration/*.ts"]
 * 
 * 6. Docker container exits right away (Postgres 18+)
 *    -> Use -v mernpgdata:/var/lib/postgresql, or pin an older
 *       image like postgres:17 (with the old /data path).
 * 
 * 7. Tests fail with "relation does not exist"
 *    -> synchronize is now false, so tables are not auto-created.
 *       Run migrations in test setup: await AppDataSource.runMigrations()
 *       or use: synchronize: Config.NODE_ENV === 'test'
 * 
 * 8. Connecting to the wrong database
 *    -> A local Windows Postgres may be using port 5432 too.
 *       Stop it, or use -p 5433:5432 and change DB_PORT in .env.dev.
 * 
 * 9. The pg "DeprecationWarning" message
 *    -> Harmless. Ignore it.
 * 
 * 10. "Unknown argument: dataSource" (on migration:create)
 *    -> migration:create does not accept -d. Remove it from the
 *       script: "migration:create": "typeorm-ts-node-commonjs migration:create"
*/
```