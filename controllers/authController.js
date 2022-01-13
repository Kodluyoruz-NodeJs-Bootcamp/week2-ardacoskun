const Users = require("../models/user");

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
  try {
    const user = await Users.findByCredentials(
      req.body.username,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.status(201); // .send()kısmı gerekebilir tekrar bak.
    res.redirect("/");
  } catch (error) {
    handleErrors(error);
    res.status(500).json({ error: "Kullanıcı Bulunamadı ! " }); // Error mesajlarını düzelt.
  }
};

const postRegister = async (req, res) => {
  const user = new Users(req.body);
  try {
    const token = await user.generateAuthToken();
    await user.save();
    res.setHeader("Set-Cookie", `newUser=${token}`);
    res.status(201).redirect("/");
  } catch (error) {
    handleErrors(error);
    res.status(500).json("Kayıt Başarısız!");
  }
};

module.exports = { getLogin, getRegister, postLogin, postRegister };
