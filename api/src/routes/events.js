import express from "express";
import { deleteEvent, getEvent, getEvents, patchEvent, postEvent } from "../controllers/events.js";

const eventRouter = express.Router();

eventRouter
.route("/")
.get(getEvents)
.post(postEvent);

eventRouter
.route("/:event_id")
.get(getEvent)
.patch(patchEvent)
.delete(deleteEvent);

export default eventRouter;
