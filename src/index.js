const express = require("express");
require("./db/mongoose");
const app = express();
const port = process.env.PORT;
const userRouter = require("../src/routers/user");
const itemRouter = require("../src/routers/item");

app.use(express.json());
app.use(userRouter);
app.use(itemRouter);

app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});
