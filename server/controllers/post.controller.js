import httpStatus from "http-status";
import db from "../../config/sequelize";

const { Post, QueryTypes, sequelize } = db;

function create(req, res, next) {
  const post = Post.build({
    post_name: req.body.post_name,
    post_description: req.body.post_description,
    color: req.body.color,
    userId: req.body.userId,
  });

  post
    .save()
    .then((savedPost) => res.json(savedPost))
    .catch((e) => next(e));
}

const list = (req, res, next) => {
  // Post.findAll({ limit })
  //     .then((users) => res.json(users))
  //     .catch((e) => next(e));
  // Callee is the model definition. This allows you to easily map a query to a predefined model
  sequelize
    .query(`SELECT id, post_name as name, post_description  from "Posts"`, {
      QueryTypes: QueryTypes.SELECT,
      model: Post,
      mapToModel: true,
    })
    .then((posts) => {
      return res.json(posts);
    })
    .catch((e) => {
      console.log(e);
      return next(e);
    });
};

export default {
  create,
  list,
};
