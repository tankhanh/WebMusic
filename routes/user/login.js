require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const bcrypt = require("bcrypt");
const loginSchema = require("../../models/loginSchema");
const verifyToken = require("../../middleware/auth");

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/getCookie", async (req, res) => {
  res.redirect("/mp3-player");
});

// Create tokens
const generateTokens = (payload) => {
  const { email, password } = payload;
  const accessToken = jwt.sign(
    { email, password },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
  const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  return { accessToken, refreshToken };
};

const updateRefreshToken = async (email, refreshToken) => {
  await loginSchema.findOneAndUpdate({ email }, { refreshToken });
};
// POST login
router.post("/", async (req, res) => {
  let { email, password } = req.body;
  email = email.toString().trim();
  password = password.toString().trim();
  const check = await loginSchema.findOne({ email });
  if (!check) {
    res.send("Sai email hoặc mật khẩu");
    return;
  }
  try {
    const match = bcrypt.compareSync(password, check.password);
    if (match) {
      const tokens = generateTokens(check.toJSON());
      updateRefreshToken(email, tokens.refreshToken);

      res.cookie("token", tokens.accessToken, { httpOnly: true });
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
      });

      res.redirect("/login/getCookie");
    } else {
      res.send("Sai mật khẩu");
    }
  } catch (err) {
    console.log(err);
    res.send("Lỗi tải dữ liệu");
  }
});

router.post("/token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.sendStatus(401);
    return;
  }

  const check = await loginSchema.findOne({ refreshToken });

  if (!check) {
    res.sendStatus(403);
    return;
  }

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const tokens = generateTokens(check);
    updateRefreshToken(check.email, tokens.refreshToken);
    res.json(tokens);
  } catch (error) {
    console.log(error);
    res.sendStatus(403);
  }
});

router.delete("/logout", verifyToken, async (req, res) => {
  const check = await loginSchema.findOne({ email: req.UserEmail });
  updateRefreshToken(check.email, null);
  console.log(check);
  res.redirect("/login");
});

router.get("/logout", async (req, res) => {
  // const check = await loginSchema.findOne({ email: req.UserEmail });
  // updateRefreshToken(check.email, null);
  // console.log(check);
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.redirect("/login");
});

module.exports = router;
