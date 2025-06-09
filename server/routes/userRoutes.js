import express from 'express';
import * as userController from './../controllers/userController.js';
import {protect} from './../middleware/auth.js';

const router = express.Router();

//below is to generate a token
router
  .route('/generatetoken')
  .post(userController.generateToken);
  
router
  .route('/')
  .post(userController.createUser);

// comment this out if dont have a jwt token
router
  .use(protect);

//this is here temporarily
router
  .route('/check')
  .post(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);


export default router;
