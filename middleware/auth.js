const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;

  if (!token || !refreshToken) {
    return res.redirect("/login/");
    // res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (decoded.email === decodedRefreshToken.email) {
      req.UserEmail = decoded.email;
      next();
    } else {
      console.log("Token không hợp lệ");
      return res.redirect("/login/");
      // res.sendStatus(403);
    }
  } catch (error) {
    console.log(error);
    return res.redirect("/login/");
  }
};

module.exports = verifyToken;
