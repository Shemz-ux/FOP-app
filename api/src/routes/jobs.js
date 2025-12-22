import express from "express";
import { deleteJob, getJob, getJobs, patchJob, postJob } from "../controllers/jobs.js";

const jobRouter = express.Router();

jobRouter
.route("/")
.get(getJobs)
.post(postJob);

jobRouter
.route("/:job_id")
.get(getJob)
.patch(patchJob)
.delete(deleteJob);

export default jobRouter;
