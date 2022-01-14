const jwt = require("jsonwebtoken");
const Users = require("../models/user");

const auth = async (req, res, next) => {
  //Authentication middleware about compare browser informations in jwt token and session
  try {
    const token = await req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded._id !== req.session.userId) {
      throw new Error("Hatalı Kullanıcı Girişi");
    } else if (
      decoded.userAgent !== req.session.userAgent &&
      decoded.userAgent !== req.headers["user-agent"]
    ) {
      throw new Error("Farklı bir tarayıcıdan giriş yapamazsınız.");
    }
    const user = await Users.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error("Kullanıcı Bulunamadı!");
    }

    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    res.status(500).redirect("/girisyap");
  }
};

module.exports = auth;
