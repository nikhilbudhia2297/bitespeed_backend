const SnakeNamingStrategy = require('typeorm-naming-strategies').SnakeNamingStrategy;
const nodeEnvironment = process.env.NODE_ENV || "develop";

module.exports = [{
    name : 'test',
    type : 'postgres',
    host: process.env.DB_HOST || '',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USER || '',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || '',
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
            ? ["src/subscriber/**/*.ts", "node_modules/kafka_publisher/lib/subscriber/*.js"]
            : ["dist/subscriber/**/*.js", "node_modules/kafka_publisher/lib/subscriber/*.js"]
    ,
    cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber'
    },
    extra: {
        poolSize: process.env.SERVICE_TYPE == "consumer" ? 100 : 50,
        connectionTimeoutMillis: 2000
    },
    cache: {
        type: 'redis',
        options: {
            url: process.env.REDIS_CACHE
        }
    },
    namingStrategy: new SnakeNamingStrategy()
}]