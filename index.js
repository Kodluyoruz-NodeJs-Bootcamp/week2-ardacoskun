const express = require("express");
const app = express();
require("./db/mongoose");
const path = require("path");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const session = require("express-session");

const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_DB_URI,
  collection: "mySessions",
});

const userRouter = require("./router/user");
const homeRouter = require("./router/home");

dotenv.config();

//GLOBAL VARIABLE
global.userIn = null;

app.set("view engine", "ejs"); // template-engine
//Session definition
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store,
  })
);

//Middlewares

app.use("*", (req, res, next) => {
  userIN = req.session.userId;
  next();
});
app.use(express.static("public")); // This middleware is about static files.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(homeRouter);
app.use(userRouter);
app.get("*", function (req, res) {
  res.status(404).render("error");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Sunucu port ${port} da başlatıldı.`);
});
