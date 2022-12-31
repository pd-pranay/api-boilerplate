import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import APIError from "../helpers/APIError";
import config from "../../config/config";
import db from "../../config/sequelize";

const { User } = db;

// sample user, used for authentication
const user = {
  username: "react",
  password: "express",
};

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function loginold(req, res, next) {
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity
  if (
    req.body.username === user.username &&
    req.body.password === user.password
  ) {
    const token = jwt.sign(
      {
        username: user.username,
        expiresIn: 3600,
      },
      config.jwtSecret
    );
    return res.json({
      token,
      username: user.username,
    });
  }

  const err = new APIError(
    "Authentication error",
    httpStatus.UNAUTHORIZED,
    true
  );
  return next(err);
}

const login = async () => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username: username.trim() } });
  if (user === null) {
    return res.status(204).json({ message: "No such user" });
  }

  const match = await bcrypt.compare(password, iser.password);
  if (!match) return res.status(401).json({ message: "Unauthorized" });

  const accessToken = jwt.sign(
    {
      user: {
        username: user.username,
      },
    },
    config.jwtSecret,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign({ username: user.username }, config.jwtSecret, {
    expiresIn: "7d",
  });

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  // Send accessToken containing username and roles
  res.json({ accessToken });
};

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(refreshToken, config.jwtSecret, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    const foundUser = await User.findOne({
      where: { username: decoded.username },
    });

    if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
        },
      },
      config.jwtSecret,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  });
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100,
  });
}

export default { login, logout, refresh, getRandomNumber };
