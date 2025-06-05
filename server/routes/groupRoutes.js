import express from 'express';
import * as groupController from './../controllers/groupController.js';

const router = express.Router();

router
  .route('/')
  .post(groupController.createGroup);

router
  .route('/:id')
  .get(userController.getGroup)
  .patch(userController.updateGroup)
  .delete(userController.deleteGroup);

export default router;
