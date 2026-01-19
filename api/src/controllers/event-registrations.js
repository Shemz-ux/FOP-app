import { fetchEventRegistrations } from "../models/event-registrations.js";

export const getEventRegistrations = (req, res, next) => {
    const { event_id } = req.params;
    
    fetchEventRegistrations(event_id)
        .then((registrations) => {
            res.status(200).send({ registrations });
        })
        .catch((err) => {
            next(err);
        });
};
