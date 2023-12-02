import { DataSource } from 'typeorm'

export default new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    entities: [ "src/entity/*.ts"],
    migrations: ["src/migration/*.ts"],
});