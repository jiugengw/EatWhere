import express from 'express';
import * as userController from './../controllers/userController.js';
import validateUserId from './../middlewares/validateUserId.js'

const router = express.Router();

router
  .route('/')
  .post(userController.createUser);

router
  .route('/:id')
  .get(validateUserId, userController.getUser)
  .patch(validateUserId, userController.updateUser)
  .delete(validateUserId, userController.deleteUser);

export default router;
