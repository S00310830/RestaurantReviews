import express, { Application, Request, Response } from "express";

const app : Application = express();

app.get("/ping", async (_req : Request, res: Response) => {
    res.json({
    message: "This is the restaurant review API, ping test!",
    });
});
