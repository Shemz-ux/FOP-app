import express from "express";
import adminChecker from "../middleware/adminChecker.js";

// Import analytics controllers
import {
    getJobApplicationStats,
    getJobApplicationsByJobId,
    getEventApplicationStats,
    getEventApplicationsByEventId,
    getStudentsByGender,
    getStudentsByUniversity,
    getStudentsBySociety,
    getStudentsEligibleForFreeMeals,
    getFirstGenStudents,
    getStudentsByEducationStatus,
    getUserByName,
    getAnalyticsSummary
} from "../controllers/admin-analytics.js";

// Import user management controllers
import {
    getAdminUsers,
    getAdminUser,
    postAdminUser,
    patchAdminUser,
    deactivateAdmin,
    deleteAdminUser
} from "../controllers/admin-users.js";

const adminRouter = express.Router();

// Apply admin middleware to all routes
adminRouter.use(adminChecker);

// Analytics summary
adminRouter.get("/summary", getAnalyticsSummary);

// Job application analytics
adminRouter.get("/jobs/applications", getJobApplicationStats);
adminRouter.get("/jobs/:job_id/applications", getJobApplicationsByJobId);

// Event application analytics
adminRouter.get("/events/applications", getEventApplicationStats);
adminRouter.get("/events/:event_id/applications", getEventApplicationsByEventId);

// Jobseeker filtering endpoints
adminRouter.get("/jobseekers/gender/:gender", getStudentsByGender);
adminRouter.get("/jobseekers/university/:university", getStudentsByUniversity);
adminRouter.get("/jobseekers/society/:society", getStudentsBySociety);
adminRouter.get("/jobseekers/free-meals", getStudentsEligibleForFreeMeals);
adminRouter.get("/jobseekers/first-gen", getFirstGenStudents);
adminRouter.get("/jobseekers/education/:education_level", getStudentsByEducationStatus);
adminRouter.get("/users/name/:name", getUserByName);

// Admin user management routes
adminRouter.get("/users", getAdminUsers);
adminRouter.get("/users/:admin_id", getAdminUser);
adminRouter.post("/users", postAdminUser);
adminRouter.patch("/users/:admin_id", patchAdminUser);
adminRouter.patch("/users/:admin_id/deactivate", deactivateAdmin);
adminRouter.delete("/users/:admin_id", deleteAdminUser);

export default adminRouter;
