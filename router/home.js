const express = require("express");
const router = new express.Router();
const Users = require("../models/user");
const auth = require("../middleware/auth");
const homeController = require("../controllers/homeController");
const logout = require("../controllers/authController");

router.get("/", auth, homeController.gotoHome);

router.get("/users", auth, homeController.goToUsers);

router.get("/profile", auth, homeController.goToProfile);

//router.get("*", homeController.errorPage);

module.exports = router;
