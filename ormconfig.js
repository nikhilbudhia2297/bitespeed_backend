const SnakeNamingStrategy = require('typeorm-naming-strategies').SnakeNamingStrategy;
const nodeEnvironment = process.env.NODE_ENV || "develop";

module.exports = [{
    name : 'default',
    type : 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '8143',
    database: process.env.DB_NAME || 'bite-speed',
    synchronize: false,
    migrationsRun: false,
    logging: process.env.NODE_ENV !== 'production',
    "entities": [
        nodeEnvironment === "develop" ? "src/entities/**/*.ts" : "dist/entities/**/*.js"
    ],
    "migrations": [
        nodeEnvironment === "develop" ? "src/migration/**/*.ts" : "dist/migration/**/*.js"
    ],
    "subscribers":
        nodeEnvironment === "develop"
            ? ["src/subscriber/**/*.ts"]
            : ["dist/subscriber/**/*.js"]
    ,
    cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber'
    },
    namingStrategy: new SnakeNamingStrategy()
}]