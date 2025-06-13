import express from 'express';
import userRoutes from './../users/userRoutes.js';
// import groupRoutes from './../groups/groupRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);
// router.use('/groups', groupRoutes);

export default router;


