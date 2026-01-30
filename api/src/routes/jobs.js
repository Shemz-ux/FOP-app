import express from "express";
import { deleteJob, getJob, getJobs, patchJob, postJob } from "../controllers/jobs.js";
import { getJobApplications, exportJobApplicationsCSV } from "../controllers/job-applications.js";
import adminChecker from "../middleware/adminChecker.js";

const jobRouter = express.Router();

jobRouter
.route("/")
.get(getJobs)
.post(adminChecker, postJob);

jobRouter
.route("/:job_id")
.get(getJob)
.patch(adminChecker, patchJob)
.delete(adminChecker, deleteJob);

jobRouter
.route("/:job_id/applications")
.get(adminChecker, getJobApplications);

jobRouter
.route("/:job_id/applications/export")
.get(adminChecker, exportJobApplicationsCSV);

export default jobRouter;
