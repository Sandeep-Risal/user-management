import jwt from "jsonwebtoken";
import { StatusCode } from "../enums/statusCode.js";

const generateAccessToken = async (user) => {
  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  return token;
};
const generateRefreshToken = async (user) => {
  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

const verifyToken = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(StatusCode.UNAUTHORIZED).json({
      success: false,
      error: "Invalid token",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(StatusCode.FORBIDDEN).json({
        success: false,
        message: "Token expired",
      });
    }
    next();
  });
};

export { generateAccessToken, generateRefreshToken, verifyToken };
