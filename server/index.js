import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import router from "./routes/routes.js";
import swaggerDocs from "./utils/swagger.js";
import cookieParser from "cookie-parser";
import { connection } from "./postgres/postgres.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
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
