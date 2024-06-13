import express from "express";
import {
  login,
  register,
  sendForgetPassMail,
} from "../controllers/user.controller.js";

const userRoutes = express.Router();

userRoutes.route("/register").post(register);

userRoutes.route("/login").post(login);

userRoutes.route("/send-forget-mail").post(sendForgetPassMail);

export default userRoutes;
