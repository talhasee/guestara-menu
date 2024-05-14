import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
);

app.use(
    express.json({
        limit: "50mb",
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "50mb",
    })
);

app.use(cookieParser());


//Routes
import categoryRouter from "./routes/category.routes.js";

app.use("/api/v1/category", categoryRouter);


export { app };