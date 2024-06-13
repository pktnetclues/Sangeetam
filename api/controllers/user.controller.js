import brcypt from "bcrypt";
import jwt from "jsonwebtoken";
import Yup from "yup";
import User from "../models/auth/user.model.js";
import {
  emailSchema,
  loginSchema,
  registerSchema,
} from "../schema/user.schema.js";

const register = async (req, res) => {
  try {
    await registerSchema.validate(req.body, { abortEarly: false });

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email: email } });

    console.log(existingUser);

    if (existingUser && existingUser.email) {
      return res.status(400).json({ message: "user already exist" });
    }

    const hashedPassword = await brcypt.hash(password, 10);

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    return res.status(200).json({ message: "success", userid: user.id });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return res.status(400).json({ errors: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

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

    const comparePassword = await brcypt.compare(
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
        .json({ message: "success" });
    }
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return res.status(400).json({ errors: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

const sendForgetPassMail = async (req, res) => {
  try {
    await emailSchema.validate(req.body, { abortEarly: false });

    const { email } = req.body;

    const existingUser = await User.findOne({ where: { email: email } });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    return res.status(200).json({ existingUser: existingUser });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return res.status(400).json({ errors: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

export { login, register, sendForgetPassMail };