import express from "express";
import authRouter from "./authentication.js";
import jobseekerRouter from "./jobseekers.js";
import societyRouter from "./societies.js";
import jobRouter from "./jobs.js";
import eventRouter from "./events.js";
import jobseekerDashboardRouter from "./jobseeker-dashboard.js";
import societyDashboardRouter from "./society-dashboard.js";

const apiRouter = express.Router();

// Core entity routes
apiRouter.use("/jobseekers", jobseekerRouter);
apiRouter.use("/societies", societyRouter);
apiRouter.use("/jobs", jobRouter);
apiRouter.use("/events", eventRouter);

// Authentication routes
apiRouter.use("/", authRouter);

// Dashboard routes (clearly separated by user type)
apiRouter.use("/", jobseekerDashboardRouter);  // Handles /jobseekers/:id/dashboard, etc.
apiRouter.use("/", societyDashboardRouter);    // Handles /societies/:id/dashboard, etc.


export default apiRouter;