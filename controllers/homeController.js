const Users = require("../models/user");

//Controllers about home pages

const gotoHome = async (req, res) => {
  res.render("dashboard");
};

const goToUsers = async (req, res) => {
  try {
    const users = await Users.find({});

    res.render("userlist", {
      users,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const goToProfile = async (req, res) => {
  try {
    const users = await Users.findById(req.session.userId);

    res.render("profile", {
      users,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const errorPage = async (req, res) => {
  res.render("error");
};

module.exports = { gotoHome, goToUsers, goToProfile, errorPage };
