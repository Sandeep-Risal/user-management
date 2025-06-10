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

export { register, login };
