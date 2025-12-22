import { createJob, fetchJobs, fetchJobById, updateJob, removeJob, fetchActiveJobs, fetchJobsByCompany } from "../models/jobs.js";

export const postJob = (req, res, next) => {
    const newJob = req.body;
    createJob(newJob).then((job) => {
        res.status(201).send({newJob: job});
    }).catch((err) => {
        next(err);
    });
};

export const getJobs = (req, res, next) => {
    const { active, company } = req.query;
    
    if (active === 'true') {
        fetchActiveJobs().then((jobs) => {
            res.status(200).send({jobs: jobs});
        }).catch((err) => {
            next(err);
        });
    } else if (company) {
        fetchJobsByCompany(company).then((jobs) => {
            res.status(200).send({jobs: jobs});
        }).catch((err) => {
            next(err);
        });
    } else {
        fetchJobs().then((jobs) => {
            res.status(200).send({jobs: jobs});
        }).catch((err) => {
            next(err);
        });
    }
};

export const getJob = (req, res, next) => {
    const {job_id} = req.params;
    fetchJobById(job_id).then((job) => {
        res.status(200).send({job: job});
    }).catch((err) => {
        next(err);
    });
};

export const patchJob = (req, res, next) => {
    const updatedJob = req.body;
    const {job_id} = req.params;
    updateJob(updatedJob, job_id).then((job) => {
        res.status(200).send({job: job});
    }).catch((err) => {
        next(err);
    });
};

export const deleteJob = (req, res, next) => {
    const {job_id} = req.params;
    removeJob(job_id).then((msg) => {
        res.status(200).send({msg});
    }).catch((err) => {
        next(err);
    });
};
