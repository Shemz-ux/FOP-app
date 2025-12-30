import express from "express";
import { deleteEvent, getEvent, getEvents, patchEvent, postEvent } from "../controllers/events.js";
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

export default eventRouter;
