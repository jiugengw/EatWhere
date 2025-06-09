import express from 'express';
import * as userController from './../controllers/userController.js';

const router = express.Router();

router
  .route('/')
  .post(userController.createUser);

router
  .route('/:id')
  .get(validateUserId, userController.getCurrentUser)
  .patch(validateUserId, userController.updateUser)
  .delete(validateUserId, userController.deleteUser);

router
  .route(':/id/preferences')
  .get(validateUserId, userController.getUserPreferences)
  .patch(validateUserId, userController.updateUserPreferences);

router.route(':/id/history').get(validateUserId, userController.getUserHistory);

export default router;
