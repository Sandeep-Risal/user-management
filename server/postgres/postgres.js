import { Sequelize } from "sequelize";
import { createUserModel } from "../model/userSchema.js";

const sequelize = new Sequelize(
  process.env.DATABASE_NAME || "study",
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  }
);

let UserModel = null;

const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    UserModel = await createUserModel(sequelize);
    await sequelize.sync();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { connection, UserModel };
