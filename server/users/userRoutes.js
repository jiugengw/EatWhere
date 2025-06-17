import express from 'express';
import * as userController from './userController.js';
import * as authController from './../auth/authController.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.use(authController.protect);

router.use('/me', userController.getMe);

router.get('/me',userController.getMe, userController.getUser);
router.patch('/me/updateMyPassword', authController.updatePassword);
router.patch('/me/updateMe', userController.updateMe);
router.patch('/me/deleteMe', userController.deleteMe);

router
  .route('/me/history')
  .get(userController.getUserHistory);
router
  .route('/me/groups')
  .get(userController.getUserGroups);
router
  .route('/me/preferences')
  .get(userController.getUserPreferences)
  .patch(userController.updateMyPreferences);

router.route('/username/:username').get(userController.getUserByUsername);

export default router;
