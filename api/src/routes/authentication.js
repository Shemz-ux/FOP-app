import express from "express";
import AuthenticationController from "../controllers/authentication.js";

const authRouter = express.Router();

authRouter.post("/tokens", AuthenticationController.createToken);
authRouter.post("/forgot-password", AuthenticationController.forgotPassword);
authRouter.post("/reset-password", AuthenticationController.resetPassword);

export default authRouter;
