import express from "express";
import { deleteUser, getUser, getUsers, patchUser, postUser } from "../controllers/users.js";
const userRouter = express.Router();

userRouter
.route("/")
.get(getUsers)
.post(postUser)

userRouter
.route("/:user_id")
.get(getUser)
.patch(patchUser)
.delete(deleteUser)

export default userRouter;