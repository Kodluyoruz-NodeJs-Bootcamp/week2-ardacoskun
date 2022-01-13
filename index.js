const express = require("express");
const app = express();
require("./db/mongoose");
const path = require("path");
const ejs = require("ejs");
const dotenv = require("dotenv");
const userRouter = require("./router/user");
const homeRouter = require("./router/home");

dotenv.config();

app.set("view engine", "ejs"); // template-engine

app.use(express.static("public")); // This middleware is about static files.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(homeRouter);
app.use(userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Sunucu port ${port} da başlatıldı.`);
});
