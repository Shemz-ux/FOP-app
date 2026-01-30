import express from "express";
import { deleteJobseeker, getJobseeker, getJobseekers, patchJobseeker, postJobseeker, exportJobseekersCSV } from "../controllers/jobseekers.js";
import adminChecker from "../middleware/adminChecker.js";

const jobseekerRouter = express.Router();

jobseekerRouter
.route("/")
.get(getJobseekers)
.post(postJobseeker);

jobseekerRouter
.route("/:jobseeker_id")
.get(getJobseeker)
.patch(patchJobseeker)
.delete(deleteJobseeker);

jobseekerRouter
.route("/export/csv")
.get(adminChecker, exportJobseekersCSV);

export default jobseekerRouter;
