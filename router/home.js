const express = require("express");
const router = new express.Router();
const Users = require("../models/user");

router.get("/", async (req, res) => {
  try {
    const users = await Users.find({});
    res.status(201).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
