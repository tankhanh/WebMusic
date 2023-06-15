const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const musicSongs = require("../../models/musicSongs");

router.get("/", verifyToken, (req, res) => {
  res.render("mp3-player");
});

router.get("/api/", verifyToken, async (req, res) => {
  try {
    const songs = await musicSongs.find();
    res.json({ songs });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

module.exports = router;
