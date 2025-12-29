import { createSociety, fetchSocieties, fetchSocietyById, updateSociety, removeSociety } from "../models/societies.js";
import bcrypt from "bcrypt";

export const postSociety = async (req, res, next) => {
    try {
        const newSociety = req.body;
        
        // Validate password requirements
        if (!newSociety.password) {
            return res.status(400).json({ message: "Password is required" });
        }
        
        if (newSociety.password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
        
        // Hash the password
        const saltRounds = 12;
        const password_hash = await bcrypt.hash(newSociety.password, saltRounds);
        
        // Replace password with hash
        const societyData = {
            ...newSociety,
            password_hash,
        };
        delete societyData.password; // Remove plaintext password
        
        const society = await createSociety(societyData);
        res.status(201).send({newSociety: society});
    } catch (err) {
        next(err);
    }
};

export const getSocieties = (req, res, next) => {
    fetchSocieties().then((societies) => {
        res.status(200).send({societies: societies});
    }).catch((err) => {
        next(err);
    });
};

export const getSociety = (req, res, next) => {
    const {society_id} = req.params;
    fetchSocietyById(society_id).then((society) => {
        res.status(200).send({society: society});
    }).catch((err) => {
        next(err);
    });
};

export const patchSociety = async (req, res, next) => {
    try {
        const updatedSociety = req.body;
        const {society_id} = req.params;
        
        // If password is being updated, hash it
        if (updatedSociety.password) {
            if (updatedSociety.password.length < 8) {
                return res.status(400).json({ message: "Password must be at least 8 characters long" });
            }
            
            const saltRounds = 12;
            updatedSociety.password_hash = await bcrypt.hash(updatedSociety.password, saltRounds);
            delete updatedSociety.password; // Remove plaintext password
        }
        
        const society = await updateSociety(updatedSociety, society_id);
        res.status(200).send({society: society});
    } catch (err) {
        next(err);
    }
};

export const deleteSociety = (req, res, next) => {
    const {society_id} = req.params;
    removeSociety(society_id).then((msg) => {
        res.status(200).send({msg});
    }).catch((err) => {
        next(err);
    });
};