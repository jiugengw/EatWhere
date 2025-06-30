import express from 'express';
import groupRoutes from './groups/groupRoutes.js';
import userRoutes from './users/userRoutes.js';
const router = express.Router();
router.use('/users', userRoutes);
router.use('/groups', groupRoutes);
export default router;
