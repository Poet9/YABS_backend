const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");
// const jwt = require("express-jwt");
// const jwks = require("jwks-rsa")();
require("./db/mongoose");
const userRouter = require("./routers/userRouter");
const blogRouter = require("./routers/blogRouter");
const commentRouter = require("./routers/commentRouter");
// port
const PORT = 3000;
// swagger options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "YABS API",
      version: "1.0.0",
      description: "yet another blog site API",
    },
    servers: [
      {
        url: `http://127.0.0.1:3000`,
      },
    ],
  },
  apis: ["./routers/*.js"],
};
const specs = swaggerJsdoc(options);
const app = express();
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
// Auth0 stuff
// var jwtCheck = jwt({
//   secret: jwks.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: process.env.JWKSURI,
//   }),
//   audience: process.env.AUTH_AUDIENCE,
//   issuer: process.env.AUTH_ISSUER,
//   algorithms: ["RS256"],
// });

// app.use(jwtCheck);


// cors params
app.use(cors({
   origin: process.env.FRONTENDURL || '*',
   allowedHeaders: ['content-type, Accept'],
   methods: 'POST, GET, PATCH, DELETE, OPTIONS',
   credentials: true,
   preflightContinue: false
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/users/", userRouter);
app.use("/api/blogs/", blogRouter);
app.use("/api/comments/", commentRouter);

module.exports = app;



