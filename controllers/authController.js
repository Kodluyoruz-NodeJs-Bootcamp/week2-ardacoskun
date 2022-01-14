const Users = require("../models/user");
const jwt = require("jsonwebtoken");

// handle errors
const handleErrors = (error) => {
  //Error mesajlarını göstermeyi tamamla.
  console.log(error.message);
};

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

    res.cookie("jwt", token, { httpOnly: true });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.session.userId = decoded._id;
    console.log("Decoded:", decoded._id);
    req.session.userAgent = userAgent;

    res.status(201).redirect("/"); // .send()kısmı gerekebilir tekrar bak.
  } catch (error) {
    handleErrors(error);
    res.status(500).json({ error: "Kullanıcı Bulunamadı ! " }); // Error mesajlarını düzelt.
  }
};

const postRegister = async (req, res) => {
  const user = new Users(req.body);

  try {
    //const token = await user.generateAuthToken(); //Create JWT token while user signing up.
    await user.save();

    //res.cookie("jwt", token, { httpOnly: true }); // Send jWT token to client with cookie.

    res.status(201).redirect("/girisyap");
  } catch (error) {
    handleErrors(error);
    res.status(500).json("Kayıt Başarısız!");
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

const logoutWithCookie = (req, res) => {
  const cookie = res.cookie("jwt", "", { maxAge: 1 }); // Switch jwt token to empty one and expired very soon.

  res.redirect("/");
};

module.exports = {
  getLogin,
  getRegister,
  postLogin,
  postRegister,
  logout,
  logoutAll,
  logoutWithCookie,
};
