import express from "express";
import { connection } from "./postgres/postgres.js";
import dotenv from "dotenv";
import router from "./routes/routes.js";
import cors from "cors";
import swaggerDocs from "./utils/swagger.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
  swaggerDocs(app, process.env.SERVER_PORT);
  console.log(
    `Swagger docs are available at http://localhost:${process.env.SERVER_PORT}/api-docs`
  );
});

connection();
