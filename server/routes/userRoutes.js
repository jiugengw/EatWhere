import express from 'express';
import * as userController from './../controllers/userController.js';
import validateUserId from './../middlewares/validateUserId.js';
import {protect} from './../middlewares/auth.js';

const router = express.Router();

router
  .route('/')
  .post(userController.createUser);

//below is to generate a token (need this to pass protect)
router
  .route('/generatetoken')
  .post(userController.generateToken);

// comment the route below out if you dunno how get a token 
// and are seeing "access denied" or "invalid token"
router
  .use(protect);

//this is here temporarily
router
  .route('/check')
  .post(userController.getAllUsers);

router
  .route('/:id')
  .get(validateUserId, userController.getUser)
  .patch(validateUserId, userController.updateUser)
  .delete(validateUserId, userController.deleteUser);

router
  .route('/:id/preferences')
  .get(validateUserId, userController.getUserPreferences)
  .patch(validateUserId, userController.updateUserPreferences);

router
  .route('/:id/history')
  .get(validateUserId, userController.getUserHistory);


export default router;
