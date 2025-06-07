import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API DOCS",
      version: "1.0.0",
      description: "REST API documentation",
    },
    // components: {
    //   securitySchemas: {
    //     bearerAuth: {
    //       type: "http",
    //       scheme: "bearer",
    //       bearerFormat: "JWT",
    //     },
    //   },
    // },
    // security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js", "./model/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app, port) {
  // Swagger page
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

  // Swagger json file
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

export default swaggerDocs;
