import express from "express";
import { deleteJobseeker, getJobseeker, getJobseekers, patchJobseeker, postJobseeker } from "../controllers/jobseekers.js";

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

export default jobseekerRouter;
