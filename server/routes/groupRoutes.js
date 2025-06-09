import express from 'express';
import * as groupController from './../controllers/groupController.js';
import validateGroupId from './../middlewares/validateGrpId';

const router = express.Router();

router.route('/').post(groupController.createGroup);

router.route('/')
