import jwt from "jsonwebtoken";
import User from "../models/auth/user.model.js";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if the token is expired
    if (Date.now() - decoded.createdAt > 24 * 60 * 60 * 1000) {
      return res.status(401).json({ message: "Token has expired" });
    }

    // Check if the user exists
    const user = await User.findOne({
      // attributes: ["userId"],
      where: { userId: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check if the user is still active
    if (user.isDeleted === true) {
      return res.status(401).json({ message: "User is deleted by admin" });
    }

    // Check if the user is approved
    if (user.isApproved === false) {
      return res.status(401).json({ message: "User is not approved" });
    }

    // Check if the user is inactive
    if (user.status === false) {
      return res
        .status(401)
        .json({ message: "User has been made inactive by admin" });
    }

    req.user = decoded;
    next();
  });
};

export default authMiddleware;
