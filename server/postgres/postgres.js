import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";
import { createUserModel } from "../model/userSchema.js";
import { createAccountModel } from "../model/accountSchema.js";

const sequelize = new Sequelize(
  process?.env?.DB_NAME,
  process?.env?.DB_USERNAME,
  process?.env?.DB_PASSWORD,
  {
    host: process?.env?.DB_HOST,
    dialect: "postgres",
  }
);

let UserModel = null;
let AccountModel = null;

const connection = async () => {
  console.log("process.env.DB_NAME", sequelize.getDatabaseName());
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    // models
    UserModel = await createUserModel(sequelize);
    AccountModel = await createAccountModel(sequelize);

    // models end
    await sequelize.sync();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { connection, UserModel, AccountModel };
