import express from "express";
import {
  getAllUsers,
  getPendingUsers,
  login,
  register,
  sendForgetPassMail,
  updatePassword,
  verifyForgetPassToken,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRoutes = express.Router();

// register
userRoutes.route("/register").post(register);

// login
userRoutes.route("/login").post(login);

//profile
userRoutes.route("/profile").get(authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json(user);
});

// reset password
userRoutes.route("/reset-password").post(sendForgetPassMail);

// verify reset password token
userRoutes.route("/verify-reset-password").get(verifyForgetPassToken);

// change password
userRoutes.route("/change-password").post(updatePassword);

// get all users
userRoutes.route("/all-users").get(authMiddleware, getAllUsers);

// get all pending users
userRoutes.route("/pending-users").get(authMiddleware, getPendingUsers);

export default userRoutes;
