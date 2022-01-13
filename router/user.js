const express = require("express");
const router = new express.Router();
const Users = require("../models/user");
const authController = require("../controllers/authController");

router.get("/girisyap", authController.getLogin);

router.get("/kayitol", authController.getRegister);

router.post("/girisyap", authController.postLogin);

router.post("/kayitol", authController.postRegister);

module.exports = router;
