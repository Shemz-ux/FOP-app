import { createEvent, fetchEvents, fetchEventById, updateEvent, removeEvent, fetchActiveEvents, fetchUpcomingEvents } from "../models/events.js";

export const postEvent = (req, res, next) => {
    const newEvent = req.body;
    console.log('📝 Creating event with data:', JSON.stringify(newEvent, null, 2));
    createEvent(newEvent).then((event) => {
        console.log('✅ Event created successfully:', event.event_id);
        res.status(201).send({newEvent: event});
    }).catch((err) => {
        console.error('❌ Error creating event:', err);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        next(err);
    });
};

export const getEvents = (req, res, next) => {
    const { active, upcoming } = req.query;
    
    if (upcoming === 'true') {
        fetchUpcomingEvents().then((events) => {
            res.status(200).send({events: events});
        }).catch((err) => {
            next(err);
        });
    } else if (active === 'true') {
        fetchActiveEvents().then((events) => {
            res.status(200).send({events: events});
        }).catch((err) => {
            next(err);
        });
    } else {
        fetchEvents().then((events) => {
            res.status(200).send({events: events});
        }).catch((err) => {
            next(err);
        });
    }
};

export const getEvent = (req, res, next) => {
    const {event_id} = req.params;
    fetchEventById(event_id).then((event) => {
        res.status(200).send({event: event});
    }).catch((err) => {
        next(err);
    });
};

export const patchEvent = (req, res, next) => {
    const updatedEvent = req.body;
    const {event_id} = req.params;
    updateEvent(updatedEvent, event_id).then((event) => {
        res.status(200).send({event: event});
    }).catch((err) => {
        next(err);
    });
};

export const deleteEvent = (req, res, next) => {
    const {event_id} = req.params;
    removeEvent(event_id).then((msg) => {
        res.status(200).send({msg});
    }).catch((err) => {
        next(err);
    });
};
