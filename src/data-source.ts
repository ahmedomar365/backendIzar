import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Product } from "./entity/Product"
import { DB_PASS, DB_URL } from "./config"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_URL,
    ssl: true,
    port: 5432,
    username: "izart_user",
    password: DB_PASS,
    database: "izart",
    synchronize: true,
    logging: false,
    entities: [User, Product],
    migrations: [],
    subscribers: [],
})
