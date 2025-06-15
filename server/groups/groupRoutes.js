import express from 'express';
import * as groupController from './groupController.js';

const router = express.Router();

router.route('/').post(groupController.createGroup);

export default router;
