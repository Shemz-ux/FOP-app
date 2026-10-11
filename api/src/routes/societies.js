import express from "express";
import { deleteSociety, getSociety, getSocieties, getSocietyNames, patchSociety, postSociety, exportSocietiesCSV, getOwnSocietyMembers } from "../controllers/societies.js";
import adminChecker from "../middleware/adminChecker.js";
import societyChecker from "../middleware/societyChecker.js";

const societyRouter = express.Router();

societyRouter
.route("/")
.get(getSocieties)
.post(postSociety);

societyRouter
.route("/names")
.get(getSocietyNames);

// Declared before /:society_id so "me" is never read as an id.
// No id in the path: societyChecker takes it from the caller's token.
societyRouter
.route("/me/members")
.get(societyChecker, getOwnSocietyMembers);

societyRouter
.route("/:society_id")
.get(getSociety)
.patch(patchSociety)
.delete(deleteSociety);

societyRouter
.route("/export/csv")
.get(adminChecker, exportSocietiesCSV);

export default societyRouter;
