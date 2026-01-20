import express from "express";
import { deleteSociety, getSociety, getSocieties, getSocietyNames, patchSociety, postSociety } from "../controllers/societies.js";

const societyRouter = express.Router();

societyRouter
.route("/")
.get(getSocieties)
.post(postSociety);

societyRouter
.route("/names")
.get(getSocietyNames);

societyRouter
.route("/:society_id")
.get(getSociety)
.patch(patchSociety)
.delete(deleteSociety);

export default societyRouter;
