import dotenv from "dotenv";
dotenv.config();

import express from "express";
import router from "./routes/routes.js";
import cors from "cors";
import swaggerDocs from "./utils/swagger.js";
import cookieParser from "cookie-parser";
import { connection } from "./postgres/postgres.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(router);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
  swaggerDocs(app, process.env.SERVER_PORT);
  console.log(
    `Swagger docs are available at http://localhost:${process.env.SERVER_PORT}/api-docs`
  );
});

connection();
