import { DataTypes } from "sequelize";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUser:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - designation
 *        - empId
 *      properties:
 *        name:
 *          type: string
 *        email:
 *          type: string
 *        designation:
 *          type: string
 *        empId:
 *          type: string
 */

const createUserModel = async (sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
        isLowercase: true,
      },
      allowNull: false,
      unique: true,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    empId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return User;
};

export { createUserModel };
