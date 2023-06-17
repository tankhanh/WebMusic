require("dotenv").config();
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth");

router.get("/", (req, res) => {
  res.render("homepage");
});

router.post("/mp3-player", verifyToken, (req, res) => {
  if (verifyToken) {
    res.redirect("/mp3-player");
  } else {
    res.redirect("/login");
  }
});
module.exports = router;
