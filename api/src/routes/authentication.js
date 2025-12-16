import express from "express";
import AuthenticationController from "../controllers/authentication.js";

const authRouter = express.Router();

authRouter.post("/tokens", AuthenticationController.createToken);

export default authRouter;
