import express from 'express';
import {
  createGroup,
  getGroup,
  updateGroup,
  joinGroup,
  checkUserInGroup,
  getGroupUsers,
  getGroupByCode,
  removeGroupMembers,
  updateGroupRoles,
  leaveGroup,
} from './groupController.js';
import { protect } from '../auth/authController.js';

const router = express.Router();

router.use(protect);

router.route('/').post(createGroup);
router.get('/code/:code', getGroupByCode);

router
  .route('/:id')
  .get(getGroup)
  .patch(updateGroup)

router.patch('/:code/join', joinGroup);

router.patch('/:id/leave', leaveGroup); 
router.get('/:id/isMember', checkUserInGroup);
router.get('/:id/users', getGroupUsers);
router.patch('/:id/users/role', updateGroupRoles); 
router.delete('/:id/users', removeGroupMembers); 

export default router;
/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create a group
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGroupRequest'
 *     responses:
 *       201:
 *         description: Group successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupResponse'
 */



  /**
   * @swagger
   * /api/groups/{id}:
   *   get:
   *     summary: Get group by ID
   *     tags: [Group]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Group ID
   *     responses:
   *       200:
   *         description: Returns group details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GroupWithPopulatedUsersResponse'
   */
  
  /**
   * @swagger
   * /api/groups/{id}:
   *   patch:
   *     summary: Update group
   *     tags: [Group]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the group to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateGroupRequest'
   *     responses:
   *       200:
   *         description: Group successfully updated
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GroupResponse'
   */
 
  /**
   * @swagger
   * /api/groups/{id}:
   *   delete:
   *     summary: Delete group
   *     tags: [Group]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the group to delete
   *     responses:
   *       204:
   *         description: Group deleted successfully
   */
  

/**
 * @swagger
 * /api/groups/{id}/join:
 *   patch:
 *     summary: Join a group
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the group to join
 *     responses:
 *       200:
 *         description: Successfully joined the group
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupJoinLeaveResponse'
 */

/**
 * @swagger
 * /api/groups/{id}/leave:
 *   patch:
 *     summary: Leave a group
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the group to leave
 *     responses:
 *       200:
 *         description: Successfully left the group
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupJoinLeaveResponse'
 */
// router.patch('/:id/leave', leaveGroup);

/**
 * @swagger
 * /api/groups/{id}/isMember:
 *   get:
 *     summary: Check if the logged-in user is a member of the group
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Membership status returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     isMember:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: Group not found
 */

/**
 * @swagger
 * /api/groups/{id}/users:
 *   get:
 *     summary: Get all users in a group
 *     tags: [Group]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Group users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupUsersOnlyResponse'
 *       404:
 *         description: Group not found
 */


/**
 * @swagger
 * /api/groups/code/{code}:
 *   get:
 *     summary: Get a group by its unique code
 *     tags: [Group]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique code of the group
 *     responses:
 *       200:
 *         description: Group found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupWithUserCountResponse'
 *       404:
 *         description: Group not found
 */

