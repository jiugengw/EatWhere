import express from 'express';
import groupRoutes from './groups/groupRoutes';
import userRoutes from './users/userRoutes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/groups', groupRoutes);

export default router;


