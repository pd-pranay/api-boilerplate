import express from 'express';
import { validate } from 'express-validation';
import { expressjwt } from 'express-jwt';
import paramValidation from '../../config/param-validation';
import authCtrl from '../controllers/auth.controller';
import config from '../../config/config';
import verifyJWT from '../middlewares/jwt.middleware'
const router = express.Router(); // eslint-disable-line new-cap

/**
 * POST /api/auth/login - Returns token if correct username and password is provided
 */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header.
 * Authorization: Bearer {token}
 */
router.route('/random-number')
  .get(verifyJWT, authCtrl.getRandomNumber);

export default router;
