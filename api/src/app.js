import express from "express";
import cors from "cors";
import apiRouter from "./routes/api-routers.js";
import { customError, psqlError, serverError } from "./middleware/errorHandlers.js";
const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5001',
  'http://localhost:3000',
  'https://fop-app.vercel.app',
  'https://www.foperspectives.co.uk',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition']
}));

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
