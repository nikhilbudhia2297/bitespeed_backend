import * as http from "http";
import app from "./app";

async function startServer(){

    try{
        const server = http.createServer(app);
        const PORT = 4000;
        server.listen(PORT, ()=>{
            console.log(`server is running on http://localhost:${PORT} `);
        });
    } catch (err : any) {
        console.log(err);
    }
}

startServer();