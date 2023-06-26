import { Connection, createConnection } from "typeorm";

export async function createDBConnection() {
    return await DBConnectionFactory.getInstance();
}
export async function dbConnection() {
    return (await DBConnectionFactory.getInstance()).dbConnection;
}

export class DBConnectionFactory {
    private static instance: DBConnectionFactory;
    dbConnection: Connection | null;

    private constructor() {
        this.dbConnection = null;
    }

    public static async getInstance() {
        if (!DBConnectionFactory.instance) {
            DBConnectionFactory.instance = new DBConnectionFactory();
            await DBConnectionFactory.instance.setupPostgresConnection();
            console.log('loyalty db-connection object created')
        }
        return DBConnectionFactory.instance;
    }

    private async setupPostgresConnection() {
        this.dbConnection= await createConnection('bite_speed_backend');
    }

}
