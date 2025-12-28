import express from "express";
import authRouter from "./authentication.js";
import jobseekerRouter from "./jobseekers.js";
import societyRouter from "./societies.js";
import jobRouter from "./jobs.js";
import eventRouter from "./events.js";
import dashboardRouter from "./dashboard.js";
const apiRouter = express.Router()

apiRouter.use("/jobseekers", jobseekerRouter);
apiRouter.use("/", authRouter);
apiRouter.use("/societies", societyRouter);
apiRouter.use("/jobs", jobRouter);
apiRouter.use("/events", eventRouter);
apiRouter.use("/", dashboardRouter);


export default apiRouter;