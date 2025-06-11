import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import { AccountModel } from "../postgres/postgres.js";
import { StatusCode } from "../enums/statusCode.js";
import {
  validateRequiredFields,
  validatePassword,
  validateEmail,
} from "../utils/formValidations.js";
import { generateAccessToken, generateRefreshToken } from "../auth/auth.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  //   sameSite: "Lax",
  maxAge: 15 * 60 * 1000,
};

// Register a new account
const register = async (req, res) => {
  const { username, email, password, firstName, lastName, confirmPassword } =
    req.body;

  try {
    // Validate required fields
    if (validateRequiredFields({ ...req.body })) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        error: "Missing required fields",
        key: Object.entries(req.body)
          .filter(([_, value]) => !value)
          .map(([key]) => key),
      });
    }
    // Validate password
    if (validatePassword(password, confirmPassword)) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        error: "Password and confirm password do not match",
        key: ["password"],
      });
    }
    // Validate email format
    if (!validateEmail(email)) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        error: "Invalid email format",
        key: ["email"],
      });
    }

    // Check for existing account
    const existingAccount = await AccountModel.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });
    if (existingAccount) {
      if (existingAccount.email === email) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Email already exists",
          key: ["email"],
        });
      }
      if (existingAccount.username === username) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Username already exists",
          key: ["username"],
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const account = await AccountModel.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    res.status(StatusCode.CREATED).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Login an account
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate required fields
    if (validateRequiredFields({ ...req.body })) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        error: "Missing required fields",
        key: Object.entries(req.body)
          .filter(([_, value]) => !value)
          .map(([key]) => key),
      });
    }

    // Check if account exists
    const accountExists = await AccountModel.findOne({
      where: {
        username,
      },
    });
    if (!accountExists) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        error: "Invalid username or password",
        key: ["username"],
      });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      accountExists.password
    );
    if (!isPasswordCorrect) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        error: "Your password is incorrect",
        key: ["password"],
      });
    }

    // Generate tokens
    const accessToken = await generateAccessToken(accountExists.dataValues);
    const refreshToken = await generateRefreshToken(accountExists.dataValues);

    accountExists.update({
      refreshToken: refreshToken,
    });

    // set cookies
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(StatusCode.SUCCESS).json({
      success: true,
      message: "Login successful",
    });
  } catch (e) {
    console.log(e);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Refresh a user's token
const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    // check if refresh token is found
    if (!refreshToken) {
      return res.status(StatusCode.FORBIDDEN).json({
        success: false,
        error: "Refresh token is not found",
      });
    }

    // check if refresh token is valid
    const user = await AccountModel.findOne({
      where: {
        refreshToken: refreshToken,
      },
    });

    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(StatusCode.FORBIDDEN).json({
          success: false,
          error: "Refresh token is invalid",
        });
      }
      const token = await generateAccessToken(user.dataValues);

      res.cookie("accessToken", token, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      });

      return res.status(StatusCode.SUCCESS).json({
        success: true,
        message: "Token refreshed successfully",
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Logout a user
const logout = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) {
      return res.status(StatusCode.FORBIDDEN).json({
        success: false,
        error: "Access token is not found",
      });
    }

    const user = await AccountModel.findOne({
      where: {
        refreshToken: refreshToken,
      },
    });

    if (user) {
      user.update({
        refreshToken: null,
      });
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(StatusCode.SUCCESS).json({
      success: true,
      message: "Logout successful",
    });
  } catch (err) {
    console.log(err);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Get a user's profile
const getProfile = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    const user = await AccountModel.findOne({
      where: {
        refreshToken: refreshToken,
      },
    });
    if (!user) {
      return res.status(StatusCode.FORBIDDEN).json({
        success: false,
        error: "User not found",
      });
    }
    return res.status(StatusCode.SUCCESS).json({
      success: true,
      // message: "Profile fetched successfully",
      data: {
        id: user.dataValues.id,
        username: user.dataValues.username,
        email: user.dataValues.email,
        // fullName: `${user.dataValues.firstName} ${user.dataValues.lastName}`,
        firstName: user.dataValues.firstName,
        lastName: user.dataValues.lastName,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { register, login, refreshToken, logout, getProfile };
