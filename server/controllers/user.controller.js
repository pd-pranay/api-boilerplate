import httpStatus from "http-status";
import db from "../../config/sequelize";
import bcrypt from 'bcrypt';
const { User } = db;

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.findOne({ where: { id } })
    .then((user) => {
      if (!user) {
        const e = new Error("User does not exist");
        e.status = httpStatus.NOT_FOUND;
        return next(e);
      }
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch((e) => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
const create = async (req, res, next) => {
  // const user = User.build({
  //   username: req.body.username,
  // });

  const { username, password } = req.body;
  const userExists = await User.findOne({
    where: { username: username.trim() },
  });

  if (userExists !== null) {
    res.status(httpStatus.NO_CONTENT).json({ message: "User Already exists." });
  }

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds
  const user = User.build({
    username: username,
    password: hashedPwd,
  });

  let newUser = await user.save();
  res.status(httpStatus.OK).json(newUser);
};

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  const { user } = req;
  user.username = req.body.username;
  user.mobileNumber = req.body.mobileNumber;

  user
    .save()
    .then((savedUser) => res.json(savedUser))
    .catch((e) => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50 } = req.query;
  User.findAll({ limit })
    .then((users) => res.json(users))
    .catch((e) => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const { user } = req;
  const { username } = req.user;
  user
    .destroy()
    .then(() => res.json(username))
    .catch((e) => next(e));
}

export default {
  load,
  get,
  create,
  update,
  list,
  remove,
};
