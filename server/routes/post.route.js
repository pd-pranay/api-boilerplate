import express from 'express';
import postCtrl from '../controllers/post.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')

    /** GET /api/posts - Get list of posts */
    .get(postCtrl.list)

    /** POST /api/posts - Create new user */
    .post(postCtrl.create);

// router.route('/:userId')

//     /** GET /api/posts/:userId - Get user */
//     .get(postCtrl.get)

export default router;
