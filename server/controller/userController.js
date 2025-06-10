import { Op } from "sequelize";
import { StatusCode } from "../enums/statusCode.js";
import { UserModel } from "../postgres/postgres.js";
import {
  validateRequiredFields,
  validateEmail,
} from "../utils/formValidations.js";

const getAllUsers = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const whereClause = search
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { empId: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const users = await UserModel.findAndCountAll({
      limit: limit || 10,
      offset: (page - 1) * limit || 0,
      where: whereClause,
    });
    if (users.count === 0) {
      return res.status(StatusCode.SUCCESS).json({
        success: true,
        message: "No users found",
        data: [],
      });
    }
    return res.status(StatusCode.SUCCESS).json({
      success: true,
      message: "Users fetched successfully",
      data: users.rows || [],
      pagination: {
        totalRecords: users.count,
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        totalPages: Math.ceil(users.count / limit || 10),
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Internal server error",
      data: [],
    });
  }
};

const createUser = async (req, res) => {
  const { email, empId, name, designation } = req.body;

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
    // Validate email format
    if (!validateEmail(email)) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        error: "Invalid email format",
        key: ["email"],
      });
    }

    // Check for existing user
    const existingUser = await UserModel.findOne({
      where: {
        [Op.or]: [{ empId: empId }, { email: email }],
      },
    });

    if (existingUser) {
      if (existingUser.empId === empId) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          error: "Employee ID already exists",
          key: ["empId"],
        });
      }
      if (existingUser.email === email) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          error: "Email already exists",
          key: ["email"],
        });
      }
    }

    // Create new user
    await UserModel.create({
      name,
      email,
      designation,
      empId,
    });

    return res.status(StatusCode.CREATED).json({
      success: true,
      message: "User created successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const udpateUser = async (req, res) => {
  const { email, empId } = req.body;
  try {
    const { id } = req.params;
    const user = await UserModel.findByPk(id);

    if (user == null) {
      return res.status(StatusCode.NOT_FOUND).json({
        success: false,
        error: "User not found",
      });
    }

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
    // Validate email format
    if (!validateEmail(email)) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        error: "Invalid email format",
        key: ["email"],
      });
    }
    // Check for existing user
    const existingUser = await UserModel.findOne({
      where: {
        [Op.or]: [{ empId: empId }, { email: email }],
      },
    });

    if (existingUser) {
      if (existingUser.empId === empId) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          error: "Employee ID already exists",
          key: ["empId"],
        });
      }
      if (existingUser.email === email) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          error: "Email already exists",
          key: ["email"],
        });
      }
    }

    await UserModel.update(req.body, {
      where: {
        id: id,
      },
    });
    return res.status(StatusCode.SUCCESS).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByPk(id);

    if (user == null) {
      return res.status(StatusCode.NOT_FOUND).json({
        success: false,
        error: "User not found",
      });
    }
    await UserModel.destroy({
      where: {
        id: id,
      },
    });
    return res.status(StatusCode.SUCCESS).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export { getAllUsers, createUser, udpateUser, deleteUser };
