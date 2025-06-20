import express from 'express';
import * as groupController from './groupController.js';
import * as authController from './../auth/authController.js';

const router = express.Router();

router.use(authController.protect);

router.route('/').post(groupController.createGroup);

router
  .route('/:id')
  .get(groupController.getGroup)
  .patch(groupController.updateGroup)
  .delete(groupController.deleteGroup);

// router.patch('/:id/join', groupController.joinGroup);
// router.patch('/:id/leave', groupController.leaveGroup);

router.get('/:id/history', groupController.getGroupHistory);
router.get('/:id/preferences', groupController.getGroupPreferences);
router.get('/:id/users', groupController.getGroupUsers);

router.route('/code/:code').get(groupController.getGroupByCode);


export default router;
