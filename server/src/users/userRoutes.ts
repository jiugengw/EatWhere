import express from 'express';
import {
  getMe,
  getUser,
  updateUser,
  deleteUser,
  // getUserHistory,
  getUserGroups,
  getUserPreferences,
  updateMyPreferences,
  getUserByUsername,
} from './userController.js';
import { signup, login, protect, updatePassword, handleRefreshToken } from '../auth/authController.js';
import { logout } from '../auth/authController.js';

const router = express.Router();

router.get('/refresh-token', handleRefreshToken);
/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserWithTokenResponse'
 */
router.post('/signup', signup);
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: User login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserWithTokenResponse'
 */
router.post('/login', login);
router.post('/logout',logout);

router.use(protect);

router
  .route('/me')
  /**
   * @swagger
   * /api/users/me:
   *   get:
   *     summary: Get the currently logged-in user
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Returns authenticated user's details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponse'
   */
  .get(getMe, getUser)
  /**
   * @swagger
   * /api/users/me:
   *   patch:
   *     summary: Update user details (except preferences/password)
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateUserRequest'
   *     responses:
   *       200:
   *         description: Updated user details successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponse'
   */
  .patch(getMe, updateUser)
  /**
   * @swagger
   * /api/users/me:
   *   delete:
   *     summary: Soft delete currently logged-in user
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       204:
   *         description: User deleted successfully
   */
  .delete(getMe, deleteUser);

/**
 * @swagger
 * /api/users/me/password:
 *   patch:
 *     summary: Update Password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePasswordRequest'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 */
router.patch('/me/password', getMe, updatePassword);

/**
 * @swagger
 * /api/users/me/history:
 *   get:
 *     summary: Get history of currently logged-in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserHistoryOnlyResponse'
 */
// router.route('/me/history').get(getMe, getUserHistory);

/**
 * @swagger
 * /api/users/me/groups:
 *   get:
 *     summary: Get groups of currently logged-in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User groups retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserGroupsOnlyResponse'
 */
router.route('/me/groups').get(getMe, getUserGroups);

router
  .route('/me/preferences')
  /**
   * @swagger
   * /api/users/me/preferences:
   *   get:
   *     summary: Get preferences of currently logged-in user
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User preferences retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserPreferencesOnlyResponse'
   */
  .get(getMe, getUserPreferences)
  /**
   * @swagger
   * /api/users/me/preferences:
   *   patch:
   *     summary: Update user preferences
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *            $ref: '#/components/schemas/UpdatePreferencesRequest'
   *     responses:
   *       200:
   *         description: User preferences updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserPreferencesOnlyResponse'
   */
  .patch(getMe, updateMyPreferences);

/**
 * @swagger
 * /api/users/username/{username}:
 *   get:
 *     summary: Get user by username
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user to retrieve
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSummaryResponse'
 */
router.route('/username/:username').get(getUserByUsername);

export default router;
