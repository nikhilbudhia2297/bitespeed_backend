import { Connection, createConnection } from "typeorm";

export async function createDBConnection() {
    return await DbConnectionFactory.getInstance();
}
export async function dbConnection() {
    return (await DbConnectionFactory.getInstance()).dbConnection;
}

export class DbConnectionFactory {
    private static instance: DbConnectionFactory;
    dbConnection: Connection;

    private constructor() {
    }

    public static async getInstance() {
        if (!DbConnectionFactory.instance) {
            DbConnectionFactory.instance = new DbConnectionFactory();
            await DbConnectionFactory.instance.setupPostgresConnection();
            console.log('loyalty db-connection object created')
        }
        return DbConnectionFactory.instance;
    }

    private async setupPostgresConnection() {
        this.dbConnection= await createConnection();
    }

}
