import express from "express";
import { deleteSociety, getSociety, getSocieties, getSocietyNames, patchSociety, postSociety, exportSocietiesCSV } from "../controllers/societies.js";
import adminChecker from "../middleware/adminChecker.js";

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

societyRouter
.route("/export/csv")
.get(adminChecker, exportSocietiesCSV);

export default societyRouter;
