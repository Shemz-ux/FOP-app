import express from "express";
import authRouter from "./authentication.js";
import jobseekerRouter from "./jobseekers.js";
import societyRouter from "./societies.js";
const apiRouter = express.Router()

apiRouter.use("/jobseekers", jobseekerRouter);
apiRouter.use("/", authRouter);
apiRouter.use("/societies", societyRouter);


export default apiRouter;