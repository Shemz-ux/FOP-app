import express from "express";
import authRouter from "./authentication.js";
import jobseekerRouter from "./jobseekers.js";
const apiRouter = express.Router()

apiRouter.use("/jobseekers", jobseekerRouter);
apiRouter.use("/", authRouter);


export default apiRouter;