import express from "express";
import { deleteJob, getJob, getJobs, patchJob, postJob } from "../controllers/jobs.js";
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

export default jobRouter;
