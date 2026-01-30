import express from "express";
import { deleteEvent, getEvent, getEvents, patchEvent, postEvent } from "../controllers/events.js";
import { getEventRegistrations, exportEventRegistrationsCSV } from "../controllers/event-registrations.js";
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

eventRouter
.route("/:event_id/registrations/export")
.get(adminChecker, exportEventRegistrationsCSV);

export default eventRouter;
