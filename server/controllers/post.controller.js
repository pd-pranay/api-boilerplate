import httpStatus from "http-status";
import db from "../../config/sequelize";

const { Post, User, QueryTypes, sequelize } = db;

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
  // Callee is the model definition. This allows you to easily map a query to a predefined model
  sequelize
    // SELECT id, post_name as name, post_description  from "Posts"
    .query(`SELECT p.id, p.post_name , p.post_description, p.color, p.user_id, u.username  FROM "Posts" as p INNER JOIN "Users" as u
    ON u.id = p.user_id ;`, {
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
