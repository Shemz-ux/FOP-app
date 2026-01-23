import express from "express";
import authRouter from "./authentication.js";
import jobseekerRouter from "./jobseekers.js";
import societyRouter from "./societies.js";
import jobRouter from "./jobs.js";
import eventRouter from "./events.js";
import jobseekerDashboardRouter from "./jobseeker-dashboard.js";
import societyDashboardRouter from "./society-dashboard.js";
import jobsAdvancedRouter from "./jobs-advanced.js";
import eventsAdvancedRouter from "./events-advanced.js";
import adminRouter from "./admin.js";
import resourcesRouter from "./resources.js";
import mediaUploadRouter from "./mediaUpload.js";
import cvUploadRouter from "./cvUpload.js";
import contactRouter from "./contact.js";

const apiRouter = express.Router();
// Advanced filtering routes
apiRouter.use("/jobs", jobsAdvancedRouter);     // Handles /jobs/search, /jobs/filters
apiRouter.use("/events", eventsAdvancedRouter); // Handles /events/search, /events/filters

// Core entity routes
apiRouter.use("/jobseekers", jobseekerRouter);
apiRouter.use("/societies", societyRouter);
apiRouter.use("/jobs", jobRouter);
apiRouter.use("/events", eventRouter);

// Authentication routes
apiRouter.use("/", authRouter);

// Admin routes (analytics + user management)
apiRouter.use("/admin", adminRouter);

// Resources routes
apiRouter.use("/resources", resourcesRouter);

// Media upload routes
apiRouter.use("/media", mediaUploadRouter);

// CV upload routes
apiRouter.use("/cv", cvUploadRouter);

// Contact form routes
apiRouter.use("/contact", contactRouter);

// Dashboard routes 
apiRouter.use("/", jobseekerDashboardRouter);  // Handles /jobseekers/:id/dashboard, etc.
apiRouter.use("/", societyDashboardRouter);    // Handles /societies/:id/dashboard, etc.


export default apiRouter;