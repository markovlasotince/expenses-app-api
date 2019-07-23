const express = require("express");
require("./db/mongoose");
const userRouter = require("../src/routers/user");
const itemRouter = require("../src/routers/item");

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(itemRouter);

module.exports = app;
