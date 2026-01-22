import express from "express";
import cors from "cors";
import apiRouter from "./routes/api-routers.js";
import { customError, psqlError, serverError } from "./middleware/errorHandlers.js";
const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);


// endpoints.json file
app.get("/", (req, res) => {
    res.sendFile('endpoints.json', { root: '.' });
});


// catch all errors
app.use((req, res, next) => {
    return res.status(404).send({msg: 'Invalid request!'})
});

// error handlers 
app.use(psqlError)

app.use(customError)

app.use(serverError)

export default app;
