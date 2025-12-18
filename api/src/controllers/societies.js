import { createSociety, fetchSocieties, fetchSocietyById, updateSociety, removeSociety } from "../models/societies.js";

export const postSociety = (req, res, next) => {
    const newSociety = req.body;
    createSociety(newSociety).then((society) => {
        res.status(201).send({newSociety: society});
    }).catch((err) => {
        next(err);
    });
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

export const patchSociety = (req, res, next) => {
    const updatedSociety = req.body;
    const {society_id} = req.params;
    updateSociety(updatedSociety, society_id).then((society) => {
        res.status(200).send({society: society});
    }).catch((err) => {
        next(err);
    });
};

export const deleteSociety = (req, res, next) => {
    const {society_id} = req.params;
    removeSociety(society_id).then((msg) => {
        res.status(200).send({msg});
    }).catch((err) => {
        next(err);
    });
};