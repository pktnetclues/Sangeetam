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
    const user = await User.findOne({ where: { userId: decoded.userid } });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check if the user is still active
    if (decoded.isDeleted === true) {
      return res.status(401).json({ message: "User is deleted" });
    }

    // Check if the user is approved
    if (decoded.isApproved === false) {
      return res.status(401).json({ message: "User is not approved" });
    }

    // Check if the user is inactive
    if (decoded.status === "inactive") {
      return res.status(401).json({ message: "User is inactive" });
    }

    // If the token is valid, set the user id in the request object
    req.user = decoded;
    next();
  });
};

export default authMiddleware;
