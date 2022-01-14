const express = require("express");
const router = new express.Router();
const Users = require("../models/user");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const authRoute = require("../middleware/authRoute");

router.get("/girisyap", authRoute, authController.getLogin);

router.get("/kayitol", authRoute, authController.getRegister);

router.post("/girisyap", authController.postLogin);

router.post("/kayitol", authController.postRegister);

router.get("/logout", auth, authController.logoutUser);
//router.post("/logout", auth, authController.logout);

//router.post("/logoutAll", auth, authController.logoutAll);

module.exports = router;
