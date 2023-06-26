import {createExpressServer} from "routing-controllers";
import express from "express";

const app : express.Application = createExpressServer({
    cors : {
        origin : ["http://localhost:3001"],
        methods: "GET,POST,PATCH, DELETE",
        credentials: true
    },
    controllers : [__dirname + "/controllers/**"]
});

app.use(express.json());

export default app;