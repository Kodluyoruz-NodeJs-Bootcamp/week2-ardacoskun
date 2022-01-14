const Users = require("../models/user");
const jwt = require("jsonwebtoken");
const authController = require("../controllers/authController");

// handle errors
const handleErrors = (err) => {
  let errors = { name: "", surname: "", password: "", username: "" };

  if (err.code === 11000) {
    errors.username = "Bu kullanıcı adı zaten kullanılıyor.";
    return errors;
  }

  //validation errors

  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

console.log(handleErrors);

const getLogin = (req, res) => {
  res.render("login");
};

const getRegister = (req, res) => {
  res.render("register");
};

const postLogin = async (req, res) => {
  const userAgent = req.headers["user-agent"];

  try {
    const user = await Users.findByCredentials(
      req.body.username,
      req.body.password
    );

    const token = await user.generateAuthToken(userAgent);

    //Set jwt token into a cookie
    res.cookie("jwt", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    //Session definitions
    req.session.userId = decoded._id;
    req.session.userAgent = userAgent;
    req.session.isLoggedIn = true;

    res.status(201).redirect("/");
  } catch (error) {
    const errors = handleErrors(error);
    res.status(500).json({ errors });
  }
};

const postRegister = async (req, res) => {
  const user = new Users(req.body);

  try {
    await user.save();

    res.status(201).redirect("/girisyap");
  } catch (error) {
    const errors = handleErrors(error);
    res.status(500).json({ errors });
  }
};

const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.redirect("/girisyap");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const logoutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.redirect("/");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const logoutUser = (req, res) => {
  // Switch jwt token to empty one and expired very soon.
  res.cookie("jwt", "", { maxAge: 1 });
  res.cookie("connect.sid", "", { maxAge: 1 });

  //Clear Session
  req.session.destroy();

  res.redirect("/");
};

module.exports = {
  getLogin,
  getRegister,
  postLogin,
  postRegister,
  logout,
  logoutAll,
  logoutUser,
  handleErrors,
};
