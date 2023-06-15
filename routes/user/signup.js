const express = require("express");
const router = express.Router();

// Pasword Handler
const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const loginSchema = require("../../models/loginSchema");

router.get("/", (req, res) => {
  res.render("signup");
});
//POST SIGNUP
router.post("/", async (req, res) => {
  let { username, email } = req.body;
  let password = req.body.password[0];
  username = username.trim();
  email = email.toString().trim();
  password = password.toString().trim();
  const check = await loginSchema.findOne({ email });
  if (check) {
    res.send(`${email} đã tồn tại`);
  }
  const hashed = bcrypt.hashSync(password, salt);
  try {
    const newUser = new loginSchema({
      username,
      email,
      password: hashed,
    });
    newUser.save();
    res.redirect("./login");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
