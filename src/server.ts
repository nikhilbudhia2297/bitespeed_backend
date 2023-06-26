import * as http from "http";
import app from "./app";
import {createDBConnection} from "./utils/DBConnectionFactory";

async function startServer(){

    try{
        await createDBConnection();
        const server = http.createServer(app);
        const PORT = 3000;
        server.listen(PORT, ()=>{
            console.log(`server is running on http://localhost:${PORT} `);
        });
    } catch (err : any) {
        console.log(err);
    }
}

startServer();