import { DataTypes } from "sequelize";

const createAccountModel = async (sequelize) => {
  const Account = sequelize.define("Account", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        isLowercase: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // isActive: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: false,
    //   defaultValue: true,
    // },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  return Account;
};

export { createAccountModel };
