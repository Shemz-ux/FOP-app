import express from "express";
import { deleteEvent, getEvent, getEvents, patchEvent, postEvent } from "../controllers/events.js";
import { getEventRegistrations } from "../controllers/event-registrations.js";
import adminChecker from "../middleware/adminChecker.js";

const eventRouter = express.Router();

eventRouter
.route("/")
.get(getEvents)
.post(adminChecker, postEvent);

eventRouter
.route("/:event_id")
.get(getEvent)
.patch(adminChecker, patchEvent)
.delete(adminChecker, deleteEvent);

eventRouter
.route("/:event_id/registrations")
.get(adminChecker, getEventRegistrations);

export default eventRouter;
