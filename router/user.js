const express = require("express");
const router = new express.Router();
const Users = require("../models/user");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

router.get("/girisyap", authController.getLogin);

router.get("/kayitol", authController.getRegister);

router.post("/girisyap", authController.postLogin);

router.post("/kayitol", authController.postRegister);

router.post("/logoutWithCookie", auth, authController.logoutWithCookie);
//router.post("/logout", auth, authController.logout);

//router.post("/logoutAll", auth, authController.logoutAll);

module.exports = router;
