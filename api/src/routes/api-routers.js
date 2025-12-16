import express from "express";
import userRouter from "./users.js";
import authRouter from "./authentication.js";
const apiRouter = express.Router()


apiRouter.use("/users", userRouter);
apiRouter.use("/", authRouter);


export default apiRouter;