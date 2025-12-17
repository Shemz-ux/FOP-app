import { createJobseeker, fetchJobseekerById, fetchJobseekers, removeJobseeker, updateJobseeker } from "../models/jobseekers.js";

export const postJobseeker = (req, res, next) => {
    const newJobseeker = req.body;
    createJobseeker(newJobseeker).then((jobseeker) => {
        res.status(201).send({newJobseeker: jobseeker});
    }).catch((err) => {
        next(err);
    });
};

export const getJobseekers = (req, res, next) => {
    fetchJobseekers().then((jobseekers) => {
        res.status(200).send({jobseekers: jobseekers});
    }).catch((err) => {
        next(err);
    });
};

export const getJobseeker = (req, res, next) => {
    const {jobseeker_id} = req.params;
    fetchJobseekerById(jobseeker_id).then((jobseeker) => {
        res.status(200).send({jobseeker: jobseeker});
    }).catch((err) => {
        next(err);
    });
};

export const patchJobseeker = (req, res, next) => {
    const updatedJobseeker = req.body;
    const {jobseeker_id} = req.params;
    updateJobseeker(updatedJobseeker, jobseeker_id).then((jobseeker) => {
        res.status(200).send({jobseeker: jobseeker});
    }).catch((err) => {
        next(err);
    });
};

export const deleteJobseeker = (req, res, next) => {
    const {jobseeker_id} = req.params;
    removeJobseeker(jobseeker_id).then((msg) => {
        res.status(200).send({msg});
    }).catch((err) => {
        next(err);
    });
};
