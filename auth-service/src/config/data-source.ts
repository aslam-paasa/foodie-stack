import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../entity/User"
import { Config } from "./"
import { RefreshToken } from "../entity/RefreshToken"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: Config.DB_HOST ?? "localhost",
    port: Number(Config.DB_PORT) || 5432,
    username: Config.DB_USERNAME ?? "root",
    password: Config.DB_PASSWORD ?? "root",
    database: Config.DB_NAME ?? "test",
    synchronize: false, // don't use this in prod
    logging: false,
    entities: [User, RefreshToken],
    migrations: [],
    subscribers: [],
})
