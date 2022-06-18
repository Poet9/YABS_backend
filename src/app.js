const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
require('./db/mongoose');
const userRouter = require('./routers/userRouter');
const blogRouter = require('./routers/blogRouter');
const commentRouter = require('./routers/commentRouter');

const app = express();
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



