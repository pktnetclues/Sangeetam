import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Yup from "yup";
import User from "../models/auth/user.model.js";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  updatePassSchema,
} from "../schema/user.schema.js";
import {
  forgetPassMailContent,
  registerEmailToAdmin,
  registerEmailToUser,
  sendEmail,
} from "../utils/mail.js";

import crypto from "crypto";
import forgetPassToken from "../models/auth/token.model.js";

/*
  Register
*/
const register = async (req, res) => {
  try {
    await registerSchema.validate(req.body, { abortEarly: false });

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      const adminEmailContent = registerEmailToAdmin({
        name,
        email,
        dashboardLink: `http://localhost:5173/admin/dashboard`,
      });
      await sendEmail({
        email: process.env.GMAIL_ID,
        subject: "Approval: New User Registration",
        mailgenContent: adminEmailContent,
      });

      // Send registration success email to user
      const userEmailContent = registerEmailToUser({ name, email });
      await sendEmail({
        email,
        subject: "Registration Success",
        mailgenContent: userEmailContent,
      });
    }

    return res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return res.status(400).json({ message: error.errors });
    }
    return res.status(500).json({ message: error.message });
  }
};

/*
  Login
*/
const login = async (req, res) => {
  try {
    await loginSchema.validate(req.body, { abortEarly: false });
    const { email, password } = req.body;

    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      return res.status(400).json({ message: "user does not exist" });
    }

    if (existingUser.isDeleted === true) {
      return res
        .status(400)
        .json({ message: "User is deleted by admin contact admin" });
    }

    if (existingUser.status === "inactive") {
      return res
        .status(400)
        .json({ message: "User is in-active contact admin" });
    }

    if (existingUser.isApproved === false) {
      return res
        .status(400)
        .json({ message: "Admin has not approved user, please contact admin" });
    }

    const comparePassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!comparePassword) {
      return res.status(400).json({ message: "Invalid Password" });
    } else {
      const generateJwtToken = jwt.sign(
        {
          userid: existingUser.userId,
          email: existingUser.email,
          name: existingUser.name,
          isAdmin: existingUser.isAdmin,
          isApproved: existingUser.isApproved,
          status: existingUser.status,
          createdAt: existingUser.createdAt,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      return res
        .status(200)
        .cookie("authToken", generateJwtToken, {
          secure: true,
          httpOnly: true,
          sameSite: "none",
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })
        .json({ message: "success", isAdmin: existingUser.isAdmin });
    }
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

/* 
  Send Forget Password Mail
*/
const sendForgetPassMail = async (req, res) => {
  try {
    await emailSchema.validate(req.body, { abortEarly: false });

    const { email } = req.body;

    const existingUser = await User.findOne({ where: { email: email } });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const token = crypto.randomInt(10000, 999999);

    const saveTokenInDB = await forgetPassToken.create({
      email: existingUser.email,
      token: token,
    });

    if (saveTokenInDB) {
      await sendEmail({
        email: existingUser.email,
        subject: "Password Reset Request",
        mailgenContent: forgetPassMailContent({
          name: existingUser.name,
          forgetPassLink: `http://localhost:4000/api/verify-reset-password/?email=${existingUser.email}&token=${token}`,
        }),
      });
    }

    return res.status(200).json({ message: "success" });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return res.status(400).json({ errors: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

/*
  Verify Forget Password Token
*/
const verifyForgetPassToken = async (req, res) => {
  try {
    const { email, token } = req.query;

    if (!email || !token) {
      return res.status(400).json({ message: "Email and token are required" });
    }

    const savedToken = await forgetPassToken.findOne({
      where: {
        email: email,
        token: token,
      },
    });

    if (!savedToken) {
      return res.redirect(
        `http://localhost:5173/forgot-password?message=Invalid or expired token please try again`
      );
    }

    const tokenCreatedAt = new Date(savedToken.createdAt).getTime();
    const tokenExpirationTime = 60 * 60 * 1000;
    if (Date.now() - tokenCreatedAt > tokenExpirationTime) {
      return res.status(400).json({ message: "Token has expired" });
    }

    return res
      .status(200)
      .redirect(
        `http://localhost:5173/change-password?email=${email}&token=${token}`
      );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/*
  Update Password
*/
const updatePassword = async (req, res) => {
  try {
    await updatePassSchema.validate(req.body, { abortEarly: false });

    const { email, token, password } = req.body;

    const savedToken = await forgetPassToken.findOne({
      where: {
        email: email,
        token: token,
      },
    });

    if (!savedToken) {
      res.status(400).json({ message: "Token expired please try again" });
    }

    const tokenCreatedAt = new Date(savedToken.createdAt).getTime();
    const tokenExpirationTime = 60 * 60 * 1000;
    if (Date.now() - tokenCreatedAt > tokenExpirationTime) {
      return res.status(400).json({ message: "Token has expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updateUser = await User.update(
      { password: hashedPassword },
      { where: { email: email } }
    );

    if (updateUser[0] === 1) {
      // Invalidate the token by deleting it
      await forgetPassToken.destroy({
        where: {
          email: email,
          token: token,
        },
      });

      return res.status(200).json({ message: "Password updated successfully" });
    } else {
      return res.status(500).json({ message: "Failed to update password" });
    }
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { isAdmin } = req.user;

    if (!isAdmin) {
      return res.status(401).json({ message: "You are not authorized" });
    }
    const users = await User.findAll({
      attributes: [
        "userId",
        "name",
        "email",
        "isAdmin",
        "isApproved",
        "isDeleted",
        "status",
        "createdAt",
      ],
      where: {
        isApproved: true,
      },
    });
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPendingUsers = async (req, res) => {
  try {
    const { isAdmin } = req.user;

    if (!isAdmin) {
      return res.status(401).json({ message: "You are not authorized" });
    }

    const users = await User.findAll({
      where: {
        isApproved: false,
      },
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  login,
  register,
  sendForgetPassMail,
  verifyForgetPassToken,
  updatePassword,
  getAllUsers,
  getPendingUsers,
};
