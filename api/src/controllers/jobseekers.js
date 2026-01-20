import { createJobseeker, fetchJobseekerById, fetchJobseekers, removeJobseeker, updateJobseeker } from "../models/jobseekers.js";
import { incrementSocietyMemberCount } from "../models/societies.js";
import bcrypt from "bcrypt";

export const postJobseeker = async (req, res, next) => {
    try {
        const newJobseeker = req.body;
        
        // Validate password requirements
        if (!newJobseeker.password) {
            return res.status(400).json({ message: "Password is required" });
        }
        
        if (newJobseeker.password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
        
        // Hash the password
        const saltRounds = 12;
        const password_hash = await bcrypt.hash(newJobseeker.password, saltRounds);
        
        // Replace password with hash
        const jobseekerData = {
            ...newJobseeker,
            password_hash,
        };
        delete jobseekerData.password; // Remove plaintext password
        
        const jobseeker = await createJobseeker(jobseekerData);
        
        // Increment society member count if society is selected
        if (jobseeker.society && jobseeker.society !== 'None') {
            await incrementSocietyMemberCount(jobseeker.society);
        }
        
        res.status(201).send({newJobseeker: jobseeker});
    } catch (err) {
        next(err);
    }
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

export const patchJobseeker = async (req, res, next) => {
    try {
        const updatedJobseeker = req.body;
        const {jobseeker_id} = req.params;
        
        // If password is being updated, hash it
        if (updatedJobseeker.password) {
            if (updatedJobseeker.password.length < 8) {
                return res.status(400).json({ message: "Password must be at least 8 characters long" });
            }
            
            const saltRounds = 12;
            updatedJobseeker.password_hash = await bcrypt.hash(updatedJobseeker.password, saltRounds);
            delete updatedJobseeker.password; // Remove plaintext password
        }
        
        const jobseeker = await updateJobseeker(updatedJobseeker, jobseeker_id);
        res.status(200).send({jobseeker: jobseeker});
    } catch (err) {
        next(err);
    }
};

export const deleteJobseeker = (req, res, next) => {
    const {jobseeker_id} = req.params;
    removeJobseeker(jobseeker_id).then((msg) => {
        res.status(200).send({msg});
    }).catch((err) => {
        next(err);
    });
};
