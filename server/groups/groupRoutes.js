import express from 'express';
import * as groupController from './groupController.js';
import * as authController from './../auth/authController.js';

const router = express.Router();

router.use(authController.protect); 

router.route('/').post(groupController.createGroup);

export default router;
