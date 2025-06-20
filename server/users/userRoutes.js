import express from 'express';
import * as userController from './userController.js';
import * as authController from './../auth/authController.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.use(authController.protect);

router
  .route('/me')
  .get(userController.getMe, userController.getUser)
  .patch(userController.getMe, userController.updateUser)
  .delete(userController.getMe, userController.deleteUser);

router.patch(
  '/me/password',
  userController.getMe,
  authController.updatePassword
);

router
  .route('/me/history')
  .get(userController.getMe, userController.getUserHistory);
router
  .route('/me/groups')
  .get(userController.getMe, userController.getUserGroups);
router
  .route('/me/preferences')
  .get(userController.getMe, userController.getUserPreferences)
  .patch(userController.getMe, userController.updateMyPreferences);

router.route('/username/:username').get(userController.getUserByUsername);

export default router;
