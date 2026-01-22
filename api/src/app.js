import express from "express";
import cors from "cors";
import apiRouter from "./routes/api-routers.js";
import { customError, psqlError, serverError } from "./middleware/errorHandlers.js";
const app = express();

const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite dev server
    'http://localhost:5174', // Alternative Vite port
    'https://fop-app.vercel.app' // Production frontend
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

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
