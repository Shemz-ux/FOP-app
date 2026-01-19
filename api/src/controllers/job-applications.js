import { fetchJobApplications } from "../models/job-applications.js";

export const getJobApplications = (req, res, next) => {
    const { job_id } = req.params;
    
    fetchJobApplications(job_id)
        .then((applications) => {
            res.status(200).send({ applications });
        })
        .catch((err) => {
            next(err);
        });
};
