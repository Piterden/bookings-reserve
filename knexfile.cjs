const dotenv = require("dotenv");
const { Knex } = require("knex");

dotenv.config();
const env = process.env;

const NODE_ENV = env.NODE_ENV ?? "development";

const knegConfigs = {
    development: {
        client: "pg",
        connection: {
            host: env.POSTGRES_HOST ?? "localhost",
            port: env.POSTGRES_PORT ?? 5432,
            database: env.POSTGRES_DB ?? "postgres",
            user: env.POSTGRES_USER ?? "postgres",
            password: env.POSTGRES_PASSWORD ?? "postgres",
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            stub: 'src/config/knex/migration.stub.js',
            directory: "./src/db/migrations",
            tableName: "migrations",
            extension: "js",
        },
        seeds: {
            stub: 'src/config/knex/seed.stub.js',
            directory: "./src/db/seeds",
            extension: "js",
        },
    },
    production: {
        client: "pg",
        connection: {
            host: env.POSTGRES_HOST,
            port: env.POSTGRES_PORT,
            database: env.POSTGRES_DB,
            user: env.POSTGRES_USER,
            password: env.POSTGRES_PASSWORD,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            stub: 'dist/config/knex/migration.stub.js',
            directory: "./dist/db/migrations",
            tableName: "migrations",
            extension: "js",
        },
        seeds: {
            stub: 'src/config/knex/seed.stub.js',
            directory: "./dist/db/seeds",
            extension: "js",
        },
    },
};

module.exports = knegConfigs[NODE_ENV];
